<script setup>
import { computed } from 'vue'
import { UPGRADE_MAP } from '../../config/upgrades.js'
import { BUILDING_MAP } from '../../config/buildings.js'
import { RESOURCES, RES } from '../../config/resources.js'
import { CLICK_MODES } from '../../config/clickModes.js'
import { useUpgradeStore } from '../../stores/upgradeStore.js'
import { useResourceStore } from '../../stores/resourceStore.js'
import { fmt } from '../../composables/useFormat.js'

const props = defineProps({
  upgradeId: { type: String, required: true },
})

const emit = defineEmits(['toast'])

const upgrades = useUpgradeStore()
const resources = useResourceStore()

const upgrade = computed(() => UPGRADE_MAP[props.upgradeId])
const purchased = computed(() => upgrades.isPurchased(props.upgradeId))
const unlocked = computed(() => upgrades.isUnlocked(props.upgradeId))
const affordable = computed(() => !purchased.value && upgrades.canAfford(props.upgradeId))

function buildingName(id) {
  const b = BUILDING_MAP[id]
  return b ? b.name : id
}

function modeName(id) {
  const m = CLICK_MODES.find(cm => cm.id === id)
  return m ? m.name : id
}

function effectText(effects) {
  return effects.map(e => {
    switch (e.type) {
      case 'click_mult': return `\u00D7${e.value} click power`
      case 'building_mult': return `${buildingName(e.target)} \u00D7${e.value}`
      case 'storage_flat': return `+${fmt(e.value)} all storage`
      case 'momentum_gain_mult': return `+${Math.round((e.value - 1) * 100)}% momentum gain`
      case 'momentum_decay_mult': return `-${Math.round((1 - e.value) * 100)}% momentum decay`
      case 'crit_chance_flat': return `+${Math.round(e.value * 100)}% crit chance`
      case 'crit_mult': return `\u00D7${e.value} crit damage`
      case 'synergy': return `+${Math.round(e.value * 100)}% ${buildingName(e.source)} per ${buildingName(e.per)} lv`
      case 'synergy_total': return `+${Math.round(e.value * 100)}% ${buildingName(e.source)} per total bldg lv`
      case 'global_per_level': return `+${Math.round(e.value * 100)}% all prod per ${buildingName(e.per)} lv`
      case 'mode_mult': return `\u00D7${e.value} ${modeName(e.target)} click`
      case 'dual_focus': return 'Top 2 momentum modes never decay'
      default: return ''
    }
  }).filter(Boolean).join(', ')
}

function handleBuy() {
  if (upgrades.buy(props.upgradeId)) {
    emit('toast', `${upgrade.value.icon} ${upgrade.value.name} purchased!`)
  }
}
</script>

<template>
  <div
    v-if="unlocked || purchased"
    class="upgrade-card"
    :class="{ affordable: affordable && !purchased, purchased, locked: !unlocked && !purchased }"
    @click="affordable && !purchased ? handleBuy() : null"
  >
    <div class="card-left">
      <span class="card-icon">{{ upgrade.icon }}</span>
    </div>
    <div class="card-info">
      <div class="card-header">
        <span class="card-name">{{ upgrade.name }}</span>
        <span v-if="purchased" class="card-owned">OWNED</span>
      </div>
      <div class="card-desc">{{ upgrade.desc }}</div>
      <div class="card-effect">{{ effectText(upgrade.effects) }}</div>
    </div>
    <div v-if="!purchased" class="card-cost">
      <div v-for="(amt, resId) in upgrade.cost" :key="resId" class="cost-line">
        <span class="cost-val" :class="{ 'cost-short': resources.amounts[RES[resId]] < amt }">
          {{ fmt(amt) }}
        </span>
        <span class="cost-res" :style="{ color: RESOURCES[RES[resId]].color }">
          {{ RESOURCES[RES[resId]].icon }}
        </span>
      </div>
    </div>
    <div v-else class="card-check">&#10003;</div>
  </div>
</template>

<style scoped>
.upgrade-card {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.upgrade-card.locked {
  opacity: 0.3;
  pointer-events: none;
}
.upgrade-card.purchased {
  opacity: 0.55;
  cursor: default;
  border-color: rgba(58, 122, 40, 0.4);
}
.upgrade-card.affordable {
  border-color: var(--torch-dim);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(232, 160, 48, 0.03) 100%);
}
.upgrade-card.affordable:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 12px var(--torch-glow), 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--torch);
  transform: translateY(-1px);
}
.upgrade-card:not(.affordable):not(.purchased) {
  cursor: default;
}

.card-icon {
  font-size: 20px;
  display: block;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.card-owned {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--success);
  background: rgba(58, 122, 40, 0.1);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}
.card-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin-top: 2px;
}
.card-effect {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--torch);
  margin-top: 3px;
}

.card-cost {
  text-align: right;
}
.cost-line {
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
}
.cost-val {
  color: var(--torch);
}
.cost-val.cost-short {
  color: var(--danger);
}
.cost-res {
  font-size: 11px;
  font-weight: 700;
}
.card-check {
  font-size: 18px;
  color: var(--success);
  text-align: center;
}
</style>
