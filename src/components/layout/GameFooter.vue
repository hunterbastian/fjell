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
    <span class="footer-ornament">─ ◆ ─</span>
    <span class="stat">Clicks <b>{{ clicksFormatted }}</b></span>
    <span class="stat-diamond">◇</span>
    <span class="stat">Time <b>{{ playTimeFormatted }}</b></span>
    <span class="footer-ornament">─ ◆ ─</span>
  </footer>
</template>

<style scoped>
.game-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 6px 16px;
  background: var(--bg-dark);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  position: relative;
}
.game-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--torch-dim), transparent);
  opacity: 0.3;
}
.stat {
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--font-body);
}
.stat b {
  color: var(--text-mid);
  font-family: var(--font-mono);
  font-size: 11px;
}
.stat-diamond {
  font-size: 6px;
  color: var(--border-lit);
  opacity: 0.5;
}
.footer-ornament {
  font-size: 8px;
  color: var(--border);
  opacity: 0.3;
  letter-spacing: 2px;
}
</style>
