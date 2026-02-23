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
    </div>
    <div class="header-spacer" />
    <PixelButton small @click="manualSave">
      {{ saveFlash ? 'SAVED' : 'SAVE' }}
    </PixelButton>
  </header>
</template>

<style scoped>
.game-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
  gap: 12px;
  flex-shrink: 0;
  z-index: 10;
}
.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-sigil {
  font-size: 18px;
  color: var(--torch);
  filter: drop-shadow(0 0 6px var(--torch-glow));
  opacity: 0.7;
}
.game-title {
  font-size: 15px;
  letter-spacing: 6px;
}
.header-spacer {
  flex: 1;
}
</style>
