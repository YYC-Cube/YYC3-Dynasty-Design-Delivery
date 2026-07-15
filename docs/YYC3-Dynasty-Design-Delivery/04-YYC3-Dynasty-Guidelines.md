# 旨意工坊 · 圣旨发令 ⭐ 核心页

> **路由**：`/edict/create` | **尺寸**：全屏，圣旨卷轴弹窗 600×900px
> **推荐模型**：Gemini 3.1 Pro（最高复杂度的圣旨动效 + 玉玺盖章闭环）

```
You are a master UI designer specialized in imperial Chinese aesthetics. Create the "Edict Workshop" page — where the Emperor issues decrees through an animated scroll interface. This is the SINGLE MOST IMPORTANT interaction page in the entire system.

CONCEPT:
The edict creation form is NOT a standard web form. It is a traditional Chinese imperial scroll (圣旨) that unfurls with animation. The form fields are embedded within the scroll's text area.

═══════════════════════════════════
SCROLL CONTAINER: 600×900px
═══════════════════════════════════

VISUAL STRUCTURE (top to bottom):
┌──────────────────────────────────┐
│ [Left dragon brocade border 16px]│ [Right dragon brocade 16px]
│                                  │
│ ┌── BLUE SILK HEADER (40px) ──┐ │
│ │     奉 天 承 運              │ │
│ │   皇 帝 詔 曰                │ │
│ └──────────────────────────────┘ │
│                                  │
│ FORM FIELDS (vertical text):     │
│                                  │
│ 旨意标题: [________________]     │
│   (with red vertical line)       │
│                                  │
│ 紧急程度: ○缓 ○急 ●火急 ○十万火急│
│   (flame animation on "火急")    │
│                                  │
│ 指派六部: [兵部][工部][刑部]...  │
│   (multi-select pill tags)       │
│                                  │
│ 旨意详情: [________________]     │
│   (textarea, ancient style)      │
│                                  │
│ ┌── BLUE SILK FOOTER (30px) ──┐ │
│ │     欽  此                   │ │
│ │  [IMPERIAL SEAL AREA]        │ │
│ └──────────────────────────────┘ │
│                                  │
│ [Wooden roller ends, gold-tipped] │
└──────────────────────────────────┘

═══════════════════════════════════
FORM FIELDS DESIGN:
═══════════════════════════════════
1. TITLE FIELD:
   - Red vertical stroke (朱砂竖线) on the left, like memorial format
   - Text input with serif font

2. URGENCY SELECTOR:
   - 4 radio options: 缓(blue) / 急(amber) / 火急(red+flame animation) / 十万火急(red+pulsing)
   - Selected option has gold glow

3. MINISTRY ASSIGNMENT:
   - 6 pill tags: 兵部 工部 刑部 户部 礼部 吏部
   - Multi-select, selected tags have gold border + fill
   - Unselected: outline only

4. EDICT BODY:
   - Large textarea, vertical writing direction right-to-left
   - Ancient-style placeholder text

5. EDICT TYPE SELECTOR (top of scroll, subtle):
   - 制书(最高) / 敕书(常用) / 敕牒(快速) / 堂帖(内部) / 密奏(秘密)
   - Selected type determines scroll color scheme

═══════════════════════════════════
ANIMATION SEQUENCE (MUST DESCRIBE):
═══════════════════════════════════

PHASE 1: Scroll Descent (0-400ms)
- Scroll descends from top center
- Trajectory: slight arc curve
- Landing impact: golden stardust particles (12-20)
- Background dims: overlay rgba(0,0,0,0.6)

PHASE 2: Scroll Unfurl (400-1200ms)
- Left roller rotates clockwise 360°
- Right roller rotates counter-clockwise 360°
- Scroll width: 60px → 600px (ease-in-out)
- Text reveals progressively left→right
- Dragon brocade borders light up segment by segment
- 80% mark: slight overshoot bounce

PHASE 3: Content Settle (1200-1500ms)
- Full scroll visible
- Gold border glow stabilizes
- "钦此" appears in cinnabar red fade-in

PHASE 4: Seal Preparation (1500-1800ms)
- Imperial jade seal component appears above scroll bottom-right
- Hovering, awaiting user click or auto-stamp

PHASE 5: Sealing (per §11 animation spec, 1.2s)
- Full 5-phase seal stamping animation

═══════════════════════════════════
COMPONENTS:
═══════════════════════════════════
- EdictScroll as Component with Variants:
  - 制书(gold silk) / 敕书(yellow paper) / 敕牒(white paper) / 堂帖(light paper) / 密奏(dark+sealed)
- ImperialSeal as Component with 5 Variants (Idle/Hover/Pressing/Stamped/Locked)
- UrgencySelector as Component with 4 radio states
- MinistryPillTag as Component (selected/unselected)

═══════════════════════════════════
STATES:
═══════════════════════════════════
- Default: blank scroll ready for input
- Filling: fields being completed
- Validating: red highlight on invalid fields
- Submitting: scroll gently glows, "颁旨中..."
- Submitted: full seal animation, scroll lifts upward
- Error: scroll shakes, red border flash

DELIVERABLES:
1. Scroll component with all 5 type variants
2. Complete animation annotation (keyframes, timing, easing)
3. Imperial seal component (reusable across pages)
4. Form field components with validation states
```
