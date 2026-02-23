import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveToStorage, loadFromStorage, getTimeSinceLastSave } from '../composables/useSave.js'
import { useResourceStore } from './resourceStore.js'
import { useBuildingStore } from './buildingStore.js'
import { useClickStore } from './clickStore.js'
import { useUpgradeStore } from './upgradeStore.js'
import { useResearchStore } from './researchStore.js'
import { useEventStore } from './eventStore.js'
import { usePrestigeStore } from './prestigeStore.js'

export const useGameStore = defineStore('game', () => {
  const playTime = ref(0)
  const totalClicks = ref(0)
  const saveTimer = ref(0)
  const offlineEarnings = ref(null)

  const SAVE_INTERVAL = 30

  function tick(dt) {
    playTime.value += dt
    saveTimer.value += dt

    // Tick sub-stores
    const resources = useResourceStore()
    const click = useClickStore()
    const research = useResearchStore()
    const eventStore = useEventStore()
    resources.tick(dt)
    click.tick(dt)
    research.tick(dt)
    eventStore.tick(dt)

    // Auto-save
    if (saveTimer.value >= SAVE_INTERVAL) {
      saveTimer.value = 0
      save()
    }
  }

  function addClick() {
    totalClicks.value++
  }

  function save() {
    const resources = useResourceStore()
    const buildings = useBuildingStore()
    const click = useClickStore()
    const upgrades = useUpgradeStore()

    saveToStorage({
      playTime: playTime.value,
      totalClicks: totalClicks.value,
      resources: resources.serialize(),
      buildings: buildings.serialize(),
      click: click.serialize(),
      upgrades: upgrades.serialize(),
      research: useResearchStore().serialize(),
      events: useEventStore().serialize(),
      prestige: usePrestigeStore().serialize(),
    })
  }

  function load() {
    const data = loadFromStorage()
    if (!data) return false

    playTime.value = data.playTime || 0
    totalClicks.value = data.totalClicks || 0

    const resources = useResourceStore()
    const buildings = useBuildingStore()
    const click = useClickStore()
    const upgrades = useUpgradeStore()

    resources.deserialize(data.resources)
    buildings.deserialize(data.buildings)
    click.deserialize(data.click)
    const research = useResearchStore()
    research.deserialize(data.research)
    upgrades.deserialize(data.upgrades)

    const eventStore = useEventStore()
    eventStore.deserialize(data.events)
    eventStore.init()

    const prestigeStore = usePrestigeStore()
    prestigeStore.deserialize(data.prestige)

    // Offline progress
    const offlineSeconds = getTimeSinceLastSave()
    if (offlineSeconds > 10) {
      // Award 50% of production while offline
      const earned = {}
      let anyEarned = false
      for (let i = 0; i < resources.rates.length; i++) {
        if (resources.rates[i] > 0) {
          const amount = resources.rates[i] * offlineSeconds * 0.5
          resources.add(i, amount)
          anyEarned = true
        }
      }
      if (anyEarned) {
        offlineEarnings.value = { seconds: offlineSeconds }
      }
    }

    return true
  }

  function dismissOffline() {
    offlineEarnings.value = null
  }

  return {
    playTime,
    totalClicks,
    offlineEarnings,
    tick,
    addClick,
    save,
    load,
    dismissOffline,
  }
})
