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
  <header class="game-header bevel">
    <h1 class="game-title display-title flicker">FJELL</h1>
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
  padding: 8px 16px;
  background: var(--bg-dark);
  gap: 12px;
  flex-shrink: 0;
  z-index: 10;
}
.game-title {
  font-size: 16px;
  letter-spacing: 4px;
}
.header-spacer {
  flex: 1;
}
</style>
