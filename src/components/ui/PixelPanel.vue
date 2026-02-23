<script setup>
defineProps({
  variant: { type: String, default: 'raised' }, // 'raised' | 'inset'
  glow: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="pixel-panel"
    :class="[
      variant === 'inset' ? 'panel-inset' : 'panel-raised',
      { 'torchlit': glow }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.pixel-panel {
  padding: 14px;
  border-radius: var(--radius);
}
.panel-raised {
  background: var(--bg-panel);
  border: 1px solid var(--border-lit);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}
.panel-inset {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.25);
}
</style>
