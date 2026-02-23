<script setup>
import { useGameStore } from '../../stores/gameStore.js'
import { fmt, fmtTime } from '../../composables/useFormat.js'
import { computed } from 'vue'

const gameStore = useGameStore()
const playTimeFormatted = computed(() => fmtTime(gameStore.playTime))
const clicksFormatted = computed(() => fmt(gameStore.totalClicks))
</script>

<template>
  <footer class="game-footer">
    <span class="stat">clicks {{ clicksFormatted }}</span>
    <span class="sep">·</span>
    <span class="stat">time {{ playTimeFormatted }}</span>
  </footer>
</template>

<style scoped>
.game-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 5px 16px;
  background: var(--bg-dark);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.stat {
  font-size: 11px;
  color: var(--text-dim);
}
.sep {
  color: var(--border-lit);
  font-size: 10px;
}
</style>
