---
file: 1001-YYC3-实操交付-Variables.md
description: Figma Variables 完整定义与组件绑定规范
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [figma],[variables],[tokens],[design-tokens]
category: design
language: zh-CN
audience: designers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 实操交付_**
> **_三省以治，六部以行_**

# Figma Variables 与 Design Tokens 映射

## 一、完整 Variables 定义

```
Figma Variable Collection: "YYC3 Dynasty"

├── Color/
│   ├── bg/primary          → #0a0e17 (玄墨)
│   ├── bg/secondary        → #1a1f2e (黛蓝)
│   ├── bg/tertiary         → #242b3d (深黛)
│   ├── text/primary        → #e5e7eb (霜白)
│   ├── text/secondary      → #9ca3af (墨灰)
│   ├── accent/gold         → #d4a843 (鎏金)
│   ├── accent/vermillion    → #c2414b (朱砂)
│   ├── accent/azure        → #3b82f6 (石青)
│   ├── accent/amber        → #f59e0b (藤黄)
│   ├── accent/emerald      → #10b981 (翠涛)
│   ├── accent/purple       → #8b5cf6 (绀紫)
│   └── semantic/success    → #10b981
│       semantic/warning    → #f59e0b
│       semantic/error      → #c2414b
│       semantic/info       → #3b82f6
│
├── Spacing/        （xs→3xl: 4px→64px）
├── Radius/         （none→full: 0px→9999px）
├── Typography/     （3家族 + 5字号 + 5字重）
├── Shadow/         （sm→glow: 5级）
├── Border/         （width + color: 4组）
└── Animation/      （duration + easing: 7组）
```

## 二、组件属性绑定规范

| 组件 | 关键绑定 |
|------|---------|
| DynastyButton | bg→gold, border-color→active, text→primary, radius→md |
| EdictStepBar | step-active→emerald, pending→tertiary, vetoed→vermillion |
| SealChain | seal-size=48px, line-color→gold, gap→md |
| NotificationCenter | panel-bg→secondary, hover→tertiary, badge→vermillion |
| SearchPalette | overlay→rgba(0,0,0,0.7), input-bg→secondary |
| Toast | p0→vermillion, p1→amber, p2→azure, p3→secondary |
| MinistryCard | card-bg→secondary, hover-shadow→glow, border-radius→lg |
| DynastyNavbar | navbar-bg→rgba(10,14,23,0.95), indicator→gold, h:56px |

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
