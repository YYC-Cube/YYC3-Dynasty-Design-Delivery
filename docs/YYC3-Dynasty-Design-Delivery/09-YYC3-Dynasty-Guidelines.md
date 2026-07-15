# 太史监候 · 系统监控台

> **路由**：`/monitor` | **尺寸**：全屏，max-width 1200px
> **推荐模型**：Gemini 3.1 Pro

```
You are a data visualization expert specializing in system monitoring dashboards. Create the "Imperial Observatory" (太史监候) system monitoring page for YYC³ Dynasty — styled as an ancient Chinese astronomical observatory monitoring modern AI system health.

CONCEPT:
The page visualizes system health through the metaphor of ancient Chinese astronomy: "观星知运，察象明机" (Observe stars to know fortune, examine phenomena to understand mechanisms).

FRAME: 1440×1200px, dark theme.

═══════════════════════════════════
HEADER:
═══════════════════════════════════
- Title: "🔭 太 史 监 候" (serif, gold, 32px)
- Subtitle: "观星辰之变 · 察万象之机" (14px, secondary)
- Real-time clock: "永熙三年·午时三刻" (mono font, gold, update every second)
- Auto-refresh indicator: "每 30 秒观星一次 ●" (green dot pulsing)

═══════════════════════════════════
SECTION 1: CELESTIAL HEALTH OVERVIEW (3 KPI cards, horizontal)
═══════════════════════════════════
┌──────────────────┬──────────────────┬──────────────────┐
│ 🌟 紫微星         │ ⭐ 北斗七星       │ 🌙 太阴星         │
│ System Health    │ Active Alerts    │ Uptime           │
│ ████████░░ 92%   │ 3  active        │ 127d 14h 32m     │
│ 正常运行          │ 2 warning · 1 err │ since 永熙三年    │
│ (green glow)     │ (amber pulse)    │ (stable)         │
└──────────────────┴──────────────────┴──────────────────┘

SECTION 2: SIX MINISTRIES HEALTH (天子驾六 full view)
═══════════════════════════════════
6 cards in 2 rows × 3 columns, each showing:
┌──────────────────────────────────────────────┐
│ ⚔️ 兵部 · 大司马                              │
│ ─────────────────────────────────────────── │
│ 状态: ● Online (green, pulsing)              │
│ 令牌: 🐟🐟🐟░░░ (3/5 available)              │
│ 当前任务: 4 active / 12 completed today       │
│ 平均响应: 2.3s / 平均耗时: 1h42m              │
│ 异常率: 0.3% (↓ 0.1% vs yesterday)          │
│ ─────────────────────────────────────────── │
│ Workload: ████████░░ 78%                    │
│ Health:   ██████████ 96%                    │
└──────────────────────────────────────────────┘

Each ministry card has 3 states:
- Normal: bronze border, green metrics
- Warning: mud-gold border, amber highlight on problematic metric
- Error: cinnabar border, red error metric + pulsing

SECTION 3: REAL-TIME EVENT STREAM (天文志·实时天象)
═══════════════════════════════════
Live scrolling log of system events, newest at top:
┌──────────────────────────────────────────────┐
│ 📜 天文志 · 实时天象                   [暂停 ⏸] │
│ ─────────────────────────────────────────── │
│ [午时三刻] 🌟 祥瑞 · 敕令 edict-045 办结归档  │
│ [午时二刻] ⚠️ 异象 · 兵部令牌数低于阈值(2/5)  │
│ [午时一刻] 🔥 灾异 · 刑部扫描发现异常访问      │
│ [巳时四刻] 🌟 祥瑞 · 门下省通过 edict-043     │
│ [巳时三刻] 📊 日表 · 户部算力消耗达75%         │
│ [巳时二刻] 🌟 祥瑞 · 中书省完成 edict-042      │
│ [巳时一刻] 🔥 灾异 · 工部CI/CD流水线失败       │
└──────────────────────────────────────────────┘

Event types:
- 🌟 祥瑞 (Auspicious): task completed, approval passed, system normal
- ⚠️ 异象 (Anomaly): token low, response time high, approaching threshold
- 🔥 灾异 (Calamity): error, failure, security breach, timeout
- 📊 日表 (Daily): periodic statistics, resource usage report

SECTION 4: PERFORMANCE CHARTS (司天监·星图)
═══════════════════════════════════
2 charts side by side:
LEFT — 24h Edict Flow (折线图·星轨)
  X-axis: 时辰 (子丑寅卯辰巳午未申酉戌亥, 12 segments)
  Y-axis: 敕令数量
  Line 1 (gold): 创建数
  Line 2 (green): 办结数
  Line 3 (red): 封驳数

RIGHT — Ministry Response Time (雷达图·分野)
  6-axis radar: 户部/礼部/兵部/刑部/工部/吏部
  Each axis: avg response time
  Target line (dashed gold): 3s threshold
  Area fill: semi-transparent green (within target) / red (exceeding)

SECTION 5: SYSTEM RESOURCES (司农监·仓廪)
═══════════════════════════════════
┌──────────────────┬──────────────────┬──────────────────┐
│ 🗄️ 户部·仓廪      │ 🧠 礼部·典籍      │ ⚡ 工部·匠坊      │
│ Storage: 67%     │ Knowledge: 1.2M  │ Pipeline: 8/10  │
│ ████████░░░░     │ 文档数: 4,287     │ 今日构建: 23     │
│ 2.1TB / 3.2TB   │ 命中率: 94.2%     │ 成功率: 95.6%    │
│ ─────────────────│ ─────────────────│ ─────────────────│
│ ⚔️ 兵部·武库      │ 🔒 刑部·诏狱      │ 📋 吏部·铨选      │
│ Deploys: 15/d    │ 漏洞: 2 (中危)    │ Agents: 12/12   │
│ Rollback: 2.1%  │ 扫描: 已完成       │ 在线率: 100%     │
│ Uptime: 99.93%  │ 修复率: 87.5%     │ 满意度: 4.8/5    │
└──────────────────┴──────────────────┴──────────────────┘

SECTION 6: ALERT RULES CONFIG (钦天监·律历)
═══════════════════════════════════
Collapsible table showing current alert thresholds:
| 星象 | 监测指标 | 阈值 | 当前值 | 状态 |
|------|---------|------|--------|------|
| 荧惑守心 | 兵部异常率 | >5% | 0.3% | ✅ |
| 太白经天 | 工部部署失败 | >3次/日 | 1次 | ✅ |
| 彗星袭月 | 令牌耗尽 | =0 | 3/5 | ⚠️ |
| 日蚀之变 | 全局响应超时 | >10s | 2.1s | ✅ |
| 月掩岁星 | 存储超限 | >90% | 67% | ✅ |

Each row: expandable to show recent alert history.

═══════════════════════════════════
COMPONENTS:
═══════════════════════════════════
- HealthKPICard as Component (3 variants: normal/warning/error)
- MinistryHealthCard as Component (6 variants × 3 states)
- EventStreamItem as Component (4 event type variants)
- SimpleLineChart as Component (configurable data)
- RadarChart as Component (6-axis)
- ResourceCard as Component (6 variants)
- AlertRuleRow as Component

STATES:
- Loading: constellation skeleton (stars connecting with lines)
- Empty: "万象俱寂，暂无天象记录" with starfield background
- Error: "观星台失联，钦天监正在修复中..."
- Real-time: streaming event log with auto-scroll
```