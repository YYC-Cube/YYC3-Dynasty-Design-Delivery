import { describe, it, expect } from 'vitest';
import { AGENT_REGISTRY, AGENT_MAP, COORDINATION_AGENTS, EXECUTION_AGENTS } from '../agents';

describe('Agents Registry: AGENT_REGISTRY', () => {
  it('defines 11 agents', () => {
    expect(AGENT_REGISTRY).toHaveLength(11);
  });

  it('each agent has required fields', () => {
    for (const agent of AGENT_REGISTRY) {
      expect(agent.id).toBeTruthy();
      expect(agent.label).toBeTruthy();
      expect(agent.role).toBeTruthy();
      expect(agent.duty).toBeTruthy();
      expect(agent.emoji).toBeTruthy();
      expect(agent.rank).toBeGreaterThan(0);
      expect(['coordination', 'execution', 'standalone']).toContain(agent.tier);
      expect(agent.org).toBeTruthy();
      expect(agent.spatialNode).toBeTruthy();
    }
  });

  it('all agent IDs are unique', () => {
    const ids = AGENT_REGISTRY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes all 三省六部 agents', () => {
    const ids = AGENT_REGISTRY.map((a) => a.id);
    expect(ids).toContain('taizi');
    expect(ids).toContain('zhongshu');
    expect(ids).toContain('menxia');
    expect(ids).toContain('shangshu');
    expect(ids).toContain('hubu');
    expect(ids).toContain('libu');
    expect(ids).toContain('bingbu');
    expect(ids).toContain('xingbu');
    expect(ids).toContain('gongbu');
    expect(ids).toContain('libu_hr');
  });

  it('includes 钦天监 as standalone', () => {
    const zaochao = AGENT_REGISTRY.find((a) => a.id === 'zaochao');
    expect(zaochao?.tier).toBe('standalone');
  });
});

describe('Agents Registry: AGENT_MAP', () => {
  it('provides O(1) lookup by agent ID', () => {
    const zhongshu = AGENT_MAP['zhongshu'];
    expect(zhongshu).toBeDefined();
    expect(zhongshu.label).toBe('中书省');
  });

  it('maps all 11 IDs', () => {
    expect(Object.keys(AGENT_MAP)).toHaveLength(11);
  });
});

describe('Agents Registry: Permission Tiers', () => {
  it('COORDINATION_AGENTS contains 5 coordination agents', () => {
    expect(COORDINATION_AGENTS.size).toBe(5);
    expect(COORDINATION_AGENTS.has('taizi')).toBe(true);
    expect(COORDINATION_AGENTS.has('zhongshu')).toBe(true);
    expect(COORDINATION_AGENTS.has('menxia')).toBe(true);
    expect(COORDINATION_AGENTS.has('shangshu')).toBe(true);
    expect(COORDINATION_AGENTS.has('zaochao')).toBe(true);
  });

  it('EXECUTION_AGENTS contains 6 execution agents', () => {
    expect(EXECUTION_AGENTS.size).toBe(6);
    expect(EXECUTION_AGENTS.has('hubu')).toBe(true);
    expect(EXECUTION_AGENTS.has('libu')).toBe(true);
    expect(EXECUTION_AGENTS.has('bingbu')).toBe(true);
    expect(EXECUTION_AGENTS.has('xingbu')).toBe(true);
    expect(EXECUTION_AGENTS.has('gongbu')).toBe(true);
    expect(EXECUTION_AGENTS.has('libu_hr')).toBe(true);
  });

  it('no agent is in both tiers', () => {
    for (const id of COORDINATION_AGENTS) {
      expect(EXECUTION_AGENTS.has(id)).toBe(false);
    }
  });
});
