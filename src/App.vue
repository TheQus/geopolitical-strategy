<template>
  <div id="app" class="app">
    <header class="header">
      <div class="header-title">🌍 Geopolitical Strategy</div>
      <div class="turn-info">
        <div>Turn: <span class="turn-number">{{ gameStore.currentTurn }}</span></div>
        <div>Speed: <span class="turn-number">{{ gameStore.gameSpeed }}</span></div>
        <div v-if="playerCountry">
          {{ playerCountry.name }}
          <span style="margin-left: 8px;">💰 {{ playerCountry.money }} | 👥 {{ playerCountry.manpower }}</span>
        </div>
      </div>
    </header>

    <div class="game-container">
      <!-- Map Section -->
      <div class="map-section">
        <WorldMap 
          :provinces="provinces" 
          :countries="countries"
          @province-click="handleProvinceClick"
          @country-click="handleCountryClick"
        />
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Country Info -->
        <CountryPanel 
          v-if="selectedCountry"
          :country="selectedCountry"
          @declare-war="handleDeclareWar"
        />

        <!-- Action Queue -->
        <ActionQueue 
          v-if="gameStore.showActionQueue"
          :actions="gameStore.actions"
        />

        <!-- News Log -->
        <NewsLog 
          v-if="gameStore.showNewsLog"
          :news="gameStore.newsLog"
        />

        <!-- Controls -->
        <div class="controls">
          <button class="control-button button" @click="togglePause">
            {{ gameStore.isPaused ? '▶ Resume' : '⏸ Pause' }}
          </button>
          <button class="control-button button" @click="changeSpeed">
            ⚡ {{ gameStore.gameSpeed }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore, useUIStore } from './stores/gameStore'
import { GameEngine } from './game/GameEngine'
import { MapGenerator } from './game/MapGenerator'
import WorldMap from './components/WorldMap.vue'
import CountryPanel from './components/CountryPanel.vue'
import ActionQueue from './components/ActionQueue.vue'
import NewsLog from './components/NewsLog.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()
const gameEngine = ref<GameEngine | null>(null)

const provinces = computed(() => Array.from(gameStore.provinces.values()))
const countries = computed(() => Array.from(gameStore.countries.values()))
const playerCountry = computed(() => gameStore.getCountry(gameStore.playerCountryId))
const selectedCountry = computed(() => {
  if (uiStore.selectedCountryId) {
    return gameStore.getCountry(uiStore.selectedCountryId)
  }
  return playerCountry.value
})

onMounted(() => {
  // Initialize game
  const mapGenerator = new MapGenerator()
  const { provinces: generatedProvinces, countries: generatedCountries } = 
    mapGenerator.generateMap(2000, 1200, 5)
  
  gameEngine.value = new GameEngine()
  gameEngine.value.initialize(generatedCountries, generatedProvinces)
  
  // Set player country
  const playerCountryId = generatedCountries[0].id
  gameStore.playerCountryId = playerCountryId
  
  // Start game loop
  gameEngine.value.startGameLoop()
})

const handleProvinceClick = (provinceId: string) => {
  uiStore.selectProvince(provinceId)
}

const handleCountryClick = (countryId: string) => {
  uiStore.selectCountry(countryId)
}

const handleDeclareWar = (targetCountryId: string) => {
  if (playerCountry.value) {
    const action = {
      id: `action-${Date.now()}`,
      countryId: playerCountry.value.id,
      type: 'declare_war' as const,
      progress: 0,
      duration: 10,
      data: {
        justification: 'Territorial dispute',
        provinces: gameStore.getCountry(targetCountryId)?.provinces.slice(0, 2) || []
      },
      startTurn: gameStore.currentTurn,
      targetCountryId
    }
    gameStore.addAction(action)
  }
}

const togglePause = () => {
  gameStore.setPaused(!gameStore.isPaused)
}

const changeSpeed = () => {
  const speeds = ['slow', 'normal', 'fast']
  const currentIndex = speeds.indexOf(gameStore.gameSpeed)
  const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
  gameStore.gameSpeed = nextSpeed as 'slow' | 'normal' | 'fast'
}
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
