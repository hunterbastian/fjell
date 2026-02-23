<script setup>
import { ref, onMounted, provide } from 'vue'
import { useGameStore } from './stores/gameStore.js'
import { useGameLoop } from './composables/useGameLoop.js'
import { fmtTimeLong } from './composables/useFormat.js'
import GameHeader from './components/layout/GameHeader.vue'
import ResourceBar from './components/layout/ResourceBar.vue'
import MainNav from './components/layout/MainNav.vue'
import GameFooter from './components/layout/GameFooter.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import GameModal from './components/ui/GameModal.vue'
import KingdomView from './components/kingdom/KingdomView.vue'
import ShopView from './components/shop/ShopView.vue'
import ResearchView from './components/research/ResearchView.vue'
import EventModal from './components/events/EventModal.vue'
import DynastyView from './components/prestige/DynastyView.vue'
import { useEventStore } from './stores/eventStore.js'

const gameStore = useGameStore()
const toastRef = ref(null)
const navRef = ref(null)

const { start } = useGameLoop((dt) => {
  gameStore.tick(dt)
})

function toast(msg, type) {
  toastRef.value?.show(msg, type)
}

provide('toast', toast)

onMounted(() => {
  const loaded = gameStore.load()
  if (loaded) {
    toast('Save loaded', 'success')
  } else {
    // Fresh game: init event timer
    useEventStore().init()
  }
  start()
})
</script>

<template>
  <div class="game-root">
    <GameHeader />
    <ResourceBar />
    <MainNav ref="navRef" />

    <main class="game-main">
      <KingdomView
        v-if="navRef?.activeTab === 'kingdom' || !navRef?.activeTab"
        @toast="toast"
      />
      <ShopView
        v-else-if="navRef?.activeTab === 'shop'"
        @toast="toast"
      />
      <ResearchView
        v-else-if="navRef?.activeTab === 'research'"
        @toast="toast"
      />
      <DynastyView
        v-else-if="navRef?.activeTab === 'dynasty'"
      />
      <div v-else class="placeholder-view fade-in">
        <p class="placeholder-text">{{ navRef?.activeTab }} — coming soon</p>
      </div>
    </main>

    <GameFooter />
    <ToastContainer ref="toastRef" />

    <EventModal />

    <GameModal :show="!!gameStore.offlineEarnings" @close="gameStore.dismissOffline()">
      <h2 class="display-title" style="margin-bottom: 12px; font-size: 17px;">
        Welcome back, Lord
      </h2>
      <p style="color: var(--text-dim); margin-bottom: 16px; font-size: 14px;">
        You were away for {{ gameStore.offlineEarnings ? fmtTimeLong(gameStore.offlineEarnings.seconds) : '' }}
      </p>
      <button class="offline-btn" @click="gameStore.dismissOffline()">
        Continue
      </button>
    </GameModal>

    <!-- no particles -->
  </div>
</template>

<style scoped>
.game-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.game-main {
  flex: 1;
  overflow: hidden;
  background: var(--bg);
  position: relative;
  display: flex;
}
.placeholder-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.placeholder-text {
  font-size: 13px;
  color: var(--text-dim);
  text-transform: lowercase;
}
.offline-btn {
  background: var(--bg-card);
  padding: 8px 20px;
  font-size: 12px;
  color: var(--accent);
  display: block;
  margin: 0 auto;
  border: 1px solid var(--border-lit);
  transition: background 0.15s;
}
.offline-btn:hover {
  background: var(--bg-card-hover);
}
</style>
