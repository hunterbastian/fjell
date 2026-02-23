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
  <div class="game-root vignette grain fog-bottom">
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

    <!-- Floating embers -->
    <div class="particles" aria-hidden="true">
      <span v-for="i in 12" :key="i" class="ember" :style="{
        left: (Math.random() * 100) + '%',
        animationDuration: (6 + Math.random() * 10) + 's',
        animationDelay: (Math.random() * 12) + 's',
        opacity: 0.08 + Math.random() * 0.18,
        width: (1 + Math.random() * 2.5) + 'px',
        height: (1 + Math.random() * 2.5) + 'px',
      }" />
    </div>
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
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text-dim);
  letter-spacing: 2px;
  text-transform: capitalize;
}
.offline-btn {
  background: var(--bg-card);
  padding: 9px 24px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--torch);
  display: block;
  margin: 0 auto;
  border: 1px solid var(--torch-dim);
  border-radius: var(--radius);
  transition: all 0.15s;
}
.offline-btn:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 0 10px var(--torch-glow);
}
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}
.ember {
  position: absolute;
  bottom: -4px;
  background: var(--torch);
  border-radius: 50%;
  animation: float-up linear infinite;
  box-shadow: 0 0 4px var(--torch-glow);
}
</style>
