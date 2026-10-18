# 安全政策 / Security Policy

## 支持的版本 / Supported Versions

| 版本     | 支持状态  |
| -------- | --------- |
| `main`   | ✅ 活跃   |
| `master` | ✅ 活跃   |
| `v0.0.1` | ✅ 支持   |
| 更早版本 | ❌ 不支持 |

目前项目处于早期开发阶段（`v0.0.1`），所有活跃分支均受支持。

## 报告安全漏洞 / Reporting a Vulnerability

我们认真对待安全问题。如您发现 YYC³ Dynasty 项目中存在安全漏洞，
请通过以下负责任的披露流程告知我们：

### 举报方式

📧 **admin@0379.email**

请在邮件中包含以下信息：

- **漏洞概述** — 简短描述漏洞类型和潜在影响
- **影响范围** — 受影响的模块/组件/路由路径
- **复现步骤** — 尽可能详细，包括代码片段或 payload
- **攻击面评估** — 攻击者需要什么权限/条件才能利用此漏洞
- **潜在影响** — 数据泄露、权限提升、DoS 等
- **您的联系方式** — 便于我们跟进（可选，默认匿名处理）

### 处理流程

1. **确认收悉** — 24 小时内通过邮件确认举报，分配唯一追踪编号
2. **初步评估** — 48 小时内由安全团队评估严重程度（CVSS 3.x 评分）
3. **修复规划** — 72 小时内制定修复方案，必要时在主分支合入紧急修复
4. **发布补丁** — 合并 PR、触发 CI/CD 流水线部署
5. **披露协调** — 与您协商披露时间和方式（默认 90 天宽限期）

### 严重程度分级

| 等级     | CVSS 范围 | 响应时效           |
| -------- | --------- | ------------------ |
| Critical | 9.0–10.0  | 24 小时内修复      |
| High     | 7.0–8.9   | 72 小时内修复      |
| Medium   | 4.0–6.9   | 7 天内修复         |
| Low      | 0.1–3.9   | 纳入下一个版本计划 |

### 请不要

- 在 issue / PR / 公共讨论中公开披露漏洞细节
- 在我们发布修复前向第三方泄露技术细节
- 对生产环境进行破坏性测试（请使用 `pnpm dev` 本地环境）

## 项目安全实践 / Project Security Practices

### 依赖与供应链

- **pnpm 锁文件不可变** — CI 使用 `pnpm install --frozen-lockfile`
- **原生二进制钉版** — darwin-arm64 二进制版本号与对应包精确匹配（见 `AGENTS.md §7.3`）
- **React 类型覆盖锁定** — 通过 `pnpm-workspace.yaml#overrides` 强制 `@types/react@18.3.1`（见 §7.4）
- **7 天最小发布龄** — `minimumReleaseAge: 10080` 阻断刚发布的新包进入依赖树

### 代码质量门禁

CI 流水线在每次 PR 时强制通过以下检查（任何一项失败即阻塞合入）：

```
typecheck → lint → format:check → madge → test → build
```

### 前端安全

- 当前项目为 **纯前端 SPA**（无真实后端），安全边界较低
- WebSocket 连接为 Mock 实现（`WorkflowContext.tsx`），生产化时必须替换为加密连接（`wss://`）并验证服务端证书
- 硬编码密钥、token、密码 **禁止** 提交到仓库
- 生产部署时需配置 CSP（Content Security Policy）、X-Frame-Options、X-Content-Type-Options 等安全响应头

### 测试覆盖

- 域模型层（`src/app/domain/`）单元测试覆盖率 100%（Vitest + v8）
- 安全模块（`src/app/domain/security.ts`）24 个测试用例覆盖校验逻辑

## 安全更新通知 / Security Updates

重要安全更新将通过以下渠道发布：

- GitHub 仓库 **Security Advisories**（<https://github.com/YYC-Cube/YYC3-Dynasty-Design-Delivery/security/advisories>）
- Release Notes
- 邮件订阅（发送至 **admin@0379.email** 申请加入通知列表）

## 致谢 / Acknowledgments

我们感谢每一位负责任披露安全问题的研究者，你们的贡献让整个社区更安全。
重要漏洞披露者的姓名（经许可后）将在 SECURITY.md 的本节永久致谢。

---

**最后更新**：2025-10-18
**维护者**：YanYuCloudCube Team <admin@0379.email>
