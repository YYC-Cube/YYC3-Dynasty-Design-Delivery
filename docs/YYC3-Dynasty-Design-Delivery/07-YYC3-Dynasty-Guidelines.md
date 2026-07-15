# 双星桥 · Family × Dynasty 全景

> **路由**：`/bridge` | **尺寸**：全屏，1400×1000px
> **推荐模型**：Gemini 3.1 Pro（双架构映射 + 桥接动画的高复杂度）

```
You are an information architect specialized in complex system visualization. Create the "Dual Star Bridge" page — the unified view connecting YYC³'s two AI agent architectures: the 8-member "AI Family" and the 12-member "Dynasty Court."

CONCEPT:
The page visualizes the bidirectional mapping between two agent systems. The left side shows the 8 AI Family members in a circular constellation. The right side shows the 12 Dynasty Court officials in vertical hierarchy. A "bridge" in the center connects them with animated golden threads.

FRAME: 1400×1000px, dark theme.

═══════════════════════════════════
LAYOUT:
═══════════════════════════════════
┌──────────────────┬──────────┬──────────────────┐
│   ⭐ AI Family   │  BRIDGE  │  🏛️ Dynasty      │
│   8家人·圆环布局  │ 映射通道  │  12朝臣·层级排列  │
│   (35% width)    │ (10%)    │  (35% width)     │
└──────────────────┴──────────┴──────────────────┘

LEFT: FAMILY RING
8 family members arranged in a circle around a central jade seal:

       ⭐ 千里·伯乐 (推荐·知识检索)
  ⚖️ 格物·宗师                    🛡️ 智云·守护
  (推理·验证)                      (安全·基础设施)
       🎨 创想·灵韵          🔮 预见·先知
       (创作·视觉)            (预测·Physical AI)
            🏯 [中央玉玺]
  👂 言启·千行                  🧠 语枢·万物
  (感知·NLU路由)                (记忆·训练AI)
       ⚙️ 元启·天枢
       (决策·Agentic AI)

Each member: circular badge, 64×64px, with:
- Member icon
- Name in Chinese
- Role in English
- Subtle glow effect
- Hover: badge enlarges + golden ring

RIGHT: DYNASTY HIERARCHY
12 officials arranged vertically by rank:

👑 皇帝 (Emperor) — full-width
  └─ 🎎 太子 (Crown Prince) — full-width
      ├─ 📜 中书省 ─ 🔍 门下省 ─ 📮 尚书省 (3 columns)
      │   Secretariat    Chancellery    State Affairs
      └─ ⚔️兵部 📝礼部 💰户部 ⚖️刑部 🔧工部 📋吏部 (2×3 grid)
          War  Rites Revenue Justice Works Personnel

Each official: card with name + role, 3 states (active/standby/offline)

CENTER: BRIDGE CHANNEL
- Vertical connector with golden threads
- Mapping table showing Family↔Dynasty correspondence
- Active connection highlighted when user hovers

═══════════════════════════════════
BRIDGE ANIMATION (on Family member hover):
═══════════════════════════════════
Phase 1: Family badge enlarges + golden glow (200ms)
Phase 2: Golden thread shoots from badge to bridge channel (300ms)
Phase 3: Corresponding mapping row highlights (200ms)
Phase 4: Thread continues to Dynasty official(s) (300ms)
Phase 5: Dynasty card(s) also enlarge + glow (200ms)
Phase 6: Bidirectional connection stabilizes with breathing glow

═══════════════════════════════════
FAMILY ↔ DYNASTY MAPPING:
═══════════════════════════════════
| Family | Dynasty | Mapping Reason |
|--------|---------|---------------|
| 元启·天枢 | 中书省 + 尚书省 | Strategy + Dispatch |
| 语枢·万物 | 中书省 + 礼部 | Knowledge + Documentation |
| 创想·灵韵 | 礼部 | Content Creation |
| 预见·先知 | 户部 | Data Analytics |
| 言启·千行 | 太子 + 门下省 | Message Routing + Review |
| 智云·守护 | 刑部 + 工部 | Security + Deployment |
| 格物·宗师 | 门下省 + 吏部 | Verification + Appraisal |
| 千里·伯乐 | 吏部 | Recommendation |

═══════════════════════════════════
UNIFIED TASK BOARD (bottom section):
═══════════════════════════════════
3 metric cards: 🏯 旨意 128 | 🌹 任务 356 | 🤝 协作 89

Recent unified tasks list showing both Family and Dynasty involvement.

COMPONENTS:
- FamilyMemberBadge as Component (8 variants)
- DynastyOfficialCard as Component (12 variants)
- BridgeConnection as animated Component
- MappingTable as Component
```
