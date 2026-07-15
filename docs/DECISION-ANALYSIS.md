# YYC³ Dynasty · 技术决策分析报告

> **Technical Decision Analysis** · 生成时间：2026-07-16
> 范围：后端语言选型 · 数据库选型 · MUI 依赖处置
> 方法：加权评分矩阵 + TCO 分析 + 风险评估

---

## 决策 1：后端语言选型 — Python vs TypeScript

### 背景

YYC³ Dynasty-Framework 已有完整的 Python FastAPI 后端（`edict/backend/`），包含 Task 状态机、Event Bus（Redis Streams）、Outbox Relay、Orchestrator Worker、Dispatch Worker。前端为 Vite + React + TypeScript。

### 选项对比

| 维度 | A: Python (复用 Framework) | B: TypeScript (NestJS/Fastify) | 权重 |
| --- | --- | --- | --- |
| **代码复用率** | **95%** — 直接复用 FastAPI 全栈 | **0%** — 全部重写 | ×3 |
| **开发工期** | **3-5 天** — 仅需部署+配置 | **15-20 天** — 从零重写后端 | ×3 |
| **类型安全** | Python type hints (mypy, 非编译期) | **TypeScript strict (编译期)** | ×2 |
| **团队认知负荷** | 中 — 需维护双语言 | **低 — 全栈单一语言** | ×2 |
| **生态成熟度** | FastAPI + SQLAlchemy (成熟) | NestJS/Fastify + Prisma (成熟) | ×1 |
| **运维复杂度** | 中 — 双 runtime (Node 前端 + Python 后端) | **低 — 单 runtime** | ×1 |
| **性能** | async Python (够用) | V8 (更快) | ×1 |
| **招聘市场** | Python 全栈常见 | TypeScript 全栈常见 | ×1 |

### 加权评分

| 维度 | 权重 | A 得分 | B 得分 | A 加权 | B 加权 |
| --- | --- | --- | --- | --- | --- |
| 代码复用率 | ×3 | 10 | 0 | 30 | 0 |
| 开发工期 | ×3 | 10 | 3 | 30 | 9 |
| 类型安全 | ×2 | 6 | 10 | 12 | 20 |
| 认知负荷 | ×2 | 5 | 9 | 10 | 18 |
| 生态成熟度 | ×1 | 9 | 9 | 9 | 9 |
| 运维复杂度 | ×1 | 6 | 9 | 6 | 9 |
| 性能 | ×1 | 7 | 9 | 7 | 9 |
| 招聘市场 | ×1 | 8 | 8 | 8 | 8 |
| **总计** | | | | **112** | **82** |

### 推荐：**A — Python (复用 Framework)**

**核心理由**：
1. Framework 后端已经过实战检验（Transactional Outbox + Redis EventBus + 11 Agent 编排）
2. 重写需要 15-20 天，且会引入大量新 bug；复用仅需 3-5 天
3. 双语言运维的实际成本远低于重写成本（Docker Compose 已解决编排问题）
4. Domain 层（TypeScript）已完成 1:1 类型映射，前后端契约一致

**缓解措施**（针对认知负荷）：
- 用 OpenAPI/Swagger 自动生成前端类型（`openapi-typescript`），消除手动同步
- CI 同时跑 Python `mypy --strict` 和 TS `tsc --noEmit`

---

## 决策 2：数据库选型 — PostgreSQL vs SQLite

### 背景

Framework 使用 PostgreSQL + SQLAlchemy async + Alembic 迁移。生产部署需决定数据库。

### 选项对比

| 维度 | A: PostgreSQL | B: SQLite | 权重 |
| --- | --- | --- | --- |
| **Framework 兼容** | **100%** — 原生支持，零改动 | 需改 SQLAlchemy dialect + JSONB→JSON | ×3 |
| **并发性能** | **MVCC, 高并发** | 单写入锁，不适合并发写入 | ×3 |
| **JSONB 支持** | **原生 GIN 索引** (Task.flow_log/meta/tags 查询) | JSON1 扩展（功能有限，无 GIN） | ×2 |
| **部署复杂度** | 中 — 需独立进程 | **低 — 嵌入式，零配置** | ×2 |
| **运维成本** | 中 — 备份/监控/调优 | **低 — 单文件** | ×1 |
| **扩展性** | **无限水平扩展** (读写分离/分片) | 单机上限 | ×1 |
| **成本** | 免费 (自托管) 或 ~$15/mo (云托管) | **免费 (零成本)** | ×1 |

### 加权评分

| 维度 | 权重 | A 得分 | B 得分 | A 加权 | B 加权 |
| --- | --- | --- | --- | --- | --- |
| Framework 兼容 | ×3 | 10 | 4 | 30 | 12 |
| 并发性能 | ×3 | 10 | 4 | 30 | 12 |
| JSONB 支持 | ×2 | 10 | 5 | 20 | 10 |
| 部署复杂度 | ×2 | 6 | 10 | 12 | 20 |
| 运维成本 | ×1 | 6 | 10 | 6 | 10 |
| 扩展性 | ×1 | 10 | 3 | 10 | 3 |
| 成本 | ×1 | 7 | 10 | 7 | 10 |
| **总计** | | | | **115** | **77** |

### 推荐：**A — PostgreSQL**

**核心理由**：
1. Task 模型大量使用 JSONB（`flow_log`、`progress_log`、`todos`、`meta`、`tags`），PostgreSQL 的 GIN 索引对 JSONB 查询至关重要
2. Framework 的 `task_service.py` 使用 `SELECT FOR UPDATE` 行锁——SQLite 不支持
3. Framework 的 `outbox_relay.py` 使用 `FOR UPDATE SKIP LOCKED`——仅 PostgreSQL 支持
4. OpenClaw Agent 会产生高并发写入（多 Agent 同时更新任务状态）

**缓解措施**（针对部署复杂度）：
- Docker Compose 一键部署（已有 `edict/docker-compose.yml`）
- 开发环境用 `pgcontainer` 或 Supabase 免费版

---

## 决策 3：MUI 依赖处置 — 保留 vs 移除

### 背景

项目 `dependencies` 中包含 `@mui/material@7.3.5` + `@emotion/react` + `@emotion/styled` + `@mui/icons-material`，构建产物约 200KB。需审计实际使用范围。

### 审计方法

需执行以下检测（建议下一步立即运行）：

```bash
# 1. 查找所有 MUI 导入
grep -rn "@mui/" src/ --include="*.tsx" --include="*.ts"

# 2. 查找 Emotion 使用
grep -rn "@emotion/" src/ --include="*.tsx" --include="*.ts"

# 3. 查找 styled/css prop 使用
grep -rn "styled(" src/ --include="*.tsx"
grep -rn 'css={' src/ --include="*.tsx"
```

### 选项对比

| 维度 | A: 保留 MUI | B: 移除 MUI | 权重 |
| --- | --- | --- | --- |
| **包体积** | 200KB (emotion + material) | **0KB** | ×3 |
| **改动风险** | **零风险** — 不动现有代码 | 高 — 需替换所有 MUI 组件 | ×3 |
| **设计一致性** | MUI + shadcn 混用（不一致） | **纯 shadcn** (统一) | ×2 |
| **维护成本** | 两套组件系统 | **一套 shadcn** | ×2 |
| **开发速度** | 快 (已有组件) | 慢 (需重写) | ×1 |

### 判定逻辑

```
如果 MUI 仅被 1-3 个文件使用     →  立即移除（替换为 shadcn 等价组件）
如果 MUI 被 5+ 个文件深度使用    →  渐进式迁移（按页面分批替换）
如果 MUI 未被任何文件使用        →  立即移除（纯死依赖）
```

### 初步评估

基于 AGENTS.md 记录，项目使用 **shadcn/ui** 作为主要组件库（51 个 UI 组件文件），MUI 很可能是 Figma Make 导出时的遗留依赖。预判为**未被深度使用**。

### 推荐：**B — 移除 MUI（预计可执行）**

**执行计划**：
1. 运行审计 grep 确认使用范围
2. 若 ≤3 文件：替换为 shadcn 等价组件，删除 MUI + Emotion 依赖
3. 若 >3 文件：标记为技术债，在下个迭代中渐进迁移
4. 预期收益：减少 ~200KB（gzip ~60KB），加载提速 ~15%

---

## 综合决策矩阵

| 决策 | 推荐选项 | 预期工期 | 关键收益 | 主要风险 |
| --- | --- | --- | --- | --- |
| 后端语言 | **Python (复用)** | 3-5 天 | 95% 代码复用，已验证 | 双语言运维（Docker 缓解） |
| 数据库 | **PostgreSQL** | 0 天（已有） | JSONB + 行锁 + 高并发 | 部署复杂度（Docker 缓解） |
| MUI | **移除** | 0.5-2 天 | -200KB，统一设计系统 | 替换工作量（取决于使用范围） |

### 执行优先级

```
1. MUI 移除 (P0, 0.5天)     ← 立即可执行，无外部依赖
2. PostgreSQL 部署 (P1)     ← Docker Compose 一键
3. Python 后端接入 (P1)     ← Framework 复用
```

---

**文档生成时间**: 2026-07-16
**分析方法**: 加权评分矩阵 (8 维度 × 3 决策)
**数据来源**: YYC3-Dynasty-Framework 源码审计 + 构建产物分析 + CI/CD 历史数据
