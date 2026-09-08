<script setup lang="ts">
import { NAvatar, NButton, NCard, NDivider, NTag } from 'naive-ui'
import { withBase } from 'vitepress'
import { categories, site } from '../../blog.mjs'
import { data as posts } from '../posts.data'
import BlogIcon from './BlogIcon.vue'
</script>

<template>
  <aside class="journal-sidebar" aria-label="作者与博客主题">
    <NCard class="profile-card" :bordered="false">
      <div class="profile-top"><NAvatar :size="52" round color="#e6f1eb" :style="{ color: '#26705b' }">梦</NAvatar><div><h2>你好，我是梦杰<span class="greeting-dot">.</span></h2><p>AI 全栈工程师</p></div></div>
      <p class="profile-description">用代码解决问题，<br>用文字沉淀思考。</p>
      <div class="profile-skills"><NTag size="small" :bordered="false">Python</NTag><NTag size="small" :bordered="false">Agent</NTag><NTag size="small" :bordered="false">RAG</NTag></div>
      <NDivider />
      <div class="profile-links"><NButton text tag="a" :href="withBase('/about.html')">了解更多 <BlogIcon name="arrow" :size="16" /></NButton><NButton text tag="a" :href="site.github" target="_blank" rel="noopener noreferrer">GitHub <BlogIcon name="external" :size="15" /></NButton></div>
    </NCard>
    <NCard class="topics-card" :bordered="false">
      <h2 class="sidebar-heading">探索主题 <span>TOPICS</span></h2>
      <nav aria-label="按主题浏览">
        <a v-for="category in categories" :key="category.id" :href="withBase(`/${category.id}/`)" class="topic-row">
          <span class="topic-icon" :class="category.id"><BlogIcon :name="category.id === 'notes' ? 'code' : category.id === 'ai' ? 'spark' : 'layers'" /></span>
          <span>{{ category.name }}</span><span class="topic-count">{{ posts.filter(post => post.category === category.name).length }}</span><BlogIcon name="external" :size="14" />
        </a>
      </nav>
    </NCard>
    <div class="sidebar-note"><BlogIcon name="leaf" :size="18" /><p>让遇到的问题，<br>成为下一次前行的经验。</p></div>
  </aside>
</template>
