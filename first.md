
# 🚀 用 DeepSeek + Claude 在 VS Code 里搭建个人技术博客

> 从零到上线，全程 AI 辅助，约 1.5 小时完成。

---

## ✅ 前置准备（已完成，可跳过）

- [x] Node.js ≥ 18 已安装
- [x] DeepSeek API Key 已申请并充值
- [x] （可选）Anthropic API Key 或 Claude Code CLI 已就绪

如果尚未完成，请参考：
- Node.js: https://nodejs.org
- DeepSeek 平台: https://platform.deepseek.com
- Anthropic 控制台: https://console.anthropic.com

---

## 1. 搭建博客项目（15 分钟）

### 使用 VitePress 初始化

```bash
mkdir my-ai-blog
cd my-ai-blog
npm init -y
npm install -D vitepress
npx vitepress init
```

- 初始化时所有选项直接回车即可，后续可修改。

### 启动本地预览

```bash
npx vitepress dev
```

浏览器访问 `http://localhost:5173`，看到页面即成功。

### 初始化 Git 仓库

```bash
git init
git add -A
git commit -m "init blog with VitePress"
```

---

## 2. 在 VS Code 中接入 AI（15 分钟）

推荐使用 **Cline** 插件（可同时接入 DeepSeek 和 Claude）。

### 安装与配置 DeepSeek

1. 在 VS Code 扩展商店搜索 **Cline** 并安装。
2. 侧边栏点击 Cline 图标，进入设置（⚙️）。
3. **API Provider** 选择 `DeepSeek`。
4. 填入信息：
   - **API Key**: 你的 DeepSeek API Key
   - **Model**: `deepseek-chat` (性价比最高)
5. 点击 **Done**，在对话框输入 “你好” 测试连通性。

### 接入 Claude 模型（可选）

- 在 Cline 设置中切换到 **Anthropic** Provider，填入 Anthropic API Key。
- 或者保留 Claude Code CLI，在终端单独使用。

> 切换模型只需在 Cline 面板下拉选择，方便随时对比。

---

## 3. 撰写第一篇博客（30 分钟）

### 用 AI 生成初稿

在 Cline 对话框中输入：

```text
你是一个技术博主，请帮我写一篇 Markdown 格式的博客文章，
标题是《我用 DeepSeek 和 Claude 在 VS Code 里搭建了这个博客》，
记录从环境准备到上线全过程，用轻松的口吻，包含代码块和心得。
文章将放在 VitePress 项目的 index.md 首页里。
```

Cline 会直接创建或修改 `index.md`，你只需审阅和个性化。

### 加入个人元素

- 替换 AI 生成的部分语句，加入真实感受（如申请 API 时的坑）。
- 截图放到 `public/images/`，文中引用 `![说明](/images/xxx.png)`。
- 可在文末加上 **AI 参与度** 标签，例如 `🤖 本文初稿由 DeepSeek 生成，人工修改占比 30%`。

### 提交内容

```bash
git add -A
git commit -m "first post: how I built this blog with AI"
```

---

## 4. 一键部署上线（10 分钟）

### 推送至 GitHub

先在 GitHub 新建一个仓库（例如 `my-ai-blog`），然后执行：

```bash
git remote add origin https://github.com/你的用户名/my-ai-blog.git
git branch -M main
git push -u origin main
```

### 在 Vercel 部署

1. 打开 [vercel.com](https://vercel.com) 并用 GitHub 登录。
2. 点击 **New Project**，导入刚推送的仓库。
3. Framework 自动识别为 VitePress，直接点 **Deploy**。
4. 等待 1 分钟，获得公开地址 `https://xxx.vercel.app`。

之后每次 `git push` 都会自动重新部署。

---

## 📝 下一步可以写什么？

- **第 2 篇**：《在 VS Code 里免费使用 DeepSeek 替代 Copilot》（详细配置教程）
- **第 3 篇**：《同题对比：让 DeepSeek 和 Claude 写同一个 React 组件》
- **第 4 篇**：《我的 AI 写作工作流：从提纲到发布》
- **增强互动**：给博客添加评论、AI 文章摘要或内嵌聊天组件。

---
