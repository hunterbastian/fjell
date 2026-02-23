<script setup>
import { RESOURCES } from '../../config/resources.js'
import { useResourceStore } from '../../stores/resourceStore.js'
import { fmt } from '../../composables/useFormat.js'

const resources = useResourceStore()

function fillPercent(i) {
  return Math.min(100, (resources.amounts[i] / resources.caps[i]) * 100)
}
</script>

<template>
  <div class="resource-bar">
    <div
      v-for="(r, i) in RESOURCES"
      :key="r.id"
      class="resource-item"
      :title="`${r.name}: ${fmt(resources.amounts[i])} / ${fmt(resources.caps[i])}${resources.rates[i] > 0 ? ' (+' + fmt(resources.rates[i]) + '/s)' : ''}`"
    >
      <span class="resource-icon" :style="{ color: r.color }">{{ r.icon }}</span>
      <div class="resource-info">
        <span class="resource-value mono">{{ fmt(resources.amounts[i]) }}</span>
        <div class="resource-fill-track">
          <div class="resource-fill-bar" :style="{ width: fillPercent(i) + '%', background: r.color }" />
        </div>
      </div>
      <span v-if="resources.rates[i] > 0" class="resource-rate mono">
        +{{ fmt(resources.rates[i]) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.resource-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.resource-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  min-width: 0;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.resource-item:hover {
  background: rgba(255, 255, 255, 0.03);
}
.resource-icon {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 11px;
  flex-shrink: 0;
  text-shadow: 0 0 8px currentColor;
}
.resource-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 36px;
}
.resource-value {
  font-size: 13px;
  color: var(--text);
  line-height: 1;
}
.resource-fill-track {
  width: 100%;
  height: 2px;
  background: var(--bg-card);
  border-radius: 1px;
  overflow: hidden;
}
.resource-fill-bar {
  height: 100%;
  border-radius: 1px;
  transition: width 0.3s linear;
  opacity: 0.6;
}
.resource-rate {
  font-size: 10px;
  color: var(--success);
  opacity: 0.8;
}
</style>
