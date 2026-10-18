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
 * reloads without extra wiring here. Because `zh-CN` has to win over the
 * engine's navigator-based detection, this module pre-seeds that key whenever
 * no choice has been made yet (see LOCALE_STORAGE_KEY below).
 */

import { I18nEngine, type Locale } from '@yyc3/i18n-core/browser';
import { en as enTranslations } from './locales/en';
import { zhCN } from './locales/zh-CN';

/**
 * The engine resolves its initial locale as `stored → navigator → DEFAULT_LOCALE`
 * (the engine's own DEFAULT_LOCALE is `en`). The `locale` option below only
 * seeds `state.locale` and is then immediately overwritten by that resolution
 * — see `resolveInitialLocale()` / `loadInitialLocale()` inside the engine.
 *
 * YYC³ Dynasty is zh-CN-first, so when a visitor has not picked a language yet
 * we pre-seed the engine's storage key. An explicit choice always wins, so a
 * visitor who switches to English keeps English on later visits.
 */
const LOCALE_STORAGE_KEY = 'yyc3.i18n.locale';

if (typeof window !== 'undefined') {
  try {
    if (!window.localStorage.getItem(LOCALE_STORAGE_KEY)) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, 'zh-CN');
    }
  } catch {
    // localStorage can be unavailable (private mode / disabled storage); in
    // that case the engine falls back to its own detection.
  }
}

/**
 * Build (and export) the singleton engine.
 *
 * `locale: 'zh-CN'` — documents the zh-CN-first intent (the resolution above
 *   has the final say).
 * `fallbackLocale: 'en'` — if a key is missing in zh-CN, fall back to English
 *   rather than showing the raw key (which the engine does by default).
 */
export const i18nEngine = new I18nEngine({
  locale: 'zh-CN',
  fallbackLocale: 'en',
});

// Register the project-specific translation maps. `registerTranslation`
// REPLACES the whole map for a locale, so our maps stay self-contained — they
// carry the `app.* / nav.* / edict.* / …` namespaces project code uses (the
// engine's built-in maps only cover `common.*`).
const registerProjectTranslations = () => {
  i18nEngine.registerTranslation('zh-CN', zhCN as never);
  i18nEngine.registerTranslation('en', enTranslations as never);
};

registerProjectTranslations();

// The engine resolves its initial locale asynchronously inside the
// constructor. When that locale is not `en` (the engine's DEFAULT_LOCALE) it
// lazily loads a built-in map and assigns it over `translations[locale]`
// (see `I18nEngine#setLocale`), silently discarding the map registered above.
// Left unchecked, every `zh-CN` lookup then falls back to `en` — the UI renders
// English even though the active locale is `zh-CN`. `setLocale` only emits
// `notify()` after it has settled, so re-asserting the maps there guarantees
// the project strings win both on startup and on every later change.
i18nEngine.subscribe(registerProjectTranslations);

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
