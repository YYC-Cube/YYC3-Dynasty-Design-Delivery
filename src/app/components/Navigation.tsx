import { Link, useLocation } from 'react-router';
import { Bell, Globe, Maximize2, Settings, User } from 'lucide-react';
import { useTranslation } from '@yyc3/i18n-react';
import { useState, useRef, useEffect } from 'react';
import { AVAILABLE_LOCALES, i18nEngine } from '@/i18n';
import type { Locale } from '@yyc3/i18n-core';

export function Navigation() {
  const location = useLocation();
  const path = location.pathname;
  const { t, locale } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  if (path === '/') return null; // No nav on welcome page

  const tabs = [
    { name: t('nav.court'), path: '/court' },
    { name: t('nav.edict'), path: '/edict' },
    { name: t('nav.honors'), path: '/honors' },
    { name: t('nav.skills'), path: '/skills' },
    { name: t('nav.workflow'), path: '/workflow' },
    { name: t('nav.bridge'), path: '/bridge' },
    { name: t('nav.hr'), path: '/hr' },
  ];

  const switchLocale = async (newLocale: Locale) => {
    await i18nEngine.setLocale(newLocale);
    setLangOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="font-serif text-xl font-bold text-[var(--color-accent-gold)]">
          YYC³ Dynasty
        </h1>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <span>{tabs.find((tab) => tab.path === path)?.name || t('nav.court')}</span>
        </div>
      </div>

      <div className="flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`border-b-2 px-2 py-4 text-sm font-medium transition-colors ${
              path.startsWith(tab.path)
                ? 'border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]'
                : 'border-transparent text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)]/80'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-gold)]"
            title={t('lang.label')}
            aria-label={t('lang.label')}
            aria-expanded={langOpen}
          >
            <Globe size={16} />
            <span className="text-xs">{locale}</span>
          </button>
          {langOpen && (
            <div className="absolute top-full right-0 mt-2 min-w-[140px] overflow-hidden rounded border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-secondary)] shadow-lg">
              {AVAILABLE_LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`block w-full px-4 py-2 text-left text-xs transition-colors hover:bg-[var(--color-accent-gold)]/10 ${
                    locale === l.code
                      ? 'text-[var(--color-accent-gold)]'
                      : 'text-[var(--color-text-primary)]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/dashboard"
          title={t('nav.dashboard')}
          className="text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-gold)]"
        >
          <Maximize2 size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-secondary)]">
            <User size={16} className="text-[var(--color-accent-gold)]" />
          </div>
          <span className="text-xs">{t('nav.role')}</span>
        </div>
        <button className="relative text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-gold)]">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--color-accent-vermillion)]"></span>
        </button>
        <button className="text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent-gold)]">
          <Settings size={18} />
        </button>
      </div>
    </nav>
  );
}
