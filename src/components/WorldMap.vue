<template>
  <canvas
    ref="canvas"
    @click="handleCanvasClick"
    @mousemove="handleMouseMove"
    :width="canvasWidth"
    :height="canvasHeight"
  />
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { ref, onMounted, watch } from 'vue'
import type { Province } from '../types'

const canvas = ref<HTMLCanvasElement | null>(null)
const gameStore = useGameStore()
const canvasWidth = 1200
const canvasHeight = 800
const hoveredProvinceId = ref<string | null>(null)

// Color map for countries
const countryColors = new Map<string, string>()
const ideologyColors: Record<string, string> = {
  democratic: '#3498db',
  authoritarian: '#e74c3c',
  communist: '#c0392b',
  fascist: '#34495e',
  neutral: '#95a5a6'
}

const generateCountryColor = (countryId: string): string => {
  if (!countryColors.has(countryId)) {
    const hue = Math.random() * 360
    const saturation = 60 + Math.random() * 20
    const lightness = 40 + Math.random() * 10
    countryColors.set(countryId, `hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }
  return countryColors.get(countryId) || '#666'
}

const drawMap = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const state = gameStore.getState() as any
  if (!state || !state.provinces) return

  // Clear canvas
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Draw provinces
  state.provinces.forEach((province: Province) => {
    const color = generateCountryColor(province.ownerId)

    ctx.fillStyle = color
    ctx.fillRect(province.x, province.y, province.width, province.height)

    // Border
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.strokeRect(province.x, province.y, province.width, province.height)

    // Hover highlight
    if (province.id === hoveredProvinceId.value) {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.strokeRect(province.x, province.y, province.width, province.height)
    }
  })

  // Draw grid
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 0.5
  for (let x = 0; x <= canvasWidth; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight)
    ctx.stroke()
  }
  for (let y = 0; y <= canvasHeight; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasWidth, y)
    ctx.stroke()
  }
}

const handleCanvasClick = (event: MouseEvent) => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return

  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const state = gameStore.getState() as any
  const province = Array.from(state.provinces.values()).find((p: Province) => {
    return x >= p.x && x < p.x + p.width && y >= p.y && y < p.y + p.height
  })

  if (province) {
    const country = state.countries.get(province.ownerId)
    if (country) {
      gameStore.setCurrentCountry(country.id)
    }
  }
}

const handleMouseMove = (event: MouseEvent) => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return

  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const state = gameStore.getState() as any
  const province = Array.from(state.provinces.values()).find((p: Province) => {
    return x >= p.x && x < p.x + p.width && y >= p.y && y < p.y + p.height
  })

  hoveredProvinceId.value = province?.id || null
}

onMounted(() => {
  watch(() => gameStore.getState(), () => {
    drawMap()
  }, { deep: true })

  drawMap()
})
</script>

<style scoped>
canvas {
  display: block;
  cursor: pointer;
}
</style>
