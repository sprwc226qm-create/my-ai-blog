# 从数据大屏到 AI 问答：Vue 3 全栈可视化平台开发实战

> 项目名称：学生行为数据可视化与学业分析系统  
> 技术栈：Vue 3 + TypeScript + ECharts 6 + Element Plus + Pinia + Vite 8  
> 代码规模：40+ 源文件、13 条路由、6 个 Pinia Store、15+ 自定义组件

## 一、为什么做这个项目？

高校数字化转型中，"数据丰富、洞察贫乏"是普遍痛点：

- 成绩、消费、借阅、上网行为分散在多个系统
- 辅导员靠经验判断学业风险，缺乏数据支撑
- 学生个体画像缺失，个性化干预无从下手

本项目用 Vue 3 全家桶构建了一个集**数据大屏、学生画像、预警面板、干预报告、AI 问答**于一体的可视化平台，共 40+ 源文件、13 条路由、7 种 ECharts 图表类型。

## 二、前端四层架构设计

系统采用分层架构，自上而下分为四层：

| 层级 | 职责 | 代表文件 |
|------|------|----------|
| **页面层** | 组装子组件，编排交互逻辑 | `views/*.vue`（13 个页面） |
| **共享组件层** | 跨模块复用的 UI 组件 | `BaseChart.vue`、`DataCard.vue` |
| **数据层** | Pinia Store + Mock 数据 | `stores/*.ts`、`mocks/data/*.ts` |
| **路由层** | 路由懒加载，侧边栏导航 | `router/index.ts`（13 条路由） |

所有页面组件通过 Pinia Store 获取数据，视图层只负责渲染，与 Mock 数据层完全解耦，便于后续无缝对接真实 API。

## 三、统一图表封装：告别重复的 ECharts 生命周期管理

ECharts 图表在 Vue 3 中最常见的坑是实例管理混乱导致的内存泄漏或渲染失败。我封装了 `BaseChart.vue` 通用容器：

```typescript
// BaseChart.vue 核心接口
defineProps<{
  option: EChartsOption   // 图表配置
  height?: string         // 高度，默认 100%
}>()

// 通过 watch 深度监听配置变更自动重绘
watch(option, () => { chart?.setOption(option, true) }, { deep: true })

// 组件卸载时释放实例
onBeforeUnmount(() => { chart?.dispose() })
```

- 全局 `resize` 事件监听实现自适应
- 所有页面只需传入 `computed` 生成的 `option`，无需管理 ECharts 实例生命周期
- 支持 7 种图表类型：折线图、柱状图、饼图、雷达图、热力图、堆叠柱状图、双轴图

## 四、AI 流式对话：打字机效果模拟 SSE

在 AI 智能问答模块中，我用 `setInterval` 逐字追加模拟了 SSE 流式输出：

```typescript
// stores/ai.ts - 流式回复模拟
const streamTimer = setInterval(() => {
  if (index < fullText.length) {
    const chunk = fullText.slice(index, index + Math.floor(Math.random() * 4) + 2)
    index += chunk.length
    msg.content += chunk   // 逐字追加到响应式消息
  } else {
    clearInterval(streamTimer)
    isStreaming.value = false
  }
}, 30 + Math.random() * 50)  // 随机间隔模拟网络延迟
```

- `isStreaming` 控制发送按钮禁用、输入框 disabled、打字指示器显示
- `computed` 监听 `currentSession.messages` 实现响应式渲染
- 关键词匹配引擎（6 种意图）快速响应常见问题

更关键的是，AI 回复中可以**内嵌 ECharts 图表和 el-table 表格**，真正实现了"数据问答一体化"体验。

## 五、PDF/Excel 双导出能力

- **画像导出**：`html2canvas` 截取学生画像区域 → 2x 分辨率 PNG 下载
- **报告 PDF**：`html2canvas` 截取预览区 → `jsPDF` 生成 A4 多页 PDF（自动计算分页）
- **预警数据导出**：`ExcelJS` 生成 `.xlsx`，支持批量导出所有预警学生数据

## 六、移动端 H5 适配

通过 `@media (max-width: 768px)` 实现全局响应式：

- 侧边栏缩窄为 60px 图标模式，隐藏文字
- Dashboard 网格 2 列 → 1 列
- 报告创建页双栏 → 上下布局

## 七、技术成果

- **类型安全**：TypeScript 全量覆盖，`vue-tsc --noEmit` 零错误
- **构建优化**：Vite 8.x 构建，首屏 js ~935KB（gzip ~301KB）
- **代码规模**：13 条路由、6 个 Pinia Store、15+ 自定义组件、30+ 类型接口

## 八、后续优化方向

| 方向 | 描述 | 优先级 |
|------|------|--------|
| 真实后端对接 | 将 Mock 数据层替换为 RESTful API | 高 |
| LLM 集成 | 接入 Claude API / GPT API 实现真正的自然语言理解 | 高 |
| WebSocket 真实推送 | 替换 setInterval 为真实的 SSE/WebSocket 连接 | 中 |
| PWA 支持 | 添加 Service Worker 实现离线缓存 | 中 |
| E2E 测试 | 使用 Playwright 覆盖核心用户流程 | 低 |

---

> 🤖 **AI 参与度**: 本文由原作者提供素材，AI 辅助排版与润色，人工占比约 **80%**。

*发布于 2026 年 7 月*
