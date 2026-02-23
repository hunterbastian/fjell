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
      :height="6"
    />
  </div>
</template>

<style scoped>
.momentum-wrap {
  width: 200px;
  margin: 8px auto 0;
}
.momentum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}
.momentum-label {
  font-size: 12px;
  color: var(--text-dim);
}
.momentum-tier {
  font-size: 12px;
  color: var(--torch);
  font-family: var(--font-mono);
}
.momentum-tier.blazing {
  color: #ff6030;
  text-shadow: 0 0 6px rgba(255, 96, 48, 0.5);
  animation: torch-flicker 1s ease-in-out infinite;
}
.momentum-bonus {
  font-size: 11px;
  opacity: 0.7;
  margin-left: 4px;
}
</style>
