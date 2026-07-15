---
file: README.md
description: 07-古都文化 组件库 · 基础组件与业务组件完整清单
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[components]
category: design
language: zh-CN
audience: designers,developers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 07-YYC3-古都文化-组件库

## 目录概述

本目录定义 YYC³ Dynasty 的完整组件库，包含基础组件（导航/反馈/表单）和业务组件（玉玺/圣旨/六部卡片/阶段条/签章链等），共计 13+ 组件。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0701 | 基础组件 | DynastyNavbar / EdictScroll / Toast / SearchPalette / 表单组件 |
| 0702 | 业务组件 | ImperialSeal / EdictStepBar / SealChain / MinistryCard / DynastyButton / MedalCard |

## 组件索引

| 组件名称 | 类型 | 使用页面 |
|---------|------|---------|
| ImperialSeal | 玉玺组件 | P1/P5/P9/全局 |
| EdictScroll | 圣旨卷轴 | P5/P9 |
| DynastyNavbar | 全局导航 | 所有页面 |
| MinistryCard | 六部卡片 | P2 |
| EdictStepBar | 阶段进度条 | P6/P9 |
| SealChain | 签章链 | P6/P9 |
| DynastyButton | 朝代按钮 | P3/P8 |
| MedalCard | 勋章卡片 | P4 |
| SearchPalette | 搜索面板 | 全局 |
| NotificationCenter | 通知中心 | 全局 |
| Toast | 通知提示 | 全局 |
| Breadcrumb | 面包屑 | 所有页面（P1除外） |
| SideQuickEntry | 侧边快捷入口 | P2 |

## 设计原则

1. **四态覆盖**：每个组件必覆盖 Default/Hover/Active/Disabled
2. **Variant 驱动**：状态变化使用 Variant（非单独组件）
3. **Auto Layout**：所有组件基于 Auto Layout 构建

## 引用关系

- 上游：06-页面提示
- 下游：08-交互规范 → 09-链路衔接

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
