import { describe, it, expect } from 'vitest';
import {
  STATE_TRANSITIONS,
  HIGH_RISK_TRANSITIONS,
  isValidTransition,
  getValidTransitions,
  isHighRiskTransition,
  isTerminal,
  resolveTransition,
  STATE_ORG_MAP,
  STATE_AGENT_MAP,
} from '../stateMachine';
import type { EdictStatus } from '../types';

describe('State Machine: STATE_TRANSITIONS', () => {
  it('defines transitions for all 11 statuses', () => {
    const allStatuses: EdictStatus[] = [
      '待承旨',
      '待草拟',
      '待审议',
      '待派发',
      '待执行',
      '执行中',
      '待回奏',
      '待复核',
      '已办结',
      '阻塞中',
      '已撤销',
    ];
    for (const status of allStatuses) {
      expect(STATE_TRANSITIONS[status]).toBeDefined();
    }
  });

  it('marks terminal states with no outgoing transitions', () => {
    expect(STATE_TRANSITIONS['已办结']).toHaveLength(0);
    expect(STATE_TRANSITIONS['已撤销']).toHaveLength(0);
  });

  it('allows 待承旨 → 待草拟 and → 已撤销', () => {
    expect(STATE_TRANSITIONS['待承旨']).toContain('待草拟');
    expect(STATE_TRANSITIONS['待承旨']).toContain('已撤销');
  });

  it('allows 待审议 → 待派发 (准奏) and → 待草拟 (封驳)', () => {
    expect(STATE_TRANSITIONS['待审议']).toContain('待派发');
    expect(STATE_TRANSITIONS['待审议']).toContain('待草拟');
  });

  it('allows 阻塞中 to transition back to multiple pipeline states', () => {
    const blockedTargets = STATE_TRANSITIONS['阻塞中'];
    expect(blockedTargets.length).toBeGreaterThanOrEqual(6);
    expect(blockedTargets).toContain('待草拟');
    expect(blockedTargets).toContain('待审议');
    expect(blockedTargets).toContain('待派发');
  });

  it('does not allow reverse terminal transitions', () => {
    expect(STATE_TRANSITIONS['已办结']).not.toContain('待回奏');
    expect(STATE_TRANSITIONS['已撤销']).not.toContain('待承旨');
  });
});

describe('State Machine: isValidTransition', () => {
  it('returns true for valid forward transitions', () => {
    expect(isValidTransition('待承旨', '待草拟')).toBe(true);
    expect(isValidTransition('待草拟', '待审议')).toBe(true);
    expect(isValidTransition('待审议', '待派发')).toBe(true);
    expect(isValidTransition('待派发', '执行中')).toBe(true);
  });

  it('returns false for invalid transitions', () => {
    expect(isValidTransition('待承旨', '执行中')).toBe(false);
    expect(isValidTransition('待承旨', '已办结')).toBe(false);
    expect(isValidTransition('待草拟', '待回奏')).toBe(false);
    expect(isValidTransition('已办结', '待回奏')).toBe(false);
  });

  it('returns false for same-state transitions', () => {
    expect(isValidTransition('待草拟', '待草拟')).toBe(false);
    expect(isValidTransition('执行中', '执行中')).toBe(false);
  });

  it('returns true for 封驳 (veto) loop: 待审议 → 待草拟', () => {
    expect(isValidTransition('待审议', '待草拟')).toBe(true);
  });

  it('returns true for unblock: 阻塞中 → 任意主管线', () => {
    expect(isValidTransition('阻塞中', '待草拟')).toBe(true);
    expect(isValidTransition('阻塞中', '待审议')).toBe(true);
    expect(isValidTransition('阻塞中', '执行中')).toBe(true);
  });
});

describe('State Machine: getValidTransitions', () => {
  it('returns array of valid targets for non-terminal states', () => {
    const targets = getValidTransitions('待承旨');
    expect(targets).toContain('待草拟');
    expect(targets).toContain('已撤销');
    expect(targets.length).toBe(2);
  });

  it('returns empty array for terminal states', () => {
    expect(getValidTransitions('已办结')).toHaveLength(0);
    expect(getValidTransitions('已撤销')).toHaveLength(0);
  });
});

describe('State Machine: HIGH_RISK_TRANSITIONS', () => {
  it('defines 3 high-risk transitions', () => {
    expect(HIGH_RISK_TRANSITIONS).toHaveLength(3);
  });

  it('marks 待回奏→已办结 as high-risk (requires 门下省 confirm)', () => {
    const hr = isHighRiskTransition('待回奏', '已办结');
    expect(hr).toBeDefined();
    expect(hr?.confirmBy).toBe('门下省');
  });

  it('marks 执行中→已撤销 as high-risk (requires 尚书省 confirm)', () => {
    const hr = isHighRiskTransition('执行中', '已撤销');
    expect(hr).toBeDefined();
    expect(hr?.confirmBy).toBe('尚书省');
  });

  it('returns undefined for non-high-risk transitions', () => {
    expect(isHighRiskTransition('待承旨', '待草拟')).toBeUndefined();
    expect(isHighRiskTransition('待审议', '待派发')).toBeUndefined();
  });
});

describe('State Machine: isTerminal', () => {
  it('returns true for 已办结 and 已撤销', () => {
    expect(isTerminal('已办结')).toBe(true);
    expect(isTerminal('已撤销')).toBe(true);
  });

  it('returns false for non-terminal states', () => {
    expect(isTerminal('待承旨')).toBe(false);
    expect(isTerminal('执行中')).toBe(false);
    expect(isTerminal('阻塞中')).toBe(false);
  });
});

describe('State Machine: resolveTransition', () => {
  it('resolves normal transitions directly', () => {
    const result = resolveTransition('待承旨', '待草拟', '明堂');
    expect(result.status).toBe('待草拟');
    expect(result.pendingConfirm).toBeUndefined();
  });

  it('routes high-risk transitions through 待复核', () => {
    const result = resolveTransition('待回奏', '已办结', '六部');
    expect(result.status).toBe('待复核');
    expect(result.pendingConfirm).toBeDefined();
    expect(result.pendingConfirm?.targetState).toBe('已办结');
    expect(result.pendingConfirm?.confirmBy).toBe('门下省');
    expect(result.pendingConfirm?.requestedBy).toBe('六部');
  });

  it('throws on illegal transitions', () => {
    expect(() => resolveTransition('待承旨', '执行中', 'test')).toThrow('非法流转');
  });
});

describe('State Machine: Cultural Mappings', () => {
  it('maps all statuses to their cultural org', () => {
    expect(STATE_ORG_MAP['待承旨']).toBe('明堂');
    expect(STATE_ORG_MAP['待草拟']).toBe('中书省');
    expect(STATE_ORG_MAP['待审议']).toBe('门下省');
    expect(STATE_ORG_MAP['待派发']).toBe('尚书省');
    expect(STATE_ORG_MAP['执行中']).toBe('六部');
    expect(STATE_ORG_MAP['已办结']).toBe('定鼎门');
  });

  it('maps statuses to their responsible agent', () => {
    expect(STATE_AGENT_MAP['待承旨']).toBe('明堂·太子');
    expect(STATE_AGENT_MAP['待草拟']).toBe('中书省');
    expect(STATE_AGENT_MAP['待审议']).toBe('门下省');
    expect(STATE_AGENT_MAP['待派发']).toBe('尚书省');
  });
});
