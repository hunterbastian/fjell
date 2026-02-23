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
      <span class="mode-icon">{{ clickStore.isModeUnlocked(i) ? mode.icon : '&#128274;' }}</span>
      <span class="mode-name">{{ mode.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.mode-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
  font-size: 14px;
  transition: all 0.2s;
  min-width: 72px;
}
.mode-btn:hover:not(:disabled) {
  color: var(--text);
  background: var(--bg-card-hover);
  border-color: var(--border-lit);
}
.mode-btn.active {
  color: var(--torch);
  border-color: var(--torch-dim);
  box-shadow: 0 0 10px var(--torch-glow), inset 0 0 12px rgba(232, 160, 48, 0.05);
  background: var(--bg-card-hover);
}
.mode-btn.locked {
  opacity: 0.25;
}
.mode-icon {
  font-size: 18px;
}
.mode-name {
  font-size: 11px;
  font-family: var(--font-display);
  letter-spacing: 0.5px;
  white-space: nowrap;
}
</style>
