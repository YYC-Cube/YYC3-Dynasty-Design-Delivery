import * as react from 'react';
import { ReactNode } from 'react';
import { I18nEngine, Locale } from '@yyc3/i18n-core';

interface I18nContextValue {
    engine: I18nEngine;
    locale: Locale;
    setLocale: (locale: Locale) => Promise<void>;
    t: (key: string, params?: Record<string, string>) => string;
    ready: boolean;
}
interface I18nProviderProps {
    engine: I18nEngine;
    children: ReactNode;
}
declare function I18nProvider({ engine, children }: I18nProviderProps): react.JSX.Element;
declare function useI18nContext(): I18nContextValue;

/**
 * @file useTranslation.ts
 * @description useTranslation hook — zero boilerplate i18n for React
 */

interface UseTranslationReturn {
    /** Translate a key with optional ICU parameters */
    t: (key: string, params?: Record<string, string>) => string;
    /** Current active locale */
    locale: Locale;
    /** Change the active locale */
    setLocale: (locale: Locale) => Promise<void>;
    /** Whether the engine is ready */
    ready: boolean;
    /** The underlying I18nEngine instance */
    engine: ReturnType<typeof useI18nContext>['engine'];
}
declare function useTranslation(): UseTranslationReturn;

interface TransProps {
    /** Translation key (ICU MessageFormat supported) */
    id: string;
    /** ICU parameter values */
    values?: Record<string, string | number>;
    /** JSX components to interpolate into the translation */
    components?: Record<string, ReactNode>;
    /** Fallback text if key is missing */
    fallback?: string;
}
/**
 * Declarative translation component with JSX interpolation.
 *
 * @example
 * // ICU: "Read the <link>documentation</link> for {version}"
 * <Trans
 *   id="docs.read"
 *   values={{ version: '2.0' }}
 *   components={{ link: <a href="/docs" /> }}
 * />
 */
declare function Trans({ id, values, components, fallback }: TransProps): react.JSX.Element;

export { type I18nContextValue, I18nProvider, type I18nProviderProps, Trans, type TransProps, type UseTranslationReturn, useI18nContext, useTranslation };
