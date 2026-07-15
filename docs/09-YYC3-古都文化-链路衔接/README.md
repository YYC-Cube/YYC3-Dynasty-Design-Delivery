---
file: README.md
description: 09-古都文化 链路衔接 · 导航/路由/状态/通知/搜索/守卫/深链
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[routing],[navigation],[state]
category: design
language: zh-CN
audience: developers,architects
complexity: advanced
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 09-YYC3-古都文化-链路衔接

## 目录概述

本目录定义 YYC³ Dynasty 的全链路衔接系统，涵盖全局导航、页面路由与数据流、全局状态管理、通知系统、全局搜索、路由守卫与深度链接、跨标签页同步等关键链路。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0901 | 导航系统 | 导航栏4项 + 面包屑 + 侧边入口 + 通知中心入口 |
| 0902 | 路由数据 | 11条路由表 + 旨意全链路数据流 + 数据一致性约束 |
| 0903 | 状态管理 | 5个Store + 全局加载态 + 三级通知 + 全局搜索 |
| 0904 | 守卫深链 | 3层路由守卫 + 7种深链场景 + URL同步 + 跨标签同步 |

## 核心数据速查

```
路由表: 11条（含参数+权限）
Store: 5个（edict/ministry/persona/dynasty/notification）
路由守卫: 3层（全局/路由级/资源级）
深链场景: 7种（敕令详情/朝代/朝堂/筛选/Family/设置/锁定恢复）
通知: 4级优先级（P0-P3）
搜索: 4分类覆盖（敕令/朝代/朝臣/Skill）
```

## 设计原则

1. **单源真理**：全局状态使用 Zustand Store，页面间共享同一实例
2. **三级守卫**：全局 → 路由级 → 资源级，层层递进
3. **深链可达**：任意页面/状态均可通过 URL 直达

## 引用关系

- 上游：08-交互规范
- 下游：10-实操交付 → 11-逻辑认证

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
