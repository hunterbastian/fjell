<script setup>
import { ref } from 'vue'

const tabs = [
  { id: 'kingdom', label: 'kingdom' },
  { id: 'shop', label: 'shop' },
  { id: 'research', label: 'research' },
  { id: 'dynasty', label: 'dynasty' },
  { id: 'achievements', label: 'feats' },
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
}
.nav-tab {
  flex: 1;
  padding: 8px 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-dim);
  text-align: center;
  transition: color 0.15s;
  position: relative;
}
.nav-tab:hover {
  color: var(--text-mid);
}
.nav-tab.active {
  color: var(--accent);
}
.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
}
</style>
