# 旨意板 · 敕令流转监控 ⭐ 核心页

> **路由**：`/edict` | **尺寸**：全屏，max-width 900px
> **推荐模型**：Gemini 3.1 Pro

```
Create the "Edict Board" monitoring page for YYC³ Dynasty — tracking the real-time status of all imperial edicts flowing through the Three Departments and Six Ministries pipeline.

FRAME: 1440×1080px, dark theme.

═══════════════════════════════════
HEADER:
═══════════════════════════════════
- Title: "📜 旨 意 板" (serif, gold, 32px)
- Subtitle: "敕令流转 · 三省六部"
- Filter tabs: 全部 / 草拟中 / 审议中 / 执行中 / 已办结 / 已封驳
- [ + 发起新敕令 ] primary button (gold)

═══════════════════════════════════
EDICT CARDS (vertical list):
═══════════════════════════════════

Each card:
┌──────────────────────────────────────────────┐
│ 敕令 #edict-001          状态: 执行中 ●      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ 下旨 ──→ 分拣 ──→ 草拟 ──→ 审议 ──→ 派发 ──→ 执行 ──→ 归档 │
│  ✅       ✅       ✅       ✅       🔄       ⏳  │
│                                              │
│ 标题: 修缮云枢殿防火墙                          │
│ 发起: 天子 · 巳时一刻                          │
│ 当前: 兵部执行中 · 已耗时 2h36m                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 签章链: [玉玺✓] [中书✓] [门下✓] [尚书✓]        │
│ [查看详情]                          [催办⚡]  │
└──────────────────────────────────────────────┘

STEP INDICATOR DESIGN (7 stages: 下旨→分拣→草拟→审议→派发→执行→归档):
- Completed: gold solid circle + ✅ + gold connecting line
- Current: gold dashed circle + 🔄 spinning + gold dashed line
- Pending: grey hollow circle + grey dotted line
- Vetoed: red cross mark + red dashed line + return arrow

STATUS BADGES:
- 草拟中: blue pill
- 审议中: amber pill
- 执行中: green pill with pulse
- 已办结: grey pill
- 已封驳: red pill

═══════════════════════════════════
FLOW LOG (collapsible bottom panel):
═══════════════════════════════════
Monospace font, reverse chronological order:
[巳时一刻] edict-001 → 天子降旨 (制书)
[巳时二刻] edict-001 → 太子分拣至兵部/工部
[巳时三刻] edict-001 → 中书省草拟方案
[巳时四刻] edict-001 → 门下省审议通过 ✅
[午时一刻] edict-001 → 尚书省派发令牌
[午时二刻] edict-001 → 兵部开始执行 🔄

New log entries: fade-in + slide-up animation (300ms)

═══════════════════════════════════
COMPONENTS:
═══════════════════════════════════
- EdictCard as Component with Variants (status × 5)
- EdictStepBar as Component (6 steps, configurable states)
- StatusBadge as Component (5 color variants)
- FlowLogItem as Component

STATES:
- Normal: active edicts list
- Empty: "尚无敕令" with empty edict scroll illustration
- Loading: skeleton cards with pulse
- Error: "敕令加载失败" toast
```
