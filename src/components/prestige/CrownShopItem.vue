<script setup>
import { computed } from 'vue'
import { CROWN_SHOP_MAP } from '../../config/prestige.js'
import { usePrestigeStore } from '../../stores/prestigeStore.js'
import { fmt } from '../../composables/useFormat.js'

const props = defineProps({
  itemId: { type: String, required: true },
})

const emit = defineEmits(['buy'])

const prestige = usePrestigeStore()

const item = computed(() => CROWN_SHOP_MAP[props.itemId])
const level = computed(() => prestige.getShopLevel(props.itemId))
const cost = computed(() => prestige.getShopCost(props.itemId))
const maxed = computed(() => level.value >= item.value.maxLevel)
const affordable = computed(() => prestige.canAffordShop(props.itemId))

function handleBuy() {
  if (prestige.buyShopItem(props.itemId)) {
    emit('buy', item.value.name, level.value)
  }
}
</script>

<template>
  <div
    class="crown-item"
    :class="{ affordable: affordable && !maxed, maxed }"
    @click="affordable && !maxed ? handleBuy() : null"
  >
    <div class="item-icon">{{ item.icon }}</div>
    <div class="item-info">
      <div class="item-header">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-level" :class="{ 'level-max': maxed }">
          {{ maxed ? 'MAX' : `${level}/${item.maxLevel}` }}
        </span>
      </div>
      <div class="item-desc">{{ item.desc }}</div>
    </div>
    <div class="item-cost" v-if="!maxed">
      <span class="crown-icon">&#128081;</span>
      <span class="crown-val" :class="{ 'crown-short': !affordable }">{{ fmt(cost) }}</span>
    </div>
    <div class="item-cost maxed-label" v-else>
      COMPLETE
    </div>
  </div>
</template>

<style scoped>
.crown-item {
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
.crown-item.maxed {
  opacity: 0.5;
  cursor: default;
}
.crown-item.affordable {
  border-color: rgba(212, 160, 23, 0.4);
}
.crown-item.affordable:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 12px rgba(212, 160, 23, 0.2);
  border-color: var(--gold);
  transform: translateY(-1px);
}
.crown-item:not(.affordable):not(.maxed) {
  cursor: default;
}

.item-icon {
  font-size: 22px;
  text-align: center;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.item-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.item-level {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--gold);
  background: rgba(212, 160, 23, 0.1);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}
.item-level.level-max {
  color: var(--success);
  background: rgba(58, 122, 40, 0.1);
}
.item-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin-top: 2px;
}

.item-cost {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
}
.crown-icon {
  font-size: 14px;
}
.crown-val {
  color: var(--gold);
}
.crown-val.crown-short {
  color: var(--danger);
}
.maxed-label {
  color: var(--success);
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 2px;
}
</style>
