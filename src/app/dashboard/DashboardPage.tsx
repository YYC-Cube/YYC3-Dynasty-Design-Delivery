import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { CentralAxis } from './CentralAxis';
import { EdictModal } from './EdictModal';
import { WorkflowProvider } from '../store/WorkflowContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { I18nProvider, useTranslation } from '@yyc3/i18n-react';
import { i18nEngine } from '@/i18n';

const HEADER_LINK_KEYS = [
  { labelKey: 'nav.skills', path: '/skills' },
  { labelKey: 'nav.workflow', path: '/workflow' },
  { labelKey: 'nav.edict', path: '/edict' },
  { labelKey: 'archive.title', path: '/archive' },
  { labelKey: 'nav.dashboard', path: '/monitor' },
];

function DashboardContent() {
  const { t } = useTranslation();
  const [isEdictModalOpen, setIsEdictModalOpen] = useState(false);

  return (
    <WorkflowProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--color-bg-primary)] font-sans text-[var(--color-text-primary)]">
          {/* Background Texture & Lines */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY3liZXIlMjBhYnN0cmFjdCUyMHRleHR1cmV8ZW58MXx8fHwxNzgxMzE2NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-[0.03] mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)]" />

          {/* Top Header / App Bar */}
          <header className="z-20 flex h-[64px] items-center justify-between border-b border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-primary)]/80 px-6 backdrop-blur">
            <div className="flex items-center space-x-4">
              <h1 className="font-serif text-xl font-bold tracking-[0.2em] text-[var(--color-accent-gold)]">
                {t('app.tagline')}
              </h1>
              <span className="border-l border-[var(--color-text-secondary)]/30 pl-4 text-xs tracking-widest text-[var(--color-text-secondary)] uppercase">
                YanYu Edict Protocol
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium">
              <Link
                to="/edict"
                className="text-[var(--color-accent-gold)] transition-colors hover:text-[var(--color-accent-gold)]/80"
                title={t('dashboard.globalDashboard')}
              >
                {t('dashboard.globalDashboard')}
              </Link>
              {HEADER_LINK_KEYS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-accent-emerald)]" />
                <span className="text-[var(--color-text-secondary)]">{t('app.location')}</span>
              </div>
              <button
                onClick={() => setIsEdictModalOpen(true)}
                className="rounded border border-[var(--color-accent-gold)]/50 px-4 py-1.5 text-xs text-[var(--color-accent-gold)] transition-colors hover:bg-[var(--color-accent-gold)]/10"
              >
                {t('dashboard.viewEdict')}
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="relative z-10 flex flex-1 overflow-hidden p-6">
            <LeftSidebar />
            <CentralAxis />
            <RightSidebar />
          </main>

          {/* Footer Signature */}
          <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-3 text-xs tracking-widest text-[var(--color-text-secondary)]/50">
            <span>{t('app.location')}</span>
            <Link
              to="/court"
              className="pointer-events-auto flex items-center gap-1 transition-colors hover:text-[var(--color-accent-gold)]"
              title={t('nav.backToCourt')}
            >
              <ArrowLeft size={12} />
              <span>{t('nav.backToCourt')}</span>
            </Link>
          </div>

          {/* P3 Modal */}
          {isEdictModalOpen && <EdictModal onClose={() => setIsEdictModalOpen(false)} />}
        </div>
      </DndProvider>
    </WorkflowProvider>
  );
}

export function DashboardPage() {
  return (
    <I18nProvider engine={i18nEngine}>
      <DashboardContent />
    </I18nProvider>
  );
}
