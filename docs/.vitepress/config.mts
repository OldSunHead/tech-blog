import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { readArticles } from '../../scripts/content.mjs'
import { site } from './blog.mjs'
import { tokenize } from './search.mjs'

readArticles()

export default defineConfig({
  base: site.base,
  title: site.title,
  description: site.description,
  lang: 'zh-CN',
  useWebFonts: false,
  vite: { ssr: { noExternal: ['naive-ui', 'vueuc', '@css-render/vue3-ssr'] } },
  postRender(context) {
    const styles = context.collectNaiveStyles?.() ?? ''
    context.content += `<!--naive-styles-start-->${styles}<!--naive-styles-end-->`
  },
  transformHtml(html) {
    const styles = html.match(/<!--naive-styles-start-->([\s\S]*?)<!--naive-styles-end-->/)
    return styles ? html.replace(styles[0], '').replace('</head>', `${styles[1]}</head>`) : html
  },
  lastUpdated: true,
  srcExclude: ['**/_templates/**', '**/templates/**', '**/drafts/**', '**/_drafts/**'],
  sitemap: { hostname: `${site.origin}${site.base}` },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${site.base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#26735f' }],
    ['meta', { property: 'og:site_name', content: site.title }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  transformHead({ page, title, description }) {
    const pagePath = page === 'index.md' ? '' : page.endsWith('/index.md')
      ? page.slice(0, -'index.md'.length) : page.replace(/\.md$/, '.html')
    const canonicalUrl = new URL(`${site.base}${pagePath}`, site.origin).href
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }]
    ]
  },
  buildEnd(config) {
    writeFileSync(resolve(config.outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}${site.base}sitemap.xml\n`)
  },
  markdown: { codeCopyButton: { tooltipText: '复制代码', copiedText: '已复制' } },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '' },
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/', activeMatch: '/(posts|notes|ai|tags)/' },
      { text: '项目实践', link: '/projects/' },
      { text: '关于我', link: '/about' }
    ],
    sidebar: false,
    outline: { level: [2, 3], label: '文章目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '页面更新', formatOptions: { dateStyle: 'medium' } },
    darkModeSwitchLabel: '外观', darkModeSwitchTitle: '切换为深色模式',
    lightModeSwitchTitle: '切换为浅色模式', sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部', skipToContentLabel: '跳到正文',
    navMenuLabel: '主导航', mobileMenuLabel: '打开导航菜单', extraMenuLabel: '更多选项',
    notFound: { code: '404', title: '这一页暂时找不到', quote: '链接可能发生了变化，可以从文章列表重新开始。', linkLabel: '返回首页', linkText: '返回首页' },
    socialLinks: [{ icon: 'github', link: site.github }],
    footer: { message: '记录问题，理解原因，沉淀方法。', copyright: '© 2026 梦杰' },
    search: {
      provider: 'local',
      options: {
        async _render(src, env, md) {
          const html = await md.renderAsync(src, env)
          if (env.frontmatter?.search === false) return ''
          const summary = env.frontmatter?.description
          if (!summary) return html
          const metadata = await md.renderAsync(`${summary}\n\n${(env.frontmatter.tags ?? []).join(' · ')}`)
          return html.replace('</h1>', `</h1>${metadata}`)
        },
        miniSearch: {
          options: { tokenize },
          searchOptions: { combineWith: 'AND', fuzzy: false, prefix: true }
        },
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            displayDetails: '显示详细结果', resetButtonTitle: '清除搜索',
            backButtonTitle: '关闭搜索', noResultsText: '没有找到相关文章，请尝试其他关键词。',
            footer: { selectText: '打开', selectKeyAriaLabel: '回车', navigateText: '切换', navigateUpKeyAriaLabel: '向上', navigateDownKeyAriaLabel: '向下', closeText: '关闭', closeKeyAriaLabel: 'Esc' }
          }
        }
      }
    }
  }
})
