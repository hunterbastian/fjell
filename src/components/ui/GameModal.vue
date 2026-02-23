<script setup>
defineProps({
  show: { type: Boolean, default: false },
})
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-box">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: var(--bg-panel);
  padding: 28px 32px;
  max-width: 420px;
  width: 90%;
  border: 1px solid var(--border-lit);
}
.modal-enter-active { animation: fade-in 0.25s ease-out; }
.modal-leave-active { animation: fade-in 0.2s ease-in reverse; }
.modal-enter-active .modal-box { animation: slide-up 0.3s ease-out; }
</style>
