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
      <div class="bg-torch bg-torch--left" />
      <div class="bg-torch bg-torch--right" />
      <div class="bg-torch bg-torch--center" />
    </div>

    <!-- Decorative frame corners -->
    <div class="frame-corner frame-corner--tl" aria-hidden="true">┌</div>
    <div class="frame-corner frame-corner--tr" aria-hidden="true">┐</div>
    <div class="frame-corner frame-corner--bl" aria-hidden="true">└</div>
    <div class="frame-corner frame-corner--br" aria-hidden="true">┘</div>

    <div class="anvil-area fade-in">
      <DarkAnvil @click-result="onClickResult" />

      <div class="click-power-row">
        <span class="ornament">─── ✦ ───</span>
        <div class="click-power mono">{{ clickPower }}</div>
      </div>

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

/* Atmospheric background */
.kingdom-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 55%,
    rgba(232, 160, 48, 0.06) 0%,
    rgba(232, 160, 48, 0.02) 30%,
    transparent 60%
  );
}
.bg-torch {
  position: absolute;
  border-radius: 50%;
  animation: torch-flicker 4s ease-in-out infinite;
  pointer-events: none;
}
.bg-torch--left {
  top: 15%;
  left: 3%;
  width: 150px;
  height: 250px;
  background: radial-gradient(ellipse, rgba(232, 160, 48, 0.07) 0%, transparent 70%);
}
.bg-torch--right {
  top: 10%;
  right: 5%;
  width: 130px;
  height: 220px;
  background: radial-gradient(ellipse, rgba(232, 160, 48, 0.05) 0%, transparent 70%);
  animation-delay: 1.5s;
  animation-duration: 5s;
}
.bg-torch--center {
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(232, 160, 48, 0.03) 0%, transparent 60%);
  animation-delay: 0.8s;
  animation-duration: 6s;
}

/* Decorative corner frame */
.frame-corner {
  position: absolute;
  color: var(--border-lit);
  opacity: 0.15;
  font-size: 20px;
  line-height: 1;
  font-family: monospace;
  pointer-events: none;
  z-index: 1;
}
.frame-corner--tl { top: 10px; left: 10px; }
.frame-corner--tr { top: 10px; right: 10px; }
.frame-corner--bl { bottom: 10px; left: 10px; }
.frame-corner--br { bottom: 10px; right: 10px; }

/* Main content */
.anvil-area {
  text-align: center;
  position: relative;
  z-index: 2;
}
.click-power-row {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ornament {
  font-size: 10px;
  color: var(--border-highlight);
  letter-spacing: 2px;
  opacity: 0.4;
}
.click-power {
  font-size: 14px;
  color: var(--text-mid);
  letter-spacing: 0.5px;
}
</style>
