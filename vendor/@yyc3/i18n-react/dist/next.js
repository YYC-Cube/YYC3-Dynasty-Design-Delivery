// src/next.ts
var DEFAULT_LOCALES = [
  "en",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt-BR",
  "ar"
];
function createI18nMiddleware(config = {}) {
  const locales = config.locales ?? DEFAULT_LOCALES;
  const defaultLocale = config.defaultLocale ?? "en";
  return function i18nMiddleware(request) {
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (firstSegment && locales.includes(firstSegment)) {
      return { locale: firstSegment, shouldRedirect: false };
    }
    const cookieLocale = request.cookies.get("yyc3-locale")?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
      return { locale: cookieLocale, shouldRedirect: false };
    }
    const acceptLang = request.headers.get("accept-language");
    if (acceptLang) {
      const detected = detectLocaleFromHeader(acceptLang, locales);
      if (detected) {
        return { locale: detected, shouldRedirect: false };
      }
    }
    return { locale: defaultLocale, shouldRedirect: false };
  };
}
function detectLocaleFromHeader(header, supported) {
  const parsed = header.split(",").map((part) => {
    const [lang, q = "q=1"] = part.trim().split(";");
    const quality = parseFloat(q.split("=")[1] ?? "1");
    return { lang: lang.trim(), quality };
  }).sort((a, b) => b.quality - a.quality);
  for (const { lang } of parsed) {
    if (supported.includes(lang)) {
      return lang;
    }
    const base = lang.split("-")[0];
    const match = supported.find((l) => l.startsWith(base));
    if (match) return match;
  }
  return null;
}
async function createServerEngine(locale) {
  const { I18nEngine } = await import('@yyc3/i18n-core');
  const engine = new I18nEngine({ locale, fallbackLocale: "en" });
  await engine.setLocale(locale);
  return engine;
}

export { DEFAULT_LOCALES, createI18nMiddleware, createServerEngine };
