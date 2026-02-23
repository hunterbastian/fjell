import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { UPGRADES, UPGRADE_MAP } from '../config/upgrades.js'
import { RESOURCES } from '../config/resources.js'
import { CRIT_BASE_CHANCE, CRIT_BASE_MULT } from '../config/clickModes.js'
import { useResourceStore } from './resourceStore.js'
import { useBuildingStore } from './buildingStore.js'
import { useClickStore } from './clickStore.js'
import { useResearchStore } from './researchStore.js'
import { usePrestigeStore } from './prestigeStore.js'

export const useUpgradeStore = defineStore('upgrades', () => {
  const purchased = reactive(new Set())

  function isPurchased(id) {
    return purchased.has(id)
  }

  function isUnlocked(id) {
    const upgrade = UPGRADE_MAP[id]
    if (!upgrade) return false

    // Check building requirements
    if (upgrade.unlock) {
      const buildings = useBuildingStore()
      for (const [buildingId, reqLevel] of Object.entries(upgrade.unlock)) {
        if (buildings.getLevel(buildingId) < reqLevel) return false
      }
    }

    // Check prerequisite upgrades
    if (upgrade.requires && upgrade.requires.length > 0) {
      for (const reqId of upgrade.requires) {
        if (!purchased.has(reqId)) return false
      }
    }

    return true
  }

  function canAfford(id) {
    if (purchased.has(id)) return false
    const upgrade = UPGRADE_MAP[id]
    if (!upgrade) return false
    const resources = useResourceStore()
    return resources.canAfford(upgrade.cost)
  }

  function buy(id) {
    if (purchased.has(id)) return false
    if (!isUnlocked(id)) return false

    const upgrade = UPGRADE_MAP[id]
    const resources = useResourceStore()
    if (!resources.spend(upgrade.cost)) return false

    purchased.add(id)
    applyAll()
    return true
  }

  // ─── Aggregate effect calculators ───

  function getClickMultiplier() {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'click_mult') mult *= e.value
      }
    }
    return mult
  }

  function getBuildingMultiplier(buildingId) {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'building_mult' && e.target === buildingId) mult *= e.value
      }
    }
    return mult
  }

  function getSynergyMultiplier(buildingId) {
    const buildings = useBuildingStore()
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'synergy' && e.source === buildingId) {
          const perLevel = buildings.getLevel(e.per)
          mult *= (1 + e.value * perLevel)
        }
        if (e.type === 'synergy_total' && e.source === buildingId) {
          mult *= (1 + e.value * buildings.totalLevels)
        }
      }
    }
    return mult
  }

  function getGlobalProductionMultiplier() {
    const buildings = useBuildingStore()
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'global_per_level') {
          const perLevel = buildings.getLevel(e.per)
          mult *= (1 + e.value * perLevel)
        }
      }
    }
    return mult
  }

  function getStorageFlatBonus() {
    let total = 0
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'storage_flat') total += e.value
      }
    }
    return total
  }

  function getMomentumGainMultiplier() {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'momentum_gain_mult') mult *= e.value
      }
    }
    return mult
  }

  function getMomentumDecayMultiplier() {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'momentum_decay_mult') mult *= e.value
      }
    }
    return mult
  }

  function getCritChanceBonus() {
    let total = 0
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'crit_chance_flat') total += e.value
      }
    }
    return total
  }

  function getCritMultiplier() {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'crit_mult') mult *= e.value
      }
    }
    return mult
  }

  function getModeMultiplier(modeId) {
    let mult = 1
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'mode_mult' && e.target === modeId) mult *= e.value
      }
    }
    return mult
  }

  function hasDualFocus() {
    for (const id of purchased) {
      const u = UPGRADE_MAP[id]
      for (const e of u.effects) {
        if (e.type === 'dual_focus') return true
      }
    }
    return false
  }

  // ─── Apply all effects to other stores ───

  function applyAll() {
    const resources = useResourceStore()
    const buildings = useBuildingStore()
    const click = useClickStore()
    const research = useResearchStore()

    const prestige = usePrestigeStore()

    // Push click bonuses (upgrades + research + prestige stacked)
    click.clickMultiplier = getClickMultiplier() * research.getClickMultiplier() * prestige.getClickMultiplier()
    click.critChance = CRIT_BASE_CHANCE + getCritChanceBonus() + research.getCritChanceBonus()
    click.critMultiplier = CRIT_BASE_MULT * getCritMultiplier() * research.getCritMultiplier()

    // Update resource caps (upgrades flat + research per-resource + prestige multiplier)
    const storageBonus = getStorageFlatBonus()
    const storageMult = prestige.getStorageMultiplier()
    for (let i = 0; i < RESOURCES.length; i++) {
      const researchBonus = research.getStorageBonus(RESOURCES[i].id)
      resources.caps[i] = Math.floor((RESOURCES[i].startCap + storageBonus + researchBonus) * storageMult)
    }

    // Recalculate building production (queries upgrade + research + prestige multipliers)
    buildings.recalcRates()
  }

  const purchasedCount = computed(() => purchased.size)

  function serialize() {
    return { purchased: [...purchased] }
  }

  function deserialize(data) {
    purchased.clear()
    if (data?.purchased) {
      for (const id of data.purchased) {
        purchased.add(id)
      }
    }
    applyAll()
  }

  return {
    purchased,
    purchasedCount,
    isPurchased,
    isUnlocked,
    canAfford,
    buy,
    getClickMultiplier,
    getBuildingMultiplier,
    getSynergyMultiplier,
    getGlobalProductionMultiplier,
    getStorageFlatBonus,
    getMomentumGainMultiplier,
    getMomentumDecayMultiplier,
    getCritChanceBonus,
    getCritMultiplier,
    getModeMultiplier,
    hasDualFocus,
    applyAll,
    serialize,
    deserialize,
  }
})
