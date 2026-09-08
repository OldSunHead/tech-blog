<script setup lang="ts">
import { NButton, NCard, NTag } from 'naive-ui'
import { withBase } from 'vitepress'
import { categoryUrl, tagUrl } from '../../blog.mjs'
import type { Post } from '../posts.data'
import BlogIcon from './BlogIcon.vue'
defineProps<{ posts: Post[] }>()
</script>

<template>
  <ul class="post-list">
    <li v-for="post in posts" :key="post.url">
      <NCard class="post-card" tag="article" :bordered="false" hoverable>
        <div class="post-topline"><a class="post-category" :href="withBase(categoryUrl(post.category))"><BlogIcon :name="post.category === 'AI 应用' ? 'spark' : post.category === '项目实践' ? 'layers' : 'book'" :size="15" />{{ post.category }}</a><span class="post-date"><BlogIcon name="clock" :size="14" /><time :datetime="post.date">{{ post.date }}</time></span></div>
        <h3 class="post-title"><a :href="withBase(post.url)">{{ post.title }}</a></h3>
        <p class="post-description">{{ post.description }}</p>
        <div class="post-bottom"><div class="post-tags"><a v-for="tag in post.tags" :key="tag" :href="withBase(tagUrl(tag))"><NTag :bordered="false" size="small">{{ tag }}</NTag></a></div><NButton text type="primary" tag="a" :href="withBase(post.url)" :aria-label="`阅读全文：${post.title}`">阅读全文 <BlogIcon name="arrow" :size="16" /></NButton></div>
      </NCard>
    </li>
  </ul>
</template>
