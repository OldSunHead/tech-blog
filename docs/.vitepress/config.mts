import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.ts'

const siteUrl = 'https://oldsunhead.github.io'
const base = '/tech-blog/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: '梦杰的技术博客',
  description: '记录开发实践、项目经验与 AI 技术探索。',
  lang: 'zh-CN',
  lastUpdated: true,
  sitemap: {
    hostname: `${siteUrl}${base}`,
    transformItems(items) {
      return items.filter((item) => !item.url.startsWith('_templates/'))
    }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:site_name', content: '梦杰的技术博客' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  transformHead({ page, title, description }) {
    const pagePath = page === 'index.md'
      ? ''
      : page.endsWith('/index.md')
        ? page.slice(0, -'index.md'.length)
        : page.replace(/\.md$/, '.html')

    const canonicalUrl = new URL(`${base}${pagePath}`, siteUrl).href

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'description', content: description }]
    ]
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/notes/' },
      { text: 'AI & Agent', link: '/ai/' },
      { text: '项目实践', link: '/projects/' },
      { text: '关于我', link: '/about' }
    ],

    sidebar,

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/OldSunHead'
      }
    ]
  }
})
