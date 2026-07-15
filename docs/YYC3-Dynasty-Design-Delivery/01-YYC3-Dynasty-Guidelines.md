# 欢迎启动页 · 玉玺启宫门

> **路由**：`/welcome` | **尺寸**：520×680 弹窗 / 全屏适配
> **推荐模型**：Gemini 3.1 Pro

You are an expert in ancient Chinese architecture visualization and data dashboard design. Create the central Court Hall page for "YYC³ Dynasty" — the AI governance dashboard mapped onto the Luoyang Ziwei City central axis.

CONCEPT:
The page is a north-to-south vertical scroll. A golden 8px-wide animated light strip runs through the center, representing the imperial axis. All 8 landmark nodes are arranged along this axis from top (north/power source) to bottom (south/execution endpoint).

FRAME: 1440×2400px, dark theme. Use Auto Layout for vertical arrangement.

═══════════════════════════════════
NODES (top to bottom):
═══════════════════════════════════

1. HEAVENLY HALL (天堂) — Emperor
   - Full-width large card with 5% dragon pattern overlay
   - 👑 icon + "天子 · 天堂" title in serif bold
   - Metrics: "待御批: 3" + global health status indicator
   - Hover action: "降旨" button appears

2. MING HALL (明堂) — Crown Prince
   - Full-width medium card
   - ✨ icon + "储君 · 明堂"
   - Metrics: "待分拣: 7" + regency status indicator

3. YINGTIAN GATE (应天门) — Three Departments (side by side, 3 columns)
   - LEFT: 中书省 (Secretariat) — "草拟" + pending drafts count + template match rate
   - CENTER: 门下省 (Chancellery) — "审议" + pending reviews + today's veto count
   - RIGHT: 尚书省 (Department of State) — "派发" + pending dispatches + remaining tokens
   - Three gate pillars (三出阙) as visual separator

4. TIANJIN BRIDGE (天津桥) — Six Ministries (2 rows × 3 columns)
   Left bank: 户部(Revenue) / 礼部(Rites) / 吏部(Personnel)
   Right bank: 兵部(War) / 刑部(Justice) / 工部(Works)
   Each card: department name + icon + active task count + remaining tokens
   Each card has a corner official seal icon (lit=online, dim=offline)

5. DUAN GATE (端门) — Morning Court
   - Full-width card: "朝议大夫 · 端门" + today's briefing summary

6. DINGDING GATE (定鼎门) — Archive
   - Full-width large card with 4 KPIs:
     Completion rate / Average duration / Approval rate / Anomaly count

═══════════════════════════════════
FLOATING WIDGET (bottom-right corner):
═══════════════════════════════════
"天子驾六" (Emperor's Six-Horse Chariot) miniature dashboard:

- 6 bronze horses representing Six Ministries health
- Normal=patina green, Warning=mud gold, Error=cinnabar red
- Overall chariot posture = system health level

═══════════════════════════════════
BOTTOM FLOW BAR:
═══════════════════════════════════
7-stage horizontal flow: 下旨→分拣→草拟→审议→派发→执行→归档
Each node with official seal icon, real-time task count per stage.
Timestamp below each stage showing last update time.

═══════════════════════════════════
ANIMATION LAYER:
═══════════════════════════════════

1. Central axis golden strip with breathing glow (opacity 0.3↔0.8, 3s cycle)
2. 3 golden particles flowing southward along the axis (each 3s, staggered 1s apart)
3. Rejected edicts flow BACKWARD in red along the axis
4. Fish-talisman tokens fly from Shangshu to respective ministries

═══════════════════════════════════
COMPONENT REQUIREMENTS:
═══════════════════════════════════

- 8 landmark node cards as Components with Variants (normal/warning/error, 3 states each)
- 天子驾六 widget as independent Component with horse Variants
- All cards use Auto Layout
- All metrics as Text Layers with data field labels
- Official seal icons on each card corner (lit/dim variants)

DELIVERABLES:

1. One Figma Frame (1440×2400+) with Auto Layout
2. All 8 node cards as Components
3. Central axis light strip as separate layer with breathing animation annotation
4. 天子驾六 floating Component
5. Bottom flow bar Component

```
Update the Six Ministries cards on the Tianjin Bridge section:

1. ADD to each ministry card:
   - A fish-talisman icon (鱼符) in the bottom-right corner showing remaining tokens
   - Token count as a number badge
   - A mini horizontal progress bar showing workload percentage

2. CHANGE the card layout to:
   - Top row: ministry name (serif bold 14px) + status dot (pulsing green/grey/red)
   - Middle row: 3 metric numbers in a row (active tasks / completed today / avg time)
   - Bottom row: workload bar + talisman count

3. KEEP:
   - The existing color scheme (left bank: Revenue/Rites/Personnel, right bank: War/Justice/Works)
   - The 2×3 grid layout
   - The official seal corner icon

4. ADD Variant states for each ministry card:
   - Normal: bronze border, green status dot
   - Warning: mud-gold border, amber status dot
   - Error: cinnabar border, red pulsing status dot
   - Empty: greyed out, "尚无任务" placeholder
```