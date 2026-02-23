<script setup>
import { RESOURCES } from '../../config/resources.js'
import { useResourceStore } from '../../stores/resourceStore.js'
import { fmt } from '../../composables/useFormat.js'

const resources = useResourceStore()
</script>

<template>
  <div class="resource-bar bevel-inset">
    <div
      v-for="(r, i) in RESOURCES"
      :key="r.id"
      class="resource-item"
      :title="`${r.name}: ${fmt(resources.amounts[i])} / ${fmt(resources.caps[i])}${resources.rates[i] > 0 ? ' (+' + fmt(resources.rates[i]) + '/s)' : ''}`"
    >
      <span class="resource-icon" :style="{ color: r.color }">{{ r.icon }}</span>
      <span class="resource-value mono">{{ fmt(resources.amounts[i]) }}</span>
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
  padding: 4px 12px;
  background: var(--bg-dark);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.resource-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  min-width: 0;
}
.resource-icon {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 12px;
  flex-shrink: 0;
}
.resource-value {
  font-size: 13px;
  color: var(--text);
}
.resource-rate {
  font-size: 10px;
  color: var(--success);
  opacity: 0.8;
}
</style>
