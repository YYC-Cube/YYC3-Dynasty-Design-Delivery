import * as _yyc3_i18n_core from '@yyc3/i18n-core';
import { Locale } from '@yyc3/i18n-core';

declare const DEFAULT_LOCALES: Locale[];
interface I18nMiddlewareConfig {
    locales?: Locale[];
    defaultLocale?: Locale;
    /** Path prefix strategy: '/en/about' or '/about' with cookie */
    strategy?: 'prefix' | 'cookie';
}
/**
 * Create Next.js middleware for automatic locale detection and routing.
 *
 * @example
 * // middleware.ts
 * import { createI18nMiddleware } from '@yyc3/i18n-react/next';
 * export const middleware = createI18nMiddleware({ defaultLocale: 'en' });
 */
declare function createI18nMiddleware(config?: I18nMiddlewareConfig): (request: {
    nextUrl: {
        pathname: string;
    };
    cookies: {
        get: (name: string) => {
            value: string;
        } | undefined;
    };
    headers: {
        get: (name: string) => string | null;
    };
}) => {
    locale: Locale;
    shouldRedirect: boolean;
    redirectUrl?: string;
};
/**
 * Create a server-side I18nEngine for Next.js Server Components.
 *
 * @example
 * // app/[locale]/layout.tsx
 * import { createServerEngine } from '@yyc3/i18n-react/next';
 * const engine = await createServerEngine(params.locale);
 */
declare function createServerEngine(locale: Locale): Promise<_yyc3_i18n_core.I18nEngine>;

export { DEFAULT_LOCALES, type I18nMiddlewareConfig, createI18nMiddleware, createServerEngine };
