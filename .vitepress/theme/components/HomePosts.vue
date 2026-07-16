<script setup lang="ts">
const posts = [
  {
    title: '我用 DeepSeek 和 Claude 在 VS Code 里搭建了这个博客',
    link: '/posts/first-blog-built-with-ai',
    date: '2026-07-16',
    emoji: '🚀',
    summary: '从零到上线，全程 AI 辅助。记录从环境准备、VitePress 初始化到一键部署上线的完整过程。',
    tags: ['VitePress', 'DeepSeek', 'Claude'],
  },
  {
    title: '在 VS Code 里免费使用 DeepSeek 替代 Copilot',
    link: '/posts/deepseek-replace-copilot',
    date: '2026-07-16',
    emoji: '💰',
    summary: 'DeepSeek + Cline 组合，功能超越 Copilot，月费只需 ¥3。包含详细配置教程和使用技巧。',
    tags: ['DeepSeek', 'VS Code', 'AI Coding'],
  },
  {
    title: '同题对比：让 DeepSeek 和 Claude 写同一个 React 组件',
    link: '/posts/deepseek-vs-claude-react',
    date: '2026-07-16',
    emoji: '⚔️',
    summary: '同一需求，两个模型。从代码质量、边界处理到无障碍访问，九个维度全方位对比实测。',
    tags: ['React', 'DeepSeek', 'Claude', '对比评测'],
  },
  {
    title: '我的 AI 写作工作流：从提纲到发布',
    link: '/posts/ai-writing-workflow',
    date: '2026-07-16',
    emoji: '✍️',
    summary: '半年 AI 辅助写作经验总结。五步工作流 + 去 AI 味技巧 + 工具清单，人机协作方法论。',
    tags: ['写作', 'Workflow', '方法论'],
  },
  {
    title: '从数据大屏到 AI 问答：Vue 3 全栈可视化平台开发实战',
    link: '/posts/vue3-visualization-platform',
    date: '2026-07-16',
    emoji: '📊',
    summary: '40+ 源文件、13 条路由、7 种图表类型。从四层架构设计到 AI 流式问答，完整可视化平台搭建。',
    tags: ['Vue 3', 'ECharts', 'TypeScript', '全栈'],
  },
  {
    title: '从 CSV 到 API：Node.js 模拟 Hive 数仓五层 ETL 全流程',
    link: '/posts/nodejs-etl-datawarehouse',
    date: '2026-07-16',
    emoji: '🗄️',
    summary: 'Express 5 + SQLite，用轻量级技术栈模拟 ODS→DWD→DIM→DWS→ADS 五层离线数仓 ETL 全过程。',
    tags: ['Node.js', 'ETL', '数仓', 'Express'],
  },
]
</script>

<template>
  <section class="home-posts">
    <div class="section-header">
      <h2>📝 最新文章</h2>
      <a href="/posts/" class="view-all">查看全部 →</a>
    </div>

    <div class="posts-grid">
      <article v-for="post in posts" :key="post.link" class="post-card">
        <a :href="post.link" class="post-link">
          <span class="post-emoji">{{ post.emoji }}</span>
          <div class="post-body">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-summary">{{ post.summary }}</p>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <span class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </span>
            </div>
          </div>
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-posts {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.dark .section-header h2 { color: #f0f0f0; }
:root:not(.dark) .section-header h2 { color: #4A3F3F; }

.view-all {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: opacity 0.2s;
}

.view-all:hover {
  opacity: 0.7;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

.post-card {
  border-radius: 14px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.dark .post-card {
  background: #141414;
  border: 1px solid #1f1f1f;
}
:root:not(.dark) .post-card {
  background: #FFFFFF;
  border: 1px solid #F0DED8;
}

.post-card:hover {
  transform: translateY(-4px);
}
.dark .post-card:hover {
  border-color: #FFB6C1;
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.1);
}
:root:not(.dark) .post-card:hover {
  border-color: #E892A5;
  box-shadow: 0 8px 30px rgba(232, 146, 165, 0.12);
}

.post-link {
  display: flex;
  gap: 16px;
  padding: 24px;
  text-decoration: none !important;
  color: inherit;
  align-items: flex-start;
}

.post-emoji {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
}

.post-body {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
  transition: color 0.2s;
}

.dark .post-title { color: #f0f0f0; }
:root:not(.dark) .post-title { color: #4A3F3F; }

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-summary {
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .post-summary { color: #999; }
:root:not(.dark) .post-summary { color: #8A7E7E; }

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.post-date {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.dark .post-date { color: #666; }
:root:not(.dark) .post-date { color: #B0A5A5; }

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
  white-space: nowrap;
}

.dark .tag {
  background: #1f1f1f;
  color: #FFB6C1;
  border: 1px solid #2a2a2a;
}
:root:not(.dark) .tag {
  background: #FFF0EB;
  color: #E892A5;
  border: 1px solid #F0DED8;
}
</style>
