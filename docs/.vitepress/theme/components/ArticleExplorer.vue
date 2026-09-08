<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { NButton, NCard } from 'naive-ui'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import { categories } from '../../blog.mjs'
import PostList from './PostList.vue'
import EmptyState from './EmptyState.vue'
import BlogSidebar from './BlogSidebar.vue'
import BlogIcon from './BlogIcon.vue'

const props = withDefaults(defineProps<{ category?: string; tagsMode?: boolean }>(), { category: '', tagsMode: false })
const route = useRoute()
const selectedCategory = ref('')
const selectedTag = ref('')
const mounted = ref(false)
const allTags = computed(() => [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b)))
const activeCategory = computed(() => props.category || selectedCategory.value)
const results = computed(() => posts.filter((post) => (!activeCategory.value || post.category === activeCategory.value) && (!selectedTag.value || post.tags.includes(selectedTag.value))))
const title = computed(() => props.category || (props.tagsMode ? '按标签发现文章' : '文章'))
const description = computed(() => categories.find((item) => item.name === props.category)?.description || (props.tagsMode ? '沿着一个技术主题，找到相关的问题和实践。' : '记录真实问题、排查过程，以及每一次技术选择背后的思考。'))
const hasFilter = computed(() => Boolean(selectedTag.value || selectedCategory.value))

function syncFromUrl() {
  const params = new URLSearchParams(window.location.search)
  selectedCategory.value = props.category ? '' : params.get('category') || ''
  selectedTag.value = params.get('tag') || ''
}
function select(category: string, tag: string) {
  selectedCategory.value = category
  selectedTag.value = tag
  const url = new URL(window.location.href)
  url.searchParams.delete('category')
  url.searchParams.delete('tag')
  if (category) url.searchParams.set('category', category)
  if (tag) url.searchParams.set('tag', tag)
  window.history.pushState({}, '', url)
}
onMounted(() => { mounted.value = true; syncFromUrl(); window.addEventListener('popstate', syncFromUrl) })
onUnmounted(() => window.removeEventListener('popstate', syncFromUrl))
watch(() => route.path, () => { if (mounted.value) syncFromUrl() })
</script>

<template>
  <main class="blog-shell archive-shell">
    <header class="page-heading"><p class="eyebrow"><span class="status-dot"></span>{{ tagsMode ? 'EXPLORE BY TOPIC' : 'THE ENGINEERING NOTEBOOK' }}</p><h1>{{ title }}<span class="heading-dot">.</span></h1><p>{{ description }}</p></header>
    <div class="journal-grid"><div class="journal-main">
    <NCard class="explorer-controls" :bordered="false">
      <div v-if="!category" class="filter-row" role="group" aria-label="文章分类">
        <NButton :type="!selectedCategory ? 'primary' : 'default'" :quaternary="!!selectedCategory" :aria-pressed="!selectedCategory" @click="select('', selectedTag)">全部</NButton>
        <NButton v-for="item in categories" :key="item.id" :type="selectedCategory === item.name ? 'primary' : 'default'" :quaternary="selectedCategory !== item.name" :aria-pressed="selectedCategory === item.name" @click="select(item.name, selectedTag)">{{ item.name }}</NButton>
      </div>
      <div v-if="allTags.length" class="tag-filter" role="group" aria-label="文章标签">
        <span class="filter-label">标签</span>
        <NButton size="tiny" :secondary="!selectedTag" :quaternary="!!selectedTag" :type="!selectedTag ? 'primary' : 'default'" :aria-pressed="!selectedTag" @click="select(selectedCategory, '')">全部</NButton>
        <NButton v-for="tag in allTags" :key="tag" size="tiny" :secondary="selectedTag === tag" :quaternary="selectedTag !== tag" :type="selectedTag === tag ? 'primary' : 'default'" :aria-pressed="selectedTag === tag" @click="select(selectedCategory, tag)">{{ tag }}</NButton>
      </div>
    </NCard>
    <div class="results-heading"><p role="status" aria-live="polite">共 {{ results.length }} 篇文章<span v-if="selectedTag"> · {{ selectedTag }}</span></p><NButton v-if="!tagsMode" text tag="a" :href="withBase('/tags/')">所有标签 <BlogIcon name="external" :size="15" /></NButton></div>
    <PostList v-if="results.length" :posts="results" />
    <EmptyState v-else :title="hasFilter ? '暂时没有匹配的文章' : '这里的内容正在积累'" :description="hasFilter ? '试试其他分类或标签，也可以清除筛选查看已有内容。' : undefined">
      <NButton v-if="hasFilter" secondary type="primary" @click="select('', '')">清除筛选 →</NButton>
      <NButton v-else secondary type="primary" tag="a" :href="withBase('/posts/')">浏览已有文章 →</NButton>
    </EmptyState>
    </div><BlogSidebar /></div>
  </main>
</template>
