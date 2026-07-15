# YYC3-Dynasty-复用分析报告

**分析目标**: `/Volumes/Max/YYC3-Dynasty-Framework`
**分析日期**: 2026-07-16
**排除范围**: UI/UX 设计元素（颜色主题、布局样式、图标、动画等视觉呈现层）
**评估维度**: 技术实现质量、依赖耦合度、通用性、复用价值、实施难度

---

## 一、项目架构概览

```
YYC3-Dynasty-Framework/
├── edict/backend/          # Python FastAPI 后端 — 事件驱动多 Agent 协作引擎
├── edict/frontend/         # React 18 + TypeScript 前端 — 看板 Dashboard
├── scripts/                # Python 工具脚本 — 数据同步、文件锁、配置管理
├── tests/                  # 测试套件 — pytest
├── agents/                 # Agent 人格定义（SOUL.md）
├── edict/migration/        # Alembic 数据库迁移
└── docker/                 # Docker 部署配置
```

---

## 二、可复用模块详细评估

### 类别 A：事件驱动架构核心（极高复用价值）

---

#### A1. Redis Streams 事件总线

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/services/event_bus.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/services/event_bus.py) |
| **功能描述** | 基于 Redis Streams 的可靠事件发布/订阅系统，支持消费者组、ACK 确认、超时事件自动认领、多 Topic 多消费者组并发消费 |
| **技术实现** | `redis.asyncio` + `XADD/XREADGROUP/XACK/XAUTOCLAIM` + Pub/Sub 双通道（Stream 持久化 + Pub/Sub 实时推送） |
| **核心能力** | `publish()` / `subscribe()` / `consume()` / `ack()` / `get_pending()` / `claim_stale()` / `consume_multi()` / `stream_info()` |
| **依赖** | `redis[hiredis]>=5.2.0`, `pydantic-settings` |
| **复用价值** | **极高** — 通用事件驱动架构基座，可应用于任何需要异步事件解耦的场景（任务调度、消息通知、数据同步、工作流引擎） |
| **实施建议** | 作为独立 Python 包抽取（如 `yyc3-event-bus`），仅依赖 `redis` 和 `pydantic-settings`。可直接复用到微服务间通信、异步任务编排、实时数据推送等场景 |

---

#### A2. Transactional Outbox Pattern

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/models/outbox.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/outbox.py) + [edict/backend/app/workers/outbox_relay.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/workers/outbox_relay.py) |
| **功能描述** | 解决 DB/Event 双写不一致问题：事件先与业务数据写入同一事务（`outbox_events` 表），再由专用 Relay Worker 异步投递到 Redis Streams |
| **技术实现** | SQLAlchemy ORM + `FOR UPDATE SKIP LOCKED` 并发安全轮询 + 幂等投递（event_id） + 重试上限自动 DLQ |
| **核心能力** | `OutboxEvent` 模型（event_id 幂等、published 标记、attempts 重试计数、last_error 记录）、`OutboxRelay` 轮询投递器（批量处理、多实例并行、优雅关闭） |
| **依赖** | SQLAlchemy 2.0+, Redis（通过 EventBus） |
| **复用价值** | **极高** — 事务性发件箱模式是分布式系统的标准模式，适用于任何需要"先写DB再发消息"的场景 |
| **实施建议** | 可抽取为独立库，适配不同的消息中间件（Kafka/RabbitMQ/NATS），核心是 `OutboxEvent` 表结构 + `OutboxRelay` 轮询逻辑 |

---

#### A3. 任务状态机引擎

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/models/task.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/task.py) (L32-L65) |
| **功能描述** | 声明式状态转换表 `STATE_TRANSITIONS`，定义合法状态跳转路径，支持阻塞态任意回退、终态不可逆、状态→Agent 映射、状态→部门映射 |
| **技术实现** | Python `enum.Enum` + `dict[State, set[State]]` 邻接表，配合 `TaskService.transition_state()` 进行运行时校验 |
| **核心能力** | `STATE_TRANSITIONS`（状态转换图）、`TERMINAL_STATES`（终态集合）、`STATE_AGENT_MAP`（状态→Agent映射）、`ORG_AGENT_MAP`（部门→Agent映射） |
| **依赖** | 无外部依赖（纯 Python 数据结构） |
| **复用价值** | **极高** — 声明式状态机是工作流引擎、审批流、任务调度等场景的通用模式 |
| **实施建议** | 抽取为独立 `StateMachine` 类，支持 JSON/YAML 配置化定义转换规则，支持运行时动态扩展。CI 守卫测试已有成熟模式（[test_state_machine_consistency.py](file:///Volumes/Max/YYC3-Dynasty-Framework/tests/test_state_machine_consistency.py)） |

---

#### A4. WebSocket 实时推送

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/api/websocket.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/api/websocket.py) |
| **功能描述** | FastAPI WebSocket 端点，订阅 Redis Pub/Sub 频道，将事件实时推送到前端，替代 HTTP 轮询 |
| **技术实现** | FastAPI WebSocket + `redis.asyncio` Pub/Sub + `asyncio.gather` 并发处理（事件推送 + 客户端消息） + 连接管理（`_connections` 集合） + 心跳 ping/pong |
| **核心能力** | 模式订阅 `psubscribe("edict:pubsub:*")`、事件中继 `_relay_events()`、客户端消息处理 `_handle_client_messages()`（ping/pong、subscribe 过滤） |
| **依赖** | FastAPI, redis, asyncio |
| **复用价值** | **高** — 适合任何需要实时数据推送的 Web 应用 |
| **实施建议** | 可抽取为 FastAPI 中间件/插件，支持 topic 过滤、连接认证、断线重连状态同步 |

---

### 类别 B：工具库与基础设施（高复用价值）

---

#### B1. 平台无关文件锁

| 属性 | 详情 |
|------|------|
| **位置** | [scripts/file_lock.py](file:///Volumes/Max/YYC3-Dynasty-Framework/scripts/file_lock.py) |
| **功能描述** | 跨平台原子性 JSON 文件读写，支持 macOS/Linux（`fcntl.flock`）和 Windows（`msvcrt.locking`），保证多进程并发安全 |
| **技术实现** | 平台抽象层（`_lock_shared` / `_lock_exclusive` / `_unlock`）+ 原子写入（先写临时文件再 `os.replace`）+ 读-改-写原子操作（全程持锁） |
| **核心能力** | `atomic_json_read()` / `atomic_json_write()` / `atomic_json_update(modifier)` |
| **依赖** | 无外部依赖（纯 Python 标准库） |
| **复用价值** | **极高** — 零依赖、跨平台、可直接复制到任何需要文件级并发的 Python 项目 |
| **实施建议** | 直接复用到当前项目 [YYC3-Dynasty-Design-Delivery](file:///Users/yanyu/YYC-Cube/YYC3-Dynasty-Design-Delivery) 的配置管理、缓存、数据持久化等场景。测试覆盖完善（[test_file_lock.py](file:///Volumes/Max/YYC3-Dynasty-Framework/tests/test_file_lock.py)） |

---

#### B2. 通用工具函数集

| 属性 | 详情 |
|------|------|
| **位置** | [scripts/utils.py](file:///Volumes/Max/YYC3-Dynasty-Framework/scripts/utils.py) |
| **功能描述** | 项目级公共工具函数集合，避免跨脚本重复定义 |
| **技术实现** | 纯 Python 标准库 |
| **核心能力** | `read_json()`（安全JSON读取）、`get_openclaw_home()`（环境感知路径解析）、`now_iso()`（UTC ISO 8601时间）、`today_str()`（日期格式化）、`safe_name()`（字符白名单校验）、`validate_url()`（防 SSRF 的 URL 校验——含内网IP检测） |
| **依赖** | 无外部依赖 |
| **复用价值** | **极高** — 特别是 `validate_url()` 的 SSRF 防护实现，是安全敏感场景的必备工具 |
| **实施建议** | 直接复制到当前项目 `src/utils/` 目录，`validate_url()` 可增强为独立安全工具模块 |

---

#### B3. Skill 管理器

| 属性 | 详情 |
|------|------|
| **位置** | [scripts/skill_manager.py](file:///Volumes/Max/YYC3-Dynasty-Framework/scripts/skill_manager.py) |
| **功能描述** | 管理 Agent 的 Skill 配置，支持本地/远程添加、更新、查看、移除，含重试机制和校验和 |
| **技术实现** | `urllib.request` + 重试退避（3/6/12s） + 内容校验（SHA256 `_compute_checksum`） + 10MB 上限 + 中国大陆网络代理提示 |
| **核心能力** | `add_remote()`（远程下载）、`_download_file()`（带重试的HTTP下载）、`_compute_checksum()`（SHA256校验） |
| **依赖** | `urllib`（标准库）、`utils.safe_name`、`utils.get_openclaw_home` |
| **复用价值** | **高** — 远程 Skill/Plugin 下载管理是通用模式，可应用于插件市场、配置同步等场景 |
| **实施建议** | 可抽取为 `RemoteResourceManager` 类，支持不同的资源类型（不仅是 SKILL.md），增加 `file://` 协议支持已完成（见 [test_cwe22_file_url.py](file:///Volumes/Max/YYC3-Dynasty-Framework/tests/test_cwe22_file_url.py) 的安全修复） |

---

#### B4. 配置管理（Pydantic Settings）

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/config.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/config.py) |
| **功能描述** | 基于 `pydantic-settings` 的集中配置管理，支持环境变量、`.env` 文件、类型校验、属性计算（如 `database_url` 拼接） |
| **技术实现** | `pydantic-settings.BaseSettings` + `@lru_cache` 单例 + `@property` 计算属性（同步/异步数据库URL） |
| **核心能力** | 多段配置（Postgres/Redis/Server/OpenClaw/调度/通知），`.env` 自动加载，`extra="ignore"` 宽松模式 |
| **依赖** | `pydantic-settings>=2.6.0` |
| **复用价值** | **高** — 是任何 Python 项目的标准配置管理模板 |
| **实施建议** | 可作为项目配置模板直接复用，按需增减配置项 |

---

#### B5. SQLAlchemy Async 数据库管理

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/db.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/db.py) |
| **功能描述** | SQLAlchemy 2.0 async 引擎 + session 管理 + FastAPI 依赖注入 |
| **技术实现** | `create_async_engine` + `async_sessionmaker` + `async with` 上下文管理 + 异常自动 rollback |
| **核心能力** | `get_db()`（FastAPI Depends 注入）、`init_db()`（开发环境建表）、`Base`（DeclarativeBase 基类） |
| **依赖** | `sqlalchemy[asyncio]>=2.0.36`, `asyncpg>=0.30.0` |
| **复用价值** | **高** — 标准 FastAPI + SQLAlchemy async 配置模板 |
| **实施建议** | 直接复用为项目数据库层模板 |

---

### 类别 C：通知渠道框架（高复用价值）

---

#### C1. 多渠道通知抽象层

| 属性 | 详情 |
|------|------|
| **位置** | [edict/backend/app/channels/base.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/base.py) + 各渠道实现 |
| **功能描述** | 基于 `Protocol` 的多渠道通知框架，统一接口 `validate_webhook()` + `send()`，支持 7 种渠道 |
| **技术实现** | Python `typing.Protocol` 接口定义 + `ClassVar` 渠道元信息 + 各渠道独立实现 |
| **核心能力** | `NotificationChannel` Protocol（`name/label/icon/placeholder/allowed_domains` + `validate_webhook()` + `send()`），`_validate_url_scheme()` + `_extract_domain()` 基类方法 |
| **依赖** | 无外部依赖（纯标准库 `urllib`） |
| **复用价值** | **极高** — 通用通知渠道抽象，可扩展任意新渠道 |

**已实现渠道清单**：

| 渠道 | 文件 | 实现要点 |
|------|------|----------|
| 飞书 | [feishu.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/feishu.py) | 富文本卡片 + 按钮跳转 |
| 企业微信 | [wecom.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/wecom.py) | Markdown 消息 |
| Discord | [discord.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/discord.py) | Embed 富文本 |
| Slack | [slack.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/slack.py) | Blocks 格式 + 按钮 |
| Telegram | [telegram.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/telegram.py) | Markdown 消息 |
| QQ | [qq.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/qq.py) | 含 access_token 缓存管理（7200s TTL，提前300s刷新） |
| 通用 Webhook | [webhook.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/channels/webhook.py) | 通用 JSON 推送 |

**实施建议**: 作为独立 Python 包 `yyc3-notify` 抽取，可被任何需要多渠道通知的项目复用。QQ 渠道的 token 缓存管理模式是亮点，可推广到其他需要 OAuth token 管理的渠道。

---

### 类别 D：前端基础设施（高复用价值）

---

#### D1. WebSocket Hook（带自动重连）

| 属性 | 详情 |
|------|------|
| **位置** | [edict/frontend/src/useWebSocket.ts](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/frontend/src/useWebSocket.ts) |
| **功能描述** | React WebSocket 连接管理 Hook，支持自动重连（指数退避）、连接状态、监听器注册/注销、协议自动选择（ws/wss） |
| **技术实现** | 模块级单例 WebSocket + `Set<Listener>` 监听器集合 + 指数退避重连（最大 30s） + `useCallback` 注册/注销 |
| **核心能力** | `useWebSocket()` Hook 返回 `{ connected, useWS }`，`useWS(fn)` 注册事件监听器并自动清理 |
| **依赖** | React 18 |
| **复用价值** | **极高** — 通用 WebSocket 连接管理，适用于任何需要实时通信的 React 应用 |
| **实施建议** | 直接复用到当前项目，可增强为独立 `useWebSocket` npm 包，增加 `topic` 过滤、自动 JSON 解析、离线消息缓存等 |

---

#### D2. Zustand 状态管理 + 领域模型

| 属性 | 详情 |
|------|------|
| **位置** | [edict/frontend/src/store.ts](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/frontend/src/store.ts) (L1-L100) |
| **功能描述** | 基于 Zustand 的全局状态管理，包含 Pipeline 流程定义、状态颜色映射、状态标签、工具函数 |
| **技术实现** | Zustand 4.5.5 `create()` + 纯函数工具集 |
| **核心能力** | `PIPE`（Kanban 流程定义）、`PIPE_STATE_IDX`（状态→索引映射）、`DEPT_COLOR`（部门颜色）、`STATE_LABEL`（状态标签）、`deptColor()`、`stateLabel()`、`isEdict()`、`isSession()`、`isArchived()`、`getPipeStatus()`、`TAB_DEFS` |
| **依赖** | `zustand` 4.5.5 |
| **复用价值** | **高** — 状态管理架构模式可复用，`PIPE` 流程定义和 `getPipeStatus()` 的管道状态计算逻辑是工作流看板的通用模式 |
| **实施建议** | 领域模型（Pipeline 定义、状态映射）可抽取为独立模块，UI 无关的纯逻辑可跨项目复用 |

---

#### D3. API 服务层

| 属性 | 详情 |
|------|------|
| **位置** | [edict/frontend/src/api.ts](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/frontend/src/api.ts) |
| **功能描述** | 集中式 API 调用层，封装所有后端接口，支持 GET/POST 通用请求函数 |
| **技术实现** | 原生 `fetch` + 泛型 `fetchJ<T>` / `postJ<T>` + `VITE_API_URL` 环境变量配置 |
| **核心能力** | `api.liveStatus()` / `api.taskAction()` / `api.setModel()` / `api.addRemoteSkill()` 等 30+ 接口方法 |
| **依赖** | 无外部依赖（原生 fetch） |
| **复用价值** | **中** — API 结构模式可复用，但接口定义与业务强相关 |
| **实施建议** | `fetchJ<T>` / `postJ<T>` 泛型封装模式可复用，建议增加请求拦截器、错误处理中间件、请求重试等 |

---

#### D4. 国际化（i18n）引擎

| 属性 | 详情 |
|------|------|
| **位置** | [edict/frontend/src/i18n.ts](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/frontend/src/i18n.ts) |
| **功能描述** | 轻量级国际化实现，支持 10 种语言，零外部依赖，localStorage 持久化语言选择 |
| **技术实现** | React hooks（`useState`/`useEffect`）+ `TranslationMap` 字典 + 模板变量替换（`{count}`） |
| **核心能力** | `useI18n()` Hook、`LOCALES` 10 种语言、`LANG_META` 语言元信息、`STORAGE_KEY` 持久化 |
| **依赖** | React 18 |
| **复用价值** | **高** — 零依赖国际化方案，适合中小型项目 |
| **实施建议** | 可抽取为独立 `useI18n` 包，增加命名空间、嵌套 Key、复数规则等。当前实现仅为中文/英文翻译表，其他语言待补充 |

---

### 类别 E：测试基础设施（高复用价值）

---

#### E1. 状态机一致性 CI 守卫

| 属性 | 详情 |
|------|------|
| **位置** | [tests/test_state_machine_consistency.py](file:///Volumes/Max/YYC3-Dynasty-Framework/tests/test_state_machine_consistency.py) |
| **功能描述** | 自动化检测 `kanban_update.py` 和 `task.py` 两处状态转换表的一致性，防止单侧修改导致漂移 |
| **技术实现** | 正则 + AST 解析源码（无需 import 避免依赖污染）+ 集合比对 |
| **核心能力** | `_load_pg_transitions()`（解析 task.py 源码提取状态转换表）、`test_state_transitions_consistent()`、`test_pending_confirm_exists()`、`test_terminal_states_have_no_outgoing()` |
| **依赖** | pytest |
| **复用价值** | **高** — 源码解析 + 一致性校验模式可推广到任何有"单源真理"（Single Source of Truth）需求的场景 |
| **实施建议** | 将 `_load_pg_transitions()` 的源码解析逻辑抽取为通用工具，支持任意 Python 文件的常量提取 |

---

#### E2. 安全测试（CWE-22 路径穿越）

| 属性 | 详情 |
|------|------|
| **位置** | [tests/test_cwe22_file_url.py](file:///Volumes/Max/YYC3-Dynasty-Framework/tests/test_cwe22_file_url.py) |
| **功能描述** | PoC 安全测试：验证 `file://` URL 不能读取 `allowed_roots` 之外的任意文件 |
| **技术实现** | `tmp_path` 隔离环境 + 边界外文件创建 + 断言拒绝访问 |
| **核心能力** | `test_file_url_path_traversal_blocked()`（路径穿越被阻止）、`test_file_url_within_allowed_roots_works()`（合法路径正常工作） |
| **依赖** | pytest |
| **复用价值** | **高** — 安全测试模板可复用到任何接受 URL 输入的场景 |
| **实施建议** | 可作为安全测试 checklist 模板，增加更多 CWE 测试用例 |

---

### 类别 F：领域模型与数据层（中等复用价值）

---

#### F1. 事件/审计/Todo 模型

| 属性　　　　 | 详情　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 |
| --------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **位置**　　 | [edict/backend/app/models/event.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/event.py) / [audit.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/audit.py) / [thought.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/thought.py) / [todo.py](file:///Volumes/Max/YYC3-Dynasty-Framework/edict/backend/app/models/todo.py) |
| **功能描述** | 事件持久化、审计日志、Agent 思考流、结构化子任务的标准数据模型　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 |
| **技术实现** | SQLAlchemy ORM + PostgreSQL JSONB/UUID + 复合索引　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|
| **核心能力** | `Event`（事件持久化 + 回放审计）、`AuditLog`（操作审计）、`Thought`（Agent 思考记录，含 confidence/tokens/type）、`Todo`（层级子任务，含 parent_id 树状结构）　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|
| **依赖**　　 | SQLAlchemy 2.0+, PostgreSQL　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|
| **复用价值** | **中** — 模型设计模式可复用，但字段与业务强相关　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|
| **实施建议** | `AuditLog` 的通用审计日志模式（谁、何时、对什么、做了什么、新旧值）可抽取为 mixin 基类，跨项目复用。`Todo` 的 `parent_id` 树状结构也是通用模式　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 |

---

### 类别 G：配置同步与数据管道（中等复用价值）

---

#### G1. Agent 配置同步工具

| 属性 | 详情 |
|------|------|
| **位置** | [scripts/sync_agent_config.py](file:///Volumes/Max/YYC3-Dynasty-Framework/scripts/sync_agent_config.py) |
| **功能描述** | 从 `openclaw.json` 同步 Agent 配置到 `data/agent_config.json`，自动发现 Skills 目录 |
| **技术实现** | JSON 解析 + 文件遍历 + 模型规范化 + 符号链接部署 |
| **核心能力** | `normalize_model()`（统一模型标识）、`get_skills()`（自动发现 Skills 目录）、`sync_scripts_to_workspaces()`（符号链接部署） |
| **依赖** | `file_lock`, `utils` |
| **复用价值** | **中** — 配置格式转换 + 自动发现模式可复用 |
| **实施建议** | 可抽取为通用配置同步框架，支持多种配置格式（JSON/YAML/TOML）互转 |

---

#### G2. 模型切换与备份管理

| 属性 | 详情 |
|------|------|
| **位置** | [scripts/apply_model_changes.py](file:///Volumes/Max/YYC3-Dynasty-Framework/scripts/apply_model_changes.py) |
| **功能描述** | 从 `pending_model_changes.json` 应用模型变更到 `openclaw.json`，含配置备份、变更日志、旧备份清理 |
| **技术实现** | 原子写入 + 备份轮转（`MAX_BACKUPS=10`） + 变更日志追加 |
| **核心能力** | `cleanup_backups()`（备份轮转）、配置备份 + 恢复、变更日志记录 |
| **依赖** | `file_lock`, `utils` |
| **复用价值** | **中** — 配置变更审批 + 备份管理是通用模式 |
| **实施建议** | 可抽取为 `ConfigChangeManager` 类，支持任意配置文件的变更管理 |

---

## 三、复用价值矩阵总结

| 排名 | 模块 | 复用值 | 依赖度 | 实施难度 | 建议动作 |
|------|------|--------|--------|----------|----------|
| 1 | 文件锁 `file_lock.py` | ★★★★★ | 零依赖 | 极低 | 直接复制使用 |
| 2 | 工具函数 `utils.py` | ★★★★★ | 零依赖 | 极低 | 直接复制使用 |
| 3 | 事件总线 `event_bus.py` | ★★★★★ | Redis | 低 | 抽取为独立包 |
| 4 | 通知渠道框架 `channels/` | ★★★★★ | 零依赖 | 低 | 抽取为独立包 |
| 5 | Transactional Outbox | ★★★★★ | SQLAlchemy+Redis | 中 | 抽取为独立包 |
| 6 | 状态机引擎 | ★★★★★ | 零依赖 | 低 | 抽取为独立类 |
| 7 | WebSocket Hook | ★★★★★ | React | 低 | 直接复制使用 |
| 8 | i18n 引擎 | ★★★★☆ | React | 低 | 直接复制使用 |
| 9 | 配置管理 `config.py` | ★★★★☆ | pydantic-settings | 低 | 作为模板复用 |
| 10 | DB 管理 `db.py` | ★★★★☆ | SQLAlchemy | 低 | 作为模板复用 |
| 11 | 状态机 CI 守卫 | ★★★★☆ | pytest | 低 | 模式复用 |
| 12 | 安全测试模板 | ★★★★☆ | pytest | 低 | 模式复用 |
| 13 | API 服务层模式 | ★★★☆☆ | 无 | 低 | 模式复用 |
| 14 | 数据模型 | ★★★☆☆ | SQLAlchemy | 中 | 模式复用 |
| 15 | 配置同步工具 | ★★★☆☆ | 内部依赖 | 中 | 按需抽取 |

---

## 四、对当前项目（YYC3-Dynasty-Design-Delivery）的复用建议

基于以上分析，建议按以下优先级复用：

**第一优先级（立即复用）**：

1. `scripts/file_lock.py` — 原子文件操作，用于配置管理、缓存持久化
2. `scripts/utils.py` — 尤其 `validate_url()` 防 SSRF，`read_json()` 安全读取
3. `edict/frontend/src/useWebSocket.ts` — 如需实时通信
4. `edict/frontend/src/i18n.ts` — 如需国际化

**第二优先级（适配后复用）**：
5. `edict/backend/app/channels/` — 如需多渠道通知
6. `edict/backend/app/services/event_bus.py` — 如需事件驱动架构
7. `edict/backend/app/config.py` — 配置管理模板

**第三优先级（模式参考）**：
8. 状态机 + CI 守卫模式
9. Transactional Outbox 模式
10. 安全测试方法

---

toolName: todo_write

status: success

Todos updated: 8 items

报告已生成。核心结论：

- **15 个可复用模块**被识别，其中 **5 个具有极高复用价值**（文件锁、事件总线、通知渠道框架、状态机、WebSocket Hook），大多数依赖极小或零依赖
- 对当前 [YYC3-Dynasty-Design-Delivery](file:///Users/yanyu/YYC-Cube/YYC3-Dynasty-Design-Delivery) 项目，最推荐立即复用的是 `file_lock.py`（原子文件操作）和 `utils.py`（SSRF 安全校验），两者均为零依赖、可直接复制使用
