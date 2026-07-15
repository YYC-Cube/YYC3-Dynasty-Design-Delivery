# 敕令详情 · 圣旨阅览 ⭐

> **路由**：`/edict/:id` | **尺寸**：全屏弹窗，max-width 720px
> **推荐模型**：Gemini 3.1 Pro

```
You are a UI designer specialized in ancient Chinese document visualization. Create the "Edict Detail" page for YYC³ Dynasty — a full-screen modal that displays an imperial edict in its complete scroll form, showing all metadata, approval chain, and action buttons.

FRAME: 720×900px modal, dark overlay background rgba(0,0,0,0.7).

═══════════════════════════════════
HEADER BAR (56px, top-fixed):
═══════════════════════════════════
├─ Back button: ← 返回旨意板 (12px, secondary gold)
├─ Edict ID badge: #edict-042 (mono font, 14px, gold border)
├─ Status badge: 执行中 (green pill with pulse)
├─ [催办⚡] button (amber, secondary)
└─ [✕] close button (top-right)

═══════════════════════════════════
SCROLL AREA (flex-1, scrollable):
═══════════════════════════════════

SECTION 1: EDICT HEADER
┌──────────────────────────────────────────────┐
│                                              │
│         奉  天  承  運                        │
│         皇  帝  詔  曰                        │
│                                              │
│    [圣旨类型: 敕书]    [紧急程度: 火急 🔥]     │
│                                              │
│          修缮云枢殿防火墙                       │
│                                              │
│    ───────────────────────────────────────   │
│    制曰：兹令兵部、工部协力修缮云枢殿          │
│    防火墙之薄弱处，限三日内完成，               │
│    不得有误。                                 │
│    ───────────────────────────────────────   │
│                                              │
│    [✍️ 中书省·中书令 草拟]  巳时三刻            │
│                                              │
└──────────────────────────────────────────────┘

SECTION 2: SEVEN-STAGE FLOW (EdictStepBar, horizontal)
┌──────────────────────────────────────────────┐
│ ●下旨──●分拣──●草拟──●审议──●派发──◉执行──○归档│
│  ✅      ✅     ✅     ✅     ✅     🔄     ⏳   │
│ 巳时一刻 巳时二刻 巳时三刻 巳时四刻 午时一刻 午时二刻   │
└──────────────────────────────────────────────┘

SECTION 3: APPROVAL SEAL CHAIN (horizontal)
┌──────────────────────────────────────────────┐
│ 签章链:                                        │
│ [玉玺✓] ─→ [中书印✓] ─→ [门下印✓] ─→ [尚书印✓] │
│  天子    中书令     门下侍中    尚书令          │
└──────────────────────────────────────────────┘
Each seal: 48×48px square with official seal SVG + official title below.

SECTION 4: ASSIGNED MINISTRIES (2×2 grid)
┌───────────────────┬───────────────────┐
│ ⚔️ 兵部             │ 🔧 工部            │
│ 进度: ████████░░ 80%│ 进度: ██████░░░░ 60%│
│ 令牌: 🐟 × 2       │ 令牌: 🐟 × 1       │
│ 状态: 执行中 🔄     │ 状态: 执行中 🔄     │
└───────────────────┴───────────────────┘

SECTION 5: FLOW LOG (collapsible, monospace)
┌──────────────────────────────────────────────┐
│ 📜 流转日志                        [展开全部 ▼] │
│ ─────────────────────────────────────────── │
│ [午时二刻] 兵部·大将军 → 开始执行 edict-042    │
│ [午时一刻] 尚书省·尚书令 → 派发至兵部/工部      │
│ [巳时四刻] 门下省·门下侍中 → 审议通过 ✅       │
│ [巳时三刻] 中书省·中书令 → 草拟方案完成         │
│ [巳时二刻] 太子 → 分拣至兵部/工部              │
│ [巳时一刻] 天子 → 颁旨 (敕书·火急)             │
│                                              │
│ 封驳记录: (0 次)                              │
└──────────────────────────────────────────────┘

SECTION 6: ACTION BAR (bottom-fixed, 64px)
┌──────────────────────────────────────────────┐
│ [催办⚡]  [撤回↩]  [封驳✕]  [复制敕令编号📋]  │
└──────────────────────────────────────────────┘
Actions vary by user role:
- 皇帝: 催办 / 撤回
- 太子: 催办
- 门下省: 封驳
- 六部: 查看（无操作按钮）
- Disabled buttons: 50% opacity + 🔒 icon

═══════════════════════════════════
COMPONENTS:
═══════════════════════════════════
- EdictDetailModal as Component
- EdictStepBar as Component (7 steps × 4 states = 28 variants)
- SealChain as Component (4 seals × 2 states: stamped/pending)
- MinistryProgressCard as Component (6 variants)
- FlowLogItem as Component (with timestamp + action + actor)

STATES:
- Loading: skeleton scroll with pulse
- Error: "敕令未能呈阅，请退回重试" + [返回旨意板]
- Empty: should not occur (404 handled by routing)
- Vetoed: entire scroll has red tint overlay + 封驳理由 section
```
