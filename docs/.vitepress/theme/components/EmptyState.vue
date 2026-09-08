<script setup lang="ts">
import { NButton, NCard, NEmpty } from 'naive-ui'
import { withBase } from 'vitepress'
import BlogIcon from './BlogIcon.vue'
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: '这里的内容正在积累',
  description: '有值得记录的实践后，我会把问题、过程与结论整理在这里。'
})
</script>

<template>
  <NCard class="empty-card" :bordered="false">
    <NEmpty :description="title" size="large">
      <template #icon><span class="empty-icon"><BlogIcon name="folder" :size="32" /></span></template>
      <template #extra><p class="empty-description">{{ description }}</p><slot><NButton secondary type="primary" tag="a" :href="withBase('/posts/')">浏览已有文章 →</NButton></slot></template>
    </NEmpty>
  </NCard>
</template>
