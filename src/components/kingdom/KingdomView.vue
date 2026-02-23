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
    <div class="anvil-area fade-in">
      <DarkAnvil @click-result="onClickResult" />
      <div class="click-power">{{ clickPower }}</div>
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
}
.anvil-area {
  text-align: center;
}
.click-power {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 12px;
}
</style>
