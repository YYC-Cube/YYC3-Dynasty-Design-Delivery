import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { motion } from 'motion/react';
import { useTranslation } from '@yyc3/i18n-react';

const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function TaishiMonitor() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState('永熙三年·午时三刻');

  const chartCreatedKey = t('monitor.chartCreated');
  const chartDoneKey = t('monitor.chartDone');
  const chartVetoedKey = t('monitor.chartVetoed');

  const [lineData] = useState(() =>
    SHICHEN.map((s) => ({
      name: s,
      [chartCreatedKey]: Math.floor(Math.random() * 50) + 10,
      [chartDoneKey]: Math.floor(Math.random() * 45) + 5,
      [chartVetoedKey]: Math.floor(Math.random() * 10),
    })),
  );

  const radarData = [
    { subject: t('court.ministries.hu'), A: 2.1, fullMark: 5 },
    { subject: t('court.ministries.li'), A: 1.8, fullMark: 5 },
    { subject: t('court.ministries.bing'), A: 4.2, fullMark: 5 },
    { subject: t('court.ministries.xing'), A: 1.5, fullMark: 5 },
    { subject: t('court.ministries.gong'), A: 2.8, fullMark: 5 },
    { subject: t('court.ministries.li2'), A: 1.2, fullMark: 5 },
  ];

  const EVENTS = [
    {
      id: 1,
      time: '午时三刻',
      type: t('monitor.eventTypes.auspicious'),
      text: '敕令 edict-045 办结归档',
      color: 'text-[var(--color-accent-emerald)]',
      icon: '🌟',
    },
    {
      id: 2,
      time: '午时二刻',
      type: t('monitor.eventTypes.anomaly'),
      text: '兵部令牌数低于阈值(2/5)',
      color: 'text-[var(--color-accent-amber)]',
      icon: '⚠️',
    },
    {
      id: 3,
      time: '午时一刻',
      type: t('monitor.eventTypes.disaster'),
      text: '刑部扫描发现异常访问',
      color: 'text-[var(--color-accent-vermillion)]',
      icon: '🔥',
    },
    {
      id: 4,
      time: '巳时四刻',
      type: t('monitor.eventTypes.auspicious'),
      text: '门下省通过 edict-043',
      color: 'text-[var(--color-accent-emerald)]',
      icon: '🌟',
    },
    {
      id: 5,
      time: '巳时三刻',
      type: t('monitor.eventTypes.daily'),
      text: '户部算力消耗达75%',
      color: 'text-[var(--color-accent-azure)]',
      icon: '📊',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        `永熙三年·${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kpis = [
    {
      title: t('monitor.celestial.ziwei'),
      subtitle: 'System Health',
      val: '92%',
      stat: t('monitor.kpiHealth'),
      color: 'text-[var(--color-accent-emerald)]',
      bar: 'bg-[var(--color-accent-emerald)]',
    },
    {
      title: t('monitor.celestial.beidou'),
      subtitle: 'Active Alerts',
      val: '3 active',
      stat: '2 warning · 1 err',
      color: 'text-[var(--color-accent-amber)]',
      bar: 'bg-[var(--color-accent-amber)]',
    },
    {
      title: t('monitor.celestial.taiyin'),
      subtitle: 'Uptime',
      val: '127d 14h',
      stat: t('monitor.kpiUptime'),
      color: 'text-[var(--color-accent-azure)]',
      bar: 'bg-[var(--color-accent-azure)]',
    },
  ];

  const ministries = [
    {
      n: t('court.ministries.hu'),
      head: '大司徒',
      stat: 'Online',
      c: 'var(--color-accent-emerald)',
      tasks: '4 / 12',
      time: '1.2s',
    },
    {
      n: t('court.ministries.li'),
      head: '大宗伯',
      stat: 'Online',
      c: 'var(--color-accent-emerald)',
      tasks: '1 / 5',
      time: '1.8s',
    },
    {
      n: t('court.ministries.bing'),
      head: '大司马',
      stat: 'Warning',
      c: 'var(--color-accent-amber)',
      tasks: '8 / 8',
      time: '4.2s',
      err: true,
    },
    {
      n: t('court.ministries.xing'),
      head: '大司寇',
      stat: 'Online',
      c: 'var(--color-accent-emerald)',
      tasks: '2 / 9',
      time: '1.5s',
    },
    {
      n: t('court.ministries.gong'),
      head: '大司空',
      stat: 'Online',
      c: 'var(--color-accent-emerald)',
      tasks: '5 / 15',
      time: '2.8s',
    },
    {
      n: t('court.ministries.li2'),
      head: '大宰',
      stat: 'Online',
      c: 'var(--color-accent-emerald)',
      tasks: '0 / 3',
      time: '1.2s',
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-6 pb-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between border-b border-[var(--color-accent-gold)]/20 pb-4">
        <div>
          <h2 className="mb-2 font-serif text-3xl tracking-widest text-[var(--color-accent-gold)] drop-shadow-[0_0_10px_rgba(212,168,67,0.3)]">
            {t('monitor.pageTitle')}
          </h2>
          <p className="font-serif text-sm text-[var(--color-text-secondary)]">
            {t('monitor.subtitle')}
          </p>
        </div>
        <div className="text-right">
          <div className="mb-1 font-mono text-lg text-[var(--color-accent-gold)]">
            {currentTime}
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--color-accent-emerald)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent-emerald)]"></span>
            {t('monitor.pollInterval')}
          </div>
        </div>
      </div>

      {/* Section 1: Celestial Health Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-[var(--color-text-primary)]">{kpi.title}</h3>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  {kpi.subtitle}
                </span>
              </div>
            </div>
            <div className={`font-mono text-2xl ${kpi.color} mb-2`}>{kpi.val}</div>
            <div className="flex items-center justify-between text-xs">
              <span className={kpi.color}>{kpi.stat}</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
                <div className={`h-full ${kpi.bar}`} style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Ministries + Events */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Section 2: Six Ministries Health */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {ministries.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border bg-[var(--color-bg-secondary)] p-4 transition-colors ${m.err ? 'border-[var(--color-accent-amber)]' : 'border-[var(--color-accent-gold)]/20'}`}
            >
              <div className="mb-2 flex items-center justify-between border-b border-[var(--color-text-secondary)]/20 pb-2">
                <h4 className="font-serif text-[var(--color-text-primary)]">
                  ⚔️ {m.n} · {m.head}
                </h4>
                <div className="flex items-center gap-1 text-[10px]" style={{ color: m.c }}>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: m.c }}
                  ></span>
                  {m.stat}
                </div>
              </div>
              <div className="mb-3 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span>{t('monitor.currentTasks')}</span>
                  <span className="text-[var(--color-text-primary)]">{m.tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('monitor.avgResponse')}</span>
                  <span
                    className={
                      m.err
                        ? 'text-[var(--color-accent-amber)]'
                        : 'text-[var(--color-text-primary)]'
                    }
                  >
                    {m.time}
                  </span>
                </div>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: m.err ? '90%' : '40%', backgroundColor: m.c }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: Event Stream */}
        <div className="flex h-[320px] flex-col rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-4">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-accent-gold)]/20 pb-2">
            <h3 className="font-serif text-sm text-[var(--color-accent-gold)]">
              {t('monitor.eventStream')}
            </h3>
            <button className="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              {t('monitor.pause')}
            </button>
          </div>
          <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
            {EVENTS.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 font-mono text-[var(--color-text-secondary)]">
                    [{ev.time}]
                  </span>
                  <span className="shrink-0">{ev.icon}</span>
                  <span className={`${ev.color} shrink-0 font-medium`}>{ev.type}</span>
                  <span className="break-all text-[var(--color-text-primary)]">{ev.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-[300px] flex-col rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-4">
          <h3 className="mb-4 font-serif text-sm text-[var(--color-accent-gold)]">
            {t('monitor.starTrack')}
          </h3>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-text-secondary)"
                  opacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-accent-gold)',
                    borderRadius: '4px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={chartCreatedKey}
                  stroke="var(--color-accent-gold)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={chartDoneKey}
                  stroke="var(--color-accent-emerald)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={chartVetoedKey}
                  stroke="var(--color-accent-vermillion)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-[300px] flex-col rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-4">
          <h3 className="mb-4 font-serif text-sm text-[var(--color-accent-gold)]">
            {t('monitor.responseRadar')}
          </h3>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--color-text-secondary)" opacity={0.3} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--color-text-primary)', fontSize: 12 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar
                  name="Response"
                  dataKey="A"
                  stroke="var(--color-accent-gold)"
                  fill="var(--color-accent-gold)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
