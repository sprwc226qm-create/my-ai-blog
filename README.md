# 皮语涵的技术博客

基于 VitePress 构建的个人技术博客，记录 AI 工具实践、前端开发与项目经验。

## 在线地址

👉 **[my-ai-blog-seven.vercel.app](https://my-ai-blog-seven.vercel.app)**

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | VitePress |
| 前端 | Vue 3 |
| AI 辅助 | DeepSeek + Claude |
| 部署 | Vercel（Git Push 自动部署） |
| 评论 | Giscus（GitHub Discussions） |
| 主题 | 马卡龙（Light）× Black & Pink（Dark）双主题 |

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

浏览器打开 `http://localhost:5173`。

## 文章列表

| # | 文章 | 方向 |
|:--:|------|------|
| 1 | 我用 DeepSeek 和 Claude 在 VS Code 里搭建了这个博客 | 博客搭建 |
| 2 | 在 VS Code 里免费使用 DeepSeek 替代 Copilot | AI 工具 |
| 3 | 同题对比：DeepSeek vs Claude 写同一个 React 组件 | 模型评测 |
| 4 | 我的 AI 写作工作流：从提纲到发布 | 写作方法 |
| 5 | 从数据大屏到 AI 问答：Vue 3 全栈可视化平台 | 项目实战 |
| 6 | 从 CSV 到 API：Node.js 模拟 Hive 数仓五层 ETL | 后端数据 |

## 主题

博客内置两套主题，点击右上角 ☀️/🌙 图标一键切换：

- 🌸 **马卡龙** — 奶油白底色 + 玫瑰粉点缀，舒适柔和
- 🖤 **Black × Pink** — 炭黑底色 + 婴儿粉 `#FFB6C1` 点缀，酷炫优雅

## 项目结构

```
myblog/
├── .vitepress/
│   ├── config.mts          # VitePress 配置
│   └── theme/
│       ├── index.ts         # 主题入口
│       ├── style.css        # 全局样式（双主题变量）
│       └── components/
│           ├── HomePosts.vue       # 首页文章卡片
│           └── GiscusComment.vue   # 评论区组件
├── posts/                  # 文章目录
│   └── index.md            # 文章归档页
├── index.md                # 博客首页
├── about.md                # 关于页
├── public/logo.svg         # 站点 Logo
├── vercel.json             # Vercel 部署配置
└── package.json
```

## 发布新文章

在 `posts/` 下新建 `.md` 文件，更新 `posts/index.md` 归档页和 `HomePosts.vue` 首页卡片，然后推送：

```bash
git add -A && git commit -m "new post: xxx" && git push
```

Vercel 自动部署，一分钟内更新上线。
