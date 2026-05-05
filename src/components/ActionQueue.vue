<template>
  <div class="panel action-queue">
    <div class="panel-title">📋 Action Queue</div>
    
    <div v-if="actions.length === 0" class="panel-content" style="text-align: center; color: var(--text-secondary);">
      No active actions
    </div>
    
    <div v-for="action in actions" :key="action.id" class="action-item">
      <div class="action-name">{{ formatActionType(action.type) }}</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: action.progress + '%' }"></div>
      </div>
      <div class="progress-text">{{ Math.round(action.progress) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Action } from '../types/index'

interface Props {
  actions: Action[]
}

defineProps<Props>()

const formatActionType = (type: string) => {
  return type.replace(/_/g, ' ').toUpperCase()
}
</script>

<style scoped>
.action-queue {
  max-height: 200px;
  overflow-y: auto;
}
</style>
