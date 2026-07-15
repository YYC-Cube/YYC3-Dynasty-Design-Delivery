# YYC³ Dynasty · 多语言全维度审核与实施落地方案

> **i18n Full-Dimension Audit & Implementation Plan**
> 生成时间：2026-07-16
> 审计范围：i18n 引擎配置 · 全页面/组件硬编码扫描 · 域层数据国际化 · RTL 支持
> 引擎来源：`@yyc3/i18n-core@2.4.0` (vendored) + `@yyc3/i18n-react` (vendored)

---

## 0. 执行摘要

| 维度 | 当前状态 | 覆盖率 | 目标 |
| --- | --- | --- | --- |
| 默认语言 | ✅ `zh-CN` | — | 维持 |
| 语言持久化 | ✅ localStorage `yyc3.i18n.locale` | — | 维持 |
| 语言切换器 | ✅ Navigation.tsx Globe 下拉 | — | 维持 |
| i18n 引擎特性利用 | ⚠️ 仅用 `t()` 基础翻译 | ~10% | 100% |
| 页面文件 i18n 覆盖 | ❌ 2/8 页面完全 i18n | **25%** | 100% |
| Dashboard 子系统 | ❌ 挂载 Provider 但零 `t()` 调用 | **0%** | 100% |
| 组件文件 i18n 覆盖 | ❌ 1/4 自定义组件 i18n | **25%** | 100% |
| 硬编码中文字符串 | **~200+** 分布在 17 个文件 | — | 0 |
| ICU 复数/选择格式 | ❌ 未使用 | 0% | 按需 |
| RTL 支持 | ❌ 未使用（引擎已内置） | 0% | 按需 |
| `Trans` 组件（JSX 插值） | ❌ 未使用 | 0% | 按需 |

---

## 1. 引擎配置审计

### 1.1 当前配置 (`src/i18n/index.ts`)

```typescript
export const i18nEngine = new I18nEngine({
  locale: 'zh-CN',        // ✅ 默认中文
  fallbackLocale: 'en',   // ✅ 英文兜底
});
```

| 配置项 | 当前值 | i18n-Core 支持 | 状态 |
| --- | --- | --- | --- |
| `locale` | `'zh-CN'` | 10 种语言 | ✅ |
| `fallbackLocale` | `'en'` | — | ✅ |
| `cache` | 默认 (enabled, 1000, 5min) | LRU + TTL | ✅ 默认即可 |
| `debug` | 未启用 | `window.__i18n_debug__` | 🟡 开发环境建议启用 |
| `onError` | 未配置 | 错误回调 | 🟡 生产建议配置 |
| `missingKeyHandler` | 未配置 | 缺失键处理 | 🟡 生产建议配置 |

### 1.2 引擎未利用的强大特性

| 特性 | 引擎能力 | 当前使用 | 建议 |
| --- | --- | --- | --- |
| **ICU MessageFormat** | `{count, plural, one{# task} other{# tasks}}` | ❌ | 勋章/统计页需用 |
| **`Trans` 组件** | `<Trans id="..." components={{link:<a/>}}/>` | ❌ | 带链接的文案需用 |
| **`createNamespace`** | 按页面/组件前缀隔离翻译空间 | ❌ | 大型页面推荐 |
| **`batchTranslate`** | 批量翻译多个键 | ❌ | 性能优化 |
| **RTL 工具** | `setupDocumentDirection`, `flipSpacing`, `transformClassForRTL` | ❌ | 阿拉伯语支持 |
| **`formatRelativeTime`** | "5 分钟前" / "5m ago" | ❌ | 时间线/历史页 |
| **Plugin 系统** | `MissingKeyReporter`, `PerformanceTracker` | ❌ | 开发环境监控 |
| **嵌套键查找** | `"edict.status.待承旨"` 点路径 | ✅ 已用 | 维持 |
| **`{name}` 插值** | `t('welcome.message', {name: '皇帝'})` | ⚠️ 有键但未大量用 | 扩展使用 |

### 1.3 引擎初始化优先级（实际行为）

```
1. localStorage["yyc3.i18n.locale"]     ← 用户手动切换过的语言（最高优先）
2. navigator.languages / navigator.language  ← 浏览器语言检测（confidence 0.8）
3. 构造函数 locale: 'zh-CN'              ← 默认值
```

**问题**：如果用户浏览器是英文环境且从未手动切换，引擎会自动选择英文而非中文。需确认是否强制 `zh-CN` 首选。

**建议**：维持当前行为（浏览器检测 → 默认 zh-CN）。中文用户浏览器通常返回 `zh-CN`。

---

## 2. 全文件硬编码审计矩阵

### 2.1 页面级审计

| 页面文件 | 硬编码中文数 | 使用 `t()`? | 优先级 | 说明 |
| --- | --- | --- | --- | --- |
| `Navigation.tsx` | **0** | ✅ 完全 | — | 唯一全 i18n 组件 |
| `PlaceholderPage.tsx` | **0** | ✅ 完全 | — | 通过 `t('placeholder.*')` |
| `WelcomePage.tsx` | **1** | ⚠️ 部分 | P2 | `受命` 一处 |
| `EdictBoard.tsx` | **~30** | ⚠️ 部分 | **P0** | COLUMNS/TRANSITION_LABELS/操作按钮 |
| `HonorsPage.tsx` | **~25** | ⚠️ 部分 | **P1** | 官员名/勋章维度/统计标签 |
| `ArchiveBoard.tsx` | **~12** | ❌ 零 | **P0** | 完全硬编码 |
| `TimelinePage.tsx` | **~20** | ❌ 零 | **P1** | 朝代名/技能标题 |
| `CourtHall.tsx` | **~30** | ❌ 零 | **P0** | 六部名/中央轴线节点/统计 |
| `TaishiMonitor.tsx` | **~40** | ❌ 零 | **P1** | 时辰/星象/图表数据/部门 |

### 2.2 Dashboard 子系统审计

| 文件 | 硬编码中文数 | 使用 `t()`? | 说明 |
| --- | --- | --- | --- |
| `DashboardPage.tsx` | **~12** | ❌ 零 | 挂载了 `I18nProvider` 但零调用 |
| `CentralAxis.tsx` | **~25** | ❌ 零 | 节点/部门/状态全硬编码 |
| `LeftSidebar.tsx` | **~10** | ❌ 零 | 任务类型/来源/状态 |
| `RightSidebar.tsx` | **~15** | ❌ 零 | 系统状态/早朝简报/指标 |
| `EdictModal.tsx` | **~20** | ❌ 零 | 敕书内容/印章名/流转轨迹 |

### 2.3 组件级审计

| 组件文件 | 硬编码中文数 | 使用 `t()`? | 说明 |
| --- | --- | --- | --- |
| `Root.tsx` | **1** | ⚠️ Provider | `加载中…` 绕过了 i18n |
| `AIAssistantHub.tsx` | **~15** | ❌ 零 | 角色名/标签页/输入框 |
| `ui/ImperialSeal.tsx` | **2** | ❌ 零 | `受命于天既寿永昌`/`待印` |
| `ui/ImperialEdict.tsx` | **1** | ❌ 零 | 类型标签 |

### 2.4 Store 层审计

| 文件 | 硬编码中文数 | 说明 |
| --- | --- | --- |
| `WorkflowContext.tsx` | **3** | 历史记录 action 字段：`待复核确认`/`待复核` |

---

## 3. 翻译键规划

### 3.1 新增键命名空间

```
i18n/locales/zh-CN.ts (+ en.ts mirror)
├── app.*                 (已有)
├── nav.*                 (已有)
├── welcome.*             (已有)
├── edict.*               (已有，需扩展)
│   ├── status.*          (已有 11 键)
│   ├── columnLabels.*    (已有 11 键)
│   ├── transition.*      🆕 20 键 (流转操作标签)
│   ├── offPipeline.*     🆕 4 键 (管线外态标签)
│   └── seal.*            🆕 2 键 (受命于天/待印)
├── archive.*             (已有，需扩展)
│   ├── sealText          🆕 "受命于天，既寿永昌"
│   └── emptyState        (已有)
├── honors.*              🆕 全新命名空间
│   ├── pageTitle         "🏅 勋 章 墙"
│   ├── leaderboard       "功勋榜 · Merit Ranking"
│   ├── dimensions.*      角色/成就/协作/安全/效率
│   ├── stats.*           办结/参与/tokens
│   ├── earned            "已获得"
│   └── condition         "条件："
├── court.*               🆕 全新命名空间
│   ├── pageTitle
│   ├── nodes.*           天堂/明堂/应天门/...
│   ├── ministries.*      户/礼/兵/刑/工/吏部
│   ├── stats.*           全局健康度/办结率/均耗时
│   └── status.*          正常/核心链路
├── monitor.*             🆕 全新命名空间
│   ├── pageTitle         "太史监候"
│   ├── subtitle          "观星辰之变"
│   ├── celestial.*       紫微星/北斗七星/太阴星
│   ├── chartLabels.*     创建/办结/封驳
│   └── eventTypes.*      祥瑞/异象/灾异/日表
├── timeline.*            🆕 全新命名空间
│   ├── pageTitle
│   ├── dynasty.*         十三朝名
│   └── skills.*          技能标题
├── dashboard.*           (已有 5 键，需大幅扩展)
│   ├── navItems.*        藏经阁/工部作坊/...
│   ├── globalDashboard
│   ├── centralAxis.*     节点/部门/状态
│   ├── leftSidebar.*     任务类型/来源
│   ├── rightSidebar.*    系统状态/指标
│   └── edictModal.*      敕书/印章/流转轨迹
├── ai.*                  🆕 AI 助手命名空间
│   ├── title             "天枢 · Navigator"
│   ├── subtitle          "王朝助理"
│   ├── tabs.*            对话/命令/提示词/配置
│   ├── inputPlaceholder
│   └── sendButton
├── common.*              🆕 通用键 (部分由引擎内置)
│   ├── loading           "加载中…" (引擎内置: "加载中...")
│   ├── noActions         "此状态无可用流转"
│   └── confirm           "需要修改"
└── placeholder.*         (已有)
```

### 3.2 文化名称处理策略

| 类别 | 示例 | zh-CN | en | 策略 |
| --- | --- | --- | --- | --- |
| 状态枚举 | `待承旨` | 待承旨 | Pending intake | `t('edict.status.待承旨')` |
| 部门名 | 户部 | 户部 | Ministry of Revenue | `t('court.ministries.hubu')` |
| 节点名 | 天堂 | 天堂 | Heaven Pagoda | `t('court.nodes.tiantang')` |
| 官职 | 中书令 | 中书令 | Secretariat | `t('agents.zhongshu.title')` |
| 勋章 | 九九归一 | 九九归一 | Unity of Nine-Nines | `t('honors.medals.jiu_jiu_gui_yi')` |
| 时辰 | 子时 | 子时 | Zi (11PM-1AM) | `t('monitor.shichen.zi')` |
| 星象 | 紫微星 | 紫微星 | Polaris | `t('monitor.celestial.ziwei')` |

**原则**：文化名在 zh-CN 保留中文原文；en 版保留拼音 + 英文注释，不强行翻译。

---

## 4. 分阶段实施计划

### Phase I: 核心页面 i18n 化（P0 · 1-2 天）

**目标**：将 4 个最高流量页面的所有硬编码字符串提取为翻译键。

#### I-1: EdictBoard.tsx (~30 字符串)

```typescript
// 当前硬编码
const COLUMNS = [
  { id: '待承旨', label: '天堂 (待承旨)', min: '天' },
  ...
];
const TRANSITION_LABELS = {
  '待承旨→待草拟': '承旨分拣',
  ...
};

// 目标：所有标签通过 t() 获取
// 在组件内部使用 useMemo 构建 labels
function useEdictLabels() {
  const { t } = useTranslation();
  return useMemo(() => ({
    columns: KANBAN_COLUMNS.map(id => ({
      id,
      label: t(`edict.columnLabels.${id}`),
    })),
    transitions: {
      '待承旨→待草拟': t('edict.transition.intakeToDraft'),
      ...
    },
    offPipeline: {
      '待执行': t('edict.offPipeline.queued'),
      '待复核': t('edict.offPipeline.pendingConfirm'),
      ...
    },
  }), [t]);
}
```

新增翻译键：`edict.transition.*` (20 键) + `edict.offPipeline.*` (4 键) + 操作按钮文案

#### I-2: ArchiveBoard.tsx (~12 字符串)

完全 i18n 化：添加 `useTranslation()` + 提取所有文案。

新增翻译键：`archive.sealText`、`archive.historyTitle`（已有）、`archive.viewOriginal`（已有）

#### I-3: CourtHall.tsx (~30 字符串)

新增翻译键：`court.*` 命名空间（~25 键）

#### I-4: Root.tsx + ImperialSeal.tsx + ImperialEdict.tsx (~4 字符串)

- `Root.tsx`: `加载中…` → `t('common.loading')`（引擎内置）
- `ImperialSeal.tsx`: `受命于天，既寿永昌` → `t('common.sealText')`
- `ImperialEdict.tsx`: 类型标签 → `t('edict.type.制书')` 等

### Phase II: Dashboard 子系统 i18n 化（P0 · 1-2 天）

**目标**：Dashboard 的 5 个文件全部接通 `t()`。

#### II-1: DashboardPage.tsx

```typescript
// 当前：挂载了 I18nProvider 但零调用
// 目标：所有 nav items + 标题通过 t()
const navItems = [
  { label: t('dashboard.navItems.scripture'), path: '/skills' },
  { label: t('dashboard.navItems.works'), path: '/workflow' },
  ...
];
```

#### II-2: CentralAxis / LeftSidebar / RightSidebar / EdictModal

所有 5 个 dashboard 文件统一引入 `useTranslation()`，提取 ~70 个硬编码字符串。

### Phase III: 次要页面 + 组件 i18n 化（P1 · 1-2 天）

| 文件 | 字符串数 | 新键命名空间 |
| --- | --- | --- |
| `HonorsPage.tsx` | ~25 | `honors.*` |
| `TaishiMonitor.tsx` | ~40 | `monitor.*` |
| `TimelinePage.tsx` | ~20 | `timeline.*` |
| `AIAssistantHub.tsx` | ~15 | `ai.*` |
| `WelcomePage.tsx` | 1 | 修复 `受命` |
| `WorkflowContext.tsx` | 3 | `edict.historyAction.*` |

### Phase IV: 高级 i18n 特性接入（P2 · 1 天）

#### IV-1: ICU 复数格式

```json
// zh-CN
"honors.stats.medals": "共 {count} 枚 · 已获得 {earned} 枚"
// en
"honors.stats.medals": "{count, plural, one{# medal} other{# medals}} · {earned} earned"
```

#### IV-2: `Trans` 组件（JSX 插值）

```tsx
<Trans
  id="archive.historyHint"
  values={{ count: 42 }}
  components={{ link: <Link to="/edict" /> }}
/>
// zh-CN: "共 <link>42 条</link> 流转记录"
// en: "<link>42</link> flow records total"
```

#### IV-3: `formatRelativeTime`

```typescript
import { formatRelativeTime } from '@yyc3/i18n-core';
// zh-CN: "5 分钟前"
// en: "5m ago"
```

#### IV-4: 开发环境 Plugin

```typescript
// src/i18n/index.ts (开发环境增强)
if (import.meta.env.DEV) {
  i18nEngine.setDebug(true);
  // MissingKeyReporter: 控制台警告缺失的翻译键
}
```

### Phase V: RTL + 多语言扩展（P3 · 按需）

#### V-1: 阿拉伯语支持

```typescript
import { setupDocumentDirection } from '@yyc3/i18n-core';

// 在 setLocale 后调用
setupDocumentDirection(locale);
// 自动设置 <html dir="rtl" lang="ar"> + .rtl class
```

#### V-2: 日语/韩语

引擎已支持 `ja`/`ko`，只需新增翻译文件：
```
src/i18n/locales/
├── zh-CN.ts  (已有)
├── en.ts     (已有)
├── ja.ts     🆕
└── ko.ts     🆕
```

---

## 5. 翻译键工作量估算

| 阶段 | 新增键数 | zh-CN | en | 影响文件数 |
| --- | --- | --- | --- | --- |
| Phase I | ~55 | 55 | 55 | 4 |
| Phase II | ~70 | 70 | 70 | 5 |
| Phase III | ~100 | 100 | 100 | 6 |
| Phase IV | ~10 | 10 | 10 | 3 |
| **总计** | **~235** | **235** | **235** | **18** |

当前翻译键：~70 → 目标：**~305 键**

---

## 6. 执行检查清单

每个文件 i18n 化后的验证标准：

- [ ] 文件顶部 `import { useTranslation } from '@yyc3/i18n-react'`
- [ ] 组件内 `const { t } = useTranslation()`
- [ ] 所有可见中文字符串替换为 `t('key')` 或 `t('key', { param })`
- [ ] 对应键已添加到 `zh-CN.ts` 和 `en.ts`
- [ ] zh-CN 保留中文原文
- [ ] en 提供英文翻译（文化名用拼音 + 注释）
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm test` 通过
- [ ] 浏览器手动验证两种语言切换

---

## 7. 文化对齐原则

1. **状态枚举**：`EdictStatus` 类型使用中文 canonical value（`待承旨`），翻译键用中文作为 key
2. **官职/部门名**：zh-CN 保留古称（`中书省`），en 用学术译名（`Secretariat`）非口语化
3. **勋章名**：zh-CN 保留古风（`九九归一`），en 用意境译名（`Unity of Nine-Nines`）
4. **时辰**：zh-CN 用地支（`子时`），en 用时间段（`Zi (11PM-1AM)`）
5. **星象**：zh-CN 用星名（`紫微星`），en 用国际名（`Polaris`）
6. **印章文字**：`受命于天，既寿永昌` — zh-CN 原文，en 译为 `"By Heaven's Mandate, Everlasting Prosperity"`

---

**文档生成时间**: 2026-07-16
**审计方法**: 全文件 `grep -rn` 硬编码扫描 + i18n-Core 源码完整阅读 + 引擎特性利用率分析
**数据来源**: 17 个 UI 文件 + 2 个 locale 文件 + i18n-Core 14 个源文件
