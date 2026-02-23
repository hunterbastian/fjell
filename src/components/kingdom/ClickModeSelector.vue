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
  gap: 6px;
  margin-top: 16px;
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
  font-size: 14px;
  transition: all 0.2s;
  min-width: 78px;
  position: relative;
}
.mode-btn:hover:not(:disabled) {
  color: var(--text);
  background: var(--bg-card-hover);
  border-color: var(--border-lit);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}
.mode-btn.active {
  color: var(--torch);
  border-color: var(--torch-dim);
  box-shadow:
    0 0 12px var(--torch-glow),
    0 0 24px rgba(232, 160, 48, 0.06),
    inset 0 0 16px rgba(232, 160, 48, 0.06);
  background: linear-gradient(180deg, var(--bg-card-hover), var(--bg-card));
}
.mode-btn.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--torch-dim), transparent);
}
.mode-btn.locked {
  opacity: 0.2;
}
.mode-icon {
  font-size: 20px;
  line-height: 1;
}
.mode-name {
  font-size: 10px;
  font-family: var(--font-display);
  letter-spacing: 0.5px;
  white-space: nowrap;
  font-weight: 600;
}
</style>
