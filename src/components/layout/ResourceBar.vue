<script setup>
import { RESOURCES } from '../../config/resources.js'
import { useResourceStore } from '../../stores/resourceStore.js'
import { fmt } from '../../composables/useFormat.js'

const resources = useResourceStore()
</script>

<template>
  <div class="resource-bar">
    <div
      v-for="(r, i) in RESOURCES"
      :key="r.id"
      class="resource-item"
      :title="`${r.name}: ${fmt(resources.amounts[i])} / ${fmt(resources.caps[i])}`"
    >
      <span class="resource-label" :style="{ color: r.color }">{{ r.letter }}</span>
      <span class="resource-value">{{ fmt(resources.amounts[i]) }}</span>
      <span v-if="resources.rates[i] > 0" class="resource-rate">
        +{{ fmt(resources.rates[i]) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.resource-bar {
  display: flex;
  gap: 0;
  padding: 0 12px;
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.resource-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
}
.resource-label {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.7;
}
.resource-value {
  font-size: 12px;
  color: var(--text);
}
.resource-rate {
  font-size: 10px;
  color: var(--success);
  opacity: 0.7;
}
</style>
