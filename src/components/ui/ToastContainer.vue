<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

function show(message, type = 'info') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

defineExpose({ show })
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
}
.toast {
  background: var(--bg-panel);
  padding: 8px 18px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text);
  white-space: nowrap;
  border: 1px solid var(--border-lit);
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}
.toast--success {
  color: var(--success);
  border-color: rgba(58, 122, 40, 0.4);
}
.toast--danger {
  color: var(--danger);
  border-color: rgba(160, 48, 48, 0.4);
}
.toast--gold {
  color: var(--torch);
  border-color: var(--torch-dim);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 12px var(--torch-glow);
}
.toast-enter-active { animation: slide-down 0.25s ease-out; }
.toast-leave-active { animation: fade-in 0.2s ease-in reverse; }
</style>
