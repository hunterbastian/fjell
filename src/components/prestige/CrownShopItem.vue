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
          {{ maxed ? 'max' : `${level}/${item.maxLevel}` }}
        </span>
      </div>
      <div class="item-desc">{{ item.desc }}</div>
    </div>
    <div class="item-cost" v-if="!maxed">
      <span class="crown-val" :class="{ 'crown-short': !affordable }">{{ fmt(cost) }}</span>
    </div>
    <div class="item-cost maxed-label" v-else>
      done
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
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.crown-item.maxed {
  opacity: 0.5;
  cursor: default;
}
.crown-item.affordable {
  border-color: rgba(212, 160, 23, 0.3);
}
.crown-item.affordable:hover {
  background: var(--bg-card-hover);
  border-color: var(--gold);
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
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.item-level {
  font-size: 10px;
  color: var(--gold);
  border: 1px solid var(--border);
  padding: 1px 5px;
}
.item-level.level-max {
  color: var(--success);
  border-color: rgba(58, 122, 40, 0.3);
}
.item-desc {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
}

.item-cost {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}
.crown-val {
  color: var(--gold);
}
.crown-val.crown-short {
  color: var(--danger);
}
.maxed-label {
  color: var(--success);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
