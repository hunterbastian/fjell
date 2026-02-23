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

    <!-- Ambient glow -->
    <div class="anvil-ambient" />

    <!-- The anvil -->
    <div ref="anvilRef" class="dark-anvil" @click="handleClick">
      <div class="anvil-face">
        <div class="anvil-icon">⚔</div>
      </div>
      <div class="anvil-glow" />
    </div>

    <!-- Corner accents on the anvil -->
    <div class="anvil-accent anvil-accent--tl" />
    <div class="anvil-accent anvil-accent--tr" />
    <div class="anvil-accent anvil-accent--bl" />
    <div class="anvil-accent anvil-accent--br" />

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
  width: 240px;
  height: 240px;
  margin: 0 auto;
}

/* Ambient glow behind the anvil */
.anvil-ambient {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 160, 48, 0.1) 0%, rgba(232, 160, 48, 0.03) 40%, transparent 70%);
  animation: torch-flicker 3s ease-in-out infinite;
  pointer-events: none;
}

/* Rune circles */
.rune-ring {
  position: absolute;
  border: 1px solid var(--torch-dim);
  border-radius: 50%;
  opacity: 0.12;
}
.rune-ring--outer {
  inset: 0;
  animation: rune-spin 20s linear infinite;
  border-style: dashed;
}
.rune-ring--inner {
  inset: 22px;
  animation: rune-spin 12s linear infinite reverse;
  border-style: dotted;
  opacity: 0.08;
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
  background: radial-gradient(circle at 40% 35%, #3a3428, #2a2418 40%, #181410 100%);
  border: 1px solid var(--border-highlight);
  border-radius: var(--radius-lg);
  box-shadow:
    0 0 50px rgba(232, 160, 48, 0.1),
    0 0 100px rgba(232, 160, 48, 0.04),
    0 6px 24px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 0 40px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s, transform 0.1s;
}
.dark-anvil:hover {
  box-shadow:
    0 0 60px rgba(232, 160, 48, 0.2),
    0 0 120px rgba(232, 160, 48, 0.08),
    0 6px 24px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
}
.dark-anvil:active {
  transform: scale(0.96);
}

/* Inner face of the anvil */
.anvil-face {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at 50% 45%, rgba(232, 160, 48, 0.04) 0%, transparent 60%);
}

.anvil-icon {
  font-size: 48px;
  color: var(--torch);
  text-shadow: 0 0 24px var(--torch-glow-strong), 0 0 48px rgba(232, 160, 48, 0.15);
  transition: transform 0.1s;
  filter: drop-shadow(0 0 12px var(--torch-glow));
}

/* Corner accents */
.anvil-accent {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--torch-dim);
  border-style: solid;
  border-width: 0;
  opacity: 0.3;
  z-index: 3;
  pointer-events: none;
}
.anvil-accent--tl { top: 46px; left: 46px; border-top-width: 1px; border-left-width: 1px; }
.anvil-accent--tr { top: 46px; right: 46px; border-top-width: 1px; border-right-width: 1px; }
.anvil-accent--bl { bottom: 46px; left: 46px; border-bottom-width: 1px; border-left-width: 1px; }
.anvil-accent--br { bottom: 46px; right: 46px; border-bottom-width: 1px; border-right-width: 1px; }

.anvil-glow {
  position: absolute;
  inset: -4px;
  border-radius: var(--radius-lg);
  opacity: 0;
  box-shadow: 0 0 50px var(--torch-glow-strong), 0 0 100px rgba(232, 160, 48, 0.15);
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
  font-size: 17px;
  color: var(--torch);
  text-shadow: 0 0 10px var(--torch-glow), 0 1px 4px rgba(0,0,0,0.9);
  pointer-events: none;
  z-index: 10;
  animation: float-number 0.9s ease-out forwards;
  white-space: nowrap;
}
.float-crit {
  font-size: 24px;
  color: #ff6040;
  text-shadow: 0 0 16px rgba(255, 96, 64, 0.6), 0 1px 4px rgba(0,0,0,0.9);
}
</style>
