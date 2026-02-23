<script setup>
defineProps({
  variant: { type: String, default: 'raised' },
  glow: { type: Boolean, default: false },
})
</script>

<template>
  <div class="pixel-panel" :class="variant === 'inset' ? 'panel-inset' : 'panel-raised'">
    <slot />
  </div>
</template>

<style scoped>
.pixel-panel { padding: 12px; }
.panel-raised {
  background: var(--bg-panel);
  border: 1px solid var(--border-lit);
}
.panel-inset {
  background: var(--bg-card);
  border: 1px solid var(--border);
}
</style>
