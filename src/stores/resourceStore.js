import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { RESOURCES, RES } from '../config/resources.js'

export const useResourceStore = defineStore('resources', () => {
  // amounts[resourceIndex] = current amount
  const amounts = reactive(RESOURCES.map(() => 0))
  // caps[resourceIndex] = storage cap
  const caps = reactive(RESOURCES.map(r => r.startCap))
  // rates[resourceIndex] = production per second (set by building store)
  const rates = reactive(RESOURCES.map(() => 0))
  // totalEarned[resourceIndex] = lifetime total
  const totalEarned = reactive(RESOURCES.map(() => 0))

  function add(resourceId, amount) {
    const i = typeof resourceId === 'number' ? resourceId : RES[resourceId]
    if (i == null || amount === 0) return
    if (amount > 0) {
      const space = caps[i] - amounts[i]
      const actual = Math.min(amount, space)
      if (actual > 0) {
        amounts[i] += actual
        totalEarned[i] += actual
      }
    } else {
      // Negative: subtract but don't go below 0
      amounts[i] = Math.max(0, amounts[i] + amount)
    }
  }

  function spend(costs) {
    // costs: { resourceId: amount }
    // Check affordability first
    for (const [resId, amt] of Object.entries(costs)) {
      const i = RES[resId]
      if (i == null || amounts[i] < amt) return false
    }
    // Deduct
    for (const [resId, amt] of Object.entries(costs)) {
      amounts[RES[resId]] -= amt
    }
    return true
  }

  function canAfford(costs) {
    for (const [resId, amt] of Object.entries(costs)) {
      const i = RES[resId]
      if (i == null || amounts[i] < amt) return false
    }
    return true
  }

  function tick(dt) {
    for (let i = 0; i < RESOURCES.length; i++) {
      if (rates[i] > 0) {
        add(i, rates[i] * dt)
      }
    }
  }

  function setRate(resourceId, rate) {
    const i = typeof resourceId === 'number' ? resourceId : RES[resourceId]
    if (i != null) rates[i] = rate
  }

  function increaseCap(resourceId, amount) {
    const i = typeof resourceId === 'number' ? resourceId : RES[resourceId]
    if (i != null) caps[i] += amount
  }

  // Serialization
  function serialize() {
    return {
      amounts: [...amounts],
      caps: [...caps],
      totalEarned: [...totalEarned],
    }
  }

  function deserialize(data) {
    if (!data) return
    if (data.amounts) data.amounts.forEach((v, i) => { if (i < amounts.length) amounts[i] = v })
    if (data.caps) data.caps.forEach((v, i) => { if (i < caps.length) caps[i] = v })
    if (data.totalEarned) data.totalEarned.forEach((v, i) => { if (i < totalEarned.length) totalEarned[i] = v })
  }

  return {
    amounts,
    caps,
    rates,
    totalEarned,
    add,
    spend,
    canAfford,
    tick,
    setRate,
    increaseCap,
    serialize,
    deserialize,
  }
})
