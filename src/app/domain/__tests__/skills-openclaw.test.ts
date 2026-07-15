import { describe, it, expect } from 'vitest';
import {
  OFFICIAL_SKILLS,
  OFFICIAL_SKILLS_HUB_BASE,
  FALLBACK_HUB_BASES,
  getSkillUrl,
  getSkillsForAgent,
  isValidSkillName,
} from '../skills';
import {
  inferStateFromSession,
  detectOfficial,
  OFFICIAL_MAP,
  calcCost,
  detectHeartbeat,
  parseTranscript,
} from '../openclaw';

describe('Skills: OFFICIAL_SKILLS catalog', () => {
  it('defines 6 official skills', () => {
    expect(OFFICIAL_SKILLS).toHaveLength(6);
  });

  it('each skill has name, description, and recommendedAgents', () => {
    for (const skill of OFFICIAL_SKILLS) {
      expect(skill.name).toBeTruthy();
      expect(skill.description).toBeTruthy();
      expect(skill.recommendedAgents.length).toBeGreaterThan(0);
    }
  });

  it('includes code_review mapped to bingbu/xingbu/menxia', () => {
    const cr = OFFICIAL_SKILLS.find((s) => s.name === 'code_review');
    expect(cr).toBeDefined();
    expect(cr?.recommendedAgents).toContain('bingbu');
    expect(cr?.recommendedAgents).toContain('xingbu');
    expect(cr?.recommendedAgents).toContain('menxia');
  });
});

describe('Skills: Hub URLs', () => {
  it('points to GitHub raw openclaw-ai/skills-hub', () => {
    expect(OFFICIAL_SKILLS_HUB_BASE).toContain('openclaw-ai/skills-hub');
  });

  it('has 2 fallback mirrors', () => {
    expect(FALLBACK_HUB_BASES).toHaveLength(2);
    expect(FALLBACK_HUB_BASES.some((u) => u.includes('ghproxy'))).toBe(true);
    expect(FALLBACK_HUB_BASES.some((u) => u.includes('gitmirror'))).toBe(true);
  });

  it('getSkillUrl builds correct path', () => {
    const url = getSkillUrl('code_review');
    expect(url).toBe(`${OFFICIAL_SKILLS_HUB_BASE}/code_review/SKILL.md`);
  });
});

describe('Skills: getSkillsForAgent', () => {
  it('returns skills recommended for bingbu', () => {
    const skills = getSkillsForAgent('bingbu');
    expect(skills.length).toBeGreaterThan(0);
    expect(skills.some((s) => s.name === 'code_review')).toBe(true);
    expect(skills.some((s) => s.name === 'api_design')).toBe(true);
  });

  it('returns fewer skills for libu', () => {
    const skills = getSkillsForAgent('libu');
    expect(skills.length).toBe(1);
    expect(skills[0].name).toBe('doc_generation');
  });
});

describe('Skills: isValidSkillName', () => {
  it('accepts alphanumeric + Chinese', () => {
    expect(isValidSkillName('code_review')).toBe(true);
    expect(isValidSkillName('审计')).toBe(true);
  });

  it('rejects special chars', () => {
    expect(isValidSkillName('code review!')).toBe(false);
    expect(isValidSkillName('../etc/passwd')).toBe(false);
  });
});

describe('OpenClaw: inferStateFromSession', () => {
  it('returns Doing for sessions ≤2 min', () => {
    const result = inferStateFromSession(30 * 1000, false);
    expect(result.state).toBe('Doing');
    expect(result.visible).toBe(true);
  });

  it('returns Review for sessions 2-60 min', () => {
    const result = inferStateFromSession(30 * 60 * 1000, false);
    expect(result.state).toBe('Review');
    expect(result.visible).toBe(true);
  });

  it('returns Next for sessions >60 min', () => {
    const result = inferStateFromSession(2 * 60 * 60 * 1000, false);
    expect(result.state).toBe('Next');
    expect(result.visible).toBe(false);
  });

  it('returns Blocked for aborted sessions regardless of age', () => {
    const result = inferStateFromSession(5000, true);
    expect(result.state).toBe('Blocked');
    expect(result.visible).toBe(true);
  });
});

describe('OpenClaw: detectOfficial', () => {
  it('maps known agent IDs to official titles', () => {
    expect(detectOfficial('zhongshu').title).toBe('中书令');
    expect(detectOfficial('zhongshu').org).toBe('中书省');
    expect(detectOfficial('menxia').title).toBe('侍中');
    expect(detectOfficial('shangshu').org).toBe('尚书省');
  });

  it('handles legacy "main" id as taizi', () => {
    expect(detectOfficial('main').org).toBe('太子');
  });

  it('falls back to 尚书令 for unknown agents', () => {
    const result = detectOfficial('unknown_agent');
    expect(result.org).toBe('尚书省');
  });

  it('maps all 12 entries in OFFICIAL_MAP', () => {
    expect(Object.keys(OFFICIAL_MAP)).toHaveLength(12);
  });
});

describe('OpenClaw: calcCost', () => {
  it('calculates cost for glm-5.1', () => {
    const cost = calcCost(1_000_000, 500_000, 0, 0, 'glm-5.1');
    // in: 1M * 0.15 = 0.15, out: 0.5M * 0.6 = 0.3 → total 0.45
    expect(cost.usd).toBeCloseTo(0.45, 1);
  });

  it('calculates CNY from USD', () => {
    const cost = calcCost(1_000_000, 0, 0, 0, 'glm-5.1');
    // in: 1M * 0.15 = 0.15 USD → 0.15 * 7.25 = 1.0875 → round to 1.09
    expect(cost.cny).toBeGreaterThan(0);
  });

  it('falls back to glm-5.1 pricing for unknown models', () => {
    const cost = calcCost(1_000_000, 0, 0, 0, 'unknown-model');
    const fallback = calcCost(1_000_000, 0, 0, 0, 'glm-5.1');
    expect(cost.usd).toBe(fallback.usd);
  });
});

describe('OpenClaw: detectHeartbeat', () => {
  it('returns active for <5 min', () => {
    expect(detectHeartbeat(60_000).status).toBe('active');
  });

  it('returns warn for 5-15 min', () => {
    expect(detectHeartbeat(10 * 60_000).status).toBe('warn');
  });

  it('returns stalled for >15 min', () => {
    expect(detectHeartbeat(20 * 60_000).status).toBe('stalled');
  });

  it('returns unknown for undefined age', () => {
    expect(detectHeartbeat(undefined).status).toBe('unknown');
  });
});

describe('OpenClaw: parseTranscript', () => {
  it('parses a simple JSONL transcript', () => {
    const jsonl = [
      JSON.stringify({
        timestamp: '2026-07-16T10:00:00Z',
        message: { role: 'assistant', content: [{ type: 'text', text: 'Hello world' }] },
      }),
      JSON.stringify({
        timestamp: '2026-07-16T10:01:00Z',
        message: { role: 'toolResult', toolName: 'editor', content: [{ text: 'done' }] },
      }),
    ].join('\n');

    const rows = parseTranscript(jsonl);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((r) => r.kind === 'assistant')).toBe(true);
    expect(rows.some((r) => r.kind === 'tool')).toBe(true);
  });

  it('handles invalid JSON lines gracefully', () => {
    const jsonl = 'not json\n{"message":{"role":"user","content":[{"text":"hi"}]}}';
    const rows = parseTranscript(jsonl);
    expect(rows.length).toBe(1);
  });

  it('returns empty array for empty input', () => {
    expect(parseTranscript('')).toEqual([]);
  });
});
