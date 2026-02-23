<script setup>
import { useGameStore } from '../../stores/gameStore.js'
import PixelButton from '../ui/PixelButton.vue'
import { ref } from 'vue'

const gameStore = useGameStore()
const saveFlash = ref(false)

function manualSave() {
  gameStore.save()
  saveFlash.value = true
  setTimeout(() => saveFlash.value = false, 1200)
}
</script>

<template>
  <header class="game-header">
    <div class="header-brand">
      <div class="brand-sigil">&#9876;</div>
      <h1 class="game-title display-title flicker">FJELL</h1>
      <div class="brand-sigil brand-sigil--mirror">&#9876;</div>
    </div>
    <div class="header-rule" />
    <PixelButton small @click="manualSave">
      {{ saveFlash ? '✓ SAVED' : 'SAVE' }}
    </PixelButton>
  </header>
</template>

<style scoped>
.game-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(180deg, rgba(20, 18, 16, 0.95) 0%, var(--bg-dark) 100%);
  border-bottom: 1px solid var(--border);
  gap: 12px;
  flex-shrink: 0;
  z-index: 10;
  position: relative;
}
/* Subtle gold underline accent */
.game-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--torch-dim), transparent);
  opacity: 0.4;
}
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-sigil {
  font-size: 14px;
  color: var(--torch);
  filter: drop-shadow(0 0 6px var(--torch-glow));
  opacity: 0.5;
}
.brand-sigil--mirror {
  transform: scaleX(-1);
}
.game-title {
  font-size: 16px;
  letter-spacing: 8px;
}
.header-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border-lit), transparent 80%);
  opacity: 0.3;
}
</style>
