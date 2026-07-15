/**
 * @file types.ts
 * @description Dynasty domain types — aligned with YYC3-Dynasty-Framework backend.
 *
 * Cultural mapping: 三省六部 governance states mapped to Tang-dynasty Luoyang
 * spatial nodes. The state machine mirrors the Framework's 12-state graph while
 * preserving the Design project's Chinese cultural terminology.
 *
 * Framework states (English) → Design states (Chinese):
 *   Pending/Taizi → 待承旨, Zhongshu → 待草拟, Menxia → 待审议,
 *   Assigned → 待派发, Next → 待执行, Doing → 执行中,
 *   Review → 待回奏, PendingConfirm → 待复核, Blocked → 阻塞中,
 *   Done → 已办结, Cancelled → 已撤销
 */

// ── Edict Status (10 canonical states) ──────────────────────────────────

export type EdictStatus =
  | '待承旨'
  | '待草拟'
  | '待审议'
  | '待派发'
  | '待执行'
  | '执行中'
  | '待回奏'
  | '待复核'
  | '已办结'
  | '阻塞中'
  | '已撤销';

/** Primary workflow columns (7) — displayed on the kanban board */
export const KANBAN_COLUMNS: EdictStatus[] = [
  '待承旨',
  '待草拟',
  '待审议',
  '待派发',
  '执行中',
  '待回奏',
  '已办结',
];

/** Terminal states — no outgoing transitions */
export const TERMINAL_STATUSES: ReadonlySet<EdictStatus> = new Set(['已办结', '已撤销']);

// ── Edict Entity ─────────────────────────────────────────────────────────

export type EdictType = '制书' | '敕书' | '敕牒';

export interface FlowLogEntry {
  at: string;
  from: string;
  to: string;
  remark: string;
  agent: string;
  agentLabel: string;
}

export interface TodoItem {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  detail?: string;
}

export interface ProgressLogEntry {
  at: string;
  agent: string;
  agentLabel: string;
  text: string;
  todos?: string;
}

export interface PendingConfirm {
  targetState: EdictStatus;
  requestedBy: string;
  requestedAt: string;
  confirmBy: string;
}

export interface Edict {
  id: string;
  title: string;
  content: string;
  status: EdictStatus;
  type: EdictType;
  createdAt: string;
  updatedAt: string;
  seal: boolean;

  // ── Extended fields (from Framework Task model) ──
  traceId?: string;
  priority?: '低' | '中' | '高' | '紧急';
  assigneeOrg?: string;
  official?: string;
  creator?: string;
  tags?: string[];
  ac?: string;
  eta?: string;
  block?: string;
  output?: string;

  flowLog: FlowLogEntry[];
  progressLog: ProgressLogEntry[];
  todos: TodoItem[];
  pendingConfirm?: PendingConfirm;
  readyToClose?: boolean;
}

// ── Edict Message Protocol (6 message types) ────────────────────────────

export type EdictMessageType = 'edict' | 'memorial' | 'review' | 'dispatch' | 'report' | 'reward';

export type AgentID =
  | 'emperor'
  | 'taizi'
  | 'zhongshu'
  | 'menxia'
  | 'shangshu'
  | 'hubu'
  | 'libu'
  | 'bingbu'
  | 'xingbu'
  | 'gongbu'
  | 'libu_hr'
  | 'zaochao';

export interface EdictMessage {
  version: '1.0';
  messageId: string;
  type: EdictMessageType;
  from: AgentID;
  to: AgentID;
  payload: {
    edictId?: string;
    title?: string;
    content: string;
    urgency?: '低' | '中' | '高' | '紧急';
    metadata?: Record<string, unknown>;
  };
  signature?: string;
}

// ── History / Audit ─────────────────────────────────────────────────────

export interface HistoryLog {
  id: string;
  edictId: string;
  timestamp: string;
  action: string;
  operator: string;
  details: string;
}

// ── Honor / Medal System ────────────────────────────────────────────────

export type HonorDimension = '角色' | '成就' | '协作' | '安全' | '效率';

export interface Honor {
  id: string;
  name: string;
  icon: string;
  condition: string;
  stars: number;
  dimension: HonorDimension;
}

export interface OfficialStats {
  id: AgentID;
  label: string;
  emoji: string;
  role: string;
  model?: string;
  tokensIn: number;
  tokensOut: number;
  tokensTotal: number;
  costUsd: number;
  costCny: number;
  sessions: number;
  messages: number;
  heartbeat: { status: string; label: string };
  tasksDone: number;
  tasksActive: number;
  flowParticipations: number;
  participatedEdicts: string[];
  meritScore: number;
  meritRank: number;
  earnedHonors: string[];
}

// ── Notification Channels ────────────────────────────────────────────────

export type ChannelType = 'feishu' | 'wecom' | 'telegram' | 'discord' | 'slack' | 'qq' | 'webhook';

export interface NotificationChannelInfo {
  type: ChannelType;
  label: string;
  icon: string;
  placeholder: string;
  allowedDomains: readonly string[];
}

export interface NotificationPayload {
  title: string;
  content: string;
  url?: string;
}
