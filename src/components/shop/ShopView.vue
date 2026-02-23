<script setup>
import { ref, computed } from 'vue'
import { BUILDINGS } from '../../config/buildings.js'
import { UPGRADES } from '../../config/upgrades.js'
import { useUpgradeStore } from '../../stores/upgradeStore.js'
import BuildingCard from './BuildingCard.vue'
import UpgradeCard from './UpgradeCard.vue'

const emit = defineEmits(['toast'])

const activeTab = ref('buildings')
const upgrades = useUpgradeStore()

const visibleUpgrades = computed(() => {
  return UPGRADES.filter(u => upgrades.isUnlocked(u.id) || upgrades.isPurchased(u.id))
})
</script>

<template>
  <div class="shop-view">
    <div class="shop-tabs">
      <button
        class="shop-tab"
        :class="{ active: activeTab === 'buildings' }"
        @click="activeTab = 'buildings'"
      >
        Buildings
      </button>
      <button
        class="shop-tab"
        :class="{ active: activeTab === 'upgrades' }"
        @click="activeTab = 'upgrades'"
      >
        Upgrades
        <span v-if="upgrades.purchasedCount > 0" class="tab-count">{{ upgrades.purchasedCount }}</span>
      </button>
    </div>

    <div class="shop-body">
      <div v-if="activeTab === 'buildings'" class="shop-list fade-in">
        <BuildingCard
          v-for="(b, i) in BUILDINGS"
          :key="b.id"
          :index="i"
          @toast="(msg) => emit('toast', msg)"
        />
      </div>
      <div v-else class="shop-list fade-in">
        <template v-if="visibleUpgrades.length > 0">
          <UpgradeCard
            v-for="u in visibleUpgrades"
            :key="u.id"
            :upgrade-id="u.id"
            @toast="(msg) => emit('toast', msg)"
          />
        </template>
        <div v-else class="shop-empty">
          <p>No upgrades available yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.shop-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.shop-tab {
  flex: 1;
  padding: 9px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-dim);
  text-align: center;
  transition: color 0.2s, background 0.2s;
  position: relative;
}
.shop-tab:hover { color: var(--text-mid); background: rgba(255, 255, 255, 0.02); }
.shop-tab.active { color: var(--torch); background: rgba(232, 160, 48, 0.04); }
.shop-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  background: var(--torch);
  border-radius: 1px 1px 0 0;
  box-shadow: 0 0 6px var(--torch-glow);
}
.tab-count {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--torch);
  margin-left: 4px;
}

.shop-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.shop-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.shop-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-dim);
  font-size: 15px;
  font-style: italic;
}
</style>
