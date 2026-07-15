/**
 * @file src/i18n/index.ts
 * @description YYC³ Dynasty i18n engine bootstrap.
 *
 * Wires @yyc3/i18n-core's I18nEngine with the project-specific translation
 * maps (zh-CN / en). The engine is a singleton re-used by the React
 * <I18nProvider> in main.tsx, the standalone DashboardPage (which mounts its
 * own provider), and any non-React code that needs `t()` directly.
 *
 * Persistence: the engine automatically reads/writes the active locale to
 * localStorage key `yyc3.i18n.locale`, so user language choice survives
 * reloads without extra wiring here.
 */

import { I18nEngine, type Locale } from '@yyc3/i18n-core';
import { zhCN } from './locales/zh-CN';
import { en as enTranslations } from './locales/en';

/**
 * Build (and export) the singleton engine.
 *
 * `defaultLocale: 'zh-CN'` — the project is zh-CN-first by design.
 * `fallbackLocale: 'en'` — if a key is missing in zh-CN, fall back to English
 *   rather than showing the raw key (which the engine does by default).
 */
export const i18nEngine = new I18nEngine({
  locale: 'zh-CN',
  fallbackLocale: 'en',
});

// Register the project-specific translation maps. The engine already ships
// its own minimal zh-CN/en maps for common.* keys; our maps ADD the
// `app.* / nav.* / edict.* / ...` namespaces project code expects.
// (registerTranslation replaces the entire map for a locale, so we keep our
// maps self-contained rather than trying to merge with the built-ins.)
i18nEngine.registerTranslation('zh-CN', zhCN as never);
i18nEngine.registerTranslation('en', enTranslations as never);

/** Convenience: translate via the singleton engine. */
export function t(key: string, params?: Record<string, string>): string {
  return i18nEngine.t(key, params);
}

/** Convenience: change locale via the singleton engine. */
export async function setLocale(locale: Locale): Promise<void> {
  await i18nEngine.setLocale(locale);
}

/** Convenience: get current locale. */
export function getLocale(): Locale {
  return i18nEngine.getLocale();
}

/** The list of locales the UI advertises in the language switcher. */
export const AVAILABLE_LOCALES: { code: Locale; label: string }[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
];
