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

const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const LINE_DATA = SHICHEN.map((s) => ({
  name: s,
  创建: Math.floor(Math.random() * 50) + 10,
  办结: Math.floor(Math.random() * 45) + 5,
  封驳: Math.floor(Math.random() * 10),
}));

const RADAR_DATA = [
  { subject: '户部', A: 2.1, fullMark: 5 },
  { subject: '礼部', A: 1.8, fullMark: 5 },
  { subject: '兵部', A: 4.2, fullMark: 5 }, // Warning: > 3s
  { subject: '刑部', A: 1.5, fullMark: 5 },
  { subject: '工部', A: 2.8, fullMark: 5 },
  { subject: '吏部', A: 1.2, fullMark: 5 },
];

const EVENTS = [
  {
    id: 1,
    time: '午时三刻',
    type: '祥瑞',
    text: '敕令 edict-045 办结归档',
    color: 'text-[var(--color-accent-emerald)]',
    icon: '🌟',
  },
  {
    id: 2,
    time: '午时二刻',
    type: '异象',
    text: '兵部令牌数低于阈值(2/5)',
    color: 'text-[var(--color-accent-amber)]',
    icon: '⚠️',
  },
  {
    id: 3,
    time: '午时一刻',
    type: '灾异',
    text: '刑部扫描发现异常访问',
    color: 'text-[var(--color-accent-vermillion)]',
    icon: '🔥',
  },
  {
    id: 4,
    time: '巳时四刻',
    type: '祥瑞',
    text: '门下省通过 edict-043',
    color: 'text-[var(--color-accent-emerald)]',
    icon: '🌟',
  },
  {
    id: 5,
    time: '巳时三刻',
    type: '日表',
    text: '户部算力消耗达75%',
    color: 'text-[var(--color-accent-azure)]',
    icon: '📊',
  },
];

export function TaishiMonitor() {
  const [currentTime, setCurrentTime] = useState('永熙三年·午时三刻');

  // Real-time clock mock
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        `永熙三年·${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-6 pb-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between border-b border-[var(--color-accent-gold)]/20 pb-4">
        <div>
          <h2 className="mb-2 font-serif text-3xl tracking-widest text-[var(--color-accent-gold)] drop-shadow-[0_0_10px_rgba(212,168,67,0.3)]">
            🔭 太 史 监 候
          </h2>
          <p className="font-serif text-sm text-[var(--color-text-secondary)]">
            观星辰之变 · 察万象之机
          </p>
        </div>
        <div className="text-right">
          <div className="mb-1 font-mono text-lg text-[var(--color-accent-gold)]">
            {currentTime}
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--color-accent-emerald)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent-emerald)]"></span>
            每 30 秒观星一次
          </div>
        </div>
      </div>

      {/* Section 1: Celestial Health Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: '🌟 紫微星',
            subtitle: 'System Health',
            val: '92%',
            stat: '正常运行',
            color: 'text-[var(--color-accent-emerald)]',
            bar: 'bg-[var(--color-accent-emerald)]',
          },
          {
            title: '⭐ 北斗七星',
            subtitle: 'Active Alerts',
            val: '3 active',
            stat: '2 warning · 1 err',
            color: 'text-[var(--color-accent-amber)]',
            bar: 'bg-[var(--color-accent-amber)]',
          },
          {
            title: '🌙 太阴星',
            subtitle: 'Uptime',
            val: '127d 14h',
            stat: 'since 永熙三年',
            color: 'text-[var(--color-accent-azure)]',
            bar: 'bg-[var(--color-accent-azure)]',
          },
        ].map((kpi, i) => (
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
          {[
            {
              n: '户部',
              head: '大司徒',
              stat: 'Online',
              c: 'var(--color-accent-emerald)',
              tasks: '4 / 12',
              time: '1.2s',
            },
            {
              n: '礼部',
              head: '大宗伯',
              stat: 'Online',
              c: 'var(--color-accent-emerald)',
              tasks: '1 / 5',
              time: '1.8s',
            },
            {
              n: '兵部',
              head: '大司马',
              stat: 'Warning',
              c: 'var(--color-accent-amber)',
              tasks: '8 / 8',
              time: '4.2s',
              err: true,
            },
            {
              n: '刑部',
              head: '大司寇',
              stat: 'Online',
              c: 'var(--color-accent-emerald)',
              tasks: '2 / 9',
              time: '1.5s',
            },
            {
              n: '工部',
              head: '大司空',
              stat: 'Online',
              c: 'var(--color-accent-emerald)',
              tasks: '5 / 15',
              time: '2.8s',
            },
            {
              n: '吏部',
              head: '大宰',
              stat: 'Online',
              c: 'var(--color-accent-emerald)',
              tasks: '0 / 3',
              time: '1.2s',
            },
          ].map((m, i) => (
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
                  <span>当前任务:</span>{' '}
                  <span className="text-[var(--color-text-primary)]">{m.tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>平均响应:</span>{' '}
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
              📜 天文志 · 实时天象
            </h3>
            <button className="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              [暂停 ⏸]
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
            司天监·星轨 (24h Edict Flow)
          </h3>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LINE_DATA}>
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
                  dataKey="创建"
                  stroke="var(--color-accent-gold)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="办结"
                  stroke="var(--color-accent-emerald)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="封驳"
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
            分野·响应 (Ministry Response Time)
          </h3>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
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
