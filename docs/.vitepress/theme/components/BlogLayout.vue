<script setup lang="ts">
import { computed, inject, useSSRContext } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import { NButton, NConfigProvider, darkTheme, zhCN, dateZhCN } from 'naive-ui'
import { data as posts } from '../posts.data'
import { categoryUrl } from '../../blog.mjs'
import { blogTheme } from '../naive'
import ArticleHeader from './ArticleHeader.vue'

const { page, isDark } = useData()
const post = computed(() => posts.find((item) => item.url === `/${page.value.relativePath.replace(/\.md$/, '.html')}`))
const overrides = computed(() => blogTheme(isDark.value))
if (import.meta.env.SSR) {
  const context = useSSRContext()
  if (context) context.collectNaiveStyles = inject('collect-naive-styles')
}
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="overrides" :locale="zhCN" :date-locale="dateZhCN">
    <DefaultTheme.Layout :class="{ 'blog-article': post }">
      <template #doc-before><ArticleHeader /></template>
      <template #doc-after><div v-if="post" class="article-end"><span>读到这里，谢谢你的时间。</span><NButton text type="primary" tag="a" :href="withBase(categoryUrl(post.category))">返回{{ post.category }} →</NButton></div></template>
    </DefaultTheme.Layout>
  </NConfigProvider>
</template>
