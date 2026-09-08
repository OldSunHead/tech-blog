<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import PostList from './PostList.vue'
import EmptyState from './EmptyState.vue'
import BlogSidebar from './BlogSidebar.vue'
import BlogIcon from './BlogIcon.vue'

const featured = posts.filter((post) => post.featured).slice(0, 3)
</script>

<template>
  <main class="blog-shell home-shell">
    <header class="journal-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot"></span>梦杰的技术手记 <span class="eyebrow-rule"></span> BUILD · LEARN · SHARE</p>
        <h1>记录每一次，<br><span>从问题到答案。</span></h1>
        <p class="hero-description">关于 AI 应用、工程实践与那些值得记住的技术细节。<br class="desktop-break">把工作中的探索与思考，慢慢写成自己的知识地图。</p>
        <div class="hero-actions"><NButton type="primary" size="large" tag="a" :href="withBase('/posts/')">开始阅读 <BlogIcon name="arrow" :size="18" /></NButton><NButton text tag="a" :href="withBase('/about.html')">认识一下 <BlogIcon name="external" :size="17" /></NButton></div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art-grid"></div>
        <div class="note-window">
          <div class="window-bar"><span class="window-dots"><i></i><i></i><i></i></span><span>engineering-notes.md</span><BlogIcon name="code" :size="16" /></div>
          <div class="window-code"><span class="code-comment">// 每一次实践，都值得留下</span><p><span class="code-key">const</span> journey = {</p><p class="code-indent">focus: <span class="code-string">'AI Engineering'</span>,</p><p class="code-indent">learn: <span class="code-string">'by building'</span>,</p><p class="code-indent">share: <span class="code-value">true</span></p><p>}</p><span class="code-cursor"></span></div>
        </div>
        <div class="art-sticker"><span class="sticker-icon"><BlogIcon name="leaf" :size="22" /></span><div><strong>持续积累，慢慢生长</strong><span>One problem. One insight.</span></div></div>
        <span class="art-cross cross-one">+</span><span class="art-cross cross-two">+</span>
      </div>
    </header>
    <div class="journal-grid">
      <div class="journal-main">
        <section v-if="featured.length" class="article-section" aria-labelledby="featured-heading"><div class="section-heading"><div class="section-title"><span class="section-marker"></span><h2 id="featured-heading">精选文章</h2></div><span class="section-caption">SELECTED</span></div><PostList :posts="featured" /></section>
        <section class="article-section" aria-labelledby="recent-heading">
          <div class="section-heading"><div class="section-title"><span class="section-marker"></span><h2 id="recent-heading">最近更新</h2><NTag round size="small" :bordered="false">{{ posts.length }} 篇</NTag></div><NButton text tag="a" :href="withBase('/posts/')">全部文章 <BlogIcon name="arrow" :size="16" /></NButton></div>
          <PostList v-if="posts.length" :posts="posts.slice(0, 6)" />
          <EmptyState v-else title="第一篇记录，正在路上" />
        </section>
        <div class="journal-footnote"><span class="footnote-line"></span><span>记录真实的问题，也保留思考的过程。</span><BlogIcon name="leaf" :size="15" /></div>
      </div>
      <BlogSidebar />
    </div>
  </main>
</template>
