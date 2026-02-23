<script setup>
import { computed } from 'vue'
import { useEventStore } from '../../stores/eventStore.js'
import GameModal from '../ui/GameModal.vue'

const events = useEventStore()

const typeLabel = computed(() => {
  if (!events.activeEvent) return ''
  switch (events.activeEvent.type) {
    case 'positive': return 'blessing'
    case 'negative': return 'calamity'
    case 'choice': return 'omen'
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
      <h2 class="event-title">{{ events.activeEvent.name }}</h2>
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
          you chose: {{ events.activeEvent.choices[events.activeChoiceIndex].label }}
        </div>
      </div>

      <button
        v-if="canDismiss"
        class="dismiss-btn"
        @click="events.dismissEvent()"
      >
        continue
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
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 3px 10px;
  display: inline-block;
  margin-bottom: 10px;
}
.event-type-badge.positive { color: var(--success); border: 1px solid rgba(58, 122, 40, 0.3); }
.event-type-badge.negative { color: var(--danger); border: 1px solid rgba(160, 48, 48, 0.3); }
.event-type-badge.choice { color: var(--faith); border: 1px solid rgba(144, 96, 192, 0.3); }

.event-icon {
  font-size: 40px;
  margin: 8px 0;
}

.event-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.event-desc {
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.event-result {
  font-size: 12px;
  color: var(--accent);
  padding: 10px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
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
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.choice-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-dim);
}
.choice-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
}
.choice-desc {
  display: block;
  font-size: 11px;
  color: var(--text-dim);
}

.choice-result {
  margin-bottom: 16px;
}
.chosen-label {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.dismiss-btn {
  background: var(--bg-card);
  padding: 9px 28px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  border: 1px solid var(--accent-dim);
  margin: 0 auto;
  display: block;
  transition: background 0.15s;
}
.dismiss-btn:hover {
  background: var(--bg-card-hover);
}
</style>
