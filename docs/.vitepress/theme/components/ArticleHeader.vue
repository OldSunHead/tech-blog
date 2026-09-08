<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NTag } from 'naive-ui'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import { categoryUrl, tagUrl } from '../../blog.mjs'
import BlogIcon from './BlogIcon.vue'
const { page } = useData()
const post = computed(() => posts.find((item) => item.url === `/${page.value.relativePath.replace(/\.md$/, '.html')}`))
</script>

<template>
  <header v-if="post" class="article-header">
    <NButton class="article-back" text type="primary" tag="a" :href="withBase(categoryUrl(post.category))">← {{ post.category }}</NButton>
    <h1>{{ post.title }}</h1>
    <p class="article-description">{{ post.description }}</p>
    <div class="article-meta"><BlogIcon name="clock" :size="15" /><span>发布于 <time :datetime="post.date">{{ post.date }}</time></span><span v-if="post.updated">更新于 <time :datetime="post.updated">{{ post.updated }}</time></span></div>
    <div class="post-tags"><a v-for="tag in post.tags" :key="tag" :href="withBase(tagUrl(tag))"><NTag :bordered="false" size="small">{{ tag }}</NTag></a></div>
  </header>
</template>
