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
    <span class="stat">Clicks <b>{{ clicksFormatted }}</b></span>
    <span class="stat-sep" />
    <span class="stat">Time <b>{{ playTimeFormatted }}</b></span>
  </footer>
</template>

<style scoped>
.game-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 5px 16px;
  background: var(--bg-dark);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.stat {
  font-size: 13px;
  color: var(--text-dim);
}
.stat b {
  color: var(--text-mid);
  font-family: var(--font-mono);
  font-size: 12px;
}
.stat-sep {
  width: 1px;
  height: 10px;
  background: var(--border);
}
</style>
