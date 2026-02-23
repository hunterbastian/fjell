<script setup>
import { computed } from 'vue'
import { useClickStore } from '../../stores/clickStore.js'
import { CLICK_MODES } from '../../config/clickModes.js'
import { fmt } from '../../composables/useFormat.js'
import DarkAnvil from './DarkAnvil.vue'
import ClickModeSelector from './ClickModeSelector.vue'
import MomentumBar from './MomentumBar.vue'

const emit = defineEmits(['toast'])

const clickStore = useClickStore()

const clickPower = computed(() => {
  const mode = CLICK_MODES[clickStore.activeMode]
  const base = clickStore.baseClickPower * clickStore.clickMultiplier
  const tier = clickStore.getMomentumTier(clickStore.activeMode)
  const total = base * (1 + tier.bonus)
  const resNames = Object.keys(mode.resources).join(', ')
  return `+${fmt(total)} ${resNames}`
})

function onClickResult(result) {
  if (result.crit) {
    emit('toast', 'CRITICAL STRIKE!', 'gold')
  }
}
</script>

<template>
  <div class="kingdom-view">
    <!-- Atmospheric background layers -->
    <div class="kingdom-bg" aria-hidden="true">
      <div class="bg-gradient" />
      <div class="bg-torch-left" />
      <div class="bg-torch-right" />
    </div>

    <div class="anvil-area fade-in">
      <DarkAnvil @click-result="onClickResult" />
      <div class="click-power mono">{{ clickPower }}</div>
      <MomentumBar />
      <ClickModeSelector />
    </div>
  </div>
</template>

<style scoped>
.kingdom-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: hidden;
}
.kingdom-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 60%,
    rgba(232, 160, 48, 0.04) 0%,
    transparent 60%
  );
}
.bg-torch-left {
  position: absolute;
  top: 20%;
  left: 5%;
  width: 120px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(232, 160, 48, 0.06) 0%, transparent 70%);
  animation: torch-flicker 4s ease-in-out infinite;
}
.bg-torch-right {
  position: absolute;
  top: 15%;
  right: 8%;
  width: 100px;
  height: 180px;
  background: radial-gradient(ellipse, rgba(232, 160, 48, 0.04) 0%, transparent 70%);
  animation: torch-flicker 5s ease-in-out infinite;
  animation-delay: 1.5s;
}
.anvil-area {
  text-align: center;
  position: relative;
  z-index: 2;
}
.click-power {
  font-size: 13px;
  color: var(--text-mid);
  margin-top: 10px;
  letter-spacing: 0.5px;
}
</style>
