# 贡献规范 / Contributing to YYC³ Dynasty

感谢参与 YYC³ Dynasty 项目！本文档定义代码与文档的提交约定。先读完再动手。

---

## 1. 分支与提交

### 分支命名

```
<type>/<short-scope>-<short-desc>
```

- `type`：`feat` / `fix` / `refactor` / `docs` / `style` / `chore` / `perf` / `test`
- 示例：`feat/edict-kanban-dnd`、`fix/imperial-token-mapping`、`docs/agents-md`

### Commit Message

遵循 **Conventional Commits**：

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

- `type` 同上。
- `scope` 可选，例如 `edict`、`workflow`、`ui`、`theme`、`deps`。
- `subject` 祈使句、不超过 50 字符，**不要**以句号结尾。
- 中文/英文均可，但一条 commit 内请保持语言一致。

示例：

```
feat(edict): 圣旨看板支持拖拽流转
fix(deps): 钉版 @esbuild/darwin-arm64 与 esbuild 0.25.12 对齐
refactor(ui): 将 imperial-* 类名替换为 var(--color-accent-*) 令牌
docs: 新增 AGENTS.md 与 CONTRIBUTING.md
```

### 不要做的事

- 不要直接推 `main` / `master`，请走 PR / MR。
- 不要在一条 commit 里混跨多个无关改动。
- 不要修改 `pnpm-lock.yaml` 之外的去向（即不要手改 `node_modules`）。
- 不要"顺手"升级依赖版本（项目通过 `minimumReleaseAge: 10080` 控制供应链稳定性）。

---

## 2. 开发流程

```bash
# 1. 拉取最新
git checkout main && git pull

# 2. 新建分支
git checkout -b feat/my-feature

# 3. 安装依赖（如已装可跳过）
pnpm install

# 4. 开发，定期自检
pnpm dev      # 启动开发服务器（http://localhost:3133）
pnpm format   # Prettier 自动格式化 + Tailwind class 排序

# 5. 提交前跑一遍与 CI 完全相同的 5 步检查
pnpm typecheck && pnpm lint && pnpm format:check && pnpm madge && pnpm build

# 6. 提交
git add <files>
git commit -m "feat(scope): subject"

# 7. 推送 + 发起 PR（CI 会自动跑同一套检查）
git push -u origin feat/my-feature
```

### 提交前自检清单

> 这套检查与 `.github/workflows/ci.yml` 完全一致；CI 跑的就是下面 5 条。
> 任何一项失败都会阻塞 PR 合入。

- [ ] `pnpm typecheck` 0 报错（`tsc --noEmit`）
- [ ] `pnpm lint` 0 错 0 警（ESLint）
- [ ] `pnpm format:check` 全部合规（Prettier；写入用 `pnpm format`）
- [ ] `pnpm madge` 无循环依赖
- [ ] `pnpm build` 成功（Vite 生产构建）
- [ ] `pnpm dev` 启动后手动跑过受影响路由（含 `/dashboard` 全屏看板）
- [ ] 新增样式使用 `var(--color-*)` 令牌，未硬编码 hex，未使用 `imperial-*`
- [ ] 新增 UI 文案使用 zh‑CN（与现有页面一致）
- [ ] 未引入新的第三方依赖；如必须，已在 PR 描述中说明理由
- [ ] 未删除 `vite.config.ts` 中的 `react()` 或 `tailwindcss()` 插件
- [ ] 未修改 `package.json#name`（`@figma/my-make-file` 为 Figma Make 约定）
- [ ] 未修改 `pnpm-lock.yaml` 后忘记提交（CI 使用 `--frozen-lockfile`，二者必须同步）

---

## 3. 代码规范

### 3.1 TypeScript

- `strict: true`。新代码不允许 `any`；ESLint `@typescript-eslint/no-explicit-any` 为 warn 级别。
- 公共类型 / 接口写在使用它的文件顶部，或同目录 `types.ts`。
- 优先 `type` 联合类型，避免 `enum`（包体积更大，且与 isolatedModules 兼容性更好）。

### 3.2 React

- 函数组件 + Hooks。**不要**新增 class 组件。
- 文件级 `export function ComponentName() {}` 优先于默认导出。
- 状态：局部用 `useState`，跨页/跨组件用 `useWorkflow()`；如需新全局状态，扩展 `WorkflowContext.tsx`，**不要**引入 Redux / Zustand。
- 副作用：`useEffect` 必须显式声明依赖数组；定时器、订阅、WebSocket 在 cleanup 中释放。

### 3.3 命名

| 类型           | 规则                                 | 示例                                            |
| -------------- | ------------------------------------ | ----------------------------------------------- |
| 路由页面       | PascalCase 文件 + named export       | `CourtHall.tsx` → `export function CourtHall()` |
| 业务组件       | PascalCase 文件 + named export       | `ImperialEdict.tsx`                             |
| shadcn/ui 原语 | **小写**文件名（保持 vendored 风格） | `button.tsx` / `badge.tsx`                      |
| Hook           | `use` 前缀 + camelCase               | `useWorkflow`                                   |
| 常量           | 全大写 + 下划线                      | `const EDICT_STATUSES = [...]`                  |
| CSS 变量       | `--color-*` / `--font-*`             | `--color-accent-gold`                           |
| 工具函数       | camelCase                            | `formatEdictId()`                               |

### 3.4 样式

- 全部用 Tailwind 工具类，**不**写 CSS 模块。
- 颜色：`bg-[var(--color-bg-secondary)]`、`text-[var(--color-accent-gold)]`、`shadow-[0_0_30px_rgba(...)]`。
- 阴影、圆角等任意值用 `[...]` 语法。
- **禁止**：
  - 硬编码十六进制色值（`bg-[#d4a843]` ❌ → `bg-[var(--color-accent-gold)]` ✅）
  - 使用已下线的 `imperial-*` 类名（如 `text-imperial-gold`）
  - 在 `vite.config.ts#assetsInclude` 中加入 `.css` / `.tsx` / `.ts`

### 3.5 文件头注释（可选）

项目里 `src/main.tsx` 使用了结构化文件头 docstring。新增**入口级**或**核心模块**文件时可参照；普通组件无需添加，避免噪音。

### 3.6 格式化（Prettier）

- 配置：`.prettierrc.json`（100 列宽、单引号、尾逗号、`prettier-plugin-tailwindcss`）。
- 写入：`pnpm format`；CI 校验：`pnpm format:check`。
- Tailwind class 在 `cn()` / `cva()` / `clsx()` / `twMerge()` 调用中**自动按官方推荐顺序排序**，无需手动维护。
- **不要**手写 Prettier 会重排的格式（如多行对象缩进、JSX 属性顺序）——交给工具。
- 排除范围（`.prettierignore`）：`docs/`、`src/imports/`、`dist/`、`pnpm-lock.yaml`、vendored shadcn 文件（`src/app/components/ui/[a-z]*.tsx`，保持与 `npx shadcn add` 上游对齐）。

---

## 4. 文档规范

- 中文为主、技术术语保留英文（如 `useReducer`、`WebSocket`、`Provider`）。
- Markdown 标题层级从 `#`（h1）开始，每级递进。
- 表格优先于长列表展示结构化对照。
- 代码块标注语言（`bash / `tsx / ```yaml）。
- 在 `docs/` 下新增材料时按现有编号目录组织（`00-团队通用` / `01-洛阳史考` / …）。

---

## 5. PR 描述模板

```markdown
## 背景 / Why

<为什么做这个改动？关联 issue / 设计稿>

## 改动 / What

- <要点 1>
- <要点 2>

## 验证 / How Tested

- [ ] `npx tsc --noEmit` 0 报错
- [ ] `pnpm build` 成功
- [ ] 手动验证：<路由 / 交互>

## 影响范围 / Impact

- <文件 / 模块 / 行为变更>

## 截图 / 录屏（如涉及 UI）
```

---

## 6. 评审标准 / Review Checklist

评审人请关注：

1. **令牌合规**：是否使用 `var(--color-*)`，是否未引入新的 `imperial-*`。
2. **类型安全**：`any` 是否必要？边界（null / undefined）是否处理？
3. **状态隔离**：是否在不必要处提升状态到全局？
4. **可访问性**：图标按钮是否有 `aria-label` / `title`？色盲模式下信息是否仍可读？
5. **文化准确性**：UI 文案涉及的官制 / 礼制是否符合隋唐规制？（参考 `docs/02-YYC3-古都文化-官制体系/`）
6. **依赖治理**：是否引入了 `minimumReleaseAge` 之外的"新鲜"包？

---

## 7. 行为准则

- 尊重每一位贡献者，无论技术背景。
- 评审对事不对人；提出问题时附带建设性建议。
- 涉及文化、历史解读的讨论，以隋唐正史为准，避免凭空杜撰。
- 项目维护者保留拒绝不符合设计规范或文化准确性 PR 的权利。
