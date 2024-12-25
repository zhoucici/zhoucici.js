import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "zhoucici",
  description: "zcc杂记",
  themeConfig: {
    siteTitle:'zhoucici',
    nav: [
      { text: '项目', link: '/docs/project/' }
    ],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {
      message: 'zhoucici的个人技术博客',
      copyright: 'Copyright © 2024-present zhoucici'
    },
    outline: {
      label: '页面导航'
    },
    sidebar: {
      '/docs/project/': [
        {
          text: '项目',
          link:'/docs/project/'
        },
        {
          text: '项目中修改node_modules中的文件',
          link:'/docs/project/nodeModules/'
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhoucici/zhoucici.js' }
    ]
  }
})
