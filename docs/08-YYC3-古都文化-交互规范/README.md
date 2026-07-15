---
file: README.md
description: 08-古都文化 交互规范 · 状态/表单/操作闭环/快捷键/通知队列
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[interaction],[spec]
category: design
language: zh-CN
audience: developers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 08-YYC3-古都文化-交互规范

## 目录概述

本目录定义 YYC³ Dynasty 的完整交互规范，涵盖全局状态覆盖、表单校验、数据操作闭环（CRUD/批量/撤销重做）、键盘快捷键、实时更新、无限滚动等关键交互模式。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0801 | 状态覆盖 | 4态标准 + 6种附加状态 + 页面状态矩阵 + 通用交互规范 |
| 0802 | 表单校验 | P5校验规则 + 校验视觉3态 + 按钮状态机 + 草稿 + 自动保存 + Toast队列 |
| 0803 | 操作闭环 | CRUD矩阵 + 批量操作 + 撤销重做命令栈 + 实时更新 + 虚拟滚动 |
| 0804 | 快捷键盘 | 16+全局快捷键 + 右键菜单 + Tab导航 + Focus指示器 |

## 核心数据速查

```
状态/组件: 4态（Default/Hover/Active/Disabled）+ 6附加态
页面状态: 11页 × 5种状态矩阵
校验字段: 5字段（标题/紧急/六部/详情/类型）
CRUD操作: 6类（创建/查看/催办/撤回/封驳/归档）
快捷键: 17个全局快捷键
Toast队列: 4优先级 + 最大50条
撤销深度: 50步
```

## 设计原则

1. **状态全覆盖**：无未定义状态，每个组件每种状态均有明确定义
2. **反馈即时**：所有操作在 150ms 内给出视觉反馈
3. **容错设计**：关键操作必有确认弹窗 + 撤销通路

## 引用关系

- 上游：03-设计系统、07-组件库
- 下游：09-链路衔接 → 11-逻辑认证

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
