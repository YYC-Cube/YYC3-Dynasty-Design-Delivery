/**
 * @file honors.ts
 * @description Dynasty honors / medal system — 18 medals × 5 dimensions × 6 rarity tiers.
 *
 * Ported from docs/YYC3-Dynasty-Framework-文化勋章.md.
 * Merit score formula from scripts/sync_officials_stats.py.
 */

import type { Honor, HonorDimension, OfficialStats } from './types';

// ── 18 Medals ────────────────────────────────────────────────────────────

export const HONORS: readonly Honor[] = [
  // ── 角色 (Role-based honors) — 11 medals, 1 star ──
  {
    id: 'tai_zi_shao_shi',
    name: '太子少师',
    icon: '🎎',
    condition: '成为太子',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'zhong_shu_she_ren',
    name: '中书舍人',
    icon: '📜',
    condition: '成为中书省',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'men_xia_gei_shi',
    name: '门下给事中',
    icon: '🔍',
    condition: '成为门下省',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'shang_shu_pu_ye',
    name: '尚书仆射',
    icon: '📮',
    condition: '成为尚书省',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'hu_bu_lang_zhong',
    name: '户部郎中',
    icon: '💰',
    condition: '成为户部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'li_bu_shi_lang',
    name: '礼部侍郎',
    icon: '📝',
    condition: '成为礼部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'bing_bu_can_jiang',
    name: '兵部参将',
    icon: '⚔️',
    condition: '成为兵部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'xing_bu_gei_shi',
    name: '刑部给事中',
    icon: '⚖️',
    condition: '成为刑部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'gong_bu_da_jiang',
    name: '工部大匠',
    icon: '🔧',
    condition: '成为工部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'li_bu_zhu_shi',
    name: '吏部主事',
    icon: '📋',
    condition: '成为吏部',
    stars: 1,
    dimension: '角色',
  },
  {
    id: 'chen_zhong_si_chen',
    name: '晨钟司晨',
    icon: '🌅',
    condition: '成为早朝官',
    stars: 1,
    dimension: '角色',
  },

  // ── 成就 (Achievement honors) ──
  {
    id: 'ri_li_wan_ji',
    name: '日理万机',
    icon: '💯',
    condition: '完成100个任务',
    stars: 2,
    dimension: '成就',
  },
  {
    id: 'bai_zhan_bu_dai',
    name: '百战不殆',
    icon: '🛡️',
    condition: '兵部修复100个bug',
    stars: 2,
    dimension: '成就',
  },
  {
    id: 'ren_cong_zong_zhao',
    name: '人从众曌',
    icon: '👑',
    condition: '获得20个五星回奏',
    stars: 5,
    dimension: '成就',
  },

  // ── 协作 (Collaboration honors) ──
  {
    id: 'feng_bo_zhi_jian',
    name: '封驳直谏',
    icon: '💬',
    condition: '门下省成功驳回10次',
    stars: 3,
    dimension: '协作',
  },
  {
    id: 'san_sheng_tong_xin',
    name: '三省同心',
    icon: '🤝',
    condition: '一次任务零封驳完美协作',
    stars: 4,
    dimension: '协作',
  },

  // ── 安全 (Security honors) ──
  {
    id: 'tong_qiang_tie_bi',
    name: '铜墙铁壁',
    icon: '🔐',
    condition: '刑部阻止5次安全入侵',
    stars: 4,
    dimension: '安全',
  },

  // ── 效率 (Efficiency honors) ──
  {
    id: 'jiu_jiu_gui_yi',
    name: '九九归一',
    icon: '🌌',
    condition: '连续99个任务无阻塞',
    stars: 6,
    dimension: '效率',
  },
];

// ── Rarity Visual Tiers ──────────────────────────────────────────────────

export interface RarityTier {
  stars: number;
  border: string;
  label: string;
  glow: string;
}

export const RARITY_TIERS: readonly RarityTier[] = [
  { stars: 6, border: '龙纹金边', label: '神话', glow: 'shadow-[0_0_20px_rgba(212,175,55,0.6)]' },
  { stars: 5, border: '青铜纹边', label: '传说', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.4)]' },
  { stars: 4, border: '银边', label: '史诗', glow: 'shadow-[0_0_10px_rgba(100,116,139,0.3)]' },
  { stars: 3, border: '铜边', label: '稀有', glow: '' },
  { stars: 2, border: '铁边', label: '精良', glow: '' },
  { stars: 1, border: '素边', label: '普通', glow: '' },
];

export function getRarityTier(stars: number): RarityTier {
  return RARITY_TIERS.find((t) => t.stars === stars) ?? RARITY_TIERS[RARITY_TIERS.length - 1];
}

export function renderStars(stars: number, earned: boolean): string {
  const full = earned ? '★' : '☆';
  return full.repeat(stars);
}

// ── Merit Score (from Framework sync_officials_stats.py) ─────────────────

/**
 * Merit score formula (ported from Python):
 *   merit_score = tasks_done * 10 + flow_participations * 2 + min(sessions, 20)
 */
export function calcMeritScore(
  stats: Pick<OfficialStats, 'tasksDone' | 'flowParticipations' | 'sessions'>,
): number {
  return stats.tasksDone * 10 + stats.flowParticipations * 2 + Math.min(stats.sessions, 20);
}

/** Rank officials by merit score (higher = better rank, rank 1 = best) */
export function rankByMerit<T extends { meritScore: number }>(officials: T[]): T[] {
  return [...officials].sort((a, b) => b.meritScore - a.meritScore);
}

// ── Honor Grouping ────────────────────────────────────────────────────────

export const HONOR_DIMENSIONS: readonly HonorDimension[] = ['角色', '成就', '协作', '安全', '效率'];

export function groupHonorsByDimension(honors: readonly Honor[]): Record<HonorDimension, Honor[]> {
  const result = {} as Record<HonorDimension, Honor[]>;
  for (const dim of HONOR_DIMENSIONS) {
    result[dim] = honors.filter((h) => h.dimension === dim);
  }
  return result;
}

export const HONOR_MAP: Readonly<Record<string, Honor>> = Object.fromEntries(
  HONORS.map((h) => [h.id, h]),
);
