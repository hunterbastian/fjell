<script setup>
import { computed } from 'vue'
import { BUILDINGS } from '../../config/buildings.js'
import { RESOURCES, RES } from '../../config/resources.js'
import { useBuildingStore } from '../../stores/buildingStore.js'
import { useResourceStore } from '../../stores/resourceStore.js'
import { fmt } from '../../composables/useFormat.js'

const props = defineProps({
  index: { type: Number, required: true },
})

const emit = defineEmits(['buy', 'toast'])

const buildings = useBuildingStore()
const resources = useResourceStore()

const building = computed(() => BUILDINGS[props.index])
const level = computed(() => buildings.levels[props.index])
const cost = computed(() => buildings.getCost(props.index))
const unlocked = computed(() => buildings.isUnlocked(props.index))
const affordable = computed(() => resources.canAfford(cost.value))
const production = computed(() => {
  const b = building.value
  if (!b.produces || Object.keys(b.produces).length === 0) return null
  const entries = []
  for (const [resId, rate] of Object.entries(b.produces)) {
    const current = rate * level.value
    entries.push({ name: RESOURCES[RES[resId]].name, rate: current, next: rate, color: RESOURCES[RES[resId]].color })
  }
  return entries
})

function handleBuy() {
  if (buildings.buy(props.index)) {
    emit('toast', `${building.value.icon} ${building.value.name} ${level.value > 1 ? 'upgraded to Lv.' + level.value : 'built'}`)
  }
}
</script>

<template>
  <div
    v-if="unlocked || level > 0"
    class="building-card"
    :class="{ affordable, locked: !unlocked }"
    @click="affordable ? handleBuy() : null"
  >
    <div class="card-left">
      <span class="card-icon">{{ building.icon }}</span>
    </div>
    <div class="card-info">
      <div class="card-header">
        <span class="card-name">{{ building.name }}</span>
        <span v-if="level > 0" class="card-level">Lv.{{ level }}</span>
      </div>
      <div class="card-desc">{{ building.desc }}</div>
      <div v-if="production" class="card-production">
        <span v-for="p in production" :key="p.name">
          <span v-if="p.rate > 0" :style="{ color: p.color }">{{ fmt(p.rate) }}/s</span>
          <span class="next-rate">(+{{ fmt(p.next) }})</span>
        </span>
      </div>
      <div v-else-if="building.special" class="card-special">
        {{ building.special === 'prestige' ? 'Enables New Dynasty' : building.special }}
      </div>
    </div>
    <div class="card-cost">
      <div v-for="(amt, resId) in cost" :key="resId" class="cost-line">
        <span class="cost-val" :class="{ 'cost-short': resources.amounts[RES[resId]] < amt }">
          {{ fmt(amt) }}
        </span>
        <span class="cost-res" :style="{ color: RESOURCES[RES[resId]].color }">
          {{ RESOURCES[RES[resId]].icon }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.building-card {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.building-card.locked {
  opacity: 0.3;
  pointer-events: none;
}
.building-card.affordable {
  border-color: var(--torch-dim);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(232, 160, 48, 0.03) 100%);
}
.building-card.affordable:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 12px var(--torch-glow), 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--torch);
  transform: translateY(-1px);
}
.building-card:not(.affordable) {
  cursor: default;
}

.card-icon {
  font-size: 22px;
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
.card-level {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--torch);
  background: rgba(232, 160, 48, 0.1);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}
.card-desc {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 2px;
  line-height: 1.4;
}
.card-production {
  font-family: var(--font-mono);
  font-size: 11px;
  margin-top: 3px;
  display: flex;
  gap: 8px;
}
.next-rate {
  color: var(--text-dim);
  font-size: 10px;
  margin-left: 2px;
}
.card-special {
  font-size: 13px;
  color: var(--faith);
  margin-top: 3px;
  text-transform: capitalize;
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
</style>
