import { defineConfig } from 'vitepress'

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

    sidebar: {
      '/notes/': [
        {
          text: '技术笔记',
          items: [
            {
              text: 'Git',
              items: [
                {
                  text: 'Git Pull 分支分叉问题',
                  link: '/notes/git/git-pull-divergent-branches'
                }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
