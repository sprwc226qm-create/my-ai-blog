# 从 CSV 到 API：Node.js 模拟 Hive 数仓五层 ETL 全流程

> 项目名称：校园智脑大数据综合实训（后端数据工程）  
> 技术栈：Express 5 + better-sqlite3 + Node.js  
> 代码规模：11 张表、40+ API 端点、五层 ETL 架构

## 一、项目背景

拿到阿里云天池"数智教育"大赛的 16 张数据表结构，需要构建一个包含**学生基本信息、学业成绩、考勤、消费、图书借阅、上网行为、心理健康、贫困资助、德育素质**9 大类的数据平台。但当时没有真实数据库，也没有 Hadoop 集群，如何用轻量级技术栈模拟数据仓库的分层 ETL 流程？这是本文要解决的问题。

## 二、第一步：确定性数据模拟（seed=42）

为了让数据既有统计特征又完全可复现，我实现了一个确定性随机数生成器：

```javascript
// scripts/generate-csv.mjs
let seed = 42
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

// Box-Muller 变换生成正态分布成绩 μ=75 σ=12
function gaussianRandom(mean=75, stdev=12) {
  const u1 = 1 - rand()
  const u2 = 1 - rand()
  return mean + stdev * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}
```

业务规则也被编码进去，保证数据符合真实场景逻辑：

| 规则 | 比例/逻辑 |
|------|----------|
| 贫困生比例 | ~12% |
| 心理风险比例 | ~7% |
| 缺勤与成绩关系 | 负相关（缺勤越多，成绩越低）|
| 上网时长影响 | 倒 U 型（适度上网促进学习，过度沉迷拉低成绩）|

输出：`src/data/students.csv`（250 行 × 28 列），`seed=42` 保证每次运行产出完全一致。

## 三、第二步：五层 ETL 架构实现

后端用 **Express 5 + better-sqlite3**，在 `server/index.js` 的 `runEtl()` 函数（第 48 行）中实现了 7 步 ETL，模拟 Hive 离线数仓分层：

```
┌─────────────────────────────────────────────┐
│ ① CSV 解析 → ODS 贴源层（原样保留 String）   │
│ ② 类型转换+去空 → DWD 明细层（INTEGER/REAL）│
│ ③ 提取维度 → DIM 维度层（学生/班级/年级维表）│
│ ④ JOIN+聚合 → DWS 汇总层（学生×学期宽表）   │
│ ⑤ 业务指标计算 → ADS 应用层（KPI/预警名单） │
│ ⑥ 注册 40+ API 端点                         │
│ ⑦ 监听 :3001                                │
└─────────────────────────────────────────────┘
```

**每层的核心 SQL 示例**（老师在答辩时问过"分层在哪"，我就指着这里讲）：

- **ODS→DWD**（第 82 行）：`INSERT INTO dwd_student_detail SELECT CAST(...) FROM ods_student_raw`
- **DWS 聚合**（第 98 行）：`INSERT INTO dws_student_semester SELECT ... JOIN dim_student`
- **DIM 公共维表**：`dim_student`、`dim_class`、`dim_grade` 全局复用，避免冗余

**为什么要做分层？**

| 优势 | 说明 |
|------|------|
| 问题可回溯 | ODS 保留原始数据，任何清洗错误都可追溯修复 |
| 维度复用 | 维表全局共享，减少重复存储和计算 |
| 预计算加速 | DWS 汇总层提前聚合，查询响应毫秒级 |
| 职责单一 | 每层只做一件事，代码清晰易维护 |

## 四、第三步：40+ RESTful API 注册

每个分析主题域对应一个或多个 API 端点：

```javascript
// server/index.js 第 110 行开始
app.get('/api/kpi', (req, res) => { ... })
app.get('/api/students', (req, res) => { ... })
app.get('/api/score-distribution', (req, res) => { ... })
app.get('/api/risk-overview', (req, res) => { ... })
// ... 40+ 端点
```

所有 API 返回 JSON 格式，字段使用 `snake_case`（如 `avg_score`），前端统一转换。

## 五、第四步：前后端 API 对接层

在 `src/store.ts`（72 行）中封装了所有 API 调用：

```typescript
// snake_case → camelCase 递归转换
function camel(o: any): any {
  if (Array.isArray(o)) return o.map(camel)
  if (o !== null && typeof o === 'object') {
    const r: any = {}
    for (const k of Object.keys(o)) {
      const nk = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      r[nk] = camel(o[k])
    }
    return r
  }
  return o
}

// 通用 fetch 封装
async function get<T>(url: string): Promise<T> {
  const res = await fetch(`http://localhost:3001/api${url}`)
  const json = await res.json()
  return camel(json)
}

// 导出 40+ 函数供 Vue 组件调用
export const fetchKpi = () => get('/kpi')
export const fetchStudents = () => get('/students')
// ...
```

**关键设计**：`store.ts` 是前后端唯一的桥梁，所有 Vue 页面都从这里 `import` 数据请求函数。未来替换真实后端，只需修改 `BASE_URL` 和 `fetch` 逻辑，前端页面完全不受影响。

## 六、业务深度：学业风险预警的模拟随机森林

在学业风险预警模块中，后端用一个加权公式模拟了随机森林模型的预测逻辑：

```javascript
// 每个学生的风险分计算公式
riskScore = 出勤率 × 0.4 + 成绩 × 1.2 + 心理 × 0.25 + 上网时长 × 5 + 借阅 × 3 + 贫困 × 5
```

**特征重要性排名**（来自预设值）：

1. 出勤率：22.5%（最重要的预测因子）
2. 早八出勤率：15.8%
3. 上网时长：13.2%

**模型指标**：准确率 96.0% / 精确率 88.9% / 召回率 92.3% / F1 90.5%（基于模拟数据的理论值）

## 七、项目成果

- **后端**：11 张数据表、40+ API 端点、五层 ETL 完整实现
- **数据**：250 条 × 28 列学生模拟数据，符合业务统计规律
- **前端**：14 个分析页面，7 种 ECharts 图表，完整的预警处理闭环
- **工程**：前后端完全分离，接口约定清晰，联调零摩擦

## 八、后续优化方向

| 方向 | 描述 | 优先级 |
|------|------|--------|
| 真实数据库 | 将 SQLite 替换为 PostgreSQL/MySQL | 高 |
| 真实 ML 模型 | 用 Python Flask 对接真实的随机森林/Sklearn 模型 | 高 |
| 用户权限 | 实现管理员/辅导员/领导三级角色权限控制 | 中 |
| 移动端小程序 | 将 H5 适配升级为微信小程序 | 低 |

---

> 🤖 **AI 参与度**: 本文由原作者提供素材，AI 辅助排版与润色，人工占比约 **80%**。

*发布于 2026 年 7 月*
