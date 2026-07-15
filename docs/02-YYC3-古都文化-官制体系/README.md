---
file: README.md
description: 02-古都文化 官制体系 · 三省六部权责与天子驾六状态机
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[culture],[government]
category: design
language: zh-CN
audience: developers,designers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 02-YYC3-古都文化-官制体系

## 目录概述

本目录定义 YYC³ Dynasty 的治理架构——三省六部权责体系和天子驾六状态机。三省分权制衡，六部专责执行，天子驾六实时映射系统健康状态。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0201 | 三省部曲 | 三省六部权责定义、系统角色映射、权力流转拓扑 |
| 0202 | 天子驾六 | 六马对应六部、健康状态定义、动效参数、状态机流转规则 |

## 核心数据速查

```
三省: 中书省（草拟）/ 门下省（审议）/ 尚书省（派发）
六部: 户部/吏部/兵部/刑部/工部/礼部
六马: 骅骝/騄駬/骊驹/騑騑/骐骥/騋牝
健康态: 3级（Normal / Warning / Error）
流转阶段: 7级（下旨→分拣→草拟→审议→派发→执行→归档）
```

## 设计原则

1. **三权分立**：草拟/审议/派发严格分离，不可跨阙操作
2. **执行闭环**：旨意创建→流转→归档 全链路闭环
3. **健康可视**：六马即六部，一马异常则系统预警

## 引用关系

- 上游：01-洛阳史考
- 下游：03-设计系统 → 04-动效系统 → 08-交互规范

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
