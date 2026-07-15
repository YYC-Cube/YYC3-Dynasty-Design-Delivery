## 勋章墙 · 麟阁

> **路由**：`/honors` | **尺寸**：全屏，max-width 800px
> **推荐模型**：Gemini 3.1 Pro

---

```
You are a heraldic designer and UI specialist. Create the "Honor Wall" page for YYC³ Dynasty — displaying 17 Chinese-culture-themed achievement badges earned by AI agents.

FRAME: 1440×1080px. Dark theme.

═══════════════════════════════════
HEADER:
═══════════════════════════════════
- Title: "🏅 勋 章 墙" (serif, gold, 32px)
- Subtitle: "17 种 · 1-6 星" (14px)

═══════════════════════════════════
CATEGORY GROUPS (accordion-style):
═══════════════════════════════════
5 categories, each with a section header "/ 类别名":
1. / 角色 (Role-based honors)
2. / 成就 (Achievement honors)
3. / 协作 (Collaboration honors)
4. / 安全 (Security honors)
5. / 效率 (Efficiency honors)

Each honor item in a category:
┌──────────────────────────────────────────┐
│ [Icon 40px]  勋章名称  ★★★★★★          │
│              描述文字（1行）              │
│              条件: 达成条件说明           │
│              获得日期: 永熙三年·辰时      │
└──────────────────────────────────────────┘

VISUAL DESIGN:
- Gold stars (★) for earned, hollow stars (☆) for unearned levels
- 6 rarity levels with distinct border treatments:
  ★★★★★★ (最高): 龙纹金边 + glow effect
  ★★★★★: 青铜纹边
  ★★★★: 银边
  ★★★: 铜边
  ★★: 铁边
  ★: 素边

- Earned badges: full color, subtle glow
- Unearned badges: greyscale, 50% opacity, lock icon overlay

COMPONENTS:
- HonorBadge as Component with Variants (earned/unearned × 6 rarity levels = 12 variants)
- Category section as Component with Auto Layout

INTERACTION:
- Hover on earned badge: slight rotation + glow intensify
- Hover on unearned badge: show unlock condition tooltip
- Click: expand full detail modal

ANIMATION:
- Badge earn animation: badge drops from top with bounce + golden particles
- Star fill animation: stars fill one by one (100ms stagger)
```
