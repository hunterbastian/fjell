import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { CLICK_MODES, MOMENTUM, CRIT_BASE_CHANCE, CRIT_BASE_MULT } from '../config/clickModes.js'
import { useResourceStore } from './resourceStore.js'
import { useBuildingStore } from './buildingStore.js'
import { useGameStore } from './gameStore.js'
import { useUpgradeStore } from './upgradeStore.js'
import { useResearchStore } from './researchStore.js'

export const useClickStore = defineStore('click', () => {
  const activeMode = ref(0) // index into CLICK_MODES
  const momentum = reactive(CLICK_MODES.map(() => 0))
  const baseClickPower = ref(1)
  const clickMultiplier = ref(1)
  const critChance = ref(CRIT_BASE_CHANCE)
  const critMultiplier = ref(CRIT_BASE_MULT)

  // Derived: which modes are unlocked
  function isModeUnlocked(modeIndex) {
    const mode = CLICK_MODES[modeIndex]
    if (!mode.unlock) return true
    const buildings = useBuildingStore()
    for (const [buildingId, reqLevel] of Object.entries(mode.unlock)) {
      if (buildings.getLevel(buildingId) < reqLevel) return false
    }
    return true
  }

  // Current momentum tier for a mode
  function getMomentumTier(modeIndex) {
    const m = momentum[modeIndex]
    const tiers = MOMENTUM.tiers
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (m >= tiers[i].min) return tiers[i]
    }
    return tiers[0]
  }

  // Momentum bonus for a specific resource (checks all modes that produce it)
  function getResourceMomentumBonus(resourceId) {
    let maxBonus = 0
    for (let i = 0; i < CLICK_MODES.length; i++) {
      const mode = CLICK_MODES[i]
      if (mode.resources[resourceId] && momentum[i] > 0) {
        const tier = getMomentumTier(i)
        if (tier.bonus > maxBonus) maxBonus = tier.bonus
      }
    }
    return maxBonus
  }

  // Perform a click — returns { resources: {id: amount}, crit: bool }
  function doClick() {
    const mode = CLICK_MODES[activeMode.value]
    const resources = useResourceStore()
    const gameStore = useGameStore()
    const upgrades = useUpgradeStore()

    // Roll for crit
    const isCrit = Math.random() < critChance.value
    const power = baseClickPower.value * clickMultiplier.value * (isCrit ? critMultiplier.value : 1)

    // Momentum bonus
    const tier = getMomentumTier(activeMode.value)
    const momentumMult = 1 + tier.bonus

    // Mode-specific multiplier from upgrades + research
    const research = useResearchStore()
    const modeMult = upgrades.getModeMultiplier(mode.id) * research.getModeMultiplier(mode.id)

    // Calculate and add resources
    const earned = {}
    for (const [resId, mult] of Object.entries(mode.resources)) {
      const amount = power * mult * momentumMult * modeMult
      resources.add(resId, amount)
      earned[resId] = amount
    }

    // Build momentum for active mode (with upgrade + research multiplier)
    const momentumGain = MOMENTUM.perClick * upgrades.getMomentumGainMultiplier() * research.getMomentumGainMultiplier()
    momentum[activeMode.value] = Math.min(
      MOMENTUM.max,
      momentum[activeMode.value] + momentumGain
    )

    gameStore.addClick()

    return { resources: earned, crit: isCrit }
  }

  // Decay momentum each tick
  function tick(dt) {
    const upgrades = useUpgradeStore()
    const research = useResearchStore()
    const decayMult = upgrades.getMomentumDecayMultiplier() * research.getMomentumDecayMultiplier()
    const dualFocus = upgrades.hasDualFocus()

    if (dualFocus) {
      // With dual focus, top 2 momentum modes don't decay
      const sorted = momentum.map((m, i) => ({ m, i }))
        .filter(x => x.m > 0)
        .sort((a, b) => b.m - a.m)
      const shielded = new Set(sorted.slice(0, 2).map(x => x.i))

      for (let i = 0; i < momentum.length; i++) {
        if (momentum[i] > 0 && !shielded.has(i)) {
          momentum[i] = Math.max(0, momentum[i] - MOMENTUM.decayPerSec * decayMult * dt)
        }
      }
    } else {
      for (let i = 0; i < momentum.length; i++) {
        if (momentum[i] > 0) {
          momentum[i] = Math.max(0, momentum[i] - MOMENTUM.decayPerSec * decayMult * dt)
        }
      }
    }
  }

  function setMode(index) {
    if (index >= 0 && index < CLICK_MODES.length && isModeUnlocked(index)) {
      activeMode.value = index
    }
  }

  // Serialization
  function serialize() {
    return {
      activeMode: activeMode.value,
      momentum: [...momentum],
      baseClickPower: baseClickPower.value,
      clickMultiplier: clickMultiplier.value,
      critChance: critChance.value,
      critMultiplier: critMultiplier.value,
    }
  }

  function deserialize(data) {
    if (!data) return
    if (data.activeMode != null) activeMode.value = data.activeMode
    if (data.momentum) data.momentum.forEach((v, i) => { if (i < momentum.length) momentum[i] = v })
    if (data.baseClickPower != null) baseClickPower.value = data.baseClickPower
    if (data.clickMultiplier != null) clickMultiplier.value = data.clickMultiplier
    if (data.critChance != null) critChance.value = data.critChance
    if (data.critMultiplier != null) critMultiplier.value = data.critMultiplier
  }

  return {
    activeMode,
    momentum,
    baseClickPower,
    clickMultiplier,
    critChance,
    critMultiplier,
    isModeUnlocked,
    getMomentumTier,
    getResourceMomentumBonus,
    doClick,
    tick,
    setMode,
    serialize,
    deserialize,
  }
})
