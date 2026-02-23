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
    class="pixel-btn bevel"
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
  font-family: var(--font-body);
  font-size: 18px;
  transition: background 0.1s, transform 0.05s;
  white-space: nowrap;
}
.pixel-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
}
.pixel-btn:active:not(:disabled) {
  transform: translateY(1px);
  border-color: var(--border) var(--border-lit) var(--border-lit) var(--border);
}
.pixel-btn--primary {
  color: var(--torch);
  border-color: var(--torch-dim) var(--border) var(--border) var(--torch-dim);
}
.pixel-btn--primary:hover:not(:disabled) {
  box-shadow: 0 0 8px var(--torch-glow);
}
.pixel-btn--danger {
  color: var(--danger);
}
.pixel-btn--small {
  font-size: 16px;
  padding: 4px 10px;
}
</style>
