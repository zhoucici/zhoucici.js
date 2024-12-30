import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "zhoucici",
  description: "zcc杂记",
  themeConfig: {
    siteTitle:'zhoucici',
    nav: [
      { text: '项目', link: '/docs/project/' },
      { text: 'JavaScript', link: '/docs/javascript/' },
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
        },
        {
          text: '多请求控制并发：队列',
          link:'/docs/project/handQueue/'
        }
      ],
      '/docs/javascript/' : [
        {
          text: 'JavaScript',
          link:'/docs/javascript/'
        },
        {
          text:'JS中的最快的循环',
          link:'/docs/javascript/loop/'
        },
        {
          text:'手搓Promise',
          link:'/docs/javascript/promise/'
        },
        {
          text:'函数柯里化',
          link:'/docs/javascript/curry/'
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhoucici/zhoucici.js' }
    ]
  }
})
