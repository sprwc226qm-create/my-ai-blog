# 我用 DeepSeek 和 Claude 在 VS Code 里搭建了这个博客

> 从零到上线，全程 AI 辅助，约 1.5 小时完成。

## 为什么写这篇文章

搭建个人博客的想法已经想了很久，但每次都在配置环境、选主题、调样式这些琐事上耗尽耐心。这次我决定换个思路——让 AI 来帮我完成这些重复性工作，我只需要专注于内容方向。

结果出乎意料地顺利。

## 前置准备

开始之前，你需要准备：

- **Node.js ≥ 18**：VitePress 的运行环境
- **DeepSeek API Key**：[platform.deepseek.com](https://platform.deepseek.com) 注册并充值（费用很低）
- （可选）**Claude API Key** 或 Claude Code CLI

## 第一步：搭建项目骨架（15 分钟）

VitePress 是目前我觉得最适合技术人员写博客的工具——它基于 Vite，启动极快，支持 Markdown，还自带漂亮的默认主题。

```bash
mkdir my-blog
cd my-blog
npm init -y
npm install -D vitepress
npx vitepress init
```

初始化时所有选项直接回车即可，后续都可以在配置文件中修改。启动本地预览：

```bash
npx vitepress dev
```

浏览器访问 `http://localhost:5173`，看到页面就说明骨架搭好了。

## 第二步：接入 AI 助手（15 分钟）

这里我选择了 **Cline**（VS Code 插件），它支持同时接入多款 AI 模型。

配置很简单：
1. VS Code 扩展商店搜索 **Cline** 并安装
2. 在设置中选择 `DeepSeek` 作为 API Provider
3. 填入 API Key，Model 选 `deepseek-chat`

想用 Claude 的话，直接在下拉菜单里切到 Anthropic Provider 就行，非常方便。

> 💡 小提示：不同模型各有所长。DeepSeek 性价比极高，适合日常写作；Claude 在代码和技术分析场景表现更出色。

## 第三步：用 AI 生成初稿（30 分钟）

这是最"魔法"的一步。我在 Cline 里输入了这样一段话：

> 你是一个技术博主，请帮我写一篇 Markdown 格式的博客文章，标题是《我用 DeepSeek 和 Claude 在 VS Code 里搭建了这个博客》，记录从环境准备到上线全过程，用轻松的口吻，包含代码块和心得。

AI 很快就生成了结构完整、代码清晰的文章草稿。我要做的就是：
- **审阅内容**，确保技术细节准确
- **加入真实感受**，比如申请 API 时踩的坑
- **调整语气**，让它更像"我"写的东西
- **补充截图** 和个性化元素

这个过程让我意识到，AI 不是替代写作者，而是帮你跳过"面对空白编辑器"这个最难的步骤。

## 第四步：部署上线（10 分钟）

### 推送至 GitHub

先在 GitHub 新建仓库，然后：

```bash
git init
git add -A
git commit -m "init: blog with VitePress + AI"

git remote add origin https://github.com/你的用户名/my-blog.git
git branch -M main
git push -u origin main
```

### Vercel 一键部署

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
2. 点击 **New Project**，导入刚推送的仓库
3. Vercel 自动识别 VitePress，直接点 **Deploy**
4. 一分钟后，你的博客就上线了 🎉

之后每次 `git push`，Vercel 都会自动重新部署。

## 心得体会

### 1. AI 降低了"开始"的门槛

以前每次想写博客，光搭框架就要花一个下午。这次 15 分钟就搞定了基础骨架，剩下的时间都花在了真正重要的事情上——写内容。

### 2. 人机协作是关键

AI 生成的初稿大概完成了 70% 的工作，但最后的 30% 才是决定文章质量的关键。我的经验是：
- AI 负责结构和信息完整性
- 人负责观点、语气和个人经验
- 两者结合，才是一篇好文章

### 3. 工具链的选择很重要

VitePress + Markdown + Git 的组合非常灵活。所有内容都是纯文本，方便版本管理，也能轻松迁移到其他平台。

## 下一步计划

- [ ] 添加 Giscus 评论功能
- [ ] 配置自定义域名
- [ ] 写一篇《在 VS Code 里免费使用 DeepSeek 替代 Copilot》
- [ ] 对比评测 DeepSeek vs Claude 在技术写作场景的表现

---

> 🤖 **AI 参与度**: 本文提纲和初稿由 DeepSeek 生成，内容经人工审校、改写和个性化补充，人工修改占比约 **40%**。

*发布于 2026 年 7 月*
