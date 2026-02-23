import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { EVENTS, EVENT_TIMING } from '../config/events.js'
import { RES } from '../config/resources.js'
import { useResourceStore } from './resourceStore.js'
import { useBuildingStore } from './buildingStore.js'
import { useResearchStore } from './researchStore.js'

export const useEventStore = defineStore('events', () => {
  const activeEvent = ref(null)       // current event object (or null)
  const activeChoiceIndex = ref(-1)   // which choice was picked (-1 = not yet)
  const resultMessage = ref('')       // outcome text
  const eventTimer = ref(0)           // seconds until next event
  const eventLog = reactive([])       // history [{name, icon, message, type, time}]
  const paused = ref(false)           // pause event timer (e.g., during active event)

  const MAX_LOG = 20

  // Calculate next event interval based on Tavern level
  function rollNextInterval() {
    const buildings = useBuildingStore()
    const tavernLevel = buildings.getLevel('tavern')
    const reduction = 1 - Math.min(tavernLevel * EVENT_TIMING.tavernReduction, 0.7)
    const min = EVENT_TIMING.minInterval * reduction
    const max = EVENT_TIMING.maxInterval * reduction
    eventTimer.value = min + Math.random() * (max - min)
  }

  // Pick a weighted random event
  function pickEvent() {
    const totalWeight = EVENTS.reduce((sum, e) => sum + e.weight, 0)
    let roll = Math.random() * totalWeight
    for (const event of EVENTS) {
      roll -= event.weight
      if (roll <= 0) return event
    }
    return EVENTS[0]
  }

  // Apply effects array to resources
  function applyEffects(effects) {
    const resources = useResourceStore()
    const research = useResearchStore()
    const defense = research.getEventDefense()

    for (const e of effects) {
      if (e.type === 'resource_flat') {
        const ri = RES[e.target]
        if (ri == null) continue
        if (e.value < 0) {
          // Negative: reduce by defense
          const reduced = e.value * (1 - defense)
          resources.add(ri, reduced)
        } else {
          resources.add(ri, e.value)
        }
      } else if (e.type === 'resource_pct') {
        const ri = RES[e.target]
        if (ri == null) continue
        const current = resources.amounts[ri]
        if (e.value < 0) {
          const loss = current * Math.abs(e.value) * (1 - defense)
          resources.add(ri, -loss)
        } else {
          resources.add(ri, current * e.value)
        }
      } else if (e.type === 'rp_flat') {
        const researchStore = useResearchStore()
        researchStore.researchPoints += e.value
      } else if (e.type === 'portal_gamble') {
        // 50/50 gamble
        handlePortalGamble()
      }
    }
  }

  function handlePortalGamble() {
    const resources = useResourceStore()
    const research = useResearchStore()
    const defense = research.getEventDefense()

    if (Math.random() < 0.5) {
      // Win: gain 300 of everything
      for (let i = 0; i < 6; i++) resources.add(i, 300)
      resultMessage.value = 'You emerge triumphant! Riches beyond measure pour from the void.'
    } else {
      // Lose: lose 20% of everything (reduced by defense)
      for (let i = 0; i < 6; i++) {
        const loss = resources.amounts[i] * 0.2 * (1 - defense)
        resources.add(i, -loss)
      }
      resultMessage.value = 'The void consumes a portion of your wealth. The portal snaps shut.'
    }
  }

  function tick(dt) {
    if (paused.value || activeEvent.value) return

    eventTimer.value -= dt
    if (eventTimer.value <= 0) {
      triggerEvent()
    }
  }

  function triggerEvent() {
    const event = pickEvent()
    activeEvent.value = event
    activeChoiceIndex.value = -1
    resultMessage.value = ''
    paused.value = true

    // Auto-apply positive/negative events immediately
    if (event.type === 'positive' || event.type === 'negative') {
      applyEffects(event.effects)
      resultMessage.value = event.message
    }
  }

  // Player picks a choice for choice events
  function selectChoice(index) {
    if (!activeEvent.value || activeEvent.value.type !== 'choice') return
    if (index < 0 || index >= activeEvent.value.choices.length) return
    if (activeChoiceIndex.value >= 0) return // already chose

    const choice = activeEvent.value.choices[index]
    activeChoiceIndex.value = index
    applyEffects(choice.effects)

    // For gamble choices, resultMessage was set in handlePortalGamble
    if (!choice.gamble) {
      resultMessage.value = choice.message
    }
  }

  // Dismiss the event modal
  function dismissEvent() {
    if (!activeEvent.value) return

    // Log it
    eventLog.unshift({
      name: activeEvent.value.name,
      icon: activeEvent.value.icon,
      type: activeEvent.value.type,
      message: resultMessage.value,
      time: Date.now(),
    })
    if (eventLog.length > MAX_LOG) eventLog.length = MAX_LOG

    activeEvent.value = null
    activeChoiceIndex.value = -1
    resultMessage.value = ''
    paused.value = false
    rollNextInterval()
  }

  // Initialize timer on first load
  function init() {
    if (eventTimer.value <= 0) {
      rollNextInterval()
    }
  }

  const hasActiveEvent = computed(() => activeEvent.value != null)
  const needsChoice = computed(() =>
    activeEvent.value?.type === 'choice' && activeChoiceIndex.value < 0
  )

  function serialize() {
    return {
      eventTimer: eventTimer.value,
      eventLog: eventLog.slice(0, 10), // only save recent
    }
  }

  function deserialize(data) {
    if (!data) return
    eventTimer.value = data.eventTimer || 0
    eventLog.length = 0
    if (data.eventLog) {
      for (const entry of data.eventLog) eventLog.push(entry)
    }
    if (eventTimer.value <= 0) rollNextInterval()
  }

  return {
    activeEvent,
    activeChoiceIndex,
    resultMessage,
    eventTimer,
    eventLog,
    hasActiveEvent,
    needsChoice,
    tick,
    triggerEvent,
    selectChoice,
    dismissEvent,
    init,
    serialize,
    deserialize,
  }
})
