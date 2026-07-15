---
file: README.md
description: 04-古都文化 动效系统 · 玉玺盖章/圣旨展开/全局动效清单
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[animation],[effects]
category: design
language: zh-CN
audience: designers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 04-YYC3-古都文化-动效系统

## 目录概述

本目录定义 YYC³ Dynasty 的核心动效系统，包含玉玺盖章（1.2s）、圣旨展开（1.8s）两段品牌级动效分镜，以及页面级/组件级/墨韵特效/状态机动画的完整参数清单。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0401 | 玉玺盖章 | 5阶段×1.2s 分镜设计 + Smart Animate 参数 + 粒子系统 |
| 0402 | 圣旨展开 | 4阶段×1.8s 分镜设计 + 尺寸规格 + 4种变体 |
| 0403 | 全局动效 | 页面级/组件级/墨韵特效/状态机/动效计时对照表 |

## 核心数据速查

```
品牌动效: 玉玺盖章 1.2s（5阶段）/ 圣旨展开 1.8s（4阶段）
页面过渡: 400ms
交互反馈: 150-500ms
环境动效: 3s-30s 循环
墨韵特效: 4种（墨滴/批红/笔走龙蛇/云开见日）
动效总量: 20+ 条定义
```

## 设计原则

1. **品牌即动效**：玉玺盖章和圣旨展开为品牌识别性动效
2. **节奏体系**：品牌 > 页面 > 交互 > 环境 四级节奏
3. **性能优先**：环境动效使用 CSS only，不使用 JavaScript 驱动

## 引用关系

- 上游：03-设计系统
- 下游：06-页面提示 → 07-组件库

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
