<p align="center">
  <img src="public/yyc3-Family.png" alt="YYC³ Family · 三省六部 Dynasty Banner" width="100%" />
</p>

<h1 align="center">YYC³ Dynasty · Design Delivery</h1>

<p align="center">
  <em>三省以治 · 六部以行</em><br />
  A multi‑agent workflow dashboard that overlays a Tang‑dynasty governance model
  (三省六部) onto the Luoyang 紫微城 central axis.
</p>

<p align="center">
  <a href="https://dynasty.yyc3.top">🌐 Live Demo</a> ·
  <a href="docs/YYC3-Dynasty-Guidelines.md">📋 设计规范</a> ·
  <a href="AGENTS.md">🤖 Agent Guide</a>
</p>

[![build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![typescript](https://img.shields.io/badge/TypeScript-5.x-blue)]()
[![vite](https://img.shields.io/badge/Vite-6.3.5-646cff)]()
[![react](https://img.shields.io/badge/React-18.3.1-61dafb)]()
[![tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)]()

---

## 项目简介 / What is this?

YYC³ Dynasty 是 **YYC³ Cloud Intelli‑Matrix** 体系下的多智能体协同看板，把现代 AI Agent 工作流映射到唐代「**中书出令、门下审议、尚书执行**」三省六部治理体系，并以隋唐洛阳紫微城南北中轴线（天堂 → 明堂 → 应天门 → 天津桥 → 定鼎门）作为空间骨架。

四类古物 —— **玉玺**（最高权限）、**圣旨**（消息协议）、**竹箴**（规则知识库）、**鱼符**（执行凭证）—— 分别承担系统的权限、消息、规则、凭证四大底层能力。

详见 [`docs/YYC3-Dynasty-项目文化-自述文档.md`](docs/YYC3-Dynasty-项目文化-自述文档.md)。

---

## 技术栈 / Tech Stack

| 领域     | 选型                                                   | 版本                                 |
| -------- | ------------------------------------------------------ | ------------------------------------ |
| 构建     | Vite                                                   | 6.3.5                                |
| 框架     | React + TypeScript (strict)                            | 18.3.1                               |
| 路由     | react-router                                           | 7.x                                  |
| 样式     | Tailwind CSS（CSS‑first `@theme`，无 config 文件）     | 4.1.12                               |
| 组件库   | shadcn/ui (Radix UI primitives)                        | vendored in `src/app/components/ui/` |
| 动效     | `motion` (前 framer‑motion)                            | 12.x                                 |
| 拖拽     | react-dnd + HTML5Backend                               | 16.x                                 |
| 图表     | recharts                                               | 2.15.2                               |
| 图标     | lucide-react                                           | 0.487.0                              |
| 包管理   | pnpm（workspace, lockfile, overrides）                 | 11.x                                 |
| 目标平台 | 现代 Chromium / Firefox / Safari；Linux x64/arm64 部署 | —                                    |

---

## 快速开始 / Quick Start

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（http://localhost:3133）
pnpm dev

# 3. 生产构建
pnpm build

# 4. 本地预览生产包
pnpm preview

# 5. Prettier 自动格式化 + Tailwind class 排序
pnpm format

# 6. 与 CI 完全相同的本地 5 步检查（PR 推送前必跑）
pnpm typecheck && pnpm lint && pnpm format:check && pnpm madge && pnpm build
```

> ⚠️ **macOS 用户**：`pnpm-workspace.yaml` 的 `supportedArchitectures` 仅声明了 Linux
> （部署目标）。在本机开发时，原生二进制（`@esbuild/darwin-arm64`、
> `lightningcss-darwin-arm64`、`@tailwindcss/oxide-darwin-arm64`、
> `@rollup/rollup-darwin-arm64`）已经在 `package.json#devDependencies` 中显式钉版，
> 请勿移除。

---

## 目录结构 / Layout

```
.
├── index.html                # Vite 入口（预加载 Noto Serif SC + Inter）
├── package.json              # name: @figma/my-make-file（Figma Make 约定，请勿改名）
├── pnpm-workspace.yaml       # 单包 workspace + 原生二进制 / overrides
├── tsconfig.json             # strict + paths "@/*" → "./src/*"
├── tsconfig.node.json        # composite，供 vite.config.ts 引用
├── vite.config.ts            # react + tailwind 插件（均不可移除）
├── AGENTS.md                 # 给 Agent / 新人的工作指南
├── CONTRIBUTING.md           # 贡献规范
├── AUDIT.md                  # 代码质量审计报告
├── STAGE_PLAN.md             # 阶段规划与执行报告
├── README.md                 # 本文件
├── eslint.config.js          # ESLint flat config（与 Prettier 协同）
├── .prettierrc.json          # Prettier + tailwind class 排序
├── .github/workflows/ci.yml  # PR 必须通过的 CI 流水线
├── docs/                     # 设计与文渊阁（zh‑CN 参考材料，只读）
└── src/
    ├── main.tsx              # ReactDOM 入口
    ├── vite-env.d.ts         # Vite 客户端类型声明
    ├── imports/              # 从 Figma 粘贴的设计规范（只读参考）
    ├── styles/               # 全局样式（fonts / tailwind / theme tokens）
    └── app/
        ├── App.tsx           # <RouterProvider router={router} />
        ├── routes.tsx        # createBrowserRouter — 所有路由
        ├── pages/            # 路由级页面（每页一个组件）
        ├── dashboard/        # 全屏命令中心（挂载于 /dashboard）
        ├── components/
        │   ├── Root.tsx      # 布局壳：Provider + Nav + Outlet + AIAssistantHub
        │   ├── Navigation.tsx
        │   ├── AIAssistantHub.tsx
        │   ├── figma/ImageWithFallback.tsx
        │   └── ui/           # shadcn/ui（小写文件）+ YYC³ 业务组件（PascalCase）
        └── store/
            └── WorkflowContext.tsx   # 全局状态：useReducer + Context（edicts / history / ws）
```

完整说明见 [`AGENTS.md`](AGENTS.md) § 3。

---

## 路由表 / Routes

| 路径                                                                        | 组件              | 说明                                            |
| --------------------------------------------------------------------------- | ----------------- | ----------------------------------------------- |
| `/`                                                                         | `WelcomePage`     | 启动 / 角色选择（隐藏导航）                     |
| `/court`                                                                    | `CourtHall`       | 中央轴线全景                                    |
| `/edict`, `/edict/:id`                                                      | `EdictBoard`      | 圣旨看板（7 阶段 DnD）                          |
| `/archive`                                                                  | `ArchiveBoard`    | 已办结奏折 + 流转史                             |
| `/timeline`                                                                 | `TimelinePage`    | 十三王朝 × 技能库                               |
| `/monitor`                                                                  | `TaishiMonitor`   | 太史监候（recharts）                            |
| `/dashboard`                                                                | `DashboardPage`   | **全屏命令中心**（独立 header，不经 Root 布局） |
| `/honors`, `/skills`, `/workflow`, `/bridge`, `/hr`, `/department/:id`, `*` | `PlaceholderPage` | 建设中占位                                      |

---

## 设计令牌 / Design Tokens

完整定义在 `src/styles/theme.css` 的 `@theme { ... }` 块。新增样式请使用 CSS 变量
（例如 `bg-[var(--color-accent-gold)]`），**不要硬编码十六进制色值**，也**不要使用
历史遗留的 `imperial-*` 类名**（已下线）。

| Token                       | 值        | 文化对应                      |
| --------------------------- | --------- | ----------------------------- |
| `--color-bg-primary`        | `#0a0e17` | 紫微深紫（页面底色）          |
| `--color-bg-secondary`      | `#1a1f2e` | 面板底色                      |
| `--color-text-primary`      | `#e5e7eb` | 纸白（正文）                  |
| `--color-text-secondary`    | `#9ca3af` | 次级灰                        |
| `--color-accent-gold`       | `#d4a843` | 鎏金（主强调色，皇帝 / 生效） |
| `--color-accent-vermillion` | `#c2414b` | 朱红（玉玺 / 警示 / 封驳）    |
| `--color-accent-emerald`    | `#10b981` | 准奏 / 成功                   |
| `--color-accent-azure`      | `#3b82f6` | 信息 / 链路                   |
| `--color-accent-amber`      | `#f59e0b` | 待审议                        |
| `--color-accent-purple`     | `#8b5cf6` | 高亮                          |

字体：`--font-serif`（思源宋体，标题）/ `--font-sans`（Inter，正文）/ `--font-mono`（JetBrains Mono，数据）。

---

## 全局状态 / State

唯一的 store 是 `src/app/store/WorkflowContext.tsx`：

- Provider：`<WorkflowProvider>`（在 `Root.tsx` 中包裹整个 App）
- Hook：`const { state, dispatch } = useWorkflow()`
- State 形状：`{ edicts: Edict[]; history: HistoryLog[]; isConnected: boolean }`
- Action：`CREATE_EDICT | UPDATE_EDICT_STATUS | SEAL_EDICT | SET_CONNECTION | SYNC_FROM_SERVER`

> WebSocket 当前为**模拟实现**（`setTimeout` / `setInterval`）。生产化时需要替换
> `WorkflowContext.tsx` 中被注释的 `new WebSocket(...)` 与 `ws.onmessage` 钩子。

圣旨流转的 7 阶段（`EdictStatus`，**不要乱序**）：

```
待承旨 → 待草拟 → 待审议 → 待派发 → 执行中 → 待回奏 → 已办结
```

---

## 贡献 / Contributing

请先阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 和 [`AGENTS.md`](AGENTS.md)。

关键约定速览：

- **shadcn/ui 组件**（`src/app/components/ui/` 下小写文件名）保持 vendored 风格，不要改名。
- **YYC³ 业务组件**（`NodeCard`、`TokenButton`、`ImperialEdict`、`ImperialSeal`、`Icons`）使用 PascalCase 文件名 + named export。
- 所有新样式使用 `var(--color-*)` 令牌；**禁止**复用已下线的 `imperial-*` 类名。
- 中文 UI 文案请使用与现有页面一致的 zh‑CN（古风/正式体）。
- 提交前请确保：
  ```bash
  npx tsc --noEmit -p tsconfig.json   # 0 errors
  pnpm build                          # success
  ```

---

## 相关文档 / Related Docs

- [`AGENTS.md`](AGENTS.md) — 给 AI Agent / 新成员的完整工作手册
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — 贡献流程与规范
- [`docs/YYC3-Dynasty-Guidelines.md`](docs/YYC3-Dynasty-Guidelines.md) — 主设计规范（~180 KB，权威）
- [`docs/YYC3-Dynasty-项目文化-自述文档.md`](docs/YYC3-Dynasty-项目文化-自述文档.md) — 项目文化自述
- [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) — 第三方组件署名（shadcn/ui MIT、Unsplash）

---

## License & Attribution

- 设计源文件来自 **Figma Make** 导出；包名 `@figma/my-make-file` 为约定，请勿修改。
- 内含 [shadcn/ui](https://ui.shadcn.com/) 组件（MIT License）。
- 部分图片素材来自 [Unsplash](https://unsplash.com)。
- 项目业务代码版权归 **YanYuCloudCube Team `<admin@0379.email>`** 所有。
