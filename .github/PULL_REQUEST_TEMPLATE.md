## 背景 / Why

<!-- 为什么做这个改动？关联 issue / 设计稿 / 任务编号 -->
<!-- 例如：Fixes #123 · 对应 docs/YYC3-Dynasty-Guidelines.md §3.2 -->

## 改动 / What

<!-- 用 bullet point 列出本次 PR 的核心改动 -->

-

## 类型 / Type

<!-- 在下方选择一个类型，删除其余 -->

- [ ] `feat` — 新功能 / New feature
- [ ] `fix` — Bug 修复
- [ ] `refactor` — 重构（行为不变）
- [ ] `docs` — 文档变更
- [ ] `style` — 格式/样式调整（不影响逻辑）
- [ ] `perf` — 性能优化
- [ ] `test` — 新增/修改测试
- [ ] `chore` — 构建/依赖/工具变更

## 验证 / How Tested

<!-- PR 合入前必须通过以下 6 项检查；CI 会自动跑同一套 -->

- [ ] `pnpm typecheck` 0 报错
- [ ] `pnpm lint` 0 错 0 警
- [ ] `pnpm format:check` 全部合规
- [ ] `pnpm madge` 无循环依赖
- [ ] `pnpm build` 成功
- [ ] `pnpm test` 全部通过（如有新测试）
- [ ] 手动验证：`pnpm dev` 启动后跑过受影响路由（含 `/dashboard` 全屏看板）

## 令牌合规 / Token Compliance

<!-- 新代码是否遵循令牌制度？CI 不检查，但维护者会看 -->

- [ ] 新增样式使用 `var(--color-*)` / `var(--font-*)` 令牌，未硬编码 hex
- [ ] 未引入/复用已下线的 `imperial-*` Tailwind 类名

## 影响范围 / Impact

<!-- 本次改动影响了哪些模块/路由/组件？ -->

-

## 文化准确性 / Cultural Accuracy（如涉及 UI 文案）

<!-- 如改动涉及官制、礼制、历史描述，是否符合隋唐正史？ -->

- [ ] UI 文案中的三省六部官制名称符合隋唐规制（参考 `docs/02-YYC3-古都文化-官制体系/`）
- [ ] 历史/文化陈述有据可考或明确标注为文学创作

## 截图 / 录屏（如涉及 UI）

<!-- 如涉及 UI 变更，请附上 before/after 对比 -->
