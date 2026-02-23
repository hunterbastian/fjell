<script setup>
import { ref } from 'vue'

const tabs = [
  { id: 'kingdom', label: 'Kingdom', icon: '🏰' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'research', label: 'Research', icon: '📜' },
  { id: 'dynasty', label: 'Dynasty', icon: '👑' },
  { id: 'achievements', label: 'Feats', icon: '⚔' },
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
      <span class="nav-icon">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.main-nav {
  display: flex;
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  gap: 0;
  position: relative;
}
/* Ornamental diamonds */
.main-nav::before,
.main-nav::after {
  content: '◆';
  position: absolute;
  bottom: -1px;
  font-size: 5px;
  color: var(--border-lit);
  line-height: 1;
}
.main-nav::before { left: 4px; }
.main-nav::after { right: 4px; }

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px 10px;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  transition: color 0.2s, background 0.2s;
  position: relative;
  text-align: center;
  text-transform: uppercase;
}
.nav-icon {
  font-size: 14px;
  line-height: 1;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.nav-label {
  font-size: 9px;
}
.nav-tab:hover {
  color: var(--text-mid);
  background: rgba(255, 255, 255, 0.02);
}
.nav-tab:hover .nav-icon {
  opacity: 0.85;
}
.nav-tab.active {
  color: var(--torch);
  background: rgba(232, 160, 48, 0.04);
}
.nav-tab.active .nav-icon {
  opacity: 1;
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
