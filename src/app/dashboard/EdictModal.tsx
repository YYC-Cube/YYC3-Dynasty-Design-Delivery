import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { TokenButton } from '../components/ui/TokenButton';
import { useModalDismiss } from '../components/ui/useModalDismiss';

interface EdictModalProps {
  onClose: () => void;
}

export function EdictModal({ onClose }: EdictModalProps) {
  const onBackdropClick = useModalDismiss(onClose);

  return (
    <div
      onClick={onBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0614]/85 p-4 backdrop-blur-sm"
    >
      <div className="animate-in fade-in zoom-in relative flex h-[640px] w-full max-w-[800px] duration-300">
        {/* Scroll Body */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-sm border-2 border-[var(--color-accent-gold)] bg-[var(--color-edict-silk)] shadow-2xl">
          {/* Scroll Textures */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629968417850-3505f5180761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwcmljZSUyMHBhcGVyJTIwdGV4dHVyZXxlbnwxfHx8fDE3ODEzMTY0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover opacity-20 mix-blend-multiply" />

          {/* Left/Right woven edges */}
          <div className="absolute top-0 bottom-0 left-0 w-4 border-r border-[var(--color-accent-gold)]/30 bg-[var(--color-accent-gold)]/10" />
          <div className="absolute top-0 right-0 bottom-0 w-4 border-l border-[var(--color-accent-gold)]/30 bg-[var(--color-accent-gold)]/10" />

          {/* Top Header (Tian Tou) */}
          <div className="relative z-10 flex h-[40px] items-center justify-between border-b-2 border-[var(--color-accent-gold)]/50 bg-[var(--color-edict-sky)] px-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="rounded-sm bg-[var(--color-accent-gold)] px-2 py-0.5 text-xs font-bold tracking-widest text-[var(--color-edict-sky)]">
                敕书
              </div>
              <span className="font-mono text-xs text-white/80">NO. ED-2026-004</span>
            </div>
            <button onClick={onClose} className="text-white/50 transition-colors hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="relative z-10 flex-1 overflow-y-auto px-12 py-8">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold tracking-widest text-[var(--color-edict-ink)]">
              关于工部流水线扩容之敕书
            </h2>

            <div className="space-y-4 text-justify font-serif text-base leading-relaxed text-[var(--color-edict-ink)]">
              <p>门下：</p>
              <p className="indent-8">
                近日工部CI/CD衙署并发骤增，现存令牌调度不堪重负。特命尚书省统筹，调拨户部算力资源五十，暂借工部周转。
              </p>
              <p className="indent-8">
                着中书省草拟扩容方案，门下省查验合规。限三日内完成，不得有误。
              </p>
              <p className="indent-8">钦此。</p>
            </div>

            {/* Seals Area */}
            <div className="mt-16 flex justify-center space-x-6 border-t border-[var(--color-edict-ink)]/20 pt-8">
              <Seal active name="中书省印" type="blue" />
              <Seal active name="门下省印" type="gold" />
              <Seal name="尚书省印" type="green" />
              <Seal name="皇帝行玺" type="red" />
            </div>
          </div>

          {/* Bottom Footer (Di Tou) */}
          <div className="relative z-10 flex h-[50px] items-center justify-center space-x-4 border-t-2 border-[var(--color-accent-gold)]/50 bg-[var(--color-edict-sky)]">
            <TokenButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="border-white/20 text-white"
            >
              驳回修改
            </TokenButton>
            <TokenButton
              variant="primary"
              size="sm"
              className="border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)] text-[var(--color-edict-sky)] hover:bg-[var(--color-accent-gold)]/90"
            >
              加盖尚书印
            </TokenButton>
          </div>
        </div>

        {/* Right Sidebar: Timeline */}
        <div className="relative ml-4 flex w-[180px] flex-col rounded border border-[var(--color-text-secondary)]/20 bg-[var(--color-bg-secondary)] p-4 before:absolute before:top-1/2 before:left-[-16px] before:w-4 before:border-t before:border-[var(--color-text-secondary)]/30">
          <h3 className="mb-6 border-b border-[var(--color-text-secondary)]/30 pb-2 font-serif text-sm text-[var(--color-accent-gold)]">
            流转轨迹
          </h3>

          <div className="relative flex flex-1 flex-col space-y-6">
            {/* Connecting line */}
            <div className="absolute top-2 bottom-6 left-[5px] w-[2px] bg-[var(--color-text-secondary)]/20" />

            <TimelineNode title="降旨" dept="皇帝" time="08:00" status="completed" />
            <TimelineNode title="宣付" dept="太子" time="08:05" status="completed" />
            <TimelineNode title="草制" dept="中书省" time="08:45" status="completed" />
            <TimelineNode title="审覆" dept="门下省" time="09:30" status="completed" />
            <TimelineNode title="签押" dept="尚书省" time="--" status="current" />
            <TimelineNode title="执行" dept="工部" time="--" status="pending" />
            <TimelineNode title="覆奏" dept="定鼎门" time="--" status="pending" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Seal({
  name,
  active,
  type,
}: {
  name: string;
  active?: boolean;
  type: 'red' | 'gold' | 'blue' | 'green';
}) {
  const colors = {
    red: 'border-[var(--color-accent-vermillion)] text-[var(--color-accent-vermillion)]',
    gold: 'border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]',
    blue: 'border-[var(--color-ministry-azure)] text-[var(--color-ministry-azure)]',
    green: 'border-[var(--color-ministry-bronze)] text-[var(--color-ministry-bronze)]',
  };

  return (
    <div
      className={`relative flex h-16 w-16 items-center justify-center rounded-sm border-2 ${active ? `${colors[type]} bg-[${type === 'red' ? 'var(--color-accent-vermillion)' : type === 'gold' ? 'var(--color-accent-gold)' : 'var(--color-ministry-azure)'}]/10` : 'border-gray-400/50 text-gray-400/50'} transition-all`}
    >
      {active && (
        <div
          className={`absolute inset-0 bg-current opacity-10 shadow-[inset_0_2px_8px_currentColor]`}
        />
      )}
      <div
        className="w-10 text-center font-serif text-xs leading-tight font-bold tracking-widest break-all"
        style={{ writingMode: 'vertical-rl' }}
      >
        {name}
      </div>
    </div>
  );
}

function TimelineNode({
  title,
  dept,
  time,
  status,
}: {
  title: string;
  dept: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
}) {
  return (
    <div className="group relative z-10 flex items-start">
      <div className="mt-1 mr-3 bg-[var(--color-bg-secondary)]">
        {status === 'completed' && (
          <CheckCircle2 className="h-3 w-3 text-[var(--color-accent-emerald)]" />
        )}
        {status === 'current' && (
          <div className="h-3 w-3 animate-pulse rounded-full border-2 border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/20" />
        )}
        {status === 'pending' && (
          <Circle className="h-3 w-3 text-[var(--color-text-secondary)]/40" />
        )}
      </div>
      <div className="flex flex-col">
        <div
          className={`text-xs font-bold ${status === 'current' ? 'text-[var(--color-accent-gold)]' : status === 'completed' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
        >
          {title}
        </div>
        <div className="mt-0.5 text-[10px] text-[var(--color-text-secondary)]">{dept}</div>
        <div className="mt-0.5 font-mono text-[9px] text-[var(--color-text-secondary)]/50">
          {time}
        </div>
      </div>
    </div>
  );
}
