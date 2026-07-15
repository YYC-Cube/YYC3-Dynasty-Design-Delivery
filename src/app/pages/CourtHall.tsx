import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from '@yyc3/i18n-react';

export function CourtHall() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const departments = [
    { id: 'hu', name: t('court.ministries.hu'), icon: '🧮', status: 'normal' },
    { id: 'li', name: t('court.ministries.li'), icon: '📜', status: 'normal' },
    { id: 'bing', name: t('court.ministries.bing'), icon: '⚔️', status: 'warning' },
    { id: 'xing', name: t('court.ministries.xing'), icon: '⚖️', status: 'normal' },
    { id: 'gong', name: t('court.ministries.gong'), icon: '🔨', status: 'normal' },
    { id: 'li2', name: t('court.ministries.li2'), icon: '👲', status: 'normal' },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] justify-center overflow-x-hidden px-6">
      {/* Background with slight map texture */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1699003789907-c92af635986c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwYW5jaWVudCUyMHBhaW50aW5nJTIwbWFwfGVufDF8fHx8MTc4MTMxNjU5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-[0.03] mix-blend-screen" />

      {/* Grid container: 12 columns max-width 1440px */}
      <div className="relative z-10 grid w-full max-w-[1440px] grid-cols-12 gap-4 py-8">
        {/* Left Column: To-do tasks */}
        <div className="col-span-12 hidden space-y-4 lg:col-span-3 lg:block xl:col-span-2">
          <h2 className="mb-6 flex items-center gap-2 font-serif text-sm font-bold text-[var(--color-accent-gold)]">
            <span className="h-4 w-1.5 rounded-sm bg-[var(--color-accent-gold)]"></span>
            {t('court.todoTitle')}
          </h2>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="group cursor-pointer rounded border-l-4 border-[var(--color-accent-vermillion)] bg-[var(--color-bg-secondary)] p-3 transition-colors hover:bg-[#342A4D]"
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="text-xs font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)]">
                  {t('court.urgentEdict')}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">
                  #00{i}
                </span>
              </div>
              <div className="text-[10px] text-[var(--color-text-secondary)]">
                {t('court.timeRemaining')}
              </div>
            </div>
          ))}
        </div>

        {/* Center Column: Axis */}
        <div className="relative col-span-12 flex min-h-[800px] flex-col items-center lg:col-span-6 xl:col-span-8">
          {/* Vertical Golden Line */}
          <div className="absolute top-0 bottom-0 z-0 w-[2px] bg-gradient-to-b from-[var(--color-accent-gold)]/80 via-[var(--color-accent-gold)]/30 to-[var(--color-accent-gold)]/80" />
          {/* Flowing Particle */}
          <motion.div
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute z-0 h-6 w-2 rounded-full bg-[var(--color-accent-gold)] shadow-[0_0_15px_var(--color-accent-gold)] blur-[2px]"
          />

          {/* 1. Heaven (Emperor) */}
          <Link
            to="/edict/new"
            className="group relative z-10 mt-0 flex h-60 w-48 flex-col items-center justify-start rounded-t-full border border-[var(--color-accent-gold)] bg-[var(--color-bg-secondary)] pt-6 transition-shadow hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded border border-[var(--color-accent-gold)] bg-[var(--color-bg-primary)] shadow-[0_0_15px_var(--color-accent-gold)]">
              <span className="text-xl">👑</span>
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-[var(--color-accent-gold)]">
              {t('court.heavenNode')}
            </h3>
            <p className="mt-1 mb-4 text-xs text-[var(--color-text-secondary)]">
              {t('court.emperorRole')}
            </p>
            <div className="font-mono text-3xl font-light text-[var(--color-text-primary)]">
              98<span className="text-sm">%</span>
            </div>
            <p className="mt-1 text-[10px] text-[var(--color-ministry-bronze)]">
              {t('court.globalHealth')}
            </p>
          </Link>

          {/* 2. Mingtang (Prince) */}
          <div className="relative z-10 mt-10 flex h-32 w-52 flex-col items-center justify-center rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] transition-colors hover:border-[var(--color-accent-gold)]">
            <h3 className="font-serif text-lg text-[var(--color-text-primary)]">
              🎎 {t('court.mingtangNode')}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {t('court.princeRole')}
            </p>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="text-[var(--color-accent-gold)]">{t('court.pendingSort')}</span>
              <span className="text-[var(--color-ministry-azure)]">{t('court.totalEdicts')}</span>
            </div>
          </div>

          {/* 3. Yingtian Gate (3 Departments) */}
          <div className="relative z-10 mt-10 flex gap-2">
            <div className="flex h-44 w-40 cursor-pointer flex-col items-center justify-center rounded border-t-4 border-[var(--color-ministry-azure)] bg-[var(--color-bg-secondary)] p-4 hover:bg-[var(--color-bg-secondary)]/80">
              <span className="mb-2 text-xl">📜</span>
              <h4 className="font-serif text-[var(--color-text-primary)]">
                {t('court.zhongshuNode')}
              </h4>
              <p className="mt-1 text-center text-[10px] text-[var(--color-text-secondary)]">
                {t('court.zhongshuDuty')}
                <br />
                {t('court.leftGate')}
              </p>
              <div className="mt-4 h-2 w-2 animate-pulse rounded-full bg-[var(--color-ministry-bronze)]"></div>
            </div>
            <div className="flex h-44 w-40 cursor-pointer flex-col items-center justify-center rounded border-t-4 border-[var(--color-accent-gold)] bg-[var(--color-bg-secondary)] p-4 hover:bg-[var(--color-bg-secondary)]/80">
              <span className="mb-2 text-xl">🔍</span>
              <h4 className="font-serif text-[var(--color-text-primary)]">
                {t('court.menxiaNode')}
              </h4>
              <p className="mt-1 text-center text-[10px] text-[var(--color-text-secondary)]">
                {t('court.menxiaDuty')}
                <br />
                {t('court.centerGate')}
              </p>
              <div className="mt-4 h-2 w-2 animate-pulse rounded-full bg-[var(--color-ministry-bronze)]"></div>
            </div>
            <div className="flex h-44 w-40 cursor-pointer flex-col items-center justify-center rounded border-t-4 border-[var(--color-ministry-bronze)] bg-[var(--color-bg-secondary)] p-4 hover:bg-[var(--color-bg-secondary)]/80">
              <span className="mb-2 text-xl">📮</span>
              <h4 className="font-serif text-[var(--color-text-primary)]">
                {t('court.shangshuNode')}
              </h4>
              <p className="mt-1 text-center text-[10px] text-[var(--color-text-secondary)]">
                {t('court.shangshuDuty')}
                <br />
                {t('court.rightGate')}
              </p>
              <div className="mt-4 h-2 w-2 animate-pulse rounded-full bg-[var(--color-ministry-bronze)]"></div>
            </div>
          </div>

          {/* 4. Tianjin Bridge (6 Ministries) */}
          <div className="relative z-10 mt-10 flex w-full max-w-[640px] justify-between border-y-2 border-[var(--color-accent-gold)]/20 px-4 py-8">
            <div className="absolute inset-0 -z-10 rounded-full bg-[var(--color-bg-secondary)]/30 blur-xl"></div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <Link
                  key={dept.id}
                  to={`/department/${dept.id}`}
                  className="flex flex-col rounded border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-secondary)] p-3 transition-all hover:-translate-y-1 hover:border-[var(--color-accent-gold)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-serif text-[var(--color-text-primary)]">
                      {dept.icon} {dept.name}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${dept.status === 'normal' ? 'bg-[var(--color-ministry-bronze)]' : 'animate-pulse bg-[var(--color-accent-gold)]'}`}
                    ></span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)]">
                    <span>{t('court.taskCount')}</span>
                    <span>{t('court.tokenCount')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 5. Dingding Gate (Summary) */}
          <div
            onClick={() => navigate('/archive')}
            className="relative z-10 mt-10 flex h-32 w-60 cursor-pointer flex-col items-center justify-center rounded-t-lg border-b-8 border-[var(--color-accent-gold)] bg-[var(--color-bg-secondary)] p-4 transition-colors hover:bg-[#32284D]"
          >
            <h3 className="mb-4 font-serif text-[var(--color-accent-gold)]">
              {t('court.dingdingNode')}
            </h3>
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-center">
              <div>
                <div className="font-mono text-lg text-[var(--color-text-primary)]">92%</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  {t('court.completionRate')}
                </div>
              </div>
              <div>
                <div className="font-mono text-lg text-[var(--color-text-primary)]">1.2h</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  {t('court.avgDuration')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status */}
        <div className="col-span-12 hidden space-y-6 lg:col-span-3 lg:block xl:col-span-2">
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold text-[var(--color-accent-gold)]">
              <span className="h-4 w-1.5 rounded-sm bg-[var(--color-accent-gold)]"></span>
              {t('court.systemStatus')}
            </h2>
            <div className="rounded bg-[var(--color-bg-secondary)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-primary)]">
                  {t('court.coreLink')}
                </span>
                <span className="text-xs text-[var(--color-ministry-bronze)]">
                  {t('court.normal')}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full bg-[var(--color-ministry-bronze)]"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-sm font-bold text-[var(--color-accent-gold)]">
              <span className="h-4 w-1.5 rounded-sm bg-[var(--color-accent-gold)]"></span>
              {t('court.morningBrief')}
            </h2>
            <div className="relative overflow-hidden rounded bg-[var(--color-bg-secondary)] p-4 text-xs leading-relaxed text-[var(--color-text-primary)]">
              <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-[var(--color-accent-gold)]/10">
                <span className="text-sm">🌅</span>
              </div>
              <p>{t('court.morningBriefContent')}</p>
              <p className="mt-2 text-[var(--color-accent-gold)]">
                {t('court.morningBriefHighlight')}
              </p>
            </div>
          </div>

          {/* 天子驾六 */}
          <div className="relative overflow-hidden rounded border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-secondary)] p-4">
            <h3 className="mb-3 font-serif text-xs text-[var(--color-accent-gold)]">
              {t('court.emperorChariot')}
            </h3>
            <div className="mb-2 flex justify-center gap-2">
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`h-3 w-4 rounded-sm ${i === 3 ? 'animate-pulse bg-[var(--color-accent-gold)]' : 'bg-[var(--color-ministry-bronze)]'}`}
                    title={`${t('court.horse')} ${i}`}
                  ></div>
                ))}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-[var(--color-accent-gold)] text-[10px] text-[var(--color-accent-gold)]">
                {t('court.chariot')}
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-[var(--color-text-secondary)]">
              {t('court.bingbuLoad')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
