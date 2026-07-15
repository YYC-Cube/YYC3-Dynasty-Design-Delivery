import React from 'react';
import { Badge } from '../components/ui/badge';
import { FileText, Clock } from 'lucide-react';
import { useTranslation } from '@yyc3/i18n-react';

const TASKS = [
  {
    id: 'ED-001',
    typeKey: 'edict.type.敕书',
    sourceKey: 'court.zhongshuNode',
    statusKey: 'edict.status.待审议',
    time: '2h',
    priority: 'high',
  },
  {
    id: 'ED-002',
    typeKey: 'dashboard.secretMemo',
    sourceKey: 'court.ministries.bing',
    statusKey: 'dashboard.urgent',
    time: '15m',
    priority: 'critical',
  },
  {
    id: 'ED-003',
    typeKey: 'dashboard.courtTicket',
    sourceKey: 'court.shangshuNode',
    statusKey: 'edict.status.执行中',
    time: '4h',
    priority: 'normal',
  },
  {
    id: 'ED-004',
    typeKey: 'edict.type.制书',
    sourceKey: 'court.menxiaNode',
    statusKey: 'dashboard.vetoed',
    time: '-',
    priority: 'high',
    error: true,
  },
];

export function LeftSidebar() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[240px] flex-col space-y-4">
      <h2 className="mb-4 border-b border-[var(--color-accent-gold)]/30 pb-2 font-serif text-lg tracking-widest text-[var(--color-accent-gold)]">
        {t('dashboard.todoTitle')}
      </h2>
      <div className="flex flex-col space-y-3">
        {TASKS.map((task) => (
          <div
            key={task.id}
            className="group relative flex cursor-pointer flex-col rounded border border-[var(--color-text-secondary)]/20 bg-[var(--color-bg-secondary)] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-gold)]/50 hover:shadow-[0_4px_12px_rgba(212,175,55,0.1)]"
          >
            {/* Status Line */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1 rounded-l ${task.error ? 'bg-[var(--color-accent-vermillion)]' : task.priority === 'critical' ? 'bg-[var(--color-accent-gold)]' : 'bg-[var(--color-accent-azure)]'}`}
            />

            <div className="mb-2 flex items-start justify-between pl-2">
              <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                {task.id}
              </span>
              <Badge
                variant={task.error ? 'destructive' : 'default'}
                className={
                  task.priority === 'critical' && !task.error
                    ? 'border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]'
                    : undefined
                }
              >
                {t(task.typeKey)}
              </Badge>
            </div>

            <div className="mb-2 flex items-center space-x-2 pl-2 text-sm font-medium text-[var(--color-text-primary)]">
              <FileText className="h-4 w-4 text-[var(--color-accent-gold)]" />
              <span>
                {t(task.sourceKey)} {t('dashboard.submitted')}
              </span>
            </div>

            <div className="flex items-center justify-between pl-2 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3" /> {task.time}
              </span>
              <span
                className={
                  task.error
                    ? 'text-[var(--color-accent-vermillion)]'
                    : 'text-[var(--color-accent-emerald)]'
                }
              >
                {t(task.statusKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
