---
layout: home

hero:
  name: "梦杰的技术博客"
  text: "记录技术、项目与成长"
  tagline: "持续学习，持续实践，持续沉淀"

features:
  - title: 技术笔记
    details: 记录 Java、Python、Docker、Git、Linux 等开发实践
    link: /notes/
  - title: AI & Agent
    details: 记录大模型、Agent、MCP、RAG 等技术探索
    link: /ai/
  - title: 项目实践
    details: 记录真实项目中的架构设计、部署、排障与经验总结
    link: /projects/
---

<script setup lang="ts">
  import { withBase } from 'vitepress'
  import { data as posts } from './.vitepress/theme/posts.data'

  const latestPost = posts[0]
</script>

<section class="latest-post" v-if="latestPost" aria-labelledby="latest-post-title">
  <p class="latest-post__eyebrow">最新文章</p>
  <a class="latest-post__card" :href="withBase(latestPost.url)">
    <h2 id="latest-post-title">{{ latestPost.title }}</h2>
    <p>{{ latestPost.description }}</p>
    <span>
      {{ latestPost.category }} · {{ latestPost.date }}
      <b aria-hidden="true">→</b>
    </span>
  </a>
</section>

<style scoped>
  .latest-post {
    max-width: 1152px;
    margin: 0 auto;
    padding: 0 24px 64px;
  }

  .latest-post__eyebrow {
    margin: 0 0 8px;
    color: var(--vp-c-text-2);
    font-size: 14px;
    font-weight: 600;
  }

  .latest-post__card {
    display: inline-block;
    width: min(100%, 640px);
    padding: 24px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
    color: inherit;
    text-decoration: none;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .latest-post__card:hover {
    border-color: var(--vp-c-brand-1);
    transform: translateY(-1px);
  }

  .latest-post__card h2,
  .latest-post__card p {
    margin: 0;
  }

  .latest-post__card h2 {
    color: var(--vp-c-brand-1);
    font-size: 20px;
  }

  .latest-post__card p {
    margin-top: 10px;
    color: var(--vp-c-text-2);
  }

  .latest-post__card span {
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
    color: var(--vp-c-text-3);
    font-size: 14px;
  }

  .latest-post__card b {
    color: var(--vp-c-brand-1);
    font-size: 18px;
  }

  @media (max-width: 640px) {
    .latest-post {
      padding: 0 24px 48px;
    }
  }
</style>
