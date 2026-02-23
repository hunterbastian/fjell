import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { CROWN_SHOP, CROWN_SHOP_MAP, CROWN_FORMULA } from '../config/prestige.js'
import { RESOURCES } from '../config/resources.js'
import { useResourceStore } from './resourceStore.js'
import { useBuildingStore } from './buildingStore.js'
import { useClickStore } from './clickStore.js'
import { useUpgradeStore } from './upgradeStore.js'
import { useResearchStore } from './researchStore.js'
import { useEventStore } from './eventStore.js'
import { useGameStore } from './gameStore.js'

export const usePrestigeStore = defineStore('prestige', () => {
  const dynastyCount = ref(0)
  const totalCrowns = ref(0)
  const spentCrowns = ref(0)
  // shopLevels[itemId] = current level purchased
  const shopLevels = reactive({})

  // Available crowns
  const availableCrowns = computed(() => totalCrowns.value - spentCrowns.value)

  // Calculate crowns earnable from current dynasty
  const pendingCrowns = computed(() => {
    const resources = useResourceStore()
    let totalEssence = 0
    for (let i = 0; i < RESOURCES.length; i++) {
      totalEssence += resources.totalEarned[i]
    }
    // Crown bonus from research (theology capstone)
    const research = useResearchStore()
    const crownMult = research.getCrownBonus()
    return Math.floor(Math.sqrt(totalEssence / CROWN_FORMULA.divisor) * crownMult)
  })

  // Can prestige? Castle level >= 10
  const canPrestige = computed(() => {
    const buildings = useBuildingStore()
    return buildings.getLevel('castle') >= 10 && pendingCrowns.value > 0
  })

  // Get shop item level
  function getShopLevel(itemId) {
    return shopLevels[itemId] || 0
  }

  // Get shop item cost for next level
  function getShopCost(itemId) {
    const item = CROWN_SHOP_MAP[itemId]
    if (!item) return Infinity
    const level = getShopLevel(itemId)
    if (level >= item.maxLevel) return Infinity
    return Math.ceil(item.baseCost * Math.pow(item.costScale, level))
  }

  // Can afford a shop item?
  function canAffordShop(itemId) {
    const cost = getShopCost(itemId)
    return availableCrowns.value >= cost && getShopLevel(itemId) < (CROWN_SHOP_MAP[itemId]?.maxLevel || 0)
  }

  // Buy a shop item
  function buyShopItem(itemId) {
    if (!canAffordShop(itemId)) return false
    const cost = getShopCost(itemId)
    spentCrowns.value += cost
    shopLevels[itemId] = (shopLevels[itemId] || 0) + 1
    return true
  }

  // ─── Permanent bonus getters (used by other stores) ───

  function getStartingResources() {
    const level = getShopLevel('starting_resources')
    return level * 500 // +500 per level
  }

  function getProductionMultiplier() {
    const level = getShopLevel('production_mult')
    return 1 + level * 0.10
  }

  function getClickMultiplier() {
    const level = getShopLevel('click_mult')
    return 1 + level * 0.15
  }

  function getResearchSpeedMultiplier() {
    const level = getShopLevel('research_speed')
    return 1 + level * 0.20
  }

  function getMomentumDecayReduction() {
    const level = getShopLevel('momentum_mastery')
    return level * 0.10 // 10% reduction per level
  }

  function getStorageMultiplier() {
    const level = getShopLevel('storage_mult')
    return 1 + level * 0.25
  }

  function getEventFortuneMultiplier() {
    const level = getShopLevel('event_fortune')
    return 1 + level * 0.20
  }

  // ─── Prestige Reset ───

  function performPrestige() {
    if (!canPrestige.value) return false

    // Award crowns
    const earned = pendingCrowns.value
    totalCrowns.value += earned
    dynastyCount.value++

    // Reset all gameplay stores
    resetGameplayStores()

    return earned
  }

  function resetGameplayStores() {
    // Reset resources (apply starting resource bonus)
    const resources = useResourceStore()
    const startBonus = getStartingResources()
    for (let i = 0; i < RESOURCES.length; i++) {
      resources.amounts[i] = startBonus
      resources.totalEarned[i] = 0
      resources.caps[i] = RESOURCES[i].startCap
      resources.rates[i] = 0
    }

    // Reset buildings
    const buildings = useBuildingStore()
    for (let i = 0; i < buildings.levels.length; i++) {
      buildings.levels[i] = 0
    }

    // Reset click store
    const click = useClickStore()
    click.activeMode = 0
    for (let i = 0; i < click.momentum.length; i++) {
      click.momentum[i] = 0
    }
    click.baseClickPower = 1
    click.clickMultiplier = 1

    // Reset upgrades
    const upgrades = useUpgradeStore()
    upgrades.purchased.clear()

    // Reset research
    const research = useResearchStore()
    research.researchPoints = 0
    research.completed.clear()
    research.activeResearch = null
    research.activeProgress = 0

    // Reset events
    const events = useEventStore()
    events.eventLog.length = 0
    events.activeEvent = null
    events.activeChoiceIndex = -1
    events.resultMessage = ''
    events.init()

    // Reset game timer (keep totalClicks for achievements later)
    const game = useGameStore()
    game.playTime = 0

    // Re-apply all effects (recalc with prestige bonuses)
    upgrades.applyAll()
  }

  // ─── Serialization ───

  function serialize() {
    return {
      dynastyCount: dynastyCount.value,
      totalCrowns: totalCrowns.value,
      spentCrowns: spentCrowns.value,
      shopLevels: { ...shopLevels },
    }
  }

  function deserialize(data) {
    if (!data) return
    dynastyCount.value = data.dynastyCount || 0
    totalCrowns.value = data.totalCrowns || 0
    spentCrowns.value = data.spentCrowns || 0
    // Clear and repopulate
    for (const key of Object.keys(shopLevels)) delete shopLevels[key]
    if (data.shopLevels) {
      for (const [k, v] of Object.entries(data.shopLevels)) {
        shopLevels[k] = v
      }
    }
  }

  return {
    dynastyCount,
    totalCrowns,
    spentCrowns,
    availableCrowns,
    pendingCrowns,
    canPrestige,
    getShopLevel,
    getShopCost,
    canAffordShop,
    buyShopItem,
    getStartingResources,
    getProductionMultiplier,
    getClickMultiplier,
    getResearchSpeedMultiplier,
    getMomentumDecayReduction,
    getStorageMultiplier,
    getEventFortuneMultiplier,
    performPrestige,
    serialize,
    deserialize,
  }
})
