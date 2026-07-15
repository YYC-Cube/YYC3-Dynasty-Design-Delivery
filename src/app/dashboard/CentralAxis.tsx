import React from 'react';
import { NodeCard } from '../components/ui/NodeCard';
import { Crown, Book, Landmark } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function CentralAxis() {
  return (
    <div className="custom-scrollbar relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto py-8">
      {/* The glowing golden central axis line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-[var(--color-accent-gold)]/20">
        <div className="absolute top-1/4 -left-[1px] h-[40px] w-[4px] animate-pulse rounded-full bg-[var(--color-accent-gold)] shadow-[0_0_12px_rgba(212,175,55,1)]" />
      </div>

      {/* 1. Heaven (Emperor) */}
      <div className="group relative z-10 mb-12 w-[200px] cursor-pointer">
        <div className="absolute -top-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-accent-vermillion)]/50 bg-[var(--color-accent-vermillion)]/20 shadow-[0_0_15px_rgba(200,37,6,0.5)] transition-transform group-hover:scale-110">
          <Crown className="h-5 w-5 text-[var(--color-accent-gold)]" />
        </div>
        <NodeCard
          title="皇帝"
          className="border-t-[var(--color-accent-gold)] bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-accent-purple)]/80 pt-8 text-center shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <div className="mb-1 font-mono text-2xl text-[var(--color-accent-gold)]">99.9%</div>
          <div className="text-xs">全局健康度</div>
        </NodeCard>
      </div>

      {/* 2. Mingtang (Crown Prince) */}
      <div className="relative z-10 mb-12 w-[240px]">
        <NodeCard title="太子" icon={<Book className="h-5 w-5" />} className="text-center">
          <div className="mt-2 flex justify-between px-2">
            <div className="flex flex-col">
              <span className="font-mono text-lg text-[var(--color-text-primary)]">12</span>
              <span className="text-[10px]">待分拣</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg text-[var(--color-text-primary)]">342</span>
              <span className="text-[10px]">今日旨意</span>
            </div>
          </div>
        </NodeCard>
      </div>

      {/* 3. Yingtian Gate (Three Departments) */}
      <div className="relative z-10 mb-12 w-full max-w-[600px]">
        <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-secondary)] px-4 py-1 font-serif text-xs tracking-widest text-[var(--color-accent-gold)]">
          应天门
        </div>
        <div className="flex w-full justify-between gap-4">
          <NodeCard
            title="中书省"
            className="flex-1 border-t-[var(--color-accent-azure)] shadow-[0_0_10px_rgba(46,94,170,0.1)]"
          >
            <div className="mt-2 text-center">
              <Badge
                variant="default"
                className="border-[var(--color-accent-azure)] bg-[var(--color-accent-azure)]/10 text-[var(--color-accent-azure)]"
              >
                草拟中
              </Badge>
              <div className="mt-2 font-mono text-2xl text-[var(--color-text-primary)]">4</div>
            </div>
          </NodeCard>
          <NodeCard
            title="门下省"
            className="flex-1 border-t-[var(--color-accent-gold)] shadow-[0_0_10px_rgba(212,175,55,0.1)]"
          >
            <div className="mt-2 text-center">
              <Badge
                variant="default"
                className="border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
              >
                审议中
              </Badge>
              <div className="mt-2 font-mono text-2xl text-[var(--color-text-primary)]">7</div>
            </div>
          </NodeCard>
          <NodeCard
            title="尚书省"
            className="flex-1 border-t-[var(--color-accent-emerald)] shadow-[0_0_10px_rgba(74,112,101,0.1)]"
          >
            <div className="mt-2 text-center">
              <Badge
                variant="default"
                className="border-[var(--color-accent-emerald)] bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)]"
              >
                待派发
              </Badge>
              <div className="mt-2 font-mono text-2xl text-[var(--color-text-primary)]">2</div>
            </div>
          </NodeCard>
        </div>
      </div>

      {/* 4. Tianjin Bridge (Six Ministries) */}
      <div className="relative z-10 mb-12 w-full max-w-[800px]">
        <div className="absolute top-1/2 right-0 left-0 -z-10 flex h-[60px] -translate-y-1/2 items-center justify-center border-y-2 border-[var(--color-accent-gold)]/20 bg-[var(--color-accent-gold)]/5">
          <span className="font-serif tracking-[0.5em] text-[var(--color-accent-gold)]/30">
            天津桥
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-[160px] gap-y-4 px-12">
          {/* Left Column */}
          <div className="space-y-4">
            <NodeCard
              title="户部"
              className="flex h-[80px] items-center justify-between border-l-[var(--color-accent-emerald)] !py-2 !pr-4"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs text-[var(--color-text-secondary)]">并发</span>
                <span className="font-mono text-[var(--color-text-primary)]">15</span>
              </div>
            </NodeCard>
            <NodeCard
              title="礼部"
              className="flex h-[80px] items-center justify-between border-l-[var(--color-accent-gold)] !py-2 !pr-4"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs text-[var(--color-text-secondary)]">并发</span>
                <span className="font-mono text-[var(--color-text-primary)]">8</span>
              </div>
            </NodeCard>
            <NodeCard
              title="吏部"
              className="flex h-[80px] items-center justify-between border-l-[var(--color-accent-azure)] !py-2 !pr-4"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs text-[var(--color-text-secondary)]">并发</span>
                <span className="font-mono text-[var(--color-text-primary)]">24</span>
              </div>
            </NodeCard>
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <NodeCard
              title="兵部"
              className="flex h-[80px] flex-row-reverse items-center justify-between border-r-[var(--color-accent-vermillion)] !py-2 !pr-4"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[var(--color-text-secondary)]">并发</span>
                <span className="font-mono text-[var(--color-text-primary)]">12</span>
              </div>
            </NodeCard>
            <NodeCard
              title="刑部"
              status="warning"
              className="flex h-[80px] flex-row-reverse items-center justify-between border-r-[var(--color-accent-gold)] !py-2 !pr-4"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[var(--color-text-secondary)]">预警</span>
                <span className="font-mono text-[var(--color-accent-gold)]">3</span>
              </div>
            </NodeCard>
            <NodeCard
              title="工部"
              status="error"
              className="flex h-[80px] flex-row-reverse items-center justify-between border-r-[var(--color-accent-vermillion)] !py-2 !pr-4 shadow-[0_0_15px_rgba(200,37,6,0.15)]"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[var(--color-text-secondary)]">故障</span>
                <span className="font-mono text-[var(--color-accent-vermillion)]">1</span>
              </div>
            </NodeCard>
          </div>
        </div>
      </div>

      {/* 5. Dingding Gate (Summary) */}
      <div className="relative z-10 w-[300px]">
        <NodeCard
          title="定鼎门"
          icon={<Landmark className="h-5 w-5" />}
          className="border-[var(--color-text-secondary)]/50 bg-black/40 text-center"
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl text-[var(--color-accent-gold)]">98.4%</span>
              <span className="text-[10px]">办结率</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl text-[var(--color-accent-gold)]">1.2h</span>
              <span className="text-[10px]">平均耗时</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl text-[var(--color-accent-gold)]">95%</span>
              <span className="text-[10px]">通过率</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl text-[var(--color-accent-vermillion)]">3</span>
              <span className="text-[10px]">异常数</span>
            </div>
          </div>
        </NodeCard>
      </div>
    </div>
  );
}
