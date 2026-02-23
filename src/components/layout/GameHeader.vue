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
    <h1 class="game-title">fjell</h1>
    <div class="spacer" />
    <PixelButton small @click="manualSave">
      {{ saveFlash ? 'saved' : 'save' }}
    </PixelButton>
  </header>
</template>

<style scoped>
.game-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border);
  gap: 12px;
  flex-shrink: 0;
}
.game-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 3px;
  text-transform: lowercase;
}
.spacer { flex: 1; }
</style>
