import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { RESEARCH_NODES, RESEARCH_MAP } from '../config/research.js'
import { useBuildingStore } from './buildingStore.js'
import { useUpgradeStore } from './upgradeStore.js'

// RP generation: Library produces 0.5 RP/s per level
const RP_PER_LIBRARY_LEVEL = 0.5

export const useResearchStore = defineStore('research', () => {
  const researchPoints = ref(0)
  const completed = reactive(new Set())
  const activeResearch = ref(null) // node id currently researching
  const activeProgress = ref(0) // seconds elapsed on active research

  // RP generation rate (from Library)
  const rpRate = computed(() => {
    const buildings = useBuildingStore()
    return buildings.getLevel('library') * RP_PER_LIBRARY_LEVEL
  })

  function isCompleted(nodeId) {
    return completed.has(nodeId)
  }

  function isUnlocked(nodeId) {
    const node = RESEARCH_MAP[nodeId]
    if (!node) return false
    // All prerequisite nodes must be completed
    if (node.requires && node.requires.length > 0) {
      for (const reqId of node.requires) {
        if (!completed.has(reqId)) return false
      }
    }
    return true
  }

  function canAfford(nodeId) {
    const node = RESEARCH_MAP[nodeId]
    if (!node) return false
    return researchPoints.value >= node.cost
  }

  function startResearch(nodeId) {
    if (activeResearch.value) return false // already researching
    if (completed.has(nodeId)) return false
    if (!isUnlocked(nodeId)) return false

    const node = RESEARCH_MAP[nodeId]
    if (researchPoints.value < node.cost) return false

    researchPoints.value -= node.cost
    activeResearch.value = nodeId
    activeProgress.value = 0
    return true
  }

  function cancelResearch() {
    if (!activeResearch.value) return false
    const node = RESEARCH_MAP[activeResearch.value]
    // Refund RP
    researchPoints.value += node.cost
    activeResearch.value = null
    activeProgress.value = 0
    return true
  }

  function tick(dt) {
    // Generate RP from Library
    if (rpRate.value > 0) {
      researchPoints.value += rpRate.value * dt
    }

    // Progress active research
    if (activeResearch.value) {
      const node = RESEARCH_MAP[activeResearch.value]
      activeProgress.value += dt

      if (activeProgress.value >= node.time) {
        // Research complete
        completed.add(activeResearch.value)
        activeResearch.value = null
        activeProgress.value = 0
        applyAllEffects()
      }
    }
  }

  // Get the active research node data
  const activeNode = computed(() => {
    if (!activeResearch.value) return null
    return RESEARCH_MAP[activeResearch.value]
  })

  const activePercent = computed(() => {
    if (!activeNode.value) return 0
    return Math.min(100, (activeProgress.value / activeNode.value.time) * 100)
  })

  // ─── Effect aggregation (same pattern as upgradeStore) ───

  function getEffects(type, target) {
    const results = []
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === type && (!target || e.target === target)) {
          results.push(e)
        }
      }
    }
    return results
  }

  function getBuildingMultiplier(buildingId) {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'building_mult' && e.target === buildingId) mult *= e.value
      }
    }
    return mult
  }

  function getGlobalProductionMultiplier() {
    const buildings = useBuildingStore()
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'global_per_level') {
          mult *= (1 + e.value * buildings.getLevel(e.per))
        }
      }
    }
    return mult
  }

  function getSynergyMultiplier(buildingId) {
    const buildings = useBuildingStore()
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'synergy_total' && e.source === buildingId) {
          mult *= (1 + e.value * buildings.totalLevels)
        }
      }
    }
    return mult
  }

  function getStorageBonus(resourceId) {
    let total = 0
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'storage_resource' && e.target === resourceId) {
          total += e.value
        }
      }
    }
    return total
  }

  function getClickMultiplier() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'click_mult') mult *= e.value
      }
    }
    return mult
  }

  function getCritChanceBonus() {
    let total = 0
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'crit_chance_flat') total += e.value
      }
    }
    return total
  }

  function getCritMultiplier() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'crit_mult') mult *= e.value
      }
    }
    return mult
  }

  function getModeMultiplier(modeId) {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'mode_mult' && e.target === modeId) mult *= e.value
      }
    }
    return mult
  }

  function getMomentumGainMultiplier() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'momentum_gain_mult') mult *= e.value
      }
    }
    return mult
  }

  function getMomentumDecayMultiplier() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'momentum_decay_mult') mult *= e.value
      }
    }
    return mult
  }

  function getBuildingCostMultiplier() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'building_cost_mult') mult *= e.value
      }
    }
    return mult
  }

  function getEventDefense() {
    let total = 0
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'event_defense') total += e.value
      }
    }
    return Math.min(total, 0.9) // cap at 90%
  }

  function getCrownBonus() {
    let mult = 1
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'crown_bonus') mult *= e.value
      }
    }
    return mult
  }

  function hasFarmAllResources() {
    for (const id of completed) {
      const node = RESEARCH_MAP[id]
      for (const e of node.effects) {
        if (e.type === 'farm_all_resources') return e.value
      }
    }
    return 0
  }

  // Apply all research effects to other stores
  function applyAllEffects() {
    // Trigger recalculation in upgrade store which cascades to building/click stores
    const upgrades = useUpgradeStore()
    upgrades.applyAll()
  }

  const completedCount = computed(() => completed.size)

  function serialize() {
    return {
      researchPoints: researchPoints.value,
      completed: [...completed],
      activeResearch: activeResearch.value,
      activeProgress: activeProgress.value,
    }
  }

  function deserialize(data) {
    if (!data) return
    researchPoints.value = data.researchPoints || 0
    completed.clear()
    if (data.completed) {
      for (const id of data.completed) completed.add(id)
    }
    activeResearch.value = data.activeResearch || null
    activeProgress.value = data.activeProgress || 0
  }

  return {
    researchPoints,
    completed,
    activeResearch,
    activeProgress,
    rpRate,
    activeNode,
    activePercent,
    completedCount,
    isCompleted,
    isUnlocked,
    canAfford,
    startResearch,
    cancelResearch,
    tick,
    getBuildingMultiplier,
    getGlobalProductionMultiplier,
    getSynergyMultiplier,
    getStorageBonus,
    getClickMultiplier,
    getCritChanceBonus,
    getCritMultiplier,
    getModeMultiplier,
    getMomentumGainMultiplier,
    getMomentumDecayMultiplier,
    getBuildingCostMultiplier,
    getEventDefense,
    getCrownBonus,
    hasFarmAllResources,
    applyAllEffects,
    serialize,
    deserialize,
  }
})
