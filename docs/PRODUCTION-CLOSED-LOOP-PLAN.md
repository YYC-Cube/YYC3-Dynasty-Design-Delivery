# YYC³ Dynasty · 全维度生产闭环落地实施方案

> **Production Closed-Loop Implementation Plan**
> 生成时间：2026-07-16
> 执行人：Crush (GLM-5.2)
> 范围：静态门禁 → 域层审计 → CI/CD → 安全 → 运行时 → 交付路线图

---

## 0. 执行摘要

| 维度 | 评分 | 状态 | 说明 |
| --- | --- | --- | --- |
| 静态门禁 | **10/10** | ✅ 全绿 | typecheck · lint · format · madge · build |
| 域层完整度 | **9/10** | ✅ 9模块 1602行 | types/stateMachine/agents/honors/notifications/security/skills/openclaw |
| CI/CD | **9.5/10** | ✅ 自动部署 | Actions v6/v7 (Node 24) · Pages HTTPS · 无 deprecation |
| 安全 | **9/10** | ✅ 14→1 | vite/react-router CVE 全修复；1 elliptic stale (low) |
| 运行时健壮性 | **8/10** | ⚠️ Mock | 状态机已接通；WebSocket/后端为 mock |
| 可访问性 | **7.5/10** | ✅ 基础达标 | 模态 a11y · sr-only · 待复核确认 |
| 测试覆盖 | **3/10** | ❌ 无测试 | 无单元/集成/E2E 测试 |
| 包体积 | **6/10** | ⚠️ 超阈值 | index.js 1406KB (gzip 426KB)，缺 code-splitting |
| **加权综合** | **8.2** | 🟡 **可交付 demo** | 生产化需后端接入 + 测试 + 性能优化 |

---

## 1. 静态门禁（Phase 1）

### 1.1 门禁结果矩阵

| # | 门禁 | 命令 | 结果 | 耗时 | CI 对应 |
|---|------|------|------|------|---------|
| 1 | TypeScript 类型检查 | `pnpm typecheck` | ✅ 0 errors | <1s | CI step |
| 2 | ESLint 代码质量 | `pnpm lint` | ✅ 0 errors / 0 warnings | <1s | CI step |
| 3 | Prettier 格式一致性 | `pnpm format:check` | ✅ All files clean | <1s | CI step |
| 4 | 循环依赖扫描 | `pnpm madge` | ✅ 0 circular (90 files) | <1s | CI step |
| 5 | 生产构建 | `pnpm build` | ✅ 3054 modules → 5.7MB | 2.77s | CI step |

### 1.2 构建产物分析

| 资源 | 原始大小 | Gzip 估算 | 说明 |
| --- | --- | --- | --- |
| `index-*.js` | **1,406 KB** | **~426 KB** | ⚠️ 超过 500KB 阈值 |
| `index-*.css` | 122 KB | ~18 KB | 含 Tailwind + theme tokens |
| 11 个 locale JS | 0.3-0.5 KB 各 | ~0.05 KB 各 | 动态加载，无问题 |
| **dist/ 总计** | **5.7 MB** | — | — |

### 1.3 包体积根因

```
index-*.js (1406KB) 组成估算:
├── recharts          ~450KB  (图表库，全量引入)
├── @radix-ui/*       ~280KB  (24 个 Radix 原语)
├── @mui/*            ~200KB  (emotion + material)
├── motion            ~150KB  (framer-motion)
├── react-dnd         ~80KB   (DnD 引擎)
├── @yyc3/i18n-core   ~120KB  (含 polyfill)
├── react/react-dom   ~130KB  (核心框架)
└── 业务代码           ~50KB   (domain + pages + components)
```

---

## 2. 域层审计（Phase 2）

### 2.1 模块清单

| # | 文件 | 行数 | 移植来源 | 复用度 | 文化对齐 |
|---|------|------|----------|--------|----------|
| 1 | `types.ts` | 206 | Framework task.py + event.py | ✅ 10态 + EdictMessage(6类) + 12 类型 | 空间节点保留 |
| 2 | `stateMachine.ts` | 129 | Framework task.py STATE_TRANSITIONS | ✅ 完整转换图 + 高风险确认 | 中文状态名 |
| 3 | `agents.ts` | 167 | Framework agents.json + sync_agent_config | ✅ 11 Agent 注册表 + 权限分层 | 省部映射 |
| 4 | `honors.ts` | 227 | Framework 文化勋章.md + sync_officials_stats | ✅ 18 勋章 × 5 维度 × 6 稀有度 | 古风命名 |
| 5 | `notifications.ts` | 161 | Framework channels/*.py | ✅ 7 通道 + webhook 校验 + payload | — |
| 6 | `security.ts` | 153 | Framework dispatch_worker + utils + kanban | ✅ 注入检测 + SSRF + 净化 | — |
| 7 | `skills.ts` | 248 | Framework skill_manager.py | ✅ 6 技能 + 镜像 + 下载器 | — |
| 8 | `openclaw.ts` | 294 | Framework 4 脚本综合 | ✅ 运行时契约 + 会话模型 + 计费 | 官职映射 |
| 9 | `index.ts` | 17 | — | Barrel export | — |
| **总计** | | **1,602** | | | |

### 2.2 Framework 对齐差异表

| Framework (Python) | Design (TypeScript) | 对齐策略 |
|---|---|---|
| `TaskState.Taizi` | `'待承旨'` | 中文映射 |
| `TaskState.Pending` | `'待承旨'`（合并） | Framework 的 Pending 与 Taizi 在 UI 上等价 |
| `TaskState.Next` | `'待执行'`（新增） | Pipeline 外 tray 显示 |
| `TaskState.PendingConfirm` | `'待复核'`（新增） | Pipeline 外 tray 显示 |
| `TaskState.Blocked` | `'阻塞中'`（新增） | Pipeline 外 tray 显示 |
| `TaskState.Cancelled` | `'已撤销'`（新增） | Pipeline 外 tray 显示 |
| 12-state enum | 11-state type（无 Pending） | Pending 合并入待承旨 |

### 2.3 缺口分析

| 缺口 | 严重度 | 说明 | 阻塞项 |
|---|---|---|---|
| Todo 树形结构未接通 | 🟡 P2 | `TodoItem` 类型已有 `parent_id`，但 UI 无树渲染 | 需产品决策 |
| Thought 模型未接通 | 🟡 P2 | Framework 有 `thought.py`（推理流），Design 无组件 | 需 TaishiMonitor 接入 |
| 委派死锁防护未实现 | 🟡 P2 | Framework `cmd_delegate` 有深度限制+环检测，Design 无委派操作 | 需后端 |
| 通知发送实际未通 | 🟢 P3 | `buildPayload()` 已实现，但无 HTTP 发送（CORS） | 需后端代理 |

---

## 3. CI/CD 审计（Phase 3）

### 3.1 工作流状态

| 工作流 | 文件 | 触发 | 最近状态 | 耗时 |
|---|---|---|---|---|
| CI | `.github/workflows/ci.yml` | push/PR to main | ✅ success | 41s |
| Deploy | `.github/workflows/deploy.yml` | push to main | ✅ success | 1m7s |

### 3.2 Actions 版本审计

| Action | 旧版本 | 当前版本 | Node 运行时 | 状态 |
|---|---|---|---|---|
| `actions/checkout` | v4 | **v7** | Node 24 | ✅ 最新 |
| `actions/setup-node` | v4 | **v7** | Node 24 | ✅ 最新 |
| `actions/upload-artifact` | v4 | **v7** | Node 24 | ✅ 最新 |
| `pnpm/action-setup` | v4 | **v6** | Node 24 | ✅ 最新 |
| `actions/configure-pages` | v5 | **v6** | Node 24 | ✅ 最新 |
| `actions/upload-pages-artifact` | v3 | **v5** | Node 24 | ✅ 最新 |
| `actions/deploy-pages` | v4 | **v5** | Node 24 | ✅ 最新 |

**结论**：所有 Actions 已升级到 Node 24 兼容版本，零 deprecation 警告。

### 3.3 GitHub Pages 部署链路

```
push to main
  → ci.yml (质量门禁: typecheck/lint/format/madge/build)
  → deploy.yml (build for Pages)
    → configure-pages v6
    → upload-pages-artifact v5 (dist/)
    → deploy-pages v5
    → https://dynasty.yyc3.top/ (HTTPS 强制, 证书已批准)
```

| 配置项 | 值 |
|---|---|
| 域名 | `dynasty.yyc3.top` |
| CNAME | `public/CNAME` |
| Build type | `workflow` |
| HTTPS | 强制 (`https_enforced: true`) |
| 证书状态 | `approved` (有效期至 2026-10-14) |
| Jekyll | 禁用 (`public/.nojekyll`) |
| Vite base | `/` (自定义域名根路径) |

### 3.4 CI/CD 闭环验证

最近 4 次 push 的运行记录（100% 通过率）：

| 时间 | 提交 | CI | Deploy |
|---|---|---|---|
| 19:46 | off-pipeline + skills + openclaw | ✅ 41s | ✅ 1m7s |
| 19:26 | domain layer + honors + state machine | ✅ 41s | ✅ 52s |
| 18:10 | i18n vendor + security + actions | ✅ 48s | ✅ 1m24s |
| 17:52 | tsconfig baseUrl fix | ✅ 43s | ✅ 1m3s |

---

## 4. 安全审计（Phase 4）

### 4.1 依赖漏洞状态

| 包 | 原版本 | 现版本 | 原 CVE 数 | 现 CVE 数 | 状态 |
|---|---|---|---|---|---|
| vite | 6.3.5 | **6.4.3** | 7 | 0 | ✅ 全修复 |
| react-router | 7.13.0 | **7.18.1** | 7 | 0 | ✅ 全修复 |
| elliptic | 6.6.1 | 6.6.1 | 1 | 1 | ⚠️ stale (low, 无修复版本) |

**总计**：14 open alerts → **1 open alert**（93% 减少）

### 4.2 域层安全模块审计

| 防护层 | 来源 | 实现位置 | 覆盖范围 |
|---|---|---|---|
| Prompt 注入检测 | Framework dispatch_worker | `security.ts` INJECTION_PATTERNS | 8 模式（中英文） |
| SSRF 防护 | Framework utils.py | `security.ts` validateUrl | 私有 IP/loopback/保留段 |
| 文本净化 | Framework kanban_update | `security.ts` sanitizeText | 代码块/路径/URL/会话元数据 |
| 标题校验 | Framework kanban_update | `security.ts` isValidTitle | 长度/垃圾模式/注入 |
| Webhook 域名白名单 | Framework channels | `notifications.ts` validateWebhook | 7 通道各自域名限制 |
| XXE 防护 | Framework fetch_morning_news | *(尚未在 Design 中使用)* | 待 RSS 功能接入 |

### 4.3 前端安全注意事项

| 风险 | 现状 | 建议 |
|---|---|---|
| XSS | React 自动转义 ✅ | 维持 |
| CSRF | 无表单提交到后端（当前纯前端） | 后端接入后需 token |
| 密钥泄露 | 代码中无硬编码密钥 ✅ | `.env` 已 gitignore |
| CORS | 后端未接入，无 CORS 配置 | 后端需 `allow_origins` 白名单 |

---

## 5. 运行时审计（Phase 5）

### 5.1 路由清单

| 路径 | 组件 | 状态 | 功能完整度 |
|---|---|---|---|
| `/` | WelcomePage | ✅ | 角色 选择入口 |
| `/court` | CourtHall | ✅ | 中央轴线全景 |
| `/edict` | EdictBoard | ✅ | **10 态看板** + DnD + 高风险确认 + off-pipeline tray |
| `/archive` | ArchiveBoard | ✅ | 已办结归档 |
| `/timeline` | TimelinePage | ✅ | 十三王朝 × 技能 |
| `/monitor` | TaishiMonitor | ✅ | recharts 仪表盘 |
| `/honors` | HonorsPage | ✅ **新** | **功勋榜 + 18 勋章手风琴** |
| `/dashboard` | DashboardPage | ✅ | 全屏命令中心 |
| `/skills` | PlaceholderPage | ⚠️ 占位 | 藏经阁待实现 |
| `/workflow` | PlaceholderPage | ⚠️ 占位 | 律令格式待实现 |
| `/bridge` | PlaceholderPage | ⚠️ 占位 | 跨域桥待实现 |
| `/hr` | PlaceholderPage | ⚠️ 占位 | 吏部待实现 |
| `/department/:id` | PlaceholderPage | ⚠️ 占位 | 六部详情待实现 |
| `*` | PlaceholderPage | ✅ | 404 兜底 |

**实现率**：8/14 路由有真实组件（57%），6/14 为占位。

### 5.2 状态机闭环验证

```
待承旨 ──承旨分拣──→ 待草拟 ──提交草拟──→ 待审议
                       ↑──封驳──┐           │
                       └──────────┘     准奏 ↓
                                                    待派发 ──核发鱼符──→ 执行中
                                                                          │
                                                                    办结 ↓
                                                                    待回奏 ──上呈回奏──→ 已办结
                                                                        │               ↑
                                                                   待复核──复核通过──────┘
                                                                        │
                                                                   高风险确认

Off-Pipeline: 待执行 · 阻塞中 → 可解回任意主管线态
Terminal: 已办结 · 已撤销 (无出转换)
```

| 验证项 | 结果 |
|---|---|
| 所有非终态有出转换 | ✅ |
| 所有终态无出转换 | ✅ (`已办结`/`已撤销`) |
| 阻塞可解回 | ✅ 6 个目标态 |
| 高风险确认门 | ✅ 3 条 (待回奏→已办结, 执行中→已撤销, 待审议→已撤销) |
| DnD 非法转换拒绝 | ✅ `isValidTransition` 在 reducer 中校验 |

### 5.3 数据流审计

| 数据源 | 当前实现 | 生产目标 | 差距 |
|---|---|---|---|
| Edict 状态 | `useReducer` (内存) | FastAPI + PostgreSQL | 需后端 |
| WebSocket | `setTimeout` mock | Redis Pub/Sub → WS | 需后端 |
| Agent 配置 | hardcoded mock | OpenClaw `openclaw.json` | 需文件系统读取 API |
| 官员统计 | `MOCK_OFFICIALS` | Framework `sync_officials_stats.py` | 需后端定时任务 |
| 勋章授予 | 静态列表 | `POST /api/honors/award` | 需后端 |
| 技能管理 | 类型定义 + 下载器 | `~/.openclaw/workspace-*/skills/` | 需文件系统 API |

### 5.4 i18n 审计

| 本地化项 | zh-CN | en | 一致性 |
|---|---|---|---|
| 状态键 (10) | ✅ 全部 | ✅ 全部 | 一致 |
| 列标签 (10) | ✅ 全部 | ✅ 全部 | 一致 |
| 导航键 (11) | ✅ 全部 | ✅ 全部 | 一致 |
| 占位页 (8) | ✅ 全部 | ✅ 全部 | 一致 |
| Dashboard 键 (5) | ✅ 全部 | ✅ 全部 | 一致 |
| 总行数 | 134 | 129 | ✅ 结构对称 |

---

## 6. 生产闭环落地路线图（Phase 6）

### 6.1 分阶段交付计划

#### Phase S1：性能优化（1-2 天）

| 任务 | 优先级 | 预期效果 | 实施方案 |
|---|---|---|---|
| 路由级 lazy-loading | P0 | index.js 426KB → ~150KB (gzip) | `React.lazy()` + `Suspense` 按路由拆分 |
| recharts 按需引入 | P1 | 减 ~300KB | 只引入 Line/Radar 组件 |
| @mui 移除或 tree-shake | P1 | 减 ~200KB | 确认 MUI 使用范围，移除未用组件 |
| `manualChunks` 配置 | P2 | vendor 分包 | vite.config `rollupOptions.output.manualChunks` |

#### Phase S2：后端最小接入（3-5 天）

| 任务 | 优先级 | 依赖 | 交付物 |
|---|---|---|---|
| FastAPI 基础服务 | P0 | PostgreSQL | `GET /api/tasks` + `POST /api/tasks/{id}/transition` |
| WebSocket 中继 | P0 | Redis | `/ws` → `{type:'event', topic, data}` 推送 |
| WorkflowContext → API | P0 | FastAPI | 替换 `useReducer` mock 为 fetch + WS |
| 官员统计 API | P1 | OpenClaw 文件系统 | `GET /api/agents/stats` |

#### Phase S3：功能补全（5-10 天）

| 路由 | 任务 | 优先级 | 依赖 |
|---|---|---|---|
| `/skills` | SkillsPage（技能库 + agent 技能矩阵） | P1 | OpenClaw 文件系统 API |
| `/workflow` | WorkflowPage（律令格式浏览器） | P2 | 后端 rule/knowledge base |
| `/hr` | HrPage（Agent 人事 + 绩效 + 模型切换） | P1 | `apply_model_changes` API |
| `/department/:id` | DepartmentPage（六部详情看板） | P2 | FastAPI per-org filter |
| `/bridge` | BridgePage（跨域星桥 · MCP/AI 提供商） | P3 | MCP server |

#### Phase S4：测试体系建设（3-5 天）

| 层级 | 工具 | 覆盖目标 | 优先级 |
|---|---|---|---|
| 单元测试 | Vitest + Testing Library | domain/ 全模块 + state machine 转换 | P0 |
| 组件测试 | Vitest + Testing Library | EdictBoard 转换流程 + HonorsPage 渲染 | P1 |
| E2E 测试 | Playwright | 路由导航 + DnD + 草拟流程 | P2 |
| CI 集成 | `.github/workflows/ci.yml` | `pnpm test` step | P0 |

#### Phase S5：生产加固（2-3 天）

| 任务 | 说明 | 优先级 |
|---|---|---|
| Sentry 错误监控 | 前端异常上报 | P1 |
| CSP 头 | `Content-Security-Policy` 配置 | P1 |
| Lighthouse CI | 性能/a11y/SEO 自动评分 | P2 |
| Docker 容器化 | FastAPI + Nginx + PostgreSQL | P2 |
| 域名 HTTPS 证书续期监控 | Let's Encrypt / GitHub 自动 | P3 |

### 6.2 依赖拓扑图

```
Phase S1 (性能优化)         ←── 无依赖，可立即启动
    ↓
Phase S2 (后端最小接入)     ←── 依赖 S1 完成以确认 API 消费层
    ↓
Phase S3 (功能补全)         ←── 依赖 S2 后端 API
    ↓                    ↗
Phase S4 (测试体系)  ──────→  可与 S2/S3 并行
    ↓
Phase S5 (生产加固)         ←── 依赖 S2-S4 完成
```

### 6.3 关键决策点

| 决策 | 选项 A | 选项 B | 建议 | 需要输入 |
|---|---|---|---|---|
| 后端语言 | Python (复用 Framework) | TypeScript (全栈统一) | **A** — Framework 已有完整 FastAPI | Maintainer |
| 数据库 | PostgreSQL (Framework 已有) | SQLite (轻量) | **A** — 生产就绪 | Maintainer |
| 消息队列 | Redis Streams (Framework 已有) | RabbitMQ / Kafka | **A** — 已有 EventBus | Maintainer |
| MUI 处理 | 保留 (情感组件依赖) | 移除 (减重 200KB) | 需审计 MUI 实际使用范围 | 开发者 |
| 测试框架 | Vitest (Vite 原生) | Jest (成熟) | **A** — 零配置集成 | — |

---

## 7. 评分矩阵与趋势

| 维度 | 初始 (07-12) | R1 (07-12) | R2 (07-15) | R3 (07-16) | 变化趋势 |
| --- | --- | --- | --- | --- | --- |
| 类型安全 | 9.5 | 9.5 | 9.5 | **9.5** | — |
| 代码风格 | 9 | 9 | 9 | **9** | — |
| React 最佳实践 | 9 | 9.5 | 9.5 | **9** | ⬇ 添加域层引入轻微复杂度 |
| 可维护性 | 8 | 8 | 8 | **8.5** | ⬆ 域层分离 |
| 设计系统一致性 | 9 | 9 | 9 | **9** | — |
| 运行时健壮性 | — | 8 | 8 | **8** | — |
| a11y 可访问性 | — | 7.5 | 7.5 | **7.5** | — |
| 安全 | 5 | 7 | 9 | **9** | ⬆⬆ 14→1 CVE + 域层防护 |
| CI/CD | — | 5 | 9 | **9.5** | ⬆ Pages + Actions 全升级 |
| 测试覆盖 | 5 | 5 | 5 | **3** | ⬇ 评分校准 (实际无测试) |
| 包体积 | — | — | — | **6** | 🆕 超阈值 |
| 域层完整度 | — | — | — | **9** | 🆕 9模块 1602行 |
| **加权综合** | **8.5** | **8.8** | **8.8** | **8.2** | ⬇ 测试/体积扣分 |

---

## 8. 本轮改动清单

```
新增:
  + src/app/domain/skills.ts       (248行 — OpenClaw Skills Hub 6技能+镜像failover+下载器)
  + src/app/domain/openclaw.ts     (294行 — 运行时契约+会话模型+JSONL解析+12模型计费+心跳检测)

更新:
  * src/app/pages/EdictBoard.tsx   (+ Off-Pipeline Tray for 待执行/待复核/阻塞中/已撤销)
  * src/app/domain/index.ts        (+ skills/openclaw barrel export)
  * docs/PRODUCTION-CLOSED-LOOP-PLAN.md (本文件)
```

---

## 9. 验收标准对照

| 验收项 | 达标标准 | 当前状态 |
|---|---|---|
| `pnpm typecheck` | 0 errors | ✅ |
| `pnpm lint` | 0 errors / 0 warnings | ✅ |
| `pnpm format:check` | All files clean | ✅ |
| `pnpm madge` | 0 circular | ✅ |
| `pnpm build` | success | ✅ |
| GitHub Actions CI | success on main | ✅ |
| GitHub Pages Deploy | success, HTTPS | ✅ |
| Dependabot alerts | ≤ 1 (low) | ✅ 1 (stale elliptic) |
| Domain layer coverage | ≥ 8 modules | ✅ 9 modules |
| i18n 双语对称 | zh-CN = en structure | ✅ |
| 状态机终态保护 | Terminal 无出转换 | ✅ |

---

## 10. 下一步行动（按优先级）

### 立即可执行（无外部依赖）

1. **[ ] 路由级 lazy-loading** — 将 recharts/TaishiMonitor 等重组件改为 `React.lazy()`
2. **[ ] Vitest 安装 + domain 层单元测试** — 状态机转换合法性 + 勋章 merit 公式
3. **[ ] CI 增加 `pnpm test` step** — 测试纳入 CI 闭环

### 需要决策后执行

4. **[ ] FastAPI 后端部署** — 复用 Framework 的 `edict/backend/` 还是重写？
5. **[ ] PostgreSQL + Redis provision** — 生产环境数据库
6. **[ ] OpenClaw 运行时接入** — 文件系统 API 代理层

### 长期演进

7. **[ ] MUI 依赖审计与移除** — 减少 200KB
8. **[ ] WebSocket 实时推送** — 替换 mock
9. **[ ] 6 个 PlaceholderPage 实现** — skills/workflow/bridge/hr/department
10. **[ ] Docker 容器化 + CI/CD CD pipeline**

---

**文档生成时间**: 2026-07-16
**审计深度**: 全维度（静态 → 域层 → CI/CD → 安全 → 运行时 → 交付路线图）
**最终验证**: `typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `madge` ✅ · `build` ✅ · CI ✅ · Deploy ✅
