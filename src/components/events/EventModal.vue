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
          class="choice-btn"
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
        class="dismiss-btn"
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
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 3px 10px;
  display: inline-block;
  margin-bottom: 10px;
  border-radius: var(--radius-sm);
}
.event-type-badge.positive { color: var(--success); border: 1px solid rgba(58, 122, 40, 0.4); background: rgba(58, 122, 40, 0.08); }
.event-type-badge.negative { color: var(--danger); border: 1px solid rgba(160, 48, 48, 0.4); background: rgba(160, 48, 48, 0.08); }
.event-type-badge.choice { color: var(--faith); border: 1px solid rgba(144, 96, 192, 0.4); background: rgba(144, 96, 192, 0.08); }

.event-icon {
  font-size: 40px;
  margin: 8px 0;
}

.event-title {
  font-size: 17px;
  margin-bottom: 8px;
}

.event-desc {
  color: var(--text-dim);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.event-result {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--torch);
  padding: 10px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.choice-btn {
  text-align: left;
  padding: 12px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.choice-btn:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 10px var(--torch-glow);
  border-color: var(--torch-dim);
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
  font-size: 13px;
  color: var(--text-dim);
}

.choice-result {
  margin-bottom: 16px;
}
.chosen-label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.dismiss-btn {
  background: var(--bg-card);
  padding: 9px 28px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--torch);
  border: 1px solid var(--torch-dim);
  border-radius: var(--radius);
  margin: 0 auto;
  display: block;
  transition: all 0.15s;
}
.dismiss-btn:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 10px var(--torch-glow);
}
</style>
