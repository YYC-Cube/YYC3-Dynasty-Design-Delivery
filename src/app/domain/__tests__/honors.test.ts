import { describe, it, expect } from 'vitest';
import {
  HONORS,
  HONOR_DIMENSIONS,
  HONOR_MAP,
  getRarityTier,
  renderStars,
  calcMeritScore,
  rankByMerit,
  groupHonorsByDimension,
} from '../honors';

describe('Honors System: HONORS catalog', () => {
  it('defines exactly 18 medals', () => {
    expect(HONORS).toHaveLength(18);
  });

  it('each honor has required fields', () => {
    for (const honor of HONORS) {
      expect(honor.id).toBeTruthy();
      expect(honor.name).toBeTruthy();
      expect(honor.icon).toBeTruthy();
      expect(honor.condition).toBeTruthy();
      expect(honor.stars).toBeGreaterThanOrEqual(1);
      expect(honor.stars).toBeLessThanOrEqual(6);
      expect(honor.dimension).toBeTruthy();
    }
  });

  it('all honor IDs are unique', () => {
    const ids = HONORS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes the 6-star medal 九九归一', () => {
    const legendary = HONORS.find((h) => h.name === '九九归一');
    expect(legendary).toBeDefined();
    expect(legendary?.stars).toBe(6);
    expect(legendary?.dimension).toBe('效率');
  });

  it('includes the role-based medals for all main agents', () => {
    const roleHonors = HONORS.filter((h) => h.dimension === '角色');
    // 11 agents = 11 role medals
    expect(roleHonors.length).toBe(11);
  });
});

describe('Honors System: HONOR_DIMENSIONS', () => {
  it('defines 5 dimensions', () => {
    expect(HONOR_DIMENSIONS).toHaveLength(5);
    expect(HONOR_DIMENSIONS).toContain('角色');
    expect(HONOR_DIMENSIONS).toContain('成就');
    expect(HONOR_DIMENSIONS).toContain('协作');
    expect(HONOR_DIMENSIONS).toContain('安全');
    expect(HONOR_DIMENSIONS).toContain('效率');
  });
});

describe('Honors System: groupHonorsByDimension', () => {
  it('groups all 18 honors into 5 dimensions', () => {
    const grouped = groupHonorsByDimension(HONORS);
    const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(18);
  });

  it('角色 dimension has 11 medals', () => {
    const grouped = groupHonorsByDimension(HONORS);
    expect(grouped['角色']).toHaveLength(11);
  });

  it('效率 dimension has 1 medal (九九归一)', () => {
    const grouped = groupHonorsByDimension(HONORS);
    expect(grouped['效率']).toHaveLength(1);
  });
});

describe('Honors System: getRarityTier', () => {
  it('returns correct tier for each star level 1-6', () => {
    expect(getRarityTier(1).label).toBe('普通');
    expect(getRarityTier(2).label).toBe('精良');
    expect(getRarityTier(3).label).toBe('稀有');
    expect(getRarityTier(4).label).toBe('史诗');
    expect(getRarityTier(5).label).toBe('传说');
    expect(getRarityTier(6).label).toBe('神话');
  });

  it('6-star tier has gold glow effect', () => {
    const tier = getRarityTier(6);
    expect(tier.glow).toContain('shadow');
  });

  it('1-star tier has no glow effect', () => {
    const tier = getRarityTier(1);
    expect(tier.glow).toBe('');
  });
});

describe('Honors System: renderStars', () => {
  it('renders filled stars when earned', () => {
    expect(renderStars(3, true)).toBe('★★★');
    expect(renderStars(6, true)).toBe('★★★★★★');
  });

  it('renders hollow stars when not earned', () => {
    expect(renderStars(3, false)).toBe('☆☆☆');
    expect(renderStars(1, false)).toBe('☆');
  });
});

describe('Honors System: calcMeritScore', () => {
  it('calculates score using the Framework formula', () => {
    expect(calcMeritScore({ tasksDone: 10, flowParticipations: 5, sessions: 10 })).toBe(
      10 * 10 + 5 * 2 + Math.min(10, 20),
    );
    // = 100 + 10 + 10 = 120
  });

  it('caps sessions at 20 in the score', () => {
    const capped = calcMeritScore({ tasksDone: 5, flowParticipations: 0, sessions: 100 });
    // = 50 + 0 + 20 = 70
    expect(capped).toBe(70);
  });

  it('returns 0 for a brand-new agent', () => {
    expect(calcMeritScore({ tasksDone: 0, flowParticipations: 0, sessions: 0 })).toBe(0);
  });

  it('weights tasks_done heavily (×10)', () => {
    const score = calcMeritScore({ tasksDone: 1, flowParticipations: 0, sessions: 0 });
    expect(score).toBe(10);
  });
});

describe('Honors System: rankByMerit', () => {
  it('sorts officials descending by meritScore', () => {
    const officials = [
      { meritScore: 100, id: 'a' },
      { meritScore: 300, id: 'b' },
      { meritScore: 200, id: 'c' },
    ];
    const ranked = rankByMerit(officials);
    expect(ranked[0].id).toBe('b');
    expect(ranked[1].id).toBe('c');
    expect(ranked[2].id).toBe('a');
  });

  it('does not mutate the original array', () => {
    const officials = [
      { meritScore: 100, id: 'a' },
      { meritScore: 300, id: 'b' },
    ];
    rankByMerit(officials);
    expect(officials[0].id).toBe('a');
  });
});

describe('Honors System: HONOR_MAP', () => {
  it('provides O(1) lookup by honor ID', () => {
    const honor = HONOR_MAP['jiu_jiu_gui_yi'];
    expect(honor).toBeDefined();
    expect(honor.name).toBe('九九归一');
  });
});
