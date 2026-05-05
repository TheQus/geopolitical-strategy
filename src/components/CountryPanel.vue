<template>
  <div class="panel">
    <div class="panel-title">📍 {{ country.name }}</div>
    
    <div class="country-info">
      <div class="info-row">
        <span class="info-label">Leader:</span>
        <span class="info-value">{{ country.leader }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Ideology:</span>
        <span class="info-value">{{ capitalizeFirst(country.ideology) }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Capital:</span>
        <span class="info-value">{{ country.capital }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Provinces:</span>
        <span class="info-value">{{ country.provinces.length }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Brigades:</span>
        <span class="info-value">{{ country.brigades.length }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Production:</span>
        <span class="info-value">{{ Math.round(country.production) }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Manpower:</span>
        <span class="info-value">{{ Math.round(country.manpower) }} / {{ country.maxManpower }}</span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Money:</span>
        <span class="info-value">{{ Math.round(country.money) }}</span>
      </div>
      
      <div v-if="country.alliances.length > 0" class="info-row">
        <span class="info-label">Allies:</span>
        <span class="info-value">{{ country.alliances.length }}</span>
      </div>
    </div>
    
    <div v-if="!country.isAI" class="controls" style="margin-top: 12px;">
      <button class="button button-success" @click="emit('declare-war', country.id)">
        ⚔️ Declare War
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Country } from '../types/index'

interface Props {
  country: Country
}

interface Emits {
  (e: 'declare-war', countryId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.panel {
  max-height: 350px;
  overflow-y: auto;
}
</style>
