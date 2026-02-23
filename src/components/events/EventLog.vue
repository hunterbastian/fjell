<script setup>
import { useEventStore } from '../../stores/eventStore.js'

const events = useEventStore()

function timeAgo(timestamp) {
  const sec = Math.floor((Date.now() - timestamp) / 1000)
  if (sec < 60) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}
</script>

<template>
  <div v-if="events.eventLog.length > 0" class="event-log">
    <div class="log-header">Recent Events</div>
    <div class="log-entries">
      <div
        v-for="(entry, i) in events.eventLog"
        :key="i"
        class="log-entry"
        :class="entry.type"
      >
        <span class="log-icon">{{ entry.icon }}</span>
        <div class="log-info">
          <span class="log-name">{{ entry.name }}</span>
          <span class="log-time">{{ timeAgo(entry.time) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-log {
  padding: 8px 10px;
  max-height: 200px;
  overflow-y: auto;
}
.log-header {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.log-entries {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.log-entry {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  font-size: 13px;
  border-left: 2px solid var(--border);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  transition: background 0.15s;
}
.log-entry:hover {
  background: rgba(255, 255, 255, 0.02);
}
.log-entry.positive { border-left-color: var(--success); }
.log-entry.negative { border-left-color: var(--danger); }
.log-entry.choice { border-left-color: var(--faith); }
.log-icon { font-size: 14px; }
.log-info {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.log-name {
  color: var(--text);
  font-size: 13px;
}
.log-time {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  margin-left: auto;
}
</style>
