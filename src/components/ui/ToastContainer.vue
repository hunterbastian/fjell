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
        class="toast bevel"
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
  padding: 6px 16px;
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
}
.toast--success {
  color: var(--success);
  border-color: var(--success) var(--border) var(--border) var(--success);
}
.toast--danger {
  color: var(--danger);
}
.toast--gold {
  color: var(--torch);
  border-color: var(--torch-dim) var(--border) var(--border) var(--torch-dim);
}
.toast-enter-active { animation: slide-down 0.25s ease-out; }
.toast-leave-active { animation: fade-in 0.2s ease-in reverse; }
</style>
