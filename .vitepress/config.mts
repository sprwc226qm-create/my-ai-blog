import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '皮语涵的技术博客',
  description: '用 AI 辅助搭建的个人技术博客',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/posts/' },
    ],

    sidebar: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: `Copyright © ${new Date().getFullYear()} 皮语涵`,
    },

    search: {
      provider: 'local',
    },
  },
})
