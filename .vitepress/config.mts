import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '皮语涵的技术博客',
  description: '用 AI 辅助搭建的个人技术博客',
  lang: 'zh-CN',
  cleanUrls: true,

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📝 归档', link: '/posts/' },
      { text: '👤 关于', link: '/about' },
    ],

    sidebar: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message: '用 AI 辅助搭建 & 写作 · 基于 VitePress 构建',
      copyright: `© ${new Date().getFullYear()} 皮语涵`,
    },

    search: {
      provider: 'local',
    },

    docFooter: {
      prev: '← 上一篇',
      next: '下一篇 →',
    },

    lastUpdated: {
      text: '最后更新于',
    },
  },
})
