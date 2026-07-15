import { createContext, useState, useEffect, useMemo, useContext, useCallback, isValidElement, Fragment as Fragment$1 } from 'react';
import { jsx, Fragment } from 'react/jsx-runtime';

// src/I18nProvider.tsx
var I18nContext = createContext(null);
function I18nProvider({ engine, children }) {
  const [locale, setLocaleState] = useState(engine.getLocale());
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    setReady(true);
    setLocaleState(engine.getLocale());
    const unsubscribe = engine.subscribe((newLocale) => {
      if (mounted) setLocaleState(newLocale);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [engine]);
  const value = useMemo(
    () => ({
      engine,
      locale,
      ready,
      setLocale: async (newLocale) => {
        await engine.setLocale(newLocale);
        setLocaleState(newLocale);
      },
      t: (key, params) => engine.t(key, params)
    }),
    [engine, locale, ready]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error(
      "useTranslation must be used within an <I18nProvider>. Wrap your component tree with <I18nProvider engine={engine}>."
    );
  }
  return ctx;
}
function useTranslation() {
  const ctx = useI18nContext();
  const t = useCallback(
    (key, params) => ctx.t(key, params),
    [ctx]
  );
  return {
    t,
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    ready: ctx.ready,
    engine: ctx.engine
  };
}
function Trans({ id, values, components, fallback }) {
  const { t } = useTranslation();
  const stringValues = {};
  if (values) {
    for (const [k, v] of Object.entries(values)) {
      stringValues[k] = String(v);
    }
  }
  const text = t(id, stringValues);
  if (!components) {
    return /* @__PURE__ */ jsx(Fragment, { children: text || fallback || id });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: interpolateJSX(text, components) });
}
function interpolateJSX(text, components) {
  const parts = [];
  const regex = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const tagName = match[1] || match[3];
    const content = match[2] || "";
    const comp = components[tagName];
    if (comp !== void 0 && isValidElement(comp)) {
      if (content) {
        parts.push(
          /* @__PURE__ */ jsx(Fragment$1, { children: cloneWithChildren(comp, content) }, `trans-${key++}`)
        );
      } else {
        parts.push(/* @__PURE__ */ jsx(Fragment$1, { children: comp }, `trans-${key++}`));
      }
    } else {
      parts.push(match[0]);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}
function cloneWithChildren(element, children) {
  if (isValidElement(element)) {
    const props = { ...element.props, children };
    return { ...element, props };
  }
  return element;
}

export { I18nProvider, Trans, useI18nContext, useTranslation };
