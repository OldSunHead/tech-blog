import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/tech-blog/',
  
  title: "梦杰的技术博客",
  description: "记录技术、项目与成长",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/notes/' },
      { text: 'AI & Agent', link: '/ai/' },
      { text: '项目实践', link: '/projects/' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
