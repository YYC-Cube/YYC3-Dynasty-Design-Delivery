import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { BambooIcon } from '../components/ui/Icons';
import { useTranslation } from '@yyc3/i18n-react';

export function PlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const getPageTitle = (path: string) => {
    if (path.includes('honors')) return t('placeholder.honors');
    if (path.includes('skills')) return t('placeholder.skills');
    if (path.includes('workflow')) return t('placeholder.workflow');
    if (path.includes('bridge')) return t('placeholder.bridge');
    if (path.includes('hr')) return t('placeholder.hr');
    if (path.includes('department')) return t('placeholder.department');
    return t('placeholder.default');
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border-2 border-[var(--color-accent-gold)]/30 bg-[#1A142A] p-12 text-center shadow-[0_0_50px_rgba(212,175,55,0.05)]"
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-accent-gold)]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-accent-gold)]/50 to-transparent"></div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8 flex justify-center opacity-50"
        >
          <BambooIcon className="h-24 w-24 text-[var(--color-accent-gold)]" />
        </motion.div>

        <h1 className="mb-4 font-serif text-3xl text-[var(--color-accent-gold)]">
          {getPageTitle(location.pathname)}
        </h1>

        <p className="mx-auto mb-10 max-w-lg font-serif text-lg leading-loose text-[var(--color-text-secondary)]">
          {t('placeholder.body')}
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate('/court')}
            className="rounded bg-[var(--color-accent-gold)] px-6 py-2.5 font-serif font-medium text-[var(--color-bg-primary)] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:bg-[#E5C158]"
          >
            {t('placeholder.returnToCourt')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-6 py-2.5 font-serif font-medium text-[var(--color-accent-gold)] transition-all hover:bg-[var(--color-accent-gold)]/10"
          >
            {t('placeholder.goBack')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
