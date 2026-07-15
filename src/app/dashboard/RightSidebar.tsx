import React from 'react';
import { ShieldCheck, AlertTriangle, Zap, Volume2 } from 'lucide-react';

const HORSES = [
  { id: 1, ministry: '户部', status: 'normal' },
  { id: 2, ministry: '礼部', status: 'normal' },
  { id: 3, ministry: '吏部', status: 'warning' },
  { id: 4, ministry: '兵部', status: 'normal' },
  { id: 5, ministry: '刑部', status: 'normal' },
  { id: 6, ministry: '工部', status: 'error' },
];

export function RightSidebar() {
  return (
    <div className="flex w-[240px] flex-col space-y-6">
      {/* Global Status */}
      <div className="rounded border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-secondary)] p-4">
        <h3 className="mb-4 flex items-center font-serif tracking-wider text-[var(--color-text-primary)]">
          <ShieldCheck className="mr-2 h-4 w-4 text-[var(--color-accent-emerald)]" />
          系统状态
        </h3>
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent-emerald)] shadow-[0_0_8px_var(--color-accent-emerald)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">正常</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-[var(--color-accent-gold)] opacity-30" />
            <span className="text-xs text-[var(--color-text-secondary)]">降级</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-[var(--color-accent-vermillion)] opacity-30" />
            <span className="text-xs text-[var(--color-text-secondary)]">故障</span>
          </div>
        </div>
      </div>

      {/* Six Horses Chariot Widget */}
      <div className="group relative overflow-hidden rounded border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-4">
        <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110">
          <Zap className="h-32 w-32 text-[var(--color-accent-gold)]" />
        </div>
        <h3 className="mb-3 font-serif text-sm tracking-widest text-[var(--color-accent-gold)]">
          天子驾六 · 节点健康
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {HORSES.map((horse) => (
            <div
              key={horse.id}
              className="flex flex-col items-center justify-center rounded border border-white/5 bg-black/20 p-2"
            >
              <div
                className={`mb-1 h-4 w-4 rounded-sm ${
                  horse.status === 'normal'
                    ? 'bg-[var(--color-accent-emerald)] shadow-[0_0_6px_var(--color-accent-emerald)]'
                    : horse.status === 'warning'
                      ? 'bg-[var(--color-accent-gold)] shadow-[0_0_6px_var(--color-accent-gold)]'
                      : 'bg-[var(--color-accent-vermillion)] shadow-[0_0_6px_var(--color-accent-vermillion)]'
                }`}
              />
              <span className="text-[10px] text-[var(--color-text-secondary)]">
                {horse.ministry}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Morning Briefing */}
      <div className="rounded border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-secondary)] p-4">
        <h3 className="mb-3 flex items-center font-serif text-sm tracking-wider text-[var(--color-text-primary)]">
          <Volume2 className="mr-2 h-4 w-4 text-[var(--color-accent-azure)]" />
          早朝简报
        </h3>
        <ul className="space-y-3 text-xs text-[var(--color-text-secondary)]">
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent-gold)]">▪</span>
            今日待办总量: 342件
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent-emerald)]">▪</span>
            昨日办结率: 98.4%
          </li>
          <li className="flex items-start text-[var(--color-accent-vermillion)]">
            <span className="mr-2">▪</span>
            异常: 工部CI/CD节点超时
          </li>
        </ul>
      </div>

      {/* Alerts */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center rounded border border-[var(--color-accent-vermillion)]/20 bg-[var(--color-accent-vermillion)]/10 p-2 text-sm font-medium text-[var(--color-accent-vermillion)]">
          <AlertTriangle className="mr-2 h-4 w-4" />
          工部流水线阻塞
        </div>
      </div>
    </div>
  );
}
