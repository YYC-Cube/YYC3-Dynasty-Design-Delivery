# YYC³ Dynasty · 阶段规划与执行报告

> **Staged Plan & Execution Report** · generated 2026‑07‑12
> 本文件记录「全局扫描 → 修复 → 规划」的实际执行情况：每项任务均给出**预期（目标）**
> 与**结果（实际）**，方便后续迭代回溯。

---

## 0. 总览 / Executive Summary

| 维度                        | 数字                                               |
| --------------------------- | -------------------------------------------------- |
| 用户原始诉求                | 9 项（含 4 项"创建/修复"前提假设）                 |
| 实际验证后真问题            | 5 大类（依赖、组件、TS、文档、规划）               |
| 阻塞性问题（blocker）       | 3 个原生二进制版本错配（构建失败）                 |
| 已修复缺陷                  | **构建 0 错 / 类型 0 错 / 业务代码 11 个缺陷**     |
| 新增文档                    | `README.md` · `CONTRIBUTING.md` · 更新 `AGENTS.md` |
| 是否符合"行业标准/团队规范" | ✅ 已对齐（见 §6）                                 |

### 关键纠正

用户的 4 项"创建/修复"前提与实际现状不符，已逐项核实并采用**最小损伤**方式处理：

1. ❌ "创建缺失的 `index.html`" → 实际已存在（779 B，20 行，含 zh‑CN meta + Google Fonts）。
2. ❌ "创建缺失的 `src/main.tsx`" → 实际已存在（867 B，37 行，含完整 file‑header docstring）。
3. ❌ "修复 `package.json` 添加 dev 脚本" → `dev` 脚本已存在（`vite --port 3133 --host`）。
4. ❌ "修复 `vite.config.ts` 配置端口 3133" → 端口已在 `dev` 脚本中配置，`vite.config.ts` 本身无须改动。

强行重建这 4 个文件会**丢掉现有正确实现**。本报告改为修复**真实存在**的缺陷。

---

## 1. 阶段一 · 现状扫描与依赖治理（Phase 1 — Scan & Dependency Health）

### 目标 / Expected

- 100 % 摸清仓库真实状态；让 `pnpm install` 与 `pnpm build` 在 macOS arm64 上成功。

### 结果 / Actual

| 检查项                   | 预期       | 实际                                   | 处置             |
| ------------------------ | ---------- | -------------------------------------- | ---------------- |
| 4 个"缺失"入口文件存在性 | 用户称缺失 | **全部存在**                           | 不重建，仅记录   |
| `pnpm install`           | 成功       | 成功（已 `node_modules`）              | 无需改动         |
| `pnpm build`             | 成功       | **失败**：esbuild host/binary 版本错配 | **修复**（见下） |

#### 1.1 阻塞修复 · 原生二进制对齐

`pnpm-workspace.yaml#supportedArchitectures` 仅声明 Linux（部署目标），导致 macOS arm64 缺失原生二进制。已显式 pin 4 个 darwin-arm64 包到与 transitive 依赖**完全一致**的版本：

| 包                                | 旧版本    | 新版本（已对齐）       | 修复的错误                                                      |
| --------------------------------- | --------- | ---------------------- | --------------------------------------------------------------- |
| `@esbuild/darwin-arm64`           | `^0.28.1` | **`0.25.12`**          | `Host version "0.25.12" does not match binary version "0.28.1"` |
| `lightningcss-darwin-arm64`       | 缺失      | **`1.30.1`**（新增）   | `Cannot find module '../lightningcss.darwin-arm64.node'`        |
| `@tailwindcss/oxide-darwin-arm64` | 缺失      | **`4.1.12`**（新增）   | `Failed to load native binding`                                 |
| `@rollup/rollup-darwin-arm64`     | `^4.62.2` | **`4.62.2`**（去 `^`） | 预防性锁定                                                      |

构建结果：`✓ built in 1.79s` ✅

#### 1.2 阻塞修复 · TypeScript 类型环境

- 新增 `@types/react@18.3.1` + `@types/react-dom@18.3.1` 到 `devDependencies`（原项目漏装）。
- 在 `pnpm-workspace.yaml#overrides` 钉版（pnpm v11 不再读 `package.json#pnpm.overrides`），消除 lucide-react / react-router 等传递依赖拉取的 `@types/react@19` 带来的 ~100 处 TS2786 错误。

#### 1.3 阻塞修复 · tsconfig 项目引用

- `tsconfig.json`：加 `"ignoreDeprecations": "6.0"`（消除 `baseUrl` deprecation，待 TS 7.0 再迁移）。
- `tsconfig.node.json`：去 `"noEmit": true`，加 `"composite": true` + `"ignoreDeprecations": "6.0"`，使项目引用 (`references`) 合法。

---

## 2. 阶段二 · 组件代码修复（Phase 2 — Component Fixes）

### 目标 / Expected

- 全局扫描所有 `.tsx` / `.ts`，消除语法/类型/逻辑错误，让 `tsc --noEmit` 0 错。

### 结果 / Actual

`tsc --noEmit` 由 **数百错误 → 0 错**。具体修复 11 个真实缺陷：

| #   | 文件                                      | 缺陷                                                                | 修复                                                              |
| --- | ----------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | `src/app/components/ui/NodeCard.tsx:2`    | `import { cn } from './Badge'` —— `badge.tsx` 未导出 `cn`           | 改为 `./utils`                                                    |
| 2   | `src/app/components/ui/TokenButton.tsx:2` | 同上                                                                | 改为 `./utils`                                                    |
| 3   | `src/app/pages/CourtHall.tsx:114`         | `navigate('/archive')` 未定义                                       | 加 `const navigate = useNavigate();` + import                     |
| 4   | `src/app/pages/EdictBoard.tsx:231`        | `<FishTokenIcon title="...">` —— `title` 不在组件 props             | 改为 `<FishTokenIcon .../>` + `<span className="sr-only">`        |
| 5   | `src/app/dashboard/CentralAxis.tsx`       | `import { Badge } from '../components/ui/Badge'` 大小写错（TS1149） | 改为 `./badge`                                                    |
| 6   | 同上                                      | `<Badge variant="blue\|gold\|green">` —— 非法 variant 值            | 改为 `variant="default"` + 主题色 className                       |
| 7   | `src/app/dashboard/LeftSidebar.tsx:2`     | 同 #5                                                               | 改为 `./badge`                                                    |
| 8   | 同上                                      | `<Badge variant={...? 'red' : 'gold' : 'default'}>` —— 非法         | 同 #6 模式                                                        |
| 9   | `src/app/dashboard/EdictModal.tsx:3`      | 同 #5                                                               | 改为 `./badge`                                                    |
| 10  | `src/main.tsx:25`                         | `import './styles/index.css'` 无类型声明                            | 新增 `src/vite-env.d.ts` 引用 `vite/client`                       |
| 11  | `src/app/{components/ui,dashboard}/*.tsx` | 大量 `imperial-*` Tailwind 类名**从未定义**（silent no-op）         | 全部翻译为 `var(--color-accent-*)` / `var(--color-bg-*)` 规范令牌 |

**Token 翻译统计**：覆盖 7 个文件、~80 处类名替换（含 `text-imperial-gold`、`bg-imperial-panel`、`border-imperial-red`、`var(--color-imperial-green)` 等所有变体）。构建后 CSS 体积 `112.82 → 117.31 kB`，证明新令牌确实生成了样式规则。

---

## 3. 阶段三 · 开发者文档（Phase 3 — Developer Documentation）

### 目标 / Expected

- 全套面向新成员/AI Agent 的文档：上手 → 规范 → 排错 → 哲学。

### 结果 / Actual

| 文档              | 类型 | 行数 | 用途                                                                                                                                   |
| ----------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`       | 新增 | ~190 | 项目总览、技术栈、快速开始、路由表、令牌表、状态摘要                                                                                   |
| `CONTRIBUTING.md` | 新增 | ~150 | 分支/Commit 规范、自检清单、代码规范、PR 模板、评审标准                                                                                |
| `AGENTS.md`       | 更新 | ~430 | 新增 §7.3‑7.11（原生二进制对齐、React 类型 override、shadcn 命名规范、令牌强制规则、TS 配置陷阱）；"FAQ when stuck" 全部改为指向真实解 |

文档体系已与 `docs/00-YYC3-团队通用-标准规范/` 下的团队规范（如 `YYC3-团队规范-开发标准.md`、`YYC3-团队通用-开发文档.md`）形成**仓库级** ↔ **项目级**的两层结构，未冲突。

---

## 4. 阶段四 · 全局验证（Phase 4 — Verification）

| 验证步骤    | 命令                                | 结果                                                                      |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------- |
| 依赖安装    | `pnpm install`                      | ✅ `Done in 1.2s`，0 warning（除 recharts 已知弃用）                      |
| 类型检查    | `npx tsc --noEmit -p tsconfig.json` | ✅ **0 errors**                                                           |
| 生产构建    | `pnpm build`                        | ✅ `built in 1.79s`，2746 modules transformed                             |
| Bundle 体积 | `dist/assets/*.js`                  | 904.56 kB（gzip 263.14 kB）—— 已有 chunk size 警告，列入后续优化（见 §7） |

---

## 5. 阶段五 · 与"行业标准 / 团队规范"对齐情况（Phase 5 — Standards Alignment）

| 维度                                 | 行业标准                        | 本仓现状                              |
| ------------------------------------ | ------------------------------- | ------------------------------------- |
| **README**                           | 项目入口、快速开始、技术栈表    | ✅ `README.md` 完成                   |
| **CONTRIBUTING**                     | 分支策略、commit 规范、自检清单 | ✅ Conventional Commits + 自检表      |
| **AGENTS.md / copilot instructions** | 给 Agent / 新人 → 上手即写      | ✅ 已含 11 节 + FAQ                   |
| **Lockfile 提交**                    | lockfile 必须入库               | ✅ `pnpm-lock.yaml` 已存              |
| **供应链策略**                       | 不引入过新/可疑包               | ✅ `minimumReleaseAge: 10080`（7 天） |
| **TypeScript strict**                | strict + no implicit any        | ✅ `strict: true` + 类型 0 错         |
| **设计令牌单一来源**                 | CSS 变量，禁硬编码              | ✅ 全部迁移至 `var(--color-*)`        |
| **包管理器一致性**                   | 锁定单一包管理器                | ✅ pnpm workspace                     |
| **License / Attribution**            | 第三方署名                      | ✅ `ATTRIBUTIONS.md`                  |
| **测试**                             | 至少一个 test runner            | ❌ 暂无（见 §7 后续计划）             |
| **CI**                               | 自动化构建/类型检查             | ❌ 暂无（见 §7 后续计划）             |

---

## 6. 未做的事情 / 显式放弃（Out of Scope）

依据 "Don't fix unrelated bugs or broken tests (not your responsibility)" 与 "Don't change filenames or variables unnecessarily" 原则，本次**未做**：

- 未删除 `src/app/dashboard/` 下的 `DashboardPage` 及其子组件。它们当前未挂到路由（dead code），但可能是后续 12 页规划中的备选实现；是否清理请产品决策。
- 未对 Bundle 体积（904 kB）做 code‑splitting 优化。
- 未引入 ESLint / Prettier / Vitest / Playwright。
- 未替换 `WorkflowContext` 中模拟的 WebSocket。
- 未升级 `recharts@2` 到 `recharts@3`（pnpm 提示 deprecated，但升级属于 breaking change，需单独立项）。
- 未触碰 `docs/YYC3-AI-Dev/`（属于另一个相关项目 monorepo）。

---

## 7. 后续阶段建议（Phase 6+ · Forward Plan）

> 给下一轮迭代参考的路线图，按优先级排序。每项含**预期**与**结果**口径。

### Phase 6 · 工程化补齐（建议下个迭代）

| 任务                   | 预期                                 | 结果（验收）          |
| ---------------------- | ------------------------------------ | --------------------- |
| 引入 Vitest            | 关键 store / reducer 单测 ≥ 80% 覆盖 | `pnpm test` 绿        |
| 引入 ESLint + Prettier | 与 TypeScript strict 协同的规则集    | `pnpm lint` 0 错      |
| GitHub Actions CI      | PR 触发 `tsc + build + lint + test`  | main 分支不可破坏     |
| Bundle code‑splitting  | 路由级 `React.lazy` + manualChunks   | 首屏 JS < 300 kB gzip |

### Phase 7 · 功能补全（依据设计规范）

| 任务                  | 预期                                                    | 结果（验收）                 |
| --------------------- | ------------------------------------------------------- | ---------------------------- |
| 接入真实后端          | `WorkflowContext` 用真 WebSocket 替换 mock              | edict 状态在多客户端实时同步 |
| 完成 P4‑P12 页面      | 三省详情 / 六部详情 / 竹箴 / 藏经阁 / 工部作坊 / 双星桥 | 12 页全部可点击闭环          |
| 圣旨流转 28 状态      | 7 阶段 × 4 态全覆盖                                     | 每个状态都有视觉差异         |
| 暗色 / 古风双主题切换 | `next-themes` 已装，需 wire up                          | 顶部一键切主题               |

### Phase 8 · 文化准确性 & 设计交付

| 任务            | 预期                                              | 结果（验收）                |
| --------------- | ------------------------------------------------- | --------------------------- |
| 官制 / 礼制审校 | 由 `docs/02-YYC3-古都文化-官制体系/` 专家复核文案 | 0 处与隋唐正史冲突          |
| 18 枚勋章 SVG   | 含 6 级稀有度视觉                                 | 全部入库                    |
| Figma 同步      | 设计稿与代码令牌 1:1                              | design‑tokens.json 单测校验 |

---

## 8. 改动清单（Changelog of this session）

```
新增:
  + README.md
  + CONTRIBUTING.md
  + src/vite-env.d.ts

更新:
  * package.json
      - @esbuild/darwin-arm64: ^0.28.1 → 0.25.12
      - @rollup/rollup-darwin-arm64: ^4.62.2 → 4.62.2
      + @tailwindcss/oxide-darwin-arm64: 4.1.12 (新增)
      + @types/react: 18.3.1 (新增)
      + @types/react-dom: 18.3.1 (新增)
      + lightningcss-darwin-arm64: 1.30.1 (新增)
  * pnpm-workspace.yaml
      + overrides.@types/react: 18.3.1
      + overrides.@types/react-dom: 18.3.1
  * tsconfig.json
      + ignoreDeprecations: "6.0"
  * tsconfig.node.json
      + composite: true
      + ignoreDeprecations: "6.0"
      - noEmit: true
  * src/app/components/ui/NodeCard.tsx       (cn 导入 + 令牌)
  * src/app/components/ui/TokenButton.tsx    (cn 导入 + 令牌)
  * src/app/dashboard/CentralAxis.tsx        (Badge 大小写 + variant + 令牌)
  * src/app/dashboard/LeftSidebar.tsx        (Badge 大小写 + variant + 令牌)
  * src/app/dashboard/RightSidebar.tsx       (令牌)
  * src/app/dashboard/EdictModal.tsx         (Badge 大小写 + 令牌)
  * src/app/dashboard/DashboardPage.tsx      (令牌)
  * src/app/pages/CourtHall.tsx              (useNavigate)
  * src/app/pages/EdictBoard.tsx             (FishTokenIcon title)
  * AGENTS.md                                 (新增 7.3‑7.11 + FAQ 重写)
```

---

**生成时间**: 2026‑07‑12  
**生成者**: Crush (GLM‑5.2)  
**复核状态**: 待团队成员评审  
**下一步**: 由 maintainer 决定是否进入 Phase 6（工程化补齐）或 Phase 7（功能补全）。
