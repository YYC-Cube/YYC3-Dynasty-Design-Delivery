---
file: README.md
description: 10-古都文化 实操交付 · Figma Variables/动画/无障碍/交接清单
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[handoff],[figma],[a11y]
category: design
language: zh-CN
audience: designers,developers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 10-YYC3-古都文化-实操交付

## 目录概述

本目录定义从 Figma 到代码的完整实操传递规范，涵盖 Figma Variables 与 Design Tokens 映射、Smart Animate 参数配置、无障碍（A11y）标注规范和完整交接清单。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 1001 | Variables | Variables Collection 定义 + 8组件绑定规范 + JSON导出格式 |
| 1002 | 智能动画 | 玉玺盖章/圣旨展开/页面过渡/状态机 Smart Animate 参数 |
| 1003 | 无障碍规范 | 色彩对比度/焦点指示器/ARIA标注/键盘快捷键/可读性 |
| 1004 | 交接清单 | 交付包结构/Component Properties/Instance Swap/导出命名 |

## 核心数据速查

```
Variables: 70+ 定义（Color/Spacing/Radius/Typography/Shadow/Border/Animation）
组件Properties: 6个核心组件（EdictStepBar/DynastyButton/MinistryCard/SealChain/DynastyNavbar/SearchPalette）
A11y: WCAG AA 达标，13.5:1 最高对比度
交付包: 11页面Spec + 6组件Spec + Tokens JSON + 动效JSON
```

## 设计原则

1. **Variables 即契约**：所有设计值均绑定 Figma Variable，不写死
2. **一份源**：Design Tokens JSON 为唯一数据源
3. **A11y 从设计开始**：色彩对比度、Focus Ring、ARIA在设计中内置

## 引用关系

- 上游：09-链路衔接
- 下游：11-逻辑认证

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
