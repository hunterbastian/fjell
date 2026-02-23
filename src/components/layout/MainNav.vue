<script setup>
import { ref } from 'vue'

const tabs = [
  { id: 'kingdom', label: 'Kingdom' },
  { id: 'shop', label: 'Shop' },
  { id: 'research', label: 'Research' },
  { id: 'dynasty', label: 'Dynasty' },
  { id: 'achievements', label: 'Feats' },
]

const activeTab = ref('kingdom')

defineExpose({ activeTab })
</script>

<template>
  <nav class="main-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-tab"
      :class="{ active: activeTab === tab.id }"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.main-nav {
  display: flex;
  background: var(--bg-dark);
  border-bottom: 2px solid var(--border);
  flex-shrink: 0;
}
.nav-tab {
  flex: 1;
  padding: 8px 4px;
  font-size: 16px;
  color: var(--text-dim);
  transition: color 0.15s, background 0.15s;
  position: relative;
  text-align: center;
}
.nav-tab:hover {
  color: var(--text-mid);
  background: var(--bg-panel);
}
.nav-tab.active {
  color: var(--torch);
  background: var(--bg-panel);
}
.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 8px;
  right: 8px;
  height: 2px;
  background: var(--torch);
  box-shadow: 0 0 6px var(--torch-glow);
}
</style>
