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

  // Anvil press animation
  const el = anvilRef.value
  if (el) {
    el.classList.remove('anvil-hit')
    void el.offsetWidth // force reflow
    el.classList.add('anvil-hit')
  }

  // Floating numbers
  const rect = anvilRef.value?.getBoundingClientRect()
  if (rect) {
    const totalValue = Object.values(result.resources).reduce((s, v) => s + v, 0)
    const id = floatId++
    floats.value.push({
      id,
      text: '+' + fmt(totalValue),
      crit: result.crit,
      x: (Math.random() - 0.5) * 80,
      y: 0,
    })
    setTimeout(() => {
      floats.value = floats.value.filter(f => f.id !== id)
    }, 900)
  }

  emit('click-result', result)
}
</script>

<template>
  <div class="anvil-wrapper">
    <!-- Rune circles -->
    <div class="rune-ring rune-ring--outer" />
    <div class="rune-ring rune-ring--inner" />

    <!-- The anvil -->
    <div ref="anvilRef" class="dark-anvil" @click="handleClick">
      <div class="anvil-icon">&#9876;</div>
      <div class="anvil-glow" />
    </div>

    <!-- Floating numbers -->
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
  width: 220px;
  height: 220px;
  margin: 0 auto;
}

/* Rune circles */
.rune-ring {
  position: absolute;
  border: 1px solid var(--torch-dim);
  border-radius: 50%;
  opacity: 0.2;
}
.rune-ring--outer {
  inset: 0;
  animation: rune-spin 20s linear infinite;
  border-style: dashed;
}
.rune-ring--inner {
  inset: 20px;
  animation: rune-spin 12s linear infinite reverse;
  border-style: dotted;
}

/* The anvil button */
.dark-anvil {
  width: 140px;
  height: 140px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  background: radial-gradient(circle at 40% 35%, #3a3a5a, #1e1e32 50%, #0e0e18 100%);
  border: 2px solid;
  border-color: var(--border-lit) var(--border) var(--border) var(--border-lit);
  box-shadow:
    0 0 30px rgba(232, 160, 48, 0.1),
    0 0 60px rgba(232, 160, 48, 0.05),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.2s;
}
.dark-anvil:hover {
  box-shadow:
    0 0 40px var(--torch-glow),
    0 0 80px rgba(232, 160, 48, 0.1),
    inset 0 0 20px rgba(0, 0, 0, 0.4);
}
.dark-anvil:active {
  border-color: var(--border) var(--border-lit) var(--border-lit) var(--border);
}

.anvil-icon {
  font-size: 48px;
  color: var(--torch);
  text-shadow: 0 0 16px var(--torch-glow-strong);
  transition: transform 0.1s;
  filter: drop-shadow(0 0 8px var(--torch-glow));
}

.anvil-glow {
  position: absolute;
  inset: -4px;
  opacity: 0;
  box-shadow: 0 0 40px var(--torch-glow-strong);
  transition: opacity 0.15s;
  pointer-events: none;
}
.dark-anvil:active .anvil-glow {
  opacity: 1;
}

/* Hit animation */
.dark-anvil.anvil-hit {
  animation: anvil-press 0.15s ease-out;
}
.dark-anvil.anvil-hit .anvil-glow {
  opacity: 1;
}

/* Floating numbers */
.float-num {
  position: absolute;
  top: 30%;
  left: 50%;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 16px;
  color: var(--torch);
  text-shadow: 0 0 6px var(--torch-glow), 0 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
  z-index: 10;
  animation: float-number 0.9s ease-out forwards;
  white-space: nowrap;
}
.float-crit {
  font-size: 22px;
  color: #ff6040;
  text-shadow: 0 0 12px rgba(255, 96, 64, 0.6);
}
</style>
