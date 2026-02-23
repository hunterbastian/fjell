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
      variant === 'inset' ? 'bevel-inset' : 'bevel',
      { 'torchlit': glow }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.pixel-panel {
  background: var(--bg-panel);
  padding: 12px;
}
.pixel-panel.bevel-inset {
  background: var(--bg-card);
}
</style>
