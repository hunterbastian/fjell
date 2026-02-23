<script setup>
import { ref } from 'vue'
import { useClickStore } from '../../stores/clickStore.js'
import { fmt } from '../../composables/useFormat.js'

const clickStore = useClickStore()
const emit = defineEmits(['click-result'])
const anvilRef = ref(null)
const floats = ref([])
let floatId = 0

function handleClick(e) {
  const result = clickStore.doClick()

  const el = anvilRef.value
  if (el) {
    el.classList.remove('anvil-hit')
    void el.offsetWidth
    el.classList.add('anvil-hit')
  }

  const rect = anvilRef.value?.getBoundingClientRect()
  if (rect) {
    const totalValue = Object.values(result.resources).reduce((s, v) => s + v, 0)
    const id = floatId++
    floats.value.push({
      id,
      text: '+' + fmt(totalValue),
      crit: result.crit,
      x: (Math.random() - 0.5) * 60,
    })
    setTimeout(() => {
      floats.value = floats.value.filter(f => f.id !== id)
    }, 800)
  }

  emit('click-result', result)
}
</script>

<template>
  <div class="anvil-wrapper">
    <div ref="anvilRef" class="dark-anvil" @click="handleClick">
      <div class="anvil-icon">⚔</div>
    </div>

    <div
      v-for="f in floats"
      :key="f.id"
      class="float-num"
      :class="{ 'float-crit': f.crit }"
      :style="{ transform: `translateX(${f.x}px)` }"
    >
      {{ f.text }}
    </div>
  </div>
</template>

<style scoped>
.anvil-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.dark-anvil {
  width: 120px;
  height: 120px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border-lit);
  transition: background 0.1s, transform 0.1s;
}
.dark-anvil:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-highlight);
}
.dark-anvil:active {
  transform: scale(0.96);
}

.anvil-icon {
  font-size: 40px;
  color: var(--accent);
  transition: transform 0.1s;
}

.dark-anvil.anvil-hit {
  animation: anvil-press 0.12s ease-out;
}

.float-num {
  position: absolute;
  top: 25%;
  left: 50%;
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
  pointer-events: none;
  z-index: 10;
  animation: float-number 0.8s ease-out forwards;
  white-space: nowrap;
}
.float-crit {
  font-size: 18px;
  color: #cc4444;
}
</style>
