/**
 * @file stateMachine.ts
 * @description Edict state machine — canonical transition graph.
 *
 * Ported from YYC3-Dynasty-Framework `edict/backend/app/models/task.py`
 * STATE_TRANSITIONS, culturally aligned to the Design project's terminology.
 * Transition rules enforce the 三省六部 governance pipeline.
 */

import type { EdictStatus } from './types';

// ── State Transition Graph ──────────────────────────────────────────────
//
// Cultural flow: 天堂 → 明堂(待承旨) → 中书省(待草拟) → 门下省(待审议)
//   → 尚书省(待派发) → 六部(执行中) → 六部(待回奏) → 定鼎门(已办结)
//
// The 门下省 review can 封驳 (veto) back to 待草拟 (max 3 rounds).
// High-risk transitions require 门下省 confirmation via 待复核.

export const STATE_TRANSITIONS: Readonly<Record<EdictStatus, readonly EdictStatus[]>> = {
  待承旨: ['待草拟', '已撤销'],
  待草拟: ['待审议', '已撤销', '阻塞中'],
  待审议: ['待派发', '待草拟', '已撤销'],
  待派发: ['待执行', '执行中', '已撤销', '阻塞中'],
  待执行: ['执行中', '已撤销', '阻塞中'],
  执行中: ['待回奏', '已办结', '阻塞中', '已撤销'],
  待回奏: ['已办结', '待审议', '执行中', '已撤销', '待复核'],
  待复核: ['已办结', '待回奏', '已撤销'],
  阻塞中: ['待草拟', '待审议', '待派发', '待执行', '执行中', '待回奏', '已撤销'],
  已办结: [],
  已撤销: [],
};

// ── High-Risk Transitions (require two-phase confirmation) ────────────────
//
// When a high-risk transition is requested, the task enters 待复核 instead of
// jumping directly to the target state. The designated confirm authority must
// then approve or reject.

export interface HighRiskTransition {
  from: EdictStatus;
  target: EdictStatus;
  confirmBy: string;
}

export const HIGH_RISK_TRANSITIONS: readonly HighRiskTransition[] = [
  { from: '待回奏', target: '已办结', confirmBy: '门下省' },
  { from: '执行中', target: '已撤销', confirmBy: '尚书省' },
  { from: '待审议', target: '已撤销', confirmBy: '中书省' },
];

// ── State → Org / Agent Cultural Mapping ─────────────────────────────────

export const STATE_ORG_MAP: Readonly<Record<EdictStatus, string>> = {
  待承旨: '明堂',
  待草拟: '中书省',
  待审议: '门下省',
  待派发: '尚书省',
  待执行: '六部',
  执行中: '六部',
  待回奏: '六部',
  待复核: '门下省',
  阻塞中: '—',
  已办结: '定鼎门',
  已撤销: '—',
};

export const STATE_AGENT_MAP: Readonly<Partial<Record<EdictStatus, string>>> = {
  待承旨: '明堂·太子',
  待草拟: '中书省',
  待审议: '门下省',
  待派发: '尚书省',
  待执行: '尚书省',
  执行中: '六部',
  待回奏: '六部',
  待复核: '门下省',
};

// ── Validation Functions ────────────────────────────────────────────────

export function isValidTransition(from: EdictStatus, to: EdictStatus): boolean {
  if (from === to) return false;
  const allowed = STATE_TRANSITIONS[from];
  return allowed.includes(to);
}

export function getValidTransitions(from: EdictStatus): EdictStatus[] {
  return [...STATE_TRANSITIONS[from]];
}

export function isHighRiskTransition(
  from: EdictStatus,
  target: EdictStatus,
): HighRiskTransition | undefined {
  return HIGH_RISK_TRANSITIONS.find((t) => t.from === from && t.target === target);
}

export function isTerminal(status: EdictStatus): boolean {
  return STATE_TRANSITIONS[status].length === 0;
}

/**
 * Resolve a transition request. If the transition is high-risk, returns
 * `{ status: '待复核', pendingConfirm }` instead of jumping to target.
 */
export function resolveTransition(
  current: EdictStatus,
  requested: EdictStatus,
  agentLabel: string,
): { status: EdictStatus; pendingConfirm?: import('./types').PendingConfirm } {
  if (!isValidTransition(current, requested)) {
    throw new Error(`非法流转: ${current} → ${requested}`);
  }

  const highRisk = isHighRiskTransition(current, requested);
  if (highRisk) {
    return {
      status: '待复核',
      pendingConfirm: {
        targetState: requested,
        requestedBy: agentLabel,
        requestedAt: new Date().toISOString(),
        confirmBy: highRisk.confirmBy,
      },
    };
  }

  return { status: requested };
}
