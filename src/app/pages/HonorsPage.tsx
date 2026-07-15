import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from '@yyc3/i18n-react';
import {
  HONORS,
  HONOR_DIMENSIONS,
  groupHonorsByDimension,
  getRarityTier,
  renderStars,
  type Honor,
  type OfficialStats,
} from '../domain';

// ── Mock official stats (would come from backend in production) ────────────

const MOCK_OFFICIALS: OfficialStats[] = [
  {
    id: 'zhongshu',
    label: '中书省',
    emoji: '📜',
    role: '规划草拟',
    model: 'glm-5.1',
    tokensIn: 1250000,
    tokensOut: 380000,
    tokensTotal: 1630000,
    costUsd: 12.5,
    costCny: 90.6,
    sessions: 28,
    messages: 145,
    heartbeat: { status: 'idle', label: '⚪ 待命' },
    tasksDone: 15,
    tasksActive: 2,
    flowParticipations: 22,
    participatedEdicts: [],
    meritScore: 234,
    meritRank: 1,
    earnedHonors: ['zhong_shu_she_ren', 'ri_li_wan_ji'],
  },
  {
    id: 'menxia',
    label: '门下省',
    emoji: '🔍',
    role: '审议封驳',
    model: 'glm-5.1',
    tokensIn: 890000,
    tokensOut: 210000,
    tokensTotal: 1100000,
    costUsd: 8.2,
    costCny: 59.5,
    sessions: 20,
    messages: 88,
    heartbeat: { status: 'idle', label: '⚪ 待命' },
    tasksDone: 12,
    tasksActive: 1,
    flowParticipations: 18,
    participatedEdicts: [],
    meritScore: 178,
    meritRank: 2,
    earnedHonors: ['men_xia_gei_shi', 'feng_bo_zhi_jian'],
  },
  {
    id: 'shangshu',
    label: '尚书省',
    emoji: '📮',
    role: '调度派发',
    model: 'glm-5',
    tokensIn: 670000,
    tokensOut: 180000,
    tokensTotal: 850000,
    costUsd: 6.1,
    costCny: 44.2,
    sessions: 16,
    messages: 62,
    heartbeat: { status: 'idle', label: '⚪ 待命' },
    tasksDone: 10,
    tasksActive: 1,
    flowParticipations: 15,
    participatedEdicts: [],
    meritScore: 150,
    meritRank: 3,
    earnedHonors: ['shang_shu_pu_ye'],
  },
  {
    id: 'bingbu',
    label: '兵部',
    emoji: '⚔️',
    role: '工程开发',
    model: 'claude-sonnet-4.6',
    tokensIn: 2400000,
    tokensOut: 680000,
    tokensTotal: 3080000,
    costUsd: 28.3,
    costCny: 205.2,
    sessions: 35,
    messages: 210,
    heartbeat: { status: 'idle', label: '⚪ 待命' },
    tasksDone: 8,
    tasksActive: 3,
    flowParticipations: 12,
    participatedEdicts: [],
    meritScore: 134,
    meritRank: 4,
    earnedHonors: ['bing_bu_can_jiang'],
  },
  {
    id: 'taizi',
    label: '太子',
    emoji: '🤴',
    role: '消息分拣',
    model: 'glm-5-turbo',
    tokensIn: 450000,
    tokensOut: 120000,
    tokensTotal: 570000,
    costUsd: 3.2,
    costCny: 23.2,
    sessions: 42,
    messages: 95,
    heartbeat: { status: 'idle', label: '⚪ 待命' },
    tasksDone: 20,
    tasksActive: 0,
    flowParticipations: 20,
    participatedEdicts: [],
    meritScore: 120,
    meritRank: 5,
    earnedHonors: ['tai_zi_shao_shi'],
  },
];

const DIMENSION_LABELS: Record<string, string> = {
  角色: '角色勋章',
  成就: '成就勋章',
  协作: '协作勋章',
  安全: '安全勋章',
  效率: '效率勋章',
};

export function HonorsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedDimension, setExpandedDimension] = React.useState<string>('角色');

  const grouped = groupHonorsByDimension(HONORS);
  const earnedHonorIds = new Set(MOCK_OFFICIALS.flatMap((o) => o.earnedHonors));
  const totalEarned = HONORS.filter((h) => earnedHonorIds.has(h.id)).length;

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-serif text-3xl text-[var(--color-accent-gold)]">🏅 勋 章 墙</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {HONORS.length} 种 · 1-6 星 · 已获得 {totalEarned} 枚
        </p>
      </div>

      {/* Merit Leaderboard */}
      <div className="mb-8 overflow-hidden rounded-lg border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-secondary)]">
        <div className="border-b border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-tertiary)] px-4 py-3">
          <h3 className="font-serif text-sm text-[var(--color-accent-gold)]">
            功勋榜 · Merit Ranking
          </h3>
        </div>
        <div className="divide-y divide-[var(--color-bg-primary)]">
          {MOCK_OFFICIALS.map((official, idx) => (
            <div key={official.id} className="flex items-center gap-4 px-4 py-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
                  idx === 0
                    ? 'bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                }`}
              >
                {official.meritRank}
              </span>
              <span className="text-xl">{official.emoji}</span>
              <div className="flex-1">
                <span className="font-serif text-sm text-[var(--color-text-primary)]">
                  {official.label}
                </span>
                <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                  {official.role} · {official.model}
                </span>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-[var(--color-accent-gold)]">
                  {official.meritScore}
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  {official.tasksDone}办结 · {official.flowParticipations}参与
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-[var(--color-text-secondary)]">
                  {(official.tokensTotal / 1000).toFixed(0)}K tokens
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  ${official.costUsd.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medal Groups (accordion) */}
      <div className="space-y-3">
        {HONOR_DIMENSIONS.map((dim) => {
          const honors = grouped[dim];
          const isExpanded = expandedDimension === dim;
          return (
            <div
              key={dim}
              className="overflow-hidden rounded-lg border border-[var(--color-bg-secondary)] bg-[var(--color-bg-secondary)]"
            >
              <button
                onClick={() => setExpandedDimension(isExpanded ? '' : dim)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-tertiary)]"
              >
                <span className="font-serif text-sm text-[var(--color-accent-gold)]">
                  {DIMENSION_LABELS[dim] || dim}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {honors.length} 枚 · {isExpanded ? '收起' : '展开'}
                </span>
              </button>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-2 px-4 pb-4"
                >
                  {honors.map((honor) => (
                    <HonorCard key={honor.id} honor={honor} earned={earnedHonorIds.has(honor.id)} />
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/court')}
          className="rounded border border-[var(--color-accent-gold)] bg-[var(--color-bg-primary)] px-6 py-2 text-sm font-medium text-[var(--color-accent-gold)] transition-colors hover:bg-[var(--color-accent-gold)]/10"
        >
          {t('edict.backToCourt')}
        </button>
      </div>
    </div>
  );
}

function HonorCard({ honor, earned }: { honor: Honor; earned: boolean }) {
  const tier = getRarityTier(honor.stars);

  return (
    <div
      className={`flex items-center gap-4 rounded border p-3 transition-all ${
        earned
          ? `border-[var(--color-accent-gold)]/40 bg-[var(--color-bg-tertiary)] ${tier.glow}`
          : 'border-[var(--color-text-secondary)]/20 bg-[var(--color-bg-primary)] opacity-50'
      }`}
    >
      {/* Icon */}
      <span className={`text-2xl ${earned ? '' : 'grayscale'}`}>{earned ? honor.icon : '🔒'}</span>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm text-[var(--color-text-primary)]">{honor.name}</span>
          <span
            className={`text-xs ${earned ? 'text-[var(--color-accent-gold)]' : 'text-[var(--color-text-secondary)]'}`}
          >
            {renderStars(honor.stars, earned)}
          </span>
          <span className="rounded bg-[var(--color-bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-secondary)]">
            {tier.label}
          </span>
        </div>
        <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
          条件：{honor.condition}
        </div>
      </div>

      {/* Status badge */}
      {earned && (
        <span className="rounded bg-[var(--color-accent-emerald)]/20 px-2 py-1 text-[10px] text-[var(--color-accent-emerald)]">
          已获得
        </span>
      )}
    </div>
  );
}
