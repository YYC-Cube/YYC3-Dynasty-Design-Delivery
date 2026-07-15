---
file: README.md
description: 05-古都文化 模型策略 · 五模型选型与提示词四阶段
author: YYC³ Dynasty Team <admin@0379.email>
version: v1.0.0
created: 2026-06-14
updated: 2026-06-14
status: published
tags: [guide],[ai],[model],[prompt]
category: technical
language: zh-CN
audience: designers,developers
complexity: intermediate
---

> **_YanYuCloudCube_**
> **_YYC³ Dynasty · 古都文化_**
> **_三省以治，六部以行_**

# 05-YYC3-古都文化-模型策略

## 目录概述

本目录定义 Figma Make 五大AI模型的差异化选型策略与提示词四阶段方法论。核心目标是"模型选型→初始提示词→迭代提示词→校验闭环"四阶段完整链路。

## 子文件清单

| 编号 | 文件名称 | 核心内容 |
|------|---------|---------|
| 0501 | 选型矩阵 | 5模型能力画像 + 四层分层策略 + 模型切换策略 |
| 0502 | 提示四段 | Brief→Delta→Check→Polish 四阶段提示词模板 |

## 核心数据速查

```
模型总量: 5个（Gemini 3 Flash / Claude Sonnet 4.6 / Gemini 3.1 Pro / Claude Opus / GPT-5.5）
分层策略: 4层（架构筑基 / 核心页面 / 标准页面 / 迭代微调）
提示阶段: 4段（初始 / 增量 / 校验 / 交付）
最佳搭档: Claude Opus（架构）+ Gemini 3.1 Pro（创意）+ Claude Sonnet 4.6（标准）
```

## 设计原则

1. **因模制宜**：不同模型能力画像决定不同任务分配
2. **Credits 效率**：高消耗模型用于高价值任务
3. **人机协同**：模型生成 + 人工审校，不做全自动无审核生成

## 引用关系

- 上游：03-设计系统、04-动效系统
- 下游：06-页面提示（提示词模板的实际应用）

---

> **言启象限 | 语枢未来** — Words Initiate Quadrants, Language Serves as Core
