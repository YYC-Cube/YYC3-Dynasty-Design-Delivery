/**
 * @file agents.ts
 * @description Agent registry — 三省六部 system mapping.
 *
 * Ported from YYC3-Dynasty-Framework agents.json + sync_agent_config.py.
 * Defines the 11-agent hierarchy and their cultural metadata.
 */

import type { AgentID } from './types';

export interface AgentMeta {
  id: AgentID;
  label: string;
  role: string;
  duty: string;
  emoji: string;
  rank: number;
  tier: 'coordination' | 'execution' | 'standalone';
  org: string;
  spatialNode: string;
}

export const AGENT_REGISTRY: readonly AgentMeta[] = [
  {
    id: 'taizi',
    label: '太子',
    role: '消息分拣',
    duty: '承接圣旨，分类路由至中书省',
    emoji: '🤴',
    rank: 1,
    tier: 'coordination',
    org: '明堂',
    spatialNode: '明堂',
  },
  {
    id: 'zhongshu',
    label: '中书省',
    role: '规划草拟',
    duty: '将圣旨转化为执行方案，调用门下省审议',
    emoji: '📜',
    rank: 2,
    tier: 'coordination',
    org: '中书省',
    spatialNode: '应天门·左阙',
  },
  {
    id: 'menxia',
    label: '门下省',
    role: '审议封驳',
    duty: '审核方案可行性，准奏或封驳退回',
    emoji: '🔍',
    rank: 3,
    tier: 'coordination',
    org: '门下省',
    spatialNode: '应天门·中阙',
  },
  {
    id: 'shangshu',
    label: '尚书省',
    role: '调度派发',
    duty: '将批准方案派发至六部执行，核发鱼符',
    emoji: '📮',
    rank: 4,
    tier: 'coordination',
    org: '尚书省',
    spatialNode: '应天门·右阙',
  },
  {
    id: 'hubu',
    label: '户部',
    role: '数据分析',
    duty: '数据处理、成本核算、报表生成',
    emoji: '💰',
    rank: 5,
    tier: 'execution',
    org: '户部',
    spatialNode: '天津桥',
  },
  {
    id: 'libu',
    label: '礼部',
    role: '文档标准',
    duty: '文档撰写、UI设计、对外沟通',
    emoji: '📝',
    rank: 6,
    tier: 'execution',
    org: '礼部',
    spatialNode: '天津桥',
  },
  {
    id: 'bingbu',
    label: '兵部',
    role: '工程开发',
    duty: '功能开发、架构设计、代码重构',
    emoji: '⚔️',
    rank: 7,
    tier: 'execution',
    org: '兵部',
    spatialNode: '天津桥',
  },
  {
    id: 'xingbu',
    label: '刑部',
    role: '安全审计',
    duty: '代码审查、安全测试、合规检查',
    emoji: '⚖️',
    rank: 8,
    tier: 'execution',
    org: '刑部',
    spatialNode: '天津桥',
  },
  {
    id: 'gongbu',
    label: '工部',
    role: '运维基建',
    duty: 'CI/CD、部署运维、工具链建设',
    emoji: '🔧',
    rank: 9,
    tier: 'execution',
    org: '工部',
    spatialNode: '天津桥',
  },
  {
    id: 'libu_hr',
    label: '吏部',
    role: '人事管理',
    duty: 'Agent管理、培训、绩效评估',
    emoji: '👔',
    rank: 10,
    tier: 'execution',
    org: '吏部',
    spatialNode: '天津桥',
  },
  {
    id: 'zaochao',
    label: '钦天监',
    role: '情报简报',
    duty: '每日新闻简报、舆情监控',
    emoji: '🌅',
    rank: 11,
    tier: 'standalone',
    org: '钦天监',
    spatialNode: '独立',
  },
];

export const AGENT_MAP: Readonly<Record<string, AgentMeta>> = Object.fromEntries(
  AGENT_REGISTRY.map((a) => [a.id, a]),
);

/** Permission tiers — controls which kanban operations each agent can perform */
export const COORDINATION_AGENTS: ReadonlySet<string> = new Set([
  'taizi',
  'zhongshu',
  'menxia',
  'shangshu',
  'zaochao',
]);

export const EXECUTION_AGENTS: ReadonlySet<string> = new Set([
  'hubu',
  'libu',
  'bingbu',
  'xingbu',
  'gongbu',
  'libu_hr',
]);
