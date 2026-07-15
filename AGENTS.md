# AGENTS.md

Guidance for AI agents (and humans) working in the **YYC³ Dynasty Design Delivery** repository. Only documents what is actually present in the codebase.

---

## 1. Project at a Glance

- **Name**: `@figma/my-make-file` (internal `package.json` name — preserved from Figma Make export; do **not** rename).
- **Product**: **YYC³ Dynasty** — a multi‑agent dashboard UI that maps an AI workflow onto the Tang‑dynasty **三省六部 (Three Departments, Six Ministries)** governance system, using the Luoyang 紫微城 central axis as its spatial metaphor.
- **Origin**: Exported from Figma Make; UI text is almost entirely Simplified Chinese.
- **All UI copy is Chinese** — when adding visible strings, write them in zh‑CN to match the existing tone (formal/古风).

### Tech stack

- **Vite 6.3.5** + **React 18.3.1** + **TypeScript** (strict, `target: ES2020`)
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.js` — config is CSS‑first via `@theme`)
- **shadcn/ui** component library (Radix UI primitives) in `src/app/components/ui/`
- **`motion`** (formerly `framer-motion`) — imported as `motion/react`
- **React Router v7** (`react-router`, not `react-router-dom`)
- **react-dnd** + **HTML5Backend** for drag‑and‑drop (EdictBoard kanban)
- **recharts** for charts (TaishiMonitor)
- **lucide-react** for icons
- **pnpm** workspaces (single package `.`)
- No test runner, no linter, no formatter configured.

---

## 2. Essential Commands

```bash
pnpm install      # install deps (react/react-dom are peer deps — ensure they resolve)
pnpm dev          # vite dev server on http://localhost:3133 (host mode)
pnpm build        # production build to dist/
pnpm preview      # preview built dist/

# Quality gates (mirrors CI — see .github/workflows/ci.yml)
pnpm typecheck    # tsc --noEmit, must be 0 errors
pnpm lint         # eslint ., must be 0 errors / 0 warnings
pnpm format       # prettier --write (auto-fix)
pnpm format:check # prettier --check (CI mode, no writes)
pnpm madge        # circular-dependency scan, must report none
```

There is **no `test` script** yet. To validate changes locally, run the same
sequence CI does:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm madge && pnpm build
```

Then `pnpm dev` and manually exercise the affected routes (including
`/dashboard` for the fullscreen command-center).

### pnpm workspace constraints (`pnpm-workspace.yaml`)

- `minimumReleaseAge: 10080` (7 days) — newly published packages are refused.
- `allowBuilds` denies `@tailwindcss/oxide` and `esbuild` (they ship prebuilt binaries).
- `supportedArchitectures`: **Linux x64 / arm64 / glibc only**. If you're on macOS/apple‑silicon, native optional deps may need the explicit `@esbuild/darwin-arm64` / `@rollup/rollup-darwin-arm64` devDeps that are already pinned in `package.json` — don't remove them.

---

## 3. Directory Layout

```
.
├── index.html                # Vite entry, loads Google Fonts (Inter + Noto Serif SC)
├── package.json              # name: @figma/my-make-file
├── pnpm-workspace.yaml
├── tsconfig.json             # strict, paths "@/*" → "./src/*"
├── tsconfig.node.json
├── vite.config.ts            # react + tailwind plugins; alias @; assetsInclude .svg/.csv
├── default_shadcn_theme.css  # unused at runtime; reference shadcn defaults
├── ATTRIBUTIONS.md           # shadcn/ui (MIT), Unsplash
├── src/
│   ├── main.tsx              # ReactDOM entry (has file-header docstring — see §6)
│   ├── i18n/                 # @yyc3/i18n-core engine + project translation maps
│   │   ├── index.ts          # singleton I18nEngine + t()/setLocale() helpers
│   │   └── locales/
│   │       ├── zh-CN.ts      # Dynasty-specific Chinese strings
│   │       └── en.ts         # English translations
│   ├── imports/              # pasted design specs / tokens (read-only reference)
│   │   ├── YYC3-Dynasty_Figma_Design_Prompt.md   # condensed design prompts
│   │   └── pasted_text/                          # design-tokens.json, design parts
│   ├── styles/
│   │   ├── index.css         # @import fonts/tailwind/theme (entry)
│   │   ├── fonts.css         # Google Fonts @import
│   │   ├── tailwind.css      # @import 'tailwindcss' + @source '../**/*.{js,ts,jsx,tsx}'
│   │   ├── theme.css         # @theme design tokens (SEE §5)
│   │   └── globals.css       # empty
│   └── app/
│       ├── App.tsx           # <RouterProvider router={router} />
│       ├── routes.tsx        # createBrowserRouter — all routes
│       ├── pages/            # one component per route
│       ├── dashboard/        # fullscreen command-center (CentralAxis/LeftSidebar/RightSidebar/EdictModal)
│       ├── components/
│       │   ├── Root.tsx      # layout shell: I18nProvider + WorkflowProvider + DndProvider + Nav + Outlet + AIAssistantHub
│       │   ├── Navigation.tsx
│       │   ├── AIAssistantHub.tsx
│       │   ├── figma/ImageWithFallback.tsx
│       │   └── ui/           # shadcn/ui (lowercase files) + custom YYC³ components (PascalCase)
│       └── store/
│           └── WorkflowContext.tsx   # global state: useReducer + Context (edicts, history, ws status)
└── docs/                     # design & cultural reference (Chinese) — see §9
```

---

## 4. Application Architecture

### Entry → Router → Pages

- `src/main.tsx` → renders `<App />` inside `React.StrictMode`.
- `App.tsx` → `RouterProvider` with `createBrowserRouter` from `routes.tsx`.
- `routes.tsx` defines a single `Root` parent with children:
  | Path                                                                        | Component         | Notes                                                                              |
  | --------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
  | `/`                                                                         | `WelcomePage`     | Hero / role picker; nav hidden here                                                |
  | `/court`                                                                    | `CourtHall`       | Vertical Luoyang central-axis overview                                             |
  | `/edict`, `/edict/:id`                                                      | `EdictBoard`      | DnD kanban of edicts across 7 stages                                               |
  | `/archive`                                                                  | `ArchiveBoard`    | Completed edicts + history per edict                                               |
  | `/timeline`                                                                 | `TimelinePage`    | 13 dynasties × skills browser                                                      |
  | `/monitor`                                                                  | `TaishiMonitor`   | recharts dashboards (line + radar)                                                 |
  | `/dashboard`                                                                | `DashboardPage`   | **Standalone fullscreen command center** (own header; not under `Root`) — see §4.1 |
  | `/honors`, `/skills`, `/workflow`, `/bridge`, `/hr`, `/department/:id`, `*` | `PlaceholderPage` | "Under construction" stand-in                                                      |

### Layout shell (`Root.tsx`)

```
WorkflowProvider  (Context + useReducer, mock WebSocket)
  └ DndProvider (HTML5Backend)
     └ div.min-h-screen (theme tokens)
        ├ Navigation     (hidden on "/" and "/dashboard")
        ├ main > Outlet
        └ AIAssistantHub (floating ✨ button → expandable chat panel)
```

New top-level pages should be added as children of `Root` in `routes.tsx`.

#### Fullscreen dashboard shell (`/dashboard`)

`DashboardPage` (in `src/app/dashboard/`) is mounted as a **sibling** of `Root`
(not a child) because it ships its own 64px header and does not reuse
`<Navigation>`. It wraps its own `WorkflowProvider + DndProvider` internally so
context is independent from the main app shell. Discoverability: the right side
of `<Navigation>` has a `Maximize2` icon link pointing at `/dashboard`. The
dashboard's own header contains nav buttons (旨意工坊 / 奏折阁 / 太史监 / …) plus
a "返回朝堂" link in the footer to return to the embedded `/court` view.

### State (`WorkflowContext.tsx`)

- Single `WorkflowProvider` exposes `{ state, dispatch }` via `useWorkflow()` hook.
- State shape: `{ edicts: Edict[], history: HistoryLog[], isConnected: boolean }`.
- Action union: `CREATE_EDICT | UPDATE_EDICT_STATUS | SEAL_EDICT | SET_CONNECTION | SYNC_FROM_SERVER`.
- `Edict.type` is `'制书' | '敕书' | '敕牒'`; `EdictStatus` is `'待承旨' | '待草拟' | '待审议' | '待派发' | '执行中' | '待回奏' | '已办结'` — these 7 statuses are the canonical workflow stages (see domain glossary §8).
- WebSocket is **mocked** (`setTimeout`/`setInterval`); there is no real backend. Treat `isConnected` and the "server push" interval as placeholders.

### Internationalization (`@yyc3/i18n-core` + `@yyc3/i18n-react`)

The project uses YYC³'s self-developed i18n framework for all user-facing strings.

**Architecture:**

```
src/i18n/
├── index.ts              # Singleton I18nEngine + t()/setLocale()/getLocale() helpers
└── locales/
    ├── zh-CN.ts          # Dynasty-specific Chinese translations
    └── en.ts             # English translations
```

**Provider chain:**

- `Root.tsx` wraps the main app shell in `<I18nProvider engine={i18nEngine}>`
- `DashboardPage.tsx` wraps its own `<I18nProvider>` (since it's a sibling route, not under `Root`)
- Both use the **same singleton** `i18nEngine` from `@/i18n`, so locale state is shared

**Usage in components:**

```tsx
import { useTranslation } from '@yyc3/i18n-react';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();
  return <h1>{t('app.tagline')}</h1>; // "三省六部 · 敕令" or "Three Departments · Six Ministries"
}
```

**Usage outside React** (e.g. in `WorkflowContext` reducers):

```ts
import { t } from '@/i18n';
console.log(t('common.loading'));
```

**Key conventions:**

- Translation keys follow `<namespace>.<area>.<element>` (e.g. `nav.court`, `edict.boardTitle`, `placeholder.honors`).
- The engine persists locale choice to `localStorage` key `yyc3.i18n.locale` — user choice survives reloads.
- Available locales are defined in `AVAILABLE_LOCALES` (currently `zh-CN` and `en`).
- The language switcher lives in `Navigation.tsx` (Globe icon dropdown, right side).
- **Adding a new UI string**: add the key to BOTH `src/i18n/locales/zh-CN.ts` AND `src/i18n/locales/en.ts`, then use `t('key')` in the component.
- **Cultural names** (三省六部, 天堂, etc.) are kept as-is in Chinese; the English translations preserve the metaphor (e.g. "Edict" not "Task Order", "Secretariat" not "Drafting Department").

**Vite + Node polyfills:**
`@yyc3/i18n-core`'s main entry bundles Node.js builtins (`crypto`, `path`, `fs`, `timers/promises`) for its server-side modules (AI providers, MCP server, security utils). The `vite-plugin-node-polyfills` plugin in `vite.config.ts` shims these for the browser so the client-side i18n engine works without pulling in a Node runtime.

**Dependencies:**

- `@yyc3/i18n-core` — linked via `file:../YYC3-i18n-Core`
- `@yyc3/i18n-react` — linked via `file:../YYC3-i18n-Core/packages/i18n-react`

Both are local workspace links; when the upstream packages are published to npm, switch to versioned ranges.

---

## 5. Design Tokens (Tailwind v4 `@theme`)

Defined in `src/styles/theme.css`. **Use the CSS variables** in arbitrary values, e.g. `bg-[var(--color-accent-gold)]`, `text-[var(--color-text-secondary)]`. Do not hardcode hex equivalents that duplicate these tokens.

| Token                       | Value                                        | Cultural meaning                                 |
| --------------------------- | -------------------------------------------- | ------------------------------------------------ |
| `--color-bg-primary`        | `#0a0e17`                                    | 紫微深紫 (page bg)                               |
| `--color-bg-secondary`      | `#1a1f2e`                                    | Panel bg                                         |
| `--color-bg-tertiary`       | `#242b3d`                                    | Recessed bg                                      |
| `--color-text-primary`      | `#e5e7eb`                                    | 纸白 (primary text)                              |
| `--color-text-secondary`    | `#9ca3af`                                    | Subdued text                                     |
| `--color-accent-gold`       | `#d4a843`                                    | 鎏金 (primary accent, emperor, success emphasis) |
| `--color-accent-vermillion` | `#c2414b`                                    | 朱红 (seals, warnings, 封驳)                     |
| `--color-accent-azure`      | `#3b82f6`                                    | Info                                             |
| `--color-accent-amber`      | `#f59e0b`                                    | Pending                                          |
| `--color-accent-emerald`    | `#10b981`                                    | Success                                          |
| `--color-accent-purple`     | `#8b5cf6`                                    | Highlight                                        |
| `--font-serif`              | `'Noto Serif SC', 方正古隶, 思源宋体, serif` | Headings, titles                                 |
| `--font-sans`               | `'Inter', 'SF Pro', sans-serif`              | Body                                             |
| `--font-mono`               | `'SF Mono', 'JetBrains Mono', monospace`     | Numbers, IDs, logs                               |

Helper classes also in `theme.css`: `.writing-vertical-rl`, `.hide-scrollbar`.

Legacy aliases (`--color-ziwei`, `--color-gold`, `--color-cinnabar`, etc.) are kept "to prevent breaking" — prefer the canonical `--color-accent-*` names for new code.

---

## 6. Conventions & Style

### Component naming

- **Route pages & custom YYC³ components**: PascalCase filenames + named exports.
  - e.g. `CourtHall.tsx` → `export function CourtHall()`, `ImperialEdict.tsx`, `NodeCard.tsx`.
- **shadcn/ui primitives** in `src/app/components/ui/`: **lowercase** filenames, PascalCase exports.
  - e.g. `button.tsx` → `export { Button, buttonVariants }`, `badge.tsx`, `dialog.tsx`.
  - Don't rename lowercase shadcn files — keeps `npx shadcn add` compatible.

### Imports / paths

- Alias `@/*` → `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).
- Intra-`ui/` imports use relative paths (`./utils`, `./Badge`).
- Pages import via relative paths (`../store/WorkflowContext`, `../components/ui/...`).

### File-header docstring (used in `src/main.tsx`)

When adding new top-level files, prefer the existing header style:

```
/**
 * @file main.tsx
 * @description ...
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created YYYY-MM-DD
 * @updated YYYY-MM-DD
 * @status active
 * @tags [entry],[react],[app]
 * @brief ...
 * @details - ...
 * @dependencies ...
 * @exports ...
 * @notes ...
 */
```

Not every file has this header — follow the convention only when the surrounding file does.

### Class composition

- `cn()` helper: `src/app/components/ui/utils.ts` → `twMerge(clsx(...))`.
- shadcn primitives use `cva` (`class-variance-authority`) for variants; follow the same pattern for new multi-variant primitives.

### Styling

- All layout/colour is Tailwind utility classes; **no CSS modules**.
- Heavy use of arbitrary values: `bg-[var(--color-bg-secondary)]`, `shadow-[0_0_30px_rgba(212,175,55,0.4)]`, `min-h-[calc(100vh-3.5rem)]`.
- Background images are remote Unsplash URLs (see `ATTRIBUTIONS.md`). New textures should also be from Unsplash or local assets.
- Animation via `motion`: `import { motion, AnimatePresence } from "motion/react"`.

### TypeScript

- `strict: true`. `noUnusedLocals` and `noUnusedParameters` are **off**, but don't abuse it.
- `jsx: "react-jsx"` — no need to `import React` for JSX (some files still do; safe to drop on edit).

---

## 7. Gotchas (read before changing code)

### 7.1 Vite config invariants

- **Both `react()` and `tailwindcss()` plugins are required**, even if Tailwind isn't actively used — see the comment in `vite.config.ts`. Do not remove either.
- **Never add `.css`, `.tsx`, or `.ts` to `assetsInclude`** (currently `['**/*.svg', '**/*.csv']`). Adding them will break module resolution.
- `@/` alias is wired in both Vite and TS — keep both in sync if you change it.

### 7.2 Tailwind v4 specifics

- Tailwind scanning source is declared in `src/styles/tailwind.css` via `@source '../**/*.{js,ts,jsx,tsx}'`. New file extensions under `src/` won't be picked up unless added here.
- PostCSS config (`postcss.config.mjs`) is intentionally empty — Tailwind v4 is wired through Vite, not PostCSS. Don't add `tailwindcss` or `autoprefixer` there.

### 7.3 Native binary alignment (macOS dev / Linux deploy)

`pnpm-workspace.yaml` declares `supportedArchitectures: linux/{x64,arm64}/glibc` only — that's the deployment target. On macOS (apple‑silicon) the Linux binaries won't load, so the matching darwin‑arm64 binaries are pinned in `devDependencies`:

| Package                           | Pinned version | Why this exact version                                                                                                                                              |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@esbuild/darwin-arm64`           | `0.25.12`      | Must match the `esbuild` version `vite@6.3.5` resolves to (also `0.25.12`). A mismatch produces `Host version "X" does not match binary version "Y"` at build time. |
| `@tailwindcss/oxide-darwin-arm64` | `4.1.12`       | Must match `@tailwindcss/oxide` resolved by `tailwindcss@4.1.12`. Missing → `Failed to load native binding` from `@tailwindcss/oxide`.                              |
| `lightningcss-darwin-arm64`       | `1.30.1`       | Must match `lightningcss` resolved by `@tailwindcss/vite`. Missing → `Cannot find module '../lightningcss.darwin-arm64.node'`.                                      |
| `@rollup/rollup-darwin-arm64`     | `4.62.2`       | Must match `rollup` resolved by vite. Already aligns across all arches.                                                                                             |

**When upgrading vite / tailwindcss / rollup**: re-check the resolved transitive version (`ls node_modules/.pnpm/ | grep esbuild`) and update the darwin binary pin to match. Otherwise the build will break on macOS.

### 7.4 React types override (workspace-level)

`lucide-react`, `react-router`, and other libs pull in `@types/react@19` transitively, which produces TS2786 ("'X' cannot be used as a JSX component") against React 18. The workspace-level override in `pnpm-workspace.yaml` pins `@types/react` and `@types/react-dom` to `18.3.1`:

```yaml
overrides:
  '@types/react': 18.3.1
  '@types/react-dom': 18.3.1
```

If you remove this, expect ~100+ TS errors. Don't move it back to `package.json#pnpm.overrides` — pnpm v11 ignores that location.

### 7.5 shadcn/ui import casing

shadcn primitive files in `src/app/components/ui/` are **lowercase** (`badge.tsx`, `button.tsx`). Imports must use the lowercase path: `'../components/ui/badge'`. Capitalised `'./Badge'` works on default macOS filesystems but fails on Linux / case‑sensitive FS and triggers `TS1149` "file name differs only in casing".

### 7.6 Token mandate: `var(--color-*)` only

The codebase previously used `imperial-*` Tailwind classes (e.g. `text-imperial-gold`, `bg-imperial-panel`) which were **never defined** — they rendered as no‑ops. They have all been translated to canonical `var(--color-accent-*)` / `var(--color-bg-*)` tokens. **Do not re‑introduce `imperial-*` classes**; use the mapping in §5.

### 7.7 Vite config invariants

- **Both `react()` and `tailwindcss()` plugins are required**, even if Tailwind isn't actively used — see the comment in `vite.config.ts`. Do not remove either.
- **Never add `.css`, `.tsx`, or `.ts` to `assetsInclude`** (currently `['**/*.svg', '**/*.csv']`). Adding them will break module resolution.
- `@/` alias is wired in both Vite and TS — keep both in sync if you change it.

### 7.8 Tailwind v4 specifics

- Tailwind scanning source is declared in `src/styles/tailwind.css` via `@source '../**/*.{js,ts,jsx,tsx}'`. New file extensions under `src/` won't be picked up unless added here.
- PostCSS config (`postcss.config.mjs`) is intentionally empty — Tailwind v4 is wired through Vite, not PostCSS. Don't add `tailwindcss` or `autoprefixer` there.

### 7.9 React / ReactDOM are peer deps

`react@18.3.1` and `react-dom@18.3.1` are declared as **optional peer dependencies**, not in `dependencies` or `devDependencies`. They resolve via the workspace. Don't "fix" by moving them to `dependencies` unless you understand why they were declared as peers (Figma Make convention). `@types/react@18.3.1` and `@types/react-dom@18.3.1` ARE in `devDependencies` and pinned via the workspace `overrides` (see §7.4).

### 7.10 TypeScript config gotchas

- `tsconfig.json` has `"ignoreDeprecations": "5.0"` to silence the `baseUrl` deprecation warning. Valid values are `"5.0"` only (not `"6.0"` — that produces `TS5103` on TS 5.9+).
- `tsconfig.node.json` is `"composite": true` because it's referenced as a project from `tsconfig.json`. It must NOT have `"noEmit": true` (composite requires emit capability).

### 7.11 Prettier + ESLint split (no plugin-prettier)

- **Prettier owns formatting** (`.prettierrc.json` + `prettier-plugin-tailwindcss`).
- **ESLint owns code quality** (types, hooks, unused vars).
- `eslint.config.js` ends with `prettierConfig` (from `eslint-config-prettier`) which **turns off** all ESLint rules that conflict with Prettier.
- **Do NOT** add `eslint-plugin-prettier` — it runs Prettier twice and produces confusing errors. It was deliberately removed.
- Tailwind classes inside `cn()` / `cva()` / `clsx()` / `twMerge()` are auto-sorted on `pnpm format` (configured via `tailwindFunctions` in `.prettierrc.json`).
- `.prettierignore` excludes `docs/`, `src/imports/`, `dist/`, `pnpm-lock.yaml`, and **vendored shadcn files** (`src/app/components/ui/[a-z]*.tsx`) to keep `npx shadcn add` diffs clean.

### 7.12 CI gate (`.github/workflows/ci.yml`)

Every PR to `main`/`master` must pass these in order: `typecheck → lint → format:check → madge → build`. The workflow:

- Runs on `ubuntu-latest` (matches `pnpm-workspace.yaml#supportedArchitectures`).
- Uses pnpm 11 + Node 22 (matches local).
- Installs with `--frozen-lockfile` — **never commit a `pnpm-lock.yaml` that's out of sync with `package.json`**.
- Uploads `dist/` as an artifact (7-day retention) even on failure, for deploy debugging.

To run the exact CI sequence locally before pushing:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm madge && pnpm build
```

### 7.13 Mocked backend

`WorkflowContext.tsx` simulates a WebSocket with `setTimeout`/`setInterval`. Don't assume `isConnected === true` means a real connection. The real‑backend hooks (`new WebSocket(...)`, `ws.onmessage`, `ws.close()`) are commented out as a template.

---

## 8. Domain Glossary (essential for understanding UI copy)

The UI overlays a multi-agent workflow onto Tang governance. Memorise these mappings:

### Roles / spatial nodes (Luoyang 紫微城 central axis, north → south)

| Chinese | Pinyin      | Meaning               | UI role                                           |
| ------- | ----------- | --------------------- | ------------------------------------------------- |
| 天堂    | Tiāntáng    | "Heaven" pagoda       | Emperor (皇帝) — top of axis, final authority     |
| 明堂    | Míngtáng    | "Bright Hall"         | Crown Prince (太子) — sorts / standardises edicts |
| 应天门  | Yìngtiānmén | Palace gate           | Three Departments (三省) — review/draft/dispatch  |
| 天津桥  | Tiānjīnqiáo | Bridge over Luo River | Six Ministries (六部) — executors                 |
| 定鼎门  | Dìngdǐngmén | Outer city gate       | Summary / archive — task closure                  |

### Three Departments (三省)

- **中书省** (Zhōngshū) — drafts the execution plan. 左阙 of 应天门. Colour: 石青 `#2E5EAA`.
- **门下省** (Ménxià) — reviews & can reject (封驳). 中阙. Colour: 鎏金.
- **尚书省** (Shàngshū) — dispatches to Six Ministries, issues 鱼符 tokens. 右阙. Colour: 青铜绿 `#4A7065`.

### Six Ministries (六部)

户(finance/data) · 礼(docs/standards) · 兵(urgent/bug-fix) · 刑(security/audit) · 工(devops/CI) · 吏(HR/agents).

### Edict workflow (7 stages, `EdictStatus` order)

`待承旨` → `待草拟` → `待审议` → `待派发` → `执行中` → `待回奏` → `已办结`

### Edict types (`Edict.type`)

- **制书** (zhìshū) — highest-grade, system-wide (金色绫卷).
- **敕书** (chìshū) — routine tasks (黄纸).
- **敕牒** (chìdié) — fast/emergency, bypasses some steps.

### Cultural artefacts (power carriers)

- **玉玺** (Imperial Seal) — highest authority. Component: `ImperialSeal.tsx`.
- **圣旨** (Edict scroll) — message carrier. Component: `ImperialEdict.tsx`.
- **竹箴** (Bamboo slips) — rule/knowledge base (律令格式).
- **鱼符** (Fish tally token) — execution credential. Component: `TokenButton.tsx`.

Full design spec lives in `docs/` (see §9) — read those before designing new screens.

---

## 9. Reference Documentation (`docs/`)

The `docs/` directory is **read-only reference material** (mostly zh-CN markdown) for design and cultural context. Do not edit unless explicitly asked.

| Path                                                                  | Contents                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/YYC3-Dynasty-Guidelines.md`                                     | Master design guideline (~180 KB). Authoritative for colour, typography, layout, components, page-by-page specs, acceptance criteria.                                                                                                                  |
| `docs/YYC3-Dynasty-项目文化-自述文档.md`                              | Project manifesto / cultural self-description.                                                                                                                                                                                                         |
| `docs/YYC3-Dynasty-制作工具选型-推荐报告.md`                          | Tooling selection report.                                                                                                                                                                                                                              |
| `docs/YYC3-Dynasty-分镜提示词-自述短片.md`                            | Storyboard prompts for short film.                                                                                                                                                                                                                     |
| `docs/YYC3-Dynasty-Design-Delivery/01..10-YYC3-Dynasty-Guidelines.md` | 10-part guidelines split.                                                                                                                                                                                                                              |
| `docs/00-YYC3-团队通用-标准规范/`                                     | Team-wide standards.                                                                                                                                                                                                                                   |
| `docs/01-YYC3-古都文化-洛阳史考/`                                     | Luoyang history research.                                                                                                                                                                                                                              |
| `docs/02-YYC3-古都文化-官制体系/`                                     | Official-system (三省六部) reference.                                                                                                                                                                                                                  |
| `docs/03-YYC3-古都文化-设计系统/`                                     | Design system (tokens, type, grid).                                                                                                                                                                                                                    |
| `docs/04-YYC3-古都文化-动效系统/`                                     | Animation system.                                                                                                                                                                                                                                      |
| `docs/05-YYC3-古都文化-模型策略/`                                     | Model strategy.                                                                                                                                                                                                                                        |
| `docs/06-YYC3-古都文化-页面提示/`                                     | Page-level prompts.                                                                                                                                                                                                                                    |
| `docs/07-YYC3-古都文化-组件库/`                                       | Component library spec.                                                                                                                                                                                                                                |
| `docs/08-YYC3-古都文化-交互规范/`                                     | Interaction spec.                                                                                                                                                                                                                                      |
| `docs/09-YYC3-古都文化-链路衔接/`                                     | Flow / linkage design.                                                                                                                                                                                                                                 |
| `docs/10-YYC3-古都文化-实操交付/`                                     | Delivery / handoff.                                                                                                                                                                                                                                    |
| `docs/11-YYC3-古都文化-逻辑认证/`                                     | Logic authentication.                                                                                                                                                                                                                                  |
| `docs/12-YYC3-古都文化-附录索引/`                                     | Appendix / index.                                                                                                                                                                                                                                      |
| `docs/YYC3-AI-Dev/`                                                   | **Separate related project** (a full monorepo: shell + plugins + standalone apps, with its own `ARCHITECTURE.md`, `README.md`, `pnpm-workspace.yaml`, `package.json`). Treat as out-of-scope for the Vite app under repo root unless explicitly asked. |
| `src/imports/YYC3-Dynasty_Figma_Design_Prompt.md`                     | Condensed Figma design prompts used to generate this app. Most directly relevant to the implemented UI.                                                                                                                                                |
| `src/imports/pasted_text/design-tokens.json`                          | Raw Figma token export.                                                                                                                                                                                                                                |

---

## 10. Workflow for Common Tasks

### Add a new page

1. Create `src/app/pages/MyPage.tsx` exporting a PascalCase component (match style of `WelcomePage.tsx` / `PlaceholderPage.tsx`).
2. Register a route in `src/app/routes.tsx` under the `Root` children (so it gets Navigation + AIAssistantHub + providers).
3. If it should appear in the top nav, add an entry to the `tabs` array in `src/app/components/Navigation.tsx`.
4. Use `var(--color-*)` tokens, not hex, not `imperial-*`.

### Add / modify a shadcn component

- Files in `src/app/components/ui/` are standard shadcn/ui output. Edit in place. Don't introduce a separate component registry — they're vendored.
- Custom YYC³ components (`NodeCard`, `TokenButton`, `ImperialEdict`, `ImperialSeal`, `Icons`) live alongside shadcn primitives in the same folder; keep PascalCase filenames for them.

### Add global state

- Extend `WorkflowContext.tsx`: add to `WorkflowState`, add a new `WorkflowAction` variant, handle it in `workflowReducer`. Don't introduce Redux/Zustand without explicit user request.

### Change theming

- Edit `src/styles/theme.css` (`@theme { ... }`). Tailwind v4 will pick up new `--color-*` / `--font-*` variables automatically and expose them as utilities like `bg-accent-gold` (NB: most existing code uses the explicit `bg-[var(--color-accent-gold)]` form — both work).

### Build / verify before finishing

- `npx tsc --noEmit -p tsconfig.json` → must be 0 errors.
- `pnpm build` must succeed with no new errors.
- `pnpm dev`, click through the affected route, confirm console is clean.

---

## 11. When You're Stuck

- **"Where does X come from?"** — grep the codebase first; the design rationale is usually in `docs/YYC3-Dynasty-Guidelines.md` or `src/imports/YYC3-Dynasty_Figma_Design_Prompt.md`.
- **"Build fails with `Host version does not match binary version`"** — esbuild darwin binary drifted. See §7.3.
- **"Build fails with `Failed to load native binding` (oxide) or `Cannot find module '../lightningcss.darwin-arm64.node'`" — same root cause as above; pin the matching darwin binary. See §7.3.
- **"~100 TS2786 errors saying 'X cannot be used as a JSX component'"** — React types override is missing or removed. See §7.4.
- **"TS1149: file name differs only in casing"** — somewhere a `'./Badge'` import slipped back in. Change to `'./badge'`. See §7.5.
- **"Why is the package named `@figma/my-make-file`?"** — Figma Make export convention. Leave it.
- **"Where's the backend?"** — There isn't one; `WorkflowContext` mocks the WebSocket (see §7.11).
