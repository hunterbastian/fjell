<script setup>
import { computed } from 'vue'
import { useClickStore } from '../../stores/clickStore.js'
import { CLICK_MODES, MOMENTUM } from '../../config/clickModes.js'
import PixelProgress from '../ui/PixelProgress.vue'

const clickStore = useClickStore()

const currentMomentum = computed(() => clickStore.momentum[clickStore.activeMode])
const currentTier = computed(() => clickStore.getMomentumTier(clickStore.activeMode))
const modeName = computed(() => CLICK_MODES[clickStore.activeMode].name)
const bonusPercent = computed(() => Math.round(currentTier.value.bonus * 100))
const isBlaze = computed(() => currentMomentum.value >= MOMENTUM.max)
</script>

<template>
  <div class="momentum-wrap">
    <div class="momentum-header">
      <span class="momentum-label">Momentum</span>
      <span v-if="currentTier.label" class="momentum-tier" :class="{ blazing: isBlaze }">
        {{ currentTier.label }}
        <span v-if="bonusPercent > 0" class="momentum-bonus">+{{ bonusPercent }}%</span>
      </span>
    </div>
    <PixelProgress
      :value="currentMomentum"
      :max="MOMENTUM.max"
      :color="isBlaze ? '#ff6030' : 'var(--torch)'"
      :height="4"
    />
  </div>
</template>

<style scoped>
.momentum-wrap {
  width: 220px;
  margin: 12px auto 0;
}
.momentum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.momentum-label {
  font-size: 11px;
  color: var(--text-dim);
  font-family: var(--font-display);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}
.momentum-tier {
  font-size: 11px;
  color: var(--torch);
  font-family: var(--font-mono);
}
.momentum-tier.blazing {
  color: #ff6030;
  text-shadow: 0 0 8px rgba(255, 96, 48, 0.5);
  animation: torch-flicker 1s ease-in-out infinite;
}
.momentum-bonus {
  font-size: 10px;
  opacity: 0.7;
  margin-left: 3px;
}
</style>
