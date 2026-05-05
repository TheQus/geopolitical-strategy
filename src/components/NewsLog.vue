<template>
  <div class="panel news-log">
    <div class="panel-title">📰 News</div>
    
    <div v-if="news.length === 0" class="panel-content" style="text-align: center; color: var(--text-secondary);">
      No news yet
    </div>
    
    <div 
      v-for="entry in sortedNews" 
      :key="entry.id" 
      class="news-item"
      :class="entry.type"
    >
      <div class="news-title">{{ entry.title }}</div>
      <div class="news-description">{{ entry.description }}</div>
      <div class="news-turn">Turn {{ entry.turn }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NewsEntry } from '../types/index'

interface Props {
  news: NewsEntry[]
}

const props = defineProps<Props>()

const sortedNews = computed(() => {
  return [...props.news].reverse().slice(0, 20)
})
</script>

<style scoped>
.news-log {
  max-height: 250px;
  overflow-y: auto;
}
</style>
