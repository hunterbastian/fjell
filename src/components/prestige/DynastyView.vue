<script setup>
import { ref, computed, inject } from 'vue'
import { CROWN_SHOP } from '../../config/prestige.js'
import { usePrestigeStore } from '../../stores/prestigeStore.js'
import { useBuildingStore } from '../../stores/buildingStore.js'
import { fmt } from '../../composables/useFormat.js'
import PixelPanel from '../ui/PixelPanel.vue'
import CrownShopItem from './CrownShopItem.vue'
import GameModal from '../ui/GameModal.vue'

const toast = inject('toast')
const prestige = usePrestigeStore()
const buildings = useBuildingStore()

const showConfirm = ref(false)

const castleLevel = computed(() => buildings.getLevel('castle'))
const castleNeeded = 10
const dynastyLabel = computed(() => {
  const n = prestige.dynastyCount
  if (n === 0) return 'first dynasty'
  return `dynasty ${n + 1}`
})

function attemptPrestige() {
  if (!prestige.canPrestige) return
  showConfirm.value = true
}

function confirmPrestige() {
  const earned = prestige.performPrestige()
  showConfirm.value = false
  if (earned) {
    toast(`new dynasty! +${earned} crowns earned`, 'success')
  }
}

function handleShopBuy(name, level) {
  toast(`${name} upgraded to lv.${level}`, 'success')
}
</script>

<template>
  <div class="dynasty-view fade-in">
    <!-- Dynasty Status -->
    <PixelPanel class="dynasty-header">
      <div class="dynasty-title-row">
        <h2 class="dynasty-name">{{ dynastyLabel }}</h2>
        <div class="crown-balance">
          <span class="crown-count">{{ fmt(prestige.availableCrowns) }} crowns</span>
        </div>
      </div>

      <div class="dynasty-stats">
        <div class="stat-item">
          <span class="stat-label">dynasties</span>
          <span class="stat-val">{{ prestige.dynastyCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">total earned</span>
          <span class="stat-val gold">{{ fmt(prestige.totalCrowns) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">available</span>
          <span class="stat-val gold">{{ fmt(prestige.availableCrowns) }}</span>
        </div>
      </div>
    </PixelPanel>

    <!-- Prestige Action -->
    <PixelPanel class="prestige-section">
      <h3 class="section-title">new dynasty</h3>
      <p class="prestige-desc">
        abandon your kingdom and begin anew. all buildings, resources, upgrades,
        and research will be lost. crowns and crown shop purchases persist forever.
      </p>

      <div class="prestige-req">
        <span class="req-label">castle level:</span>
        <span class="req-val" :class="{ met: castleLevel >= castleNeeded }">
          {{ castleLevel }} / {{ castleNeeded }}
        </span>
      </div>

      <div class="prestige-reward" v-if="prestige.pendingCrowns > 0">
        <span class="reward-label">crowns earned:</span>
        <span class="reward-val">+{{ fmt(prestige.pendingCrowns) }}</span>
      </div>
      <div class="prestige-reward" v-else>
        <span class="reward-label dim">earn more resources to gain crowns</span>
      </div>

      <button
        class="prestige-btn"
        :class="{ ready: prestige.canPrestige }"
        :disabled="!prestige.canPrestige"
        @click="attemptPrestige"
      >
        begin new dynasty
      </button>
    </PixelPanel>

    <!-- Crown Shop -->
    <PixelPanel class="shop-section">
      <h3 class="section-title">crown shop</h3>
      <p class="shop-desc">permanent upgrades that persist across all dynasties.</p>

      <div class="shop-list">
        <CrownShopItem
          v-for="item in CROWN_SHOP"
          :key="item.id"
          :item-id="item.id"
          @buy="handleShopBuy"
        />
      </div>
    </PixelPanel>

    <!-- Prestige Confirmation Modal -->
    <GameModal :show="showConfirm" @close="showConfirm = false">
      <div class="confirm-content">
        <h2 class="confirm-title">begin new dynasty?</h2>
        <div class="confirm-warning">
          <p>this will <strong>permanently destroy</strong> your current kingdom:</p>
          <ul class="reset-list">
            <li>all resources</li>
            <li>all buildings</li>
            <li>all upgrades</li>
            <li>all research progress</li>
          </ul>
        </div>
        <div class="confirm-gain">
          <p>you will receive:</p>
          <span class="gain-crowns">+{{ fmt(prestige.pendingCrowns) }} crowns</span>
        </div>
        <div class="confirm-buttons">
          <button class="cancel-btn" @click="showConfirm = false">
            cancel
          </button>
          <button class="confirm-btn" @click="confirmPrestige">
            destroy &amp; rebuild
          </button>
        </div>
      </div>
    </GameModal>
  </div>
</template>

<style scoped>
.dynasty-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Header */
.dynasty-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.dynasty-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}
.crown-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.crown-count {
  color: var(--gold);
  font-weight: 700;
}

.dynasty-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-label {
  font-size: 10px;
  color: var(--text-dim);
}
.stat-val {
  font-size: 13px;
  color: var(--text);
}
.stat-val.gold {
  color: var(--gold);
}

/* Prestige Section */
.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.prestige-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin: 0 0 14px 0;
  line-height: 1.5;
}

.prestige-req {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}
.req-label {
  color: var(--text-dim);
}
.req-val {
  color: var(--danger);
}
.req-val.met {
  color: var(--success);
}

.prestige-reward {
  margin-bottom: 14px;
  font-size: 12px;
}
.reward-label {
  color: var(--text-dim);
}
.reward-label.dim {
  color: var(--text-dim);
}
.reward-val {
  color: var(--gold);
  font-size: 14px;
  margin-left: 6px;
}

.prestige-btn {
  display: block;
  width: 100%;
  padding: 11px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  background: var(--bg-card);
  border: 1px solid var(--border);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.prestige-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.prestige-btn.ready {
  color: var(--gold);
  border-color: rgba(212, 160, 23, 0.4);
}
.prestige-btn.ready:hover {
  background: var(--bg-card-hover);
  border-color: var(--gold);
}

/* Shop Section */
.shop-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin: 0 0 12px 0;
}
.shop-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Confirmation Modal */
.confirm-content {
  text-align: center;
}
.confirm-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--danger);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
.confirm-warning {
  text-align: left;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--text-dim);
}
.confirm-warning strong {
  color: var(--danger);
}
.reset-list {
  margin: 8px 0 0 20px;
  padding: 0;
  color: var(--text-dim);
  font-size: 12px;
}
.reset-list li {
  margin-bottom: 4px;
}
.confirm-gain {
  margin-bottom: 20px;
  font-size: 12px;
  color: var(--text-dim);
}
.gain-crowns {
  display: block;
  font-size: 18px;
  color: var(--gold);
  margin-top: 6px;
}
.confirm-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.cancel-btn {
  background: var(--bg-card);
  padding: 9px 20px;
  color: var(--text-dim);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  transition: background 0.15s;
}
.cancel-btn:hover {
  background: var(--bg-card-hover);
}
.confirm-btn {
  background: var(--bg-card);
  padding: 9px 20px;
  color: var(--danger);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(160, 48, 48, 0.4);
  transition: background 0.15s;
}
.confirm-btn:hover {
  background: rgba(160, 48, 48, 0.1);
}
</style>
