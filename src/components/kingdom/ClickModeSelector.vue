<script setup>
import { useClickStore } from '../../stores/clickStore.js'
import { CLICK_MODES } from '../../config/clickModes.js'

const clickStore = useClickStore()
</script>

<template>
  <div class="mode-selector">
    <button
      v-for="(mode, i) in CLICK_MODES"
      :key="mode.id"
      class="mode-btn"
      :class="{
        active: clickStore.activeMode === i,
        locked: !clickStore.isModeUnlocked(i)
      }"
      :disabled="!clickStore.isModeUnlocked(i)"
      @click="clickStore.setMode(i)"
      :title="mode.desc"
    >
      <span class="mode-icon">{{ clickStore.isModeUnlocked(i) ? mode.icon : '🔒' }}</span>
      <span class="mode-name">{{ mode.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.mode-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  background: var(--bg-card);
  border: 2px solid;
  border-color: var(--border-lit) var(--border) var(--border) var(--border-lit);
  color: var(--text-dim);
  font-size: 14px;
  transition: all 0.15s;
  min-width: 72px;
}
.mode-btn:hover:not(:disabled) {
  color: var(--text);
  background: var(--bg-card-hover);
}
.mode-btn.active {
  color: var(--torch);
  border-color: var(--torch-dim) var(--border) var(--border) var(--torch-dim);
  box-shadow: 0 0 8px var(--torch-glow);
  background: var(--bg-card-hover);
}
.mode-btn.locked {
  opacity: 0.3;
}
.mode-icon {
  font-size: 18px;
}
.mode-name {
  font-size: 12px;
  white-space: nowrap;
}
</style>
