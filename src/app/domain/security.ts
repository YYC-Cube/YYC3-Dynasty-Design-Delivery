/**
 * @file security.ts
 * @description Input validation and prompt injection detection.
 *
 * Ported from YYC3-Dynasty-Framework:
 *   - scripts/utils.ts → validateUrl (SSRF guard)
 *   - workers/dispatch_worker.py → _INJECTION_PATTERNS
 *   - scripts/kanban_update.py → _sanitize_text, _is_valid_task_title
 */

// ── Prompt Injection Detection ───────────────────────────────────────────
//
// Patterns from Framework dispatch_worker.py _INJECTION_PATTERNS.
// Detects both Chinese and English injection attempts.

export const INJECTION_PATTERNS: readonly RegExp[] = [
  /忽略.{0,20}(指令|规则|协议)/i,
  /ignore.{0,20}(instructions?|rules?|above)/i,
  /system\s*:\s*/i,
  /<\s*system\s*>/i,
  /你(现在)?是.{0,10}(管理员|超级用户|root|admin)/i,
  /override|bypass|skip.{0,10}(check|review|approval)/i,
  /disregard.{0,20}(previous|above|prior)/i,
  /\[INST\]|\[\/INST\]/i,
];

export function detectInjection(text: string): { detected: boolean; pattern?: string } {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return { detected: true, pattern: pattern.source };
    }
  }
  return { detected: false };
}

// ── URL Validation (SSRF Guard) ──────────────────────────────────────────

const PRIVATE_IP_PATTERNS: readonly RegExp[] = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

const RESERVED_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', 'metadata.google.internal']);

export function validateUrl(
  url: string,
  options: { allowedSchemes?: readonly string[]; allowedDomains?: readonly string[] } = {},
): { valid: boolean; reason?: string } {
  const { allowedSchemes = ['https:'], allowedDomains = [] } = options;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, reason: 'URL 格式无效' };
  }

  if (!allowedSchemes.includes(parsed.protocol)) {
    return {
      valid: false,
      reason: `协议 ${parsed.protocol} 不被允许，仅接受 ${allowedSchemes.join('/')}`,
    };
  }

  if (!parsed.hostname) {
    return { valid: false, reason: '缺少主机名' };
  }

  if (RESERVED_HOSTNAMES.has(parsed.hostname)) {
    return { valid: false, reason: '保留主机名被拒绝' };
  }

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(parsed.hostname)) {
      return { valid: false, reason: '私有/内网地址被拒绝' };
    }
  }

  if (allowedDomains.length > 0) {
    const domainOk = allowedDomains.some(
      (d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`),
    );
    if (!domainOk) {
      return { valid: false, reason: `域名不在允许列表: ${allowedDomains.join(', ')}` };
    }
  }

  return { valid: true };
}

// ── Text Sanitization ────────────────────────────────────────────────────
//
// From Framework kanban_update.py _sanitize_text / _sanitize_title.
// Strips conversation metadata, code fences, file paths, session IDs.

const SANITIZE_PATTERNS: readonly { pattern: RegExp; replacement: string }[] = [
  { pattern: /```[\s\S]*?```/g, replacement: '' },
  { pattern: /【[^】]*】/g, replacement: '' },
  { pattern: /\[ Conversations?:[^\]]*\]/gi, replacement: '' },
  { pattern: /(?:传旨|下旨)[:：]\s*/g, replacement: '' },
  { pattern: /\/[\w\-/.]+\.(ts|tsx|js|jsx|py|json|md)/g, replacement: '[文件]' },
  { pattern: /https?:\/\/[^\s]+/g, replacement: '[链接]' },
  { pattern: /\s{3,}/g, replacement: '  ' },
];

export function sanitizeText(text: string, maxLength = 500): string {
  let result = text;
  for (const { pattern, replacement } of SANITIZE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result.trim().slice(0, maxLength);
}

// ── Title Validation ─────────────────────────────────────────────────────

const JUNK_TITLE_PATTERNS: readonly RegExp[] = [
  /^[\d\s\-_/.]+$/,
  /^test\d*$/i,
  /^(todo|fixme|hack|wip)$/i,
  /^[a-z]:[\\/]/i,
];

export function isValidTitle(title: string): { valid: boolean; reason?: string } {
  const trimmed = title.trim();

  if (trimmed.length < 6) {
    return { valid: false, reason: '标题过短（至少6字符）' };
  }

  if (trimmed.length > 200) {
    return { valid: false, reason: '标题过长（至多200字符）' };
  }

  for (const pattern of JUNK_TITLE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, reason: '标题格式无效（疑似无意义内容或路径）' };
    }
  }

  const injection = detectInjection(trimmed);
  if (injection.detected) {
    return { valid: false, reason: '检测到提示词注入' };
  }

  return { valid: true };
}
