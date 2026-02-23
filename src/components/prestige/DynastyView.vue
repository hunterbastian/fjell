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
  if (n === 0) return 'First Dynasty'
  return `Dynasty ${n + 1}`
})

function attemptPrestige() {
  if (!prestige.canPrestige) return
  showConfirm.value = true
}

function confirmPrestige() {
  const earned = prestige.performPrestige()
  showConfirm.value = false
  if (earned) {
    toast(`New Dynasty! +${earned} Crowns earned`, 'success')
  }
}

function handleShopBuy(name, level) {
  toast(`${name} upgraded to Lv.${level}`, 'success')
}
</script>

<template>
  <div class="dynasty-view fade-in">
    <!-- Dynasty Status -->
    <PixelPanel class="dynasty-header">
      <div class="dynasty-title-row">
        <h2 class="display-title dynasty-name">{{ dynastyLabel }}</h2>
        <div class="crown-balance">
          <span class="crown-icon">👑</span>
          <span class="crown-count">{{ fmt(prestige.availableCrowns) }}</span>
        </div>
      </div>

      <div class="dynasty-stats">
        <div class="stat-item">
          <span class="stat-label">Dynasties Completed</span>
          <span class="stat-val">{{ prestige.dynastyCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Crowns Earned</span>
          <span class="stat-val gold">{{ fmt(prestige.totalCrowns) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Crowns Available</span>
          <span class="stat-val gold">{{ fmt(prestige.availableCrowns) }}</span>
        </div>
      </div>
    </PixelPanel>

    <!-- Prestige Action -->
    <PixelPanel class="prestige-section">
      <h3 class="section-title">New Dynasty</h3>
      <p class="prestige-desc">
        Abandon your kingdom and begin anew. All buildings, resources, upgrades,
        and research will be lost. Crowns and crown shop purchases persist forever.
      </p>

      <div class="prestige-req">
        <span class="req-label">Castle Level:</span>
        <span class="req-val" :class="{ met: castleLevel >= castleNeeded }">
          {{ castleLevel }} / {{ castleNeeded }}
        </span>
      </div>

      <div class="prestige-reward" v-if="prestige.pendingCrowns > 0">
        <span class="reward-label">Crowns earned:</span>
        <span class="reward-val">+{{ fmt(prestige.pendingCrowns) }} 👑</span>
      </div>
      <div class="prestige-reward" v-else>
        <span class="reward-label dim">Earn more resources to gain crowns</span>
      </div>

      <button
        class="prestige-btn bevel"
        :class="{ ready: prestige.canPrestige }"
        :disabled="!prestige.canPrestige"
        @click="attemptPrestige"
      >
        Begin New Dynasty
      </button>
    </PixelPanel>

    <!-- Crown Shop -->
    <PixelPanel class="shop-section">
      <h3 class="section-title">Crown Shop</h3>
      <p class="shop-desc">Permanent upgrades that persist across all dynasties.</p>

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
        <h2 class="display-title confirm-title">Begin New Dynasty?</h2>
        <div class="confirm-warning">
          <p>This will <strong>permanently destroy</strong> your current kingdom:</p>
          <ul class="reset-list">
            <li>All resources</li>
            <li>All buildings</li>
            <li>All upgrades</li>
            <li>All research progress</li>
          </ul>
        </div>
        <div class="confirm-gain">
          <p>You will receive:</p>
          <span class="gain-crowns">+{{ fmt(prestige.pendingCrowns) }} 👑 Crowns</span>
        </div>
        <div class="confirm-buttons">
          <button class="bevel cancel-btn" @click="showConfirm = false">
            Cancel
          </button>
          <button class="bevel confirm-btn" @click="confirmPrestige">
            Destroy &amp; Rebuild
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
.dynasty-header {
  background: var(--bg-panel);
}
.dynasty-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.dynasty-name {
  font-size: 18px;
  margin: 0;
}
.crown-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 18px;
}
.crown-icon {
  font-size: 20px;
}
.crown-count {
  color: var(--gold);
  font-weight: 700;
}

.dynasty-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-label {
  font-size: 13px;
  color: var(--text-dim);
}
.stat-val {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text);
}
.stat-val.gold {
  color: var(--gold);
}

/* Prestige Section */
.prestige-section {
  background: var(--bg-panel);
}
.section-title {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--torch);
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}
.prestige-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.prestige-req {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
}
.req-label {
  color: var(--text-dim);
}
.req-val {
  font-family: var(--font-mono);
  color: var(--danger);
}
.req-val.met {
  color: var(--success);
}

.prestige-reward {
  margin-bottom: 12px;
  font-size: 14px;
}
.reward-label {
  color: var(--text-dim);
}
.reward-label.dim {
  color: var(--text-dim);
  font-style: italic;
}
.reward-val {
  font-family: var(--font-mono);
  color: var(--gold);
  font-size: 16px;
  margin-left: 6px;
}

.prestige-btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text-dim);
  background: var(--bg-card);
  letter-spacing: 1px;
  transition: all 0.15s;
}
.prestige-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.prestige-btn.ready {
  color: var(--gold);
  border-color: var(--gold) var(--border) var(--border) var(--gold);
  animation: torch-flicker 3s ease-in-out infinite;
}
.prestige-btn.ready:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 16px rgba(212, 160, 23, 0.35);
}

/* Shop Section */
.shop-section {
  background: var(--bg-panel);
}
.shop-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin: 0 0 12px 0;
}
.shop-list {
  display: flex;
  flex-direction: column;
}

/* Confirmation Modal */
.confirm-content {
  text-align: center;
}
.confirm-title {
  font-size: 18px;
  color: var(--danger);
  margin-bottom: 16px;
}
.confirm-warning {
  text-align: left;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-dim);
}
.confirm-warning strong {
  color: var(--danger);
}
.reset-list {
  margin: 8px 0 0 20px;
  padding: 0;
  color: var(--text-dim);
  font-size: 14px;
}
.reset-list li {
  margin-bottom: 4px;
}
.confirm-gain {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-dim);
}
.gain-crowns {
  display: block;
  font-family: var(--font-mono);
  font-size: 22px;
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
  padding: 8px 20px;
  color: var(--text-dim);
  font-size: 16px;
}
.cancel-btn:hover {
  background: var(--bg-card-hover);
}
.confirm-btn {
  background: var(--bg-card);
  padding: 8px 20px;
  color: var(--danger);
  font-size: 16px;
  border-color: var(--danger) var(--border) var(--border) var(--danger);
}
.confirm-btn:hover {
  background: rgba(138, 32, 32, 0.2);
  box-shadow: 0 0 10px rgba(138, 32, 32, 0.3);
}
</style>
