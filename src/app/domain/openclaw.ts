/**
 * @file openclaw.ts
 * @description OpenClaw runtime contract — filesystem-based integration model.
 *
 * Ported from YYC3-Dynasty-Framework:
 *   - scripts/utils.py → get_openclaw_home
 *   - scripts/sync_from_openclaw_runtime.py → state_from_session, detect_official,
 *     session model, JSONL parsing
 *   - scripts/apply_model_changes.py → gateway restart, backup/rollback
 *   - scripts/sync_officials_stats.py → MODEL_PRICING
 *
 * CRITICAL: OpenClaw does NOT expose HTTP REST APIs. All integration is via:
 *   1. Filesystem reads (~/.openclaw/agents/[agentId]/sessions/)
 *   2. One CLI subprocess: openclaw gateway restart
 */

import type { EdictStatus } from './types';

// ── Filesystem Contract ──────────────────────────────────────────────────

/**
 * OpenClaw home directory resolution.
 * Priority: OPENCLAW_HOME env var > ~/.openclaw
 *
 * Directory structure:
 *   ~/.openclaw/
 *   ├── openclaw.json                     ← master config (agents, models, providers)
 *   ├── agents/<agent_id>/
 *   │   └── sessions/
 *   │       ├── sessions.json             ← per-agent session index
 *   │       └── <session_id>.jsonl        ← conversation transcript
 *   └── workspace-<agent_id>/
 *       ├── soul.md                       ← deployed SOUL.md copy
 *       ├── scripts/                      ← symlinked from project scripts/
 *       └── skills/<skill_name>/SKILL.md
 */
export function getOpenclawHome(envOverride?: string): string {
  if (envOverride?.trim()) return envOverride.trim();
  // Browser-only: no filesystem/process access in the client bundle.
  // The real OPENCLAW_HOME resolution happens on the backend.
  // This returns the default display path for UI purposes.
  return '~/.openclaw';
}

// ── Session Model (from sessions.json) ────────────────────────────────────

export interface OpenClawSession {
  sessionId: string;
  updatedAt: number;
  abortedLastRun?: boolean;
  lastChannel?: string;
  origin?: {
    label?: string;
    channel?: string;
  };
  sessionFile?: string;
  systemSent?: boolean;
  inputTokens?: number;
  outputTokens?: number;
  outputCacheTokens?: number;
  cacheRead?: number;
  cacheWrite?: number;
  totalTokens?: number;
}

/** Per-agent sessions.json is a Record<sessionKey, OpenClawSession> */
export type SessionIndex = Record<string, OpenClawSession>;

// ── JSONL Transcript Entry ────────────────────────────────────────────────

export interface TranscriptEntry {
  timestamp?: string;
  message?: {
    role?: 'user' | 'assistant' | 'toolResult' | 'system';
    content?: Array<{ type?: string; text?: string }>;
    toolName?: string;
    details?: Record<string, unknown>;
  };
}

export interface ActivityRow {
  at: string;
  kind: 'tool' | 'assistant' | 'user';
  text: string;
}

// ── Session-Age State Inference ───────────────────────────────────────────
//
// Ported from sync_from_openclaw_runtime.py state_from_session.
// Maps session age + abort status to a kanban display state.

export interface InferredState {
  state: 'Doing' | 'Review' | 'Next' | 'Blocked';
  /** Cultural label for UI display */
  zhLabel: string;
  /** Whether this session should appear on the board */
  visible: boolean;
}

export function inferStateFromSession(ageMs: number, aborted: boolean): InferredState {
  if (aborted) {
    return { state: 'Blocked', zhLabel: '阻塞中', visible: true };
  }
  if (ageMs <= 2 * 60 * 1000) {
    return { state: 'Doing', zhLabel: '执行中', visible: true };
  }
  if (ageMs <= 60 * 60 * 1000) {
    return { state: 'Review', zhLabel: '待回奏', visible: true };
  }
  return { state: 'Next', zhLabel: '待执行', visible: false };
}

/** Map OpenClaw inferred state to EdictStatus */
export function inferredToEdictStatus(inferred: InferredState): EdictStatus {
  switch (inferred.state) {
    case 'Doing':
      return '执行中';
    case 'Review':
      return '待回奏';
    case 'Blocked':
      return '阻塞中';
    case 'Next':
    default:
      return '待执行';
  }
}

// ── Agent → Official Cultural Mapping ─────────────────────────────────────
//
// Ported from sync_from_openclaw_runtime.py detect_official.

export interface OfficialInfo {
  title: string;
  org: string;
}

export const OFFICIAL_MAP: Readonly<Record<string, OfficialInfo>> = {
  taizi: { title: '储君', org: '太子' },
  main: { title: '储君', org: '太子' },
  zhongshu: { title: '中书令', org: '中书省' },
  menxia: { title: '侍中', org: '门下省' },
  shangshu: { title: '尚书令', org: '尚书省' },
  hubu: { title: '户部尚书', org: '户部' },
  libu: { title: '礼部尚书', org: '礼部' },
  bingbu: { title: '兵部尚书', org: '兵部' },
  xingbu: { title: '刑部尚书', org: '刑部' },
  gongbu: { title: '工部尚书', org: '工部' },
  libu_hr: { title: '吏部尚书', org: '吏部' },
  zaochao: { title: '钦天监', org: '钦天监' },
};

export function detectOfficial(agentId: string): OfficialInfo {
  return OFFICIAL_MAP[agentId] ?? { title: '尚书令', org: '尚书省' };
}

// ── JSONL Transcript Parser ───────────────────────────────────────────────
//
// Ported from sync_from_openclaw_runtime.py load_activity.
// Parses conversation transcripts into meaningful activity rows.

export function parseTranscript(jsonlText: string, limit = 12): ActivityRow[] {
  const events: TranscriptEntry[] = [];
  const lines = jsonlText.split('\n');

  for (const line of lines) {
    try {
      events.push(JSON.parse(line) as TranscriptEntry);
    } catch {
      continue;
    }
  }

  const rows: ActivityRow[] = [];

  for (let i = events.length - 1; i >= 0 && rows.length < limit; i--) {
    const item = events[i];
    const msg = item.message;
    if (!msg) continue;

    const role = msg.role;
    const ts = item.timestamp ?? '';

    if (role === 'toolResult') {
      const tool = msg.toolName ?? '-';
      const content = msg.content?.[0]?.text ?? '';
      const text =
        content.length < 50 ? `Tool '${tool}' returned: ${content}` : `Tool '${tool}' finished`;
      rows.push({ at: ts, kind: 'tool', text });
    } else if (role === 'assistant') {
      for (const c of msg.content ?? []) {
        if (c.type === 'text' && c.text) {
          const raw = c.text.replace(/\[\[reply_to_current\]\]/g, '').trim();
          if (raw) {
            const summary = raw.split('\n')[0].slice(0, 200);
            rows.push({ at: ts, kind: 'assistant', text: summary });
            break;
          }
        }
      }
    } else if (role === 'user') {
      const text = msg.content?.[0]?.text?.slice(0, 100) ?? '';
      if (text) {
        rows.push({ at: ts, kind: 'user', text: `User: ${text}...` });
      }
    }
  }

  return rows;
}

// ── Gateway Restart CLI ────────────────────────────────────────────────────
//
// Ported from apply_model_changes.py.
// The ONLY subprocess call to OpenClaw: `openclaw gateway restart`.
// In a browser context, this must be invoked via a backend API proxy.

export interface GatewayRestartResult {
  success: boolean;
  returnCode: number;
  stdout: string;
  stderr: string;
  rolledBack: boolean;
}

export const OPENCLAW_BIN = 'openclaw';

// ── Model Pricing ─────────────────────────────────────────────────────────
//
// Ported from sync_officials_stats.py MODEL_PRICING.
// Per-1M-token USD pricing: { in, out, cr (cache read), cw (cache write) }

export interface ModelPricing {
  in: number;
  out: number;
  cr: number;
  cw: number;
}

export const MODEL_PRICING: Readonly<Record<string, ModelPricing>> = {
  'glm-5.1': { in: 0.15, out: 0.6, cr: 0.015, cw: 0.3 },
  'glm-5': { in: 0.15, out: 0.6, cr: 0.015, cw: 0.3 },
  'glm-5-turbo': { in: 0.07, out: 0.28, cr: 0.007, cw: 0.14 },
  'glm-4.7': { in: 0.12, out: 0.48, cr: 0.012, cw: 0.24 },
  'claude-sonnet-4.6': { in: 3.0, out: 15.0, cr: 0.3, cw: 3.75 },
  'claude-opus-4.5': { in: 15.0, out: 75.0, cr: 1.5, cw: 18.75 },
  'claude-haiku-3.5': { in: 0.8, out: 4.0, cr: 0.08, cw: 1.0 },
  'gpt-4o': { in: 2.5, out: 10.0, cr: 1.25, cw: 2.5 },
  'gpt-4o-mini': { in: 0.15, out: 0.6, cr: 0.075, cw: 0.15 },
  'gpt-5.3-codex': { in: 5.0, out: 20.0, cr: 2.5, cw: 5.0 },
  'gemini-2.5-pro': { in: 1.25, out: 5.0, cr: 0.3125, cw: 0.781 },
  'gemini-2.0-flash': { in: 0.1, out: 0.4, cr: 0.025, cw: 0.063 },
};

export const USD_TO_CNY = 7.25;

/** Calculate cost in USD from token usage */
export function calcCost(
  tokensIn: number,
  tokensOut: number,
  cacheRead: number,
  cacheWrite: number,
  modelId: string,
): { usd: number; cny: number } {
  const p = MODEL_PRICING[modelId] ?? MODEL_PRICING['glm-5.1'];
  const usd =
    (tokensIn / 1e6) * p.in +
    (tokensOut / 1e6) * p.out +
    (cacheRead / 1e6) * p.cr +
    (cacheWrite / 1e6) * p.cw;
  return { usd: Math.round(usd * 100) / 100, cny: Math.round(usd * USD_TO_CNY * 100) / 100 };
}

// ── Heartbeat Staleness Detector ──────────────────────────────────────────
//
// Ported from refresh_live_data.py.

export interface HeartbeatStatus {
  status: 'active' | 'warn' | 'stalled' | 'unknown';
  label: string;
  color: string;
}

export function detectHeartbeat(ageMs: number | undefined): HeartbeatStatus {
  if (ageMs === undefined || ageMs === 0) {
    return { status: 'unknown', label: '⚪ 未知', color: 'var(--color-text-secondary)' };
  }
  if (ageMs < 5 * 60 * 1000) {
    return { status: 'active', label: '🟢 活跃', color: 'var(--color-accent-emerald)' };
  }
  if (ageMs < 15 * 60 * 1000) {
    return { status: 'warn', label: '🟡 可能停滞', color: 'var(--color-accent-amber)' };
  }
  return { status: 'stalled', label: '🔴 已停滞', color: 'var(--color-accent-vermillion)' };
}
