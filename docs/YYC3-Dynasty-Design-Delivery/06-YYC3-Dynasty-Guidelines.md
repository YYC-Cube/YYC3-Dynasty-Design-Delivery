# Hub 浮窗 · 全局 AI 助理

> **路由**：浮层 `/hub` | **尺寸**：浮动按钮 56×56px + 展开面板 520×680px
> **推荐模型**：Gemini 3.1 Pro（标准面板 + 复杂交互）

```
Create the global AI Assistant Hub floating panel for YYC³ Dynasty. This is a persistent floating widget in the bottom-right corner of all pages.

═══════════════════════════════════
FLOATING BUTTON (collapsed state, 56×56px):
═══════════════════════════════════
- 3D gradient square button, gold-to-deep-gold
- ✨ sparkle icon centered
- Green status dot (8px) in top-right corner (pulsing = online)
- Box-shadow: 0 0 30px rgba(212,168,67,0.4)
- Hover: scale 1.05x + "王朝助理" tooltip appears
- Click: expands to full panel (animation: scale 0→1 + fade, 250ms)

═══════════════════════════════════
EXPANDED PANEL (520×680px):
═══════════════════════════════════

HEADER (52px height):
┌──────────────────────────────────────────────┐
│ [🔶 Jade Seal] 天枢 · Navigator    [🗑][⛶][✕] │
│ Model: GPT-4o · 全局调度就绪 · 4命令         │
└──────────────────────────────────────────────┘

PERSONA BAR (40px height, horizontal scroll):
[帝][太][中][门][尚][户][礼][兵][刑][工][吏][早]
12 small circular avatars (32×32px) with short names
Selected persona: gold ring highlight

TAB BAR (36px height):
[💬 对话] [⌘ 命令] [📖 提示词] [⚙️ 配置]

MESSAGE AREA (flex-1, scrollable):
Message bubbles:
- User: right-aligned, semi-transparent gold bg, 12px border-radius (bottom-right sharp)
- Assistant: left-aligned, deep blue semi-transparent bg, persona label (gold, small) above bubble
- System: centered, yellow semi-transparent bg, full rounded

Special edict-style assistant message:
┌──────────────────────────────────────┐
│ 【圣旨】                             │
│ 朕已阅。着中书省即刻草拟方案，       │
│ 门下省严加审议。                     │
│                 — 天子御批           │
│                          [📋复制]   │
└──────────────────────────────────────┘

INPUT AREA (56px height):
┌──────────────────────────────────────────────┐
│ [🎤 mic] 输入指令... Enter发送          [发送→]│
└──────────────────────────────────────────────┘

TYPING INDICATOR:
3 bouncing dots (150ms stagger), gold color

═══════════════════════════════════
COMPONENTS:
═══════════════════════════════════
- HubFloatingButton as Component (collapsed/expanded, online/offline/busy)
- HubPanel as Component with Auto Layout
- PersonaAvatar as Component (12 variants, selected/unselected)
- MessageBubble as Component (user/assistant/system)
- EdictMessage as specialized assistant bubble variant
```
