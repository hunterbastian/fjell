import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { BUILDINGS, BUILDING_MAP, COST_SCALE, MAX_LEVEL } from '../config/buildings.js'
import { RESOURCES, RES } from '../config/resources.js'
import { useResourceStore } from './resourceStore.js'
import { useUpgradeStore } from './upgradeStore.js'
import { useResearchStore } from './researchStore.js'
import { usePrestigeStore } from './prestigeStore.js'

export const useBuildingStore = defineStore('buildings', () => {
  // levels[buildingIndex] = current level (0 = not built)
  const levels = reactive(BUILDINGS.map(() => 0))

  function getLevel(buildingId) {
    const i = BUILDINGS.findIndex(b => b.id === buildingId)
    return i >= 0 ? levels[i] : 0
  }

  function getCost(buildingIndex) {
    const b = BUILDINGS[buildingIndex]
    const level = levels[buildingIndex]
    const research = useResearchStore()
    const costMult = research.getBuildingCostMultiplier()
    const cost = {}
    for (const [resId, base] of Object.entries(b.cost)) {
      cost[resId] = Math.ceil(base * Math.pow(COST_SCALE, level) * costMult)
    }
    return cost
  }

  function isUnlocked(buildingIndex) {
    const b = BUILDINGS[buildingIndex]
    if (!b.unlock) return true
    for (const [reqId, reqLevel] of Object.entries(b.unlock)) {
      if (getLevel(reqId) < reqLevel) return false
    }
    return true
  }

  function buy(buildingIndex) {
    if (levels[buildingIndex] >= MAX_LEVEL) return false
    if (!isUnlocked(buildingIndex)) return false

    const resources = useResourceStore()
    const cost = getCost(buildingIndex)
    if (!resources.spend(cost)) return false

    levels[buildingIndex]++
    recalcRates()
    return true
  }

  // Recalculate all resource production rates from buildings
  function recalcRates() {
    const resources = useResourceStore()
    const upgrades = useUpgradeStore()
    const research = useResearchStore()
    const newRates = RESOURCES.map(() => 0)

    for (let i = 0; i < BUILDINGS.length; i++) {
      const b = BUILDINGS[i]
      const level = levels[i]
      if (level <= 0) continue

      // Stack multipliers from upgrades + research
      const buildingMult = upgrades.getBuildingMultiplier(b.id) * research.getBuildingMultiplier(b.id)
      const synergyMult = upgrades.getSynergyMultiplier(b.id) * research.getSynergyMultiplier(b.id)

      for (const [resId, baseRate] of Object.entries(b.produces)) {
        const ri = RES[resId]
        if (ri != null) {
          newRates[ri] += baseRate * level * buildingMult * synergyMult
        }
      }
    }

    // Capstone: Cornucopia — Farms produce all resources at 10% rate
    const farmAllRate = research.hasFarmAllResources()
    if (farmAllRate > 0) {
      const farmLevel = getLevel('farm')
      if (farmLevel > 0) {
        const farmBuildingMult = upgrades.getBuildingMultiplier('farm') * research.getBuildingMultiplier('farm')
        const baseFarmRate = 0.5 // from config
        const farmOutput = baseFarmRate * farmLevel * farmBuildingMult * farmAllRate
        for (let i = 0; i < RESOURCES.length; i++) {
          // Add to all resources except food (which farm already produces)
          if (RESOURCES[i].id !== 'food') {
            newRates[i] += farmOutput
          }
        }
      }
    }

    const prestige = usePrestigeStore()
    const globalMult = upgrades.getGlobalProductionMultiplier() * research.getGlobalProductionMultiplier() * prestige.getProductionMultiplier()

    for (let i = 0; i < RESOURCES.length; i++) {
      resources.setRate(i, newRates[i] * globalMult)
    }
  }

  // Total building levels
  const totalLevels = computed(() => levels.reduce((sum, l) => sum + l, 0))

  // Serialization
  function serialize() {
    return { levels: [...levels] }
  }

  function deserialize(data) {
    if (!data) return
    if (data.levels) data.levels.forEach((v, i) => { if (i < levels.length) levels[i] = v })
    recalcRates()
  }

  return {
    levels,
    getLevel,
    getCost,
    isUnlocked,
    buy,
    recalcRates,
    totalLevels,
    serialize,
    deserialize,
  }
})
