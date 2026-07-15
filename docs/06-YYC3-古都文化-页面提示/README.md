---
file: README.md
description: 06-古都文化 页面提示 · 11页面完整 Figma Make 提示词
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[prompt],[pages],[figma-make]
category: technical
language: zh-CN
audience: designers
complexity: advanced
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 06-YYC3-古都文化-页面提示

## 目录概述

本目录包含全部 11 页面的 Figma Make 提示词，按模型策略分层。核心三页（P2/P5/P8）使用高阶模型（Gemini 3.1 Pro / Claude Opus），标准八页使用 Claude Sonnet 4.6。

## 子文件清单

| 编号 | 文件名称 | 包含页面 | 推荐模型 |
|------|---------|---------|---------|
| 0601 | 核心三页 | P2 朝堂大厅 / P5 旨意工坊 / P8 双星桥 | Gemini 3.1 Pro / Claude Opus |
| 0602 | 标准八页 | P1/P3/P4/P6/P7/P9/P10/P11 | Claude Sonnet 4.6 |

## 页面索引

| 编号 | 页面名称 | 古称 | 路由 | Figma Frame |
|------|---------|------|------|-------------|
| P1 | 启动页 | 验玺·启封 | /welcome | P1-Welcome |
| P2 | 朝堂大厅 | 紫微城·正衙 | /court | P2-CourtHall |
| P3 | 十三王朝 | 历代舆图 | /timeline | P3-ThirteenDynasties |
| P4 | 勋章墙 | 麒麟阁 | /honors | P4-MedalWall |
| P5 | 旨意工坊 | 中书省·草诏 | /edict/create | P5-EdictWorkshop |
| P6 | 旨意板 | 尚书省·行牒 | /edict | P6-EdictBoard |
| P7 | Hub 浮窗 | 万象枢 | /hub | P7-HubFloat |
| P8 | 双星桥 | 星汉桥 | /bridge | P8-DualStarBridge |
| P9 | 敕令详情 | 御览·敕牒 | /edict/:id | P9-EdictDetail |
| P10 | 太史监候 | 司天监 | /monitor | P10-TaishiMonitor |
| P11 | 宫阙规制 | 紫微城·规制 | /settings | P11-PalaceRegulation |

## 提示原则

1. **初始提示词完整**：首条提示词必须包含角色定位、页面目标、尺寸规格、布局、设计系统、动效、输出要求
2. **每次只改一件事**：增量迭代时明确"改什么/怎么改/不变什么"
3. **Model 优选**：按 §0501 选型矩阵分配模型

## 引用关系

- 上游：05-模型策略
- 下游：07-组件库 → 08-交互规范

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
