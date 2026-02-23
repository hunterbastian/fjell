<script setup>
defineProps({
  variant: { type: String, default: 'default' }, // 'default' | 'primary' | 'danger'
  disabled: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button
    class="pixel-btn"
    :class="[`pixel-btn--${variant}`, { 'pixel-btn--small': small }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.pixel-btn {
  background: var(--bg-card);
  padding: 8px 16px;
  color: var(--text);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid var(--border-lit);
  border-radius: var(--radius);
  transition: all 0.15s;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.pixel-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
  border-color: var(--border-highlight);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}
.pixel-btn:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
.pixel-btn--primary {
  color: var(--torch);
  border-color: var(--torch-dim);
}
.pixel-btn--primary:hover:not(:disabled) {
  box-shadow: 0 0 10px var(--torch-glow), 0 1px 6px rgba(0, 0, 0, 0.4);
}
.pixel-btn--danger {
  color: var(--danger);
  border-color: rgba(160, 48, 48, 0.4);
}
.pixel-btn--small {
  font-size: 11px;
  padding: 4px 10px;
}
</style>
