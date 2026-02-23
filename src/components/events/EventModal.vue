<script setup>
import { computed } from 'vue'
import { useEventStore } from '../../stores/eventStore.js'
import GameModal from '../ui/GameModal.vue'

const events = useEventStore()

const typeLabel = computed(() => {
  if (!events.activeEvent) return ''
  switch (events.activeEvent.type) {
    case 'positive': return 'Blessing'
    case 'negative': return 'Calamity'
    case 'choice': return 'Omen'
    default: return ''
  }
})

const typeClass = computed(() => events.activeEvent?.type || '')

const canDismiss = computed(() => {
  if (!events.activeEvent) return false
  if (events.activeEvent.type === 'choice' && events.activeChoiceIndex < 0) return false
  return true
})
</script>

<template>
  <GameModal :show="events.hasActiveEvent" @close="canDismiss ? events.dismissEvent() : null">
    <div v-if="events.activeEvent" class="event-modal" :class="typeClass">
      <div class="event-type-badge" :class="typeClass">{{ typeLabel }}</div>
      <div class="event-icon">{{ events.activeEvent.icon }}</div>
      <h2 class="event-title display-title">{{ events.activeEvent.name }}</h2>
      <p class="event-desc">{{ events.activeEvent.desc }}</p>

      <!-- Positive/Negative: just show result -->
      <div v-if="events.resultMessage" class="event-result">
        {{ events.resultMessage }}
      </div>

      <!-- Choice event: show options -->
      <div
        v-if="events.activeEvent.type === 'choice' && events.activeChoiceIndex < 0"
        class="event-choices"
      >
        <button
          v-for="(choice, i) in events.activeEvent.choices"
          :key="i"
          class="choice-btn bevel"
          @click="events.selectChoice(i)"
        >
          <span class="choice-label">{{ choice.label }}</span>
          <span class="choice-desc">{{ choice.desc }}</span>
        </button>
      </div>

      <!-- After choice: show which was picked + result -->
      <div v-if="events.activeEvent.type === 'choice' && events.activeChoiceIndex >= 0" class="choice-result">
        <div class="chosen-label">
          You chose: {{ events.activeEvent.choices[events.activeChoiceIndex].label }}
        </div>
      </div>

      <button
        v-if="canDismiss"
        class="dismiss-btn bevel"
        @click="events.dismissEvent()"
      >
        Continue
      </button>
    </div>
  </GameModal>
</template>

<style scoped>
.event-modal {
  text-align: center;
  max-width: 380px;
  margin: 0 auto;
}

.event-type-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 2px 8px;
  display: inline-block;
  margin-bottom: 8px;
}
.event-type-badge.positive { color: var(--success); border: 1px solid var(--success); }
.event-type-badge.negative { color: var(--danger); border: 1px solid var(--danger); }
.event-type-badge.choice { color: var(--faith); border: 1px solid var(--faith); }

.event-icon {
  font-size: 40px;
  margin: 8px 0;
}

.event-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.event-desc {
  color: var(--text-dim);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 14px;
}

.event-result {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--torch);
  padding: 8px;
  background: var(--bg-dark);
  margin-bottom: 14px;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.choice-btn {
  text-align: left;
  padding: 10px 12px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.12s;
}
.choice-btn:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 8px var(--torch-glow);
  border-color: var(--torch-dim) var(--border) var(--border) var(--torch-dim);
}
.choice-label {
  display: block;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
}
.choice-desc {
  display: block;
  font-size: 12px;
  color: var(--text-dim);
}

.choice-result {
  margin-bottom: 14px;
}
.chosen-label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.dismiss-btn {
  background: var(--bg-card);
  padding: 8px 28px;
  font-size: 18px;
  color: var(--torch);
  margin: 0 auto;
  display: block;
}
.dismiss-btn:hover {
  background: var(--bg-card-hover);
}
</style>
