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
      <span class="mode-icon">{{ clickStore.isModeUnlocked(i) ? mode.icon : '·' }}</span>
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
  margin-top: 14px;
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 12px;
  transition: color 0.15s, border-color 0.15s;
  min-width: 68px;
}
.mode-btn:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--border-lit);
}
.mode-btn.active {
  color: var(--accent);
  border-color: var(--accent-dim);
}
.mode-btn.locked {
  opacity: 0.2;
}
.mode-icon {
  font-size: 16px;
  line-height: 1;
}
.mode-name {
  font-size: 9px;
  white-space: nowrap;
}
</style>
