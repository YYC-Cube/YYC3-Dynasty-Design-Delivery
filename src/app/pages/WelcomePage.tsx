import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useTranslation } from '@yyc3/i18n-react';

export function WelcomePage() {
  const { t } = useTranslation();

  const roles = [
    { id: 'emperor', name: t('welcome.roles.emperor'), desc: t('welcome.roles.emperorDesc') },
    { id: 'prince', name: t('welcome.roles.prince'), desc: t('welcome.roles.princeDesc') },
    { id: 'zhongshu', name: t('welcome.roles.zhongshu'), desc: t('welcome.roles.zhongshuDesc') },
    { id: 'menxia', name: t('welcome.roles.menxia'), desc: t('welcome.roles.menxiaDesc') },
    { id: 'shangshu', name: t('welcome.roles.shangshu'), desc: t('welcome.roles.shangshuDesc') },
    {
      id: 'ministries',
      name: t('welcome.roles.ministries'),
      desc: t('welcome.roles.ministriesDesc'),
    },
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Background Central Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-accent-gold)]/50 to-transparent"></div>

      {/* Top and Bottom Silhouettes */}
      <div className="absolute top-0 h-[180px] w-full bg-[url('https://images.unsplash.com/photo-1507868162883-6b769c1a88c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdGVtcGxlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc4MTMxNjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-10 mix-blend-screen" />
      <div className="absolute bottom-0 h-[200px] w-full bg-[url('https://images.unsplash.com/flagged/photo-1565950978347-ba1cb53b0fef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2hpbmVzZSUyMGFyY2hpdGVjdHVyZSUyMG5pZ2h0fGVufDF8fHx8MTc4MTMxNjU3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-10 mix-blend-screen" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center text-[var(--color-accent-gold)]">
          {/* Stamp Icon */}
          <div className="flex h-full w-full items-center justify-center rounded-sm border-4 border-[var(--color-accent-vermillion)]">
            <span className="font-serif text-2xl font-bold text-[var(--color-accent-vermillion)]">
              受命
            </span>
          </div>
        </div>

        <h1 className="mb-4 font-serif text-4xl font-bold tracking-[0.2em] text-[var(--color-accent-gold)] drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] md:text-5xl">
          {t('app.tagline')}
        </h1>
        <p className="mb-16 font-sans text-sm tracking-widest text-[var(--color-text-secondary)]">
          {t('app.subtitle')}
        </p>

        <div className="flex max-w-3xl flex-wrap justify-center gap-4">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
            >
              <Link
                to="/court"
                className="group flex h-16 w-32 flex-col items-center justify-center rounded border border-transparent bg-[var(--color-bg-secondary)] transition-all hover:-translate-y-1 hover:border-[var(--color-accent-gold)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
              >
                <span className="text-sm font-medium text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-gold)]">
                  {role.name}
                </span>
                <span className="mt-1 text-xs text-[var(--color-text-secondary)]">{role.desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-xs font-light tracking-widest text-[var(--color-text-secondary)]"
      >
        {t('app.location')}
      </motion.div>
    </div>
  );
}
