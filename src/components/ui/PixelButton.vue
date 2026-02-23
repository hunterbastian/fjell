<script setup>
defineProps({
  variant: { type: String, default: 'default' },
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
  padding: 6px 14px;
  color: var(--text);
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--border-lit);
  transition: background 0.1s, border-color 0.1s;
}
.pixel-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
  border-color: var(--border-highlight);
}
.pixel-btn:active:not(:disabled) {
  background: var(--bg-card);
}
.pixel-btn--primary {
  color: var(--accent);
  border-color: var(--accent-dim);
}
.pixel-btn--danger {
  color: var(--danger);
  border-color: rgba(204, 68, 68, 0.3);
}
.pixel-btn--small {
  font-size: 10px;
  padding: 4px 10px;
}
</style>
