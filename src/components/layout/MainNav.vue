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
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  gap: 1px;
}
.nav-tab {
  flex: 1;
  padding: 9px 4px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  transition: color 0.2s, background 0.2s;
  position: relative;
  text-align: center;
  text-transform: uppercase;
}
.nav-tab:hover {
  color: var(--text-mid);
  background: rgba(255, 255, 255, 0.02);
}
.nav-tab.active {
  color: var(--torch);
  background: rgba(232, 160, 48, 0.04);
}
.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  background: var(--torch);
  border-radius: 1px 1px 0 0;
  box-shadow: 0 0 8px var(--torch-glow);
}
</style>
