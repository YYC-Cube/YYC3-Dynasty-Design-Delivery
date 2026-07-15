# 十三王朝时间轴 · 洛邑千年

> **路由**：`/timeline` | **尺寸**：全屏，max-width 1000px
> **推荐模型**：Gemini 3.1 Pro

---

```
You are a historian and information architect. Create the "Thirteen Dynasties Timeline" page for YYC³ Dynasty — an AI platform that maps Chinese civilization's cultural peaks to AI skills.

FRAME: 1440×1080px. Paper-like dark background (#1E180E).

═══════════════════════════════════
TOP SECTION:
═══════════════════════════════════
- Title: "十三王朝" (serif, gold, 32px)
- Subtitle: "中华文明五千年 · 智能新范式" (14px, secondary gold)

═══════════════════════════════════
DYNASTY SELECTOR (horizontal row):
═══════════════════════════════════
13 circular icon buttons in chronological order:
夏 / 商 / 西周 / 东周 / 东汉 / 曹魏 / 西晋 / 北魏 / 隋 / 唐(武周) / 后梁 / 后唐 / 后晋

Each button: 44×44px circle with dynasty name in ancient style
- Default: outline only, rgba(212,168,67,0.2)
- Selected: solid gold fill (#d4a843) + white text
- Hover: border brightens

═══════════════════════════════════
DYNASTY INFO BANNER (below selector):
═══════════════════════════════════
For the selected dynasty, show:
- Dynasty name (large, gold)
- Period (e.g., "618–907")
- Capital city
- Cultural peak description
Background: semi-transparent gold overlay

═══════════════════════════════════
CATEGORY FILTER TABS:
═══════════════════════════════════
全部 / 治理 / 礼乐 / 文韬 / 革新 / 盛世 / 警世
Pill-shaped tags, selected one has gold fill.

═══════════════════════════════════
SKILL CARDS (2-column grid):
═══════════════════════════════════
Each card represents an AI Skill mapped to a cultural achievement:
- Left: 40×40px icon
- Title + category tag (colored pill)
- Description (2 lines max)
- Keyword tags (small pills)
- Right: toggle switch (active/inactive)

Example: 唐诗品鉴 card
  Icon: 📜 | Title: 唐诗品鉴 | Tag: 文学
  Desc: 初盛中晚四唐风格流变解析
  Keywords: 唐诗 · 李白 · 杜甫 · 律诗
  Toggle: ON (gold)

COMPONENTS:
- 13 dynasty selector buttons as Component with Variants (default/selected)
- Skill cards as Component with Variants (default/hover, active/inactive toggle)
- Category filter tags as Component

STATES:
- Loading: skeleton cards with golden shimmer
- Empty: "此朝代暂无可用技能" with cloud pattern
- Error: red banner "数据加载失败，请重新选择朝代"
```
