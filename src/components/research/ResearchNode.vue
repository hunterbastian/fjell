<script setup>
import { computed } from 'vue'
import { RESEARCH_MAP } from '../../config/research.js'
import { useResearchStore } from '../../stores/researchStore.js'
import { fmt } from '../../composables/useFormat.js'
import { fmtTime } from '../../composables/useFormat.js'
import PixelProgress from '../ui/PixelProgress.vue'

const props = defineProps({
  nodeId: { type: String, required: true },
})

const emit = defineEmits(['toast'])

const research = useResearchStore()

const node = computed(() => RESEARCH_MAP[props.nodeId])
const completed = computed(() => research.isCompleted(props.nodeId))
const unlocked = computed(() => research.isUnlocked(props.nodeId))
const affordable = computed(() => research.canAfford(props.nodeId))
const isActive = computed(() => research.activeResearch === props.nodeId)
const isCapstone = computed(() => node.value?.capstone)

function handleClick() {
  if (completed.value || isActive.value) return
  if (!unlocked.value || !affordable.value) return
  if (research.activeResearch) return // already researching something
  if (research.startResearch(props.nodeId)) {
    emit('toast', `Researching ${node.value.name}...`)
  }
}
</script>

<template>
  <div
    class="research-node bevel"
    :class="{
      completed,
      unlocked: unlocked && !completed,
      affordable: affordable && unlocked && !completed && !research.activeResearch,
      active: isActive,
      locked: !unlocked && !completed,
      capstone: isCapstone,
    }"
    @click="handleClick"
  >
    <div class="node-name">{{ node.name }}</div>
    <div class="node-desc">{{ node.desc }}</div>

    <div v-if="isActive" class="node-progress">
      <PixelProgress
        :value="research.activeProgress"
        :max="node.time"
        color="var(--torch)"
        :height="4"
      />
      <div class="progress-time mono">{{ fmtTime(Math.ceil(node.time - research.activeProgress)) }}</div>
    </div>

    <div v-else-if="completed" class="node-done">✓</div>

    <div v-else class="node-cost mono">
      {{ fmt(node.cost) }} RP · {{ fmtTime(node.time) }}
    </div>
  </div>
</template>

<style scoped>
.research-node {
  width: 140px;
  padding: 8px;
  background: var(--bg-card);
  cursor: default;
  transition: all 0.15s;
  text-align: center;
  flex-shrink: 0;
}
.research-node.locked {
  opacity: 0.25;
}
.research-node.unlocked {
  opacity: 0.7;
}
.research-node.affordable {
  opacity: 1;
  cursor: pointer;
  border-color: var(--torch-dim) var(--border) var(--border) var(--torch-dim);
}
.research-node.affordable:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 8px var(--torch-glow);
}
.research-node.active {
  opacity: 1;
  border-color: var(--torch) var(--torch-dim) var(--torch-dim) var(--torch);
  box-shadow: 0 0 12px var(--torch-glow);
}
.research-node.completed {
  opacity: 0.6;
  border-color: var(--success) var(--border) var(--border) var(--success);
}
.research-node.capstone {
  border-width: 2px;
}
.research-node.capstone.completed {
  border-color: var(--faith) var(--border) var(--border) var(--faith);
  box-shadow: 0 0 12px rgba(112, 64, 160, 0.3);
}

.node-name {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
}
.node-desc {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 4px;
  line-height: 1.2;
}
.node-cost {
  font-size: 10px;
  color: var(--torch);
}
.node-done {
  font-size: 16px;
  color: var(--success);
}
.node-progress {
  margin-top: 4px;
}
.progress-time {
  font-size: 10px;
  color: var(--torch);
  margin-top: 2px;
}
</style>
