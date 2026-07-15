/**
 * @file skills.ts
 * @description OpenClaw official Skills Hub integration.
 *
 * Ported from YYC3-Dynasty-Framework scripts/skill_manager.py.
 * Defines the official skill catalog, mirror failover URLs, agent-skill
 * mapping, and the source.json schema for tracking installed skills.
 *
 * OpenClaw Skills Hub: https://github.com/openclaw-ai/skills-hub
 * Skills are SKILL.md files installed to ~/.openclaw/workspace-<agent>/skills/<name>/
 */

import type { AgentID } from './types';

// ── Official Skills Hub URLs ─────────────────────────────────────────────

export const OFFICIAL_SKILLS_HUB_BASE =
  'https://raw.githubusercontent.com/openclaw-ai/skills-hub/main';

/** Fallback mirrors for China network (GitHub raw access issues) */
export const FALLBACK_HUB_BASES: readonly string[] = [
  'https://ghproxy.com/https://raw.githubusercontent.com/openclaw-ai/skills-hub/main',
  'https://raw.gitmirror.com/openclaw-ai/skills-hub/main',
];

/** Environment variable override for custom hub base */
export const HUB_BASE_ENV = 'OPENCLAW_SKILLS_HUB_BASE';

/**
 * Resolve the hub base URL with priority:
 * 1. ~/.openclaw/skills-hub-url file
 * 2. OPENCLAW_SKILLS_HUB_BASE env var
 * 3. OFFICIAL_SKILLS_HUB_BASE (GitHub raw)
 */
export function resolveHubBase(fileContent?: string, envValue?: string): string {
  if (fileContent?.trim()) return fileContent.trim();
  if (envValue?.trim()) return envValue.trim();
  return OFFICIAL_SKILLS_HUB_BASE;
}

export function getSkillUrl(skillName: string, base?: string): string {
  const resolved = base ?? OFFICIAL_SKILLS_HUB_BASE;
  return `${resolved.replace(/\/+$/, '')}/${skillName}/SKILL.md`;
}

// ── Official Skill Catalog (6 skills) ─────────────────────────────────────

export interface SkillCatalogEntry {
  name: string;
  description: string;
  recommendedAgents: AgentID[];
}

export const OFFICIAL_SKILLS: readonly SkillCatalogEntry[] = [
  {
    name: 'code_review',
    description: '代码审查 — 自动化 code review，识别坏味道与安全风险',
    recommendedAgents: ['bingbu', 'xingbu', 'menxia'],
  },
  {
    name: 'api_design',
    description: 'API 设计 — RESTful/GraphQL 接口设计规范与文档生成',
    recommendedAgents: ['bingbu', 'gongbu', 'menxia'],
  },
  {
    name: 'security_audit',
    description: '安全审计 — 漏洞扫描、依赖检查、合规性审查',
    recommendedAgents: ['xingbu', 'menxia'],
  },
  {
    name: 'data_analysis',
    description: '数据分析 — 数据清洗、统计分析、可视化报告',
    recommendedAgents: ['hubu', 'menxia'],
  },
  {
    name: 'doc_generation',
    description: '文档生成 — 自动生成 API 文档、用户手册、变更日志',
    recommendedAgents: ['libu', 'menxia'],
  },
  {
    name: 'test_framework',
    description: '测试框架 — 单元/集成/E2E 测试生成与覆盖率分析',
    recommendedAgents: ['gongbu', 'xingbu', 'menxia'],
  },
];

export const SKILL_NAME_MAP: Readonly<Record<string, SkillCatalogEntry>> = Object.fromEntries(
  OFFICIAL_SKILLS.map((s) => [s.name, s]),
);

// ── Agent → Skill Mapping (inverse of recommendedAgents) ──────────────────

export function getSkillsForAgent(agentId: AgentID): SkillCatalogEntry[] {
  return OFFICIAL_SKILLS.filter((s) => s.recommendedAgents.includes(agentId));
}

// ── Installed Skill Source Schema ─────────────────────────────────────────

/**
 * .source.json — tracks the origin of an installed skill.
 * Written to ~/.openclaw/workspace-<agent>/skills/<name>/.source.json
 */
export interface SkillSourceInfo {
  skillName: string;
  sourceUrl: string;
  description: string;
  addedAt: string;
  lastUpdated: string;
  checksum: string;
  status: 'valid' | 'stale' | 'error';
}

// ── Checksum ──────────────────────────────────────────────────────────────

/**
 * Compute SHA-256 checksum (first 16 hex chars).
 * Ported from Framework skill_manager.py _compute_checksum.
 */
export async function computeChecksum(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

// ── Download with Retry ────────────────────────────────────────────────────

export interface DownloadOptions {
  timeout?: number;
  retries?: number;
}

export interface DownloadResult {
  content: string;
  url: string;
  bytes: number;
}

/**
 * Download a SKILL.md file with retry + mirror failover.
 * Ported from Framework skill_manager.py _download_file.
 *
 * Retry strategy: up to 3 attempts with linear backoff (3s, 6s).
 * On 4xx errors (404/403), no retry — skill doesn't exist.
 * On network errors, tries fallback mirrors.
 */
export async function downloadSkillFile(
  url: string,
  options: DownloadOptions = {},
): Promise<DownloadResult> {
  const { timeout = 30000, retries = 3 } = options;
  let lastError = '';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const resp = await fetch(url, {
        headers: { 'User-Agent': 'OpenClaw-SkillManager/1.0' },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!resp.ok) {
        if (resp.status === 404 || resp.status === 403) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText} (不重试)`);
        }
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }

      const content = await resp.text();
      const MAX_SIZE = 10 * 1024 * 1024;

      if (content.length > MAX_SIZE) {
        throw new Error('文件超过 10MB 上限');
      }

      if (content.trim().length < 10) {
        throw new Error('文件内容过短或为空');
      }

      return { content, url, bytes: content.length };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);

      if (lastError.includes('不重试')) {
        const _e = new Error(`${lastError} — URL: ${url}`);
        throw _e;
      }

      if (attempt < retries) {
        const wait = attempt * 3000;
        console.warn(`[SkillManager] 下载失败(${lastError})，${wait / 1000}秒后重试...`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }

  throw new Error(`${lastError} (已重试 ${retries} 次) — URL: ${url}`);
}

/**
 * Download with automatic mirror failover.
 * Tries the primary URL first, then each fallback base.
 */
export async function downloadWithMirrors(
  skillName: string,
  hubBase?: string,
  options?: DownloadOptions,
): Promise<DownloadResult> {
  const base = hubBase ?? OFFICIAL_SKILLS_HUB_BASE;
  const primaryUrl = getSkillUrl(skillName, base);

  try {
    return await downloadSkillFile(primaryUrl, options);
  } catch (primaryErr) {
    // Try fallback mirrors
    for (const fbBase of FALLBACK_HUB_BASES) {
      const fbUrl = getSkillUrl(skillName, fbBase);
      console.log(`[SkillManager] 尝试镜像: ${fbUrl}`);
      try {
        return await downloadSkillFile(fbUrl, options);
      } catch (fbErr) {
        console.warn(`[SkillManager] 镜像失败: ${fbBase}`, fbErr);
        continue;
      }
    }
    const errMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
    const wrappedErr = new Error(`所有下载源失败: ${errMsg}`);
    // Manually attach cause (ES2020 doesn't support Error options)
    (wrappedErr as Error & { cause?: unknown }).cause = primaryErr;
    throw wrappedErr;
  }
}

// ── Validation ────────────────────────────────────────────────────────────

const SAFE_NAME_REGEX = /^[a-zA-Z0-9_\-\u4e00-\u9fff]+$/;

export function isValidSkillName(name: string): boolean {
  return SAFE_NAME_REGEX.test(name);
}
