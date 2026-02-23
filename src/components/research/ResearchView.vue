<script setup>
import { computed } from 'vue'
import { RESEARCH_BRANCHES, RESEARCH_NODES } from '../../config/research.js'
import { useResearchStore } from '../../stores/researchStore.js'
import { fmt } from '../../composables/useFormat.js'
import ResearchNode from './ResearchNode.vue'

const emit = defineEmits(['toast'])

const research = useResearchStore()

// Group nodes by branch, preserving order (dependency chain)
const branches = computed(() => {
  return RESEARCH_BRANCHES.map(branch => ({
    ...branch,
    nodes: RESEARCH_NODES.filter(n => n.branch === branch.id),
  }))
})

// Organize nodes into rows by depth (dependency level)
function getNodeRows(nodes) {
  // Build depth map based on requires chains
  const depthMap = {}
  function getDepth(nodeId) {
    if (depthMap[nodeId] != null) return depthMap[nodeId]
    const node = nodes.find(n => n.id === nodeId)
    if (!node || node.requires.length === 0) {
      depthMap[nodeId] = 0
      return 0
    }
    let maxParent = 0
    for (const reqId of node.requires) {
      maxParent = Math.max(maxParent, getDepth(reqId) + 1)
    }
    depthMap[nodeId] = maxParent
    return maxParent
  }

  nodes.forEach(n => getDepth(n.id))

  // Group by depth
  const rows = []
  for (const node of nodes) {
    const d = depthMap[node.id]
    if (!rows[d]) rows[d] = []
    rows[d].push(node)
  }
  return rows.filter(Boolean)
}
</script>

<template>
  <div class="research-view">
    <div class="research-header">
      <div class="rp-display">
        <span class="rp-label">Research Points</span>
        <span class="rp-value mono">{{ fmt(research.researchPoints) }}</span>
        <span v-if="research.rpRate > 0" class="rp-rate mono">+{{ fmt(research.rpRate) }}/s</span>
      </div>
      <div v-if="research.activeNode" class="active-research">
        <span class="active-label">Researching:</span>
        <span class="active-name">{{ research.activeNode.name }}</span>
        <span class="active-pct mono">{{ Math.round(research.activePercent) }}%</span>
      </div>
      <div v-else-if="research.rpRate === 0" class="rp-hint">
        Build a Library to generate Research Points
      </div>
    </div>

    <div class="branch-scroll">
      <div
        v-for="branch in branches"
        :key="branch.id"
        class="branch"
      >
        <div class="branch-header">
          <span class="branch-name" :style="{ color: branch.color }">
            {{ branch.icon }} {{ branch.name }}
          </span>
          <span class="branch-desc">{{ branch.desc }}</span>
        </div>
        <div class="branch-tree">
          <div
            v-for="(row, ri) in getNodeRows(branch.nodes)"
            :key="ri"
            class="node-row"
          >
            <div class="row-connector" v-if="ri > 0" />
            <div class="node-group">
              <ResearchNode
                v-for="node in row"
                :key="node.id"
                :node-id="node.id"
                @toast="(msg) => emit('toast', msg)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.research-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.research-header {
  flex-shrink: 0;
  padding: 10px 14px;
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.rp-display {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rp-label {
  font-size: 13px;
  color: var(--text-dim);
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.rp-value {
  font-size: 15px;
  color: var(--faith);
  font-weight: 700;
}
.rp-rate {
  font-size: 11px;
  color: var(--success);
}
.rp-hint {
  font-size: 13px;
  color: var(--text-dim);
  font-style: italic;
}
.active-research {
  display: flex;
  align-items: center;
  gap: 6px;
}
.active-label {
  font-size: 12px;
  color: var(--text-dim);
}
.active-name {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--torch);
}
.active-pct {
  font-size: 11px;
  color: var(--torch);
}

.branch-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.branch {
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
}
.branch-header {
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.branch-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
}
.branch-desc {
  font-size: 13px;
  color: var(--text-dim);
}

.branch-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.node-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row-connector {
  width: 1px;
  height: 8px;
  background: var(--border-lit);
}
.node-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
