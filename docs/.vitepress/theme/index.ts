import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { setup } from '@css-render/vue3-ssr'
import BlogLayout from './components/BlogLayout.vue'
import BlogHome from './components/BlogHome.vue'
import ArticleExplorer from './components/ArticleExplorer.vue'
import './styles/blog.css'

export default {
  extends: DefaultTheme,
  Layout: BlogLayout,
  enhanceApp({ app }) {
    if (import.meta.env.SSR) {
      const { collect } = setup(app)
      app.provide('collect-naive-styles', collect)
    }
    app.component('BlogHome', BlogHome)
    app.component('ArticleExplorer', ArticleExplorer)
  }
} satisfies Theme
