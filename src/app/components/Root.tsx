import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { AIAssistantHub } from './AIAssistantHub';
import { WorkflowProvider } from '../store/WorkflowContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { I18nProvider } from '@yyc3/i18n-react';
import { i18nEngine, t } from '@/i18n';

export function Root() {
  return (
    <I18nProvider engine={i18nEngine}>
      <WorkflowProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen bg-[var(--color-bg-primary)] font-sans text-[var(--color-text-primary)] selection:bg-[var(--color-accent-gold)]/30">
            <Navigation />
            <main className="min-h-screen pt-14 pb-10">
              <Suspense
                fallback={
                  <div className="flex h-[60vh] items-center justify-center">
                    <span className="font-serif text-sm text-[var(--color-text-secondary)]">
                      {t('common.loading')}
                    </span>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </main>
            <AIAssistantHub />
          </div>
        </DndProvider>
      </WorkflowProvider>
    </I18nProvider>
  );
}
