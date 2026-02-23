<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: 'var(--torch)' },
  height: { type: Number, default: 6 },
})

const percent = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100))
)
</script>

<template>
  <div class="progress" :style="{ height: height + 'px' }">
    <div
      class="progress-fill"
      :style="{ width: percent + '%', background: color }"
    />
  </div>
</template>

<style scoped>
.progress {
  background: var(--bg-dark);
  overflow: hidden;
  position: relative;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.progress-fill {
  height: 100%;
  transition: width 0.15s linear;
  border-radius: 1px;
  box-shadow: 0 0 6px currentColor;
}
</style>
