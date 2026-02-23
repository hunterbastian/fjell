import { ref, onUnmounted } from 'vue'

const TICK_MS = 50 // 20 ticks per second

export function useGameLoop(tickFn) {
  const running = ref(false)
  let intervalId = null
  let lastTime = 0

  function tick() {
    const now = performance.now()
    if (!lastTime) lastTime = now
    const dt = Math.min((now - lastTime) / 1000, 0.2)
    lastTime = now
    tickFn(dt)
  }

  function start() {
    if (running.value) return
    running.value = true
    lastTime = 0
    intervalId = setInterval(tick, TICK_MS)
  }

  function stop() {
    running.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onUnmounted(stop)

  return { start, stop, running }
}
