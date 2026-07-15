import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DYNASTIES = [
  {
    id: 'xia',
    name: '夏',
    period: '约前2070-前1600',
    capital: '二里头',
    desc: '华夏文明之晨曦，礼制初成',
  },
  {
    id: 'shang',
    name: '商',
    period: '约前1600-前1046',
    capital: '殷墟',
    desc: '青铜铸鼎，甲骨契文',
  },
  {
    id: 'xizhou',
    name: '西周',
    period: '前1046-前771',
    capital: '镐京',
    desc: '制礼作乐，封建天下',
  },
  {
    id: 'dongzhou',
    name: '东周',
    period: '前770-前256',
    capital: '洛邑',
    desc: '百家争鸣，思想勃发',
  },
  { id: 'donghan', name: '东汉', period: '25-220', capital: '洛阳', desc: '光武中兴，蔡侯造纸' },
  { id: 'caowei', name: '曹魏', period: '220-266', capital: '洛阳', desc: '建安风骨，九品中正' },
  { id: 'xijin', name: '西晋', period: '266-316', capital: '洛阳', desc: '太康之治，玄学清谈' },
  {
    id: 'beiwei',
    name: '北魏',
    period: '386-534',
    capital: '平城/洛阳',
    desc: '孝文汉化，融合大同',
  },
  { id: 'sui', name: '隋', period: '581-618', capital: '大兴/洛阳', desc: '开皇之治，开凿大运河' },
  {
    id: 'tang',
    name: '唐(武周)',
    period: '618-907',
    capital: '长安/洛阳',
    desc: '万邦来朝，诗文极盛',
  },
  { id: 'houliang', name: '后梁', period: '907-923', capital: '开封/洛阳', desc: '五代更迭之始' },
  { id: 'houtang', name: '后唐', period: '923-936', capital: '洛阳', desc: '同光中兴，武功极盛' },
  { id: 'houjin', name: '后晋', period: '936-947', capital: '开封', desc: '石典割地，幽云十六州' },
];

const CATEGORIES = ['全部', '治理', '礼乐', '文韬', '革新', '盛世', '警世'];

const SKILL_DATABASE = [
  {
    id: 1,
    dynasty: 'tang',
    title: '唐诗品鉴',
    tag: '文韬',
    desc: '初盛中晚四唐风格流变解析，诗文生成',
    keywords: ['唐诗', '李白', '杜甫', '律诗'],
    active: true,
    icon: '📜',
  },
  {
    id: 2,
    dynasty: 'tang',
    title: '万邦交涉',
    tag: '治理',
    desc: '多语言翻译与跨文化沟通意图识别',
    keywords: ['外交', '翻译', '丝绸之路'],
    active: true,
    icon: '🌍',
  },
  {
    id: 3,
    dynasty: 'tang',
    title: '武周刑律',
    tag: '警世',
    desc: '异常流量监控与风控规则匹配',
    keywords: ['律令', '风控', '安全'],
    active: false,
    icon: '⚖️',
  },
  {
    id: 4,
    dynasty: 'sui',
    title: '运河水利',
    tag: '革新',
    desc: '大规模数据管道调度与负载均衡',
    keywords: ['工程', '调度', '数据流'],
    active: true,
    icon: '🌊',
  },
  {
    id: 5,
    dynasty: 'donghan',
    title: '蔡侯造纸',
    tag: '革新',
    desc: '文档自动化解析、OCR与版面还原',
    keywords: ['文档', 'OCR', '排版'],
    active: true,
    icon: '📄',
  },
  {
    id: 6,
    dynasty: 'dongzhou',
    title: '百家争鸣',
    tag: '文韬',
    desc: '多 Agent 辩论与共识达成模型',
    keywords: ['辩论', 'MoE', '思维链'],
    active: true,
    icon: '🗣️',
  },
];

export function TimelinePage() {
  const [selectedDynasty, setSelectedDynasty] = useState('tang');
  const [selectedCat, setSelectedCat] = useState('全部');
  const [isLoading, setIsLoading] = useState(false);

  const currentDynastyInfo = DYNASTIES.find((d) => d.id === selectedDynasty);
  const currentSkills = SKILL_DATABASE.filter(
    (s) => s.dynasty === selectedDynasty && (selectedCat === '全部' || s.tag === selectedCat),
  );

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [selectedDynasty, selectedCat]);

  return (
    <div className="mx-auto min-h-[calc(100vh-100px)] max-w-[1000px] px-6 pt-8">
      {/* Top Section */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl tracking-widest text-[var(--color-accent-gold)] drop-shadow-[0_0_10px_rgba(212,168,67,0.3)]">
          十三王朝
        </h1>
        <p className="mt-2 font-serif text-sm text-[var(--color-accent-gold)]/70">
          中华文明五千年 · 智能新范式
        </p>
      </div>

      {/* Dynasty Selector */}
      <div className="custom-scrollbar mb-8 flex justify-center gap-2 overflow-x-auto pb-4 md:gap-4">
        {DYNASTIES.map((dynasty) => {
          const isSelected = dynasty.id === selectedDynasty;
          return (
            <button
              key={dynasty.id}
              onClick={() => setSelectedDynasty(dynasty.id)}
              className={`h-11 w-11 shrink-0 rounded-full border font-serif text-sm transition-all duration-300 ${
                isSelected
                  ? 'scale-110 border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] shadow-[0_0_15px_rgba(212,168,67,0.5)]'
                  : 'border-[var(--color-accent-gold)]/30 bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-accent-gold)]/80 hover:text-[var(--color-accent-gold)]'
              }`}
            >
              {dynasty.name.slice(0, 1)}
            </button>
          );
        })}
      </div>

      {/* Dynasty Info Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDynasty}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative mb-8 overflow-hidden rounded-xl border border-[var(--color-accent-gold)]/40 bg-[var(--color-bg-secondary)] p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-gold)]/5 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 font-serif text-4xl text-[var(--color-accent-gold)]">
                {currentDynastyInfo?.name}
              </h2>
              <p className="font-mono text-sm text-[var(--color-text-secondary)]">
                {currentDynastyInfo?.period} · 都城：{currentDynastyInfo?.capital}
              </p>
            </div>
            <div className="max-w-sm text-right font-serif text-lg text-[var(--color-text-primary)]">
              {currentDynastyInfo?.desc}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedCat === cat
                ? 'bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)]'
                : 'border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`skel-${i}`}
                className="h-[120px] animate-pulse rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)]"
              ></motion.div>
            ))
          ) : currentSkills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center font-serif text-[var(--color-text-secondary)]"
            >
              <div className="mb-4 text-4xl opacity-50">☁️</div>
              此朝代暂无可用技能
            </motion.div>
          ) : (
            currentSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group flex gap-4 rounded-lg border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] p-5 transition-colors hover:border-[var(--color-accent-gold)]/60"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-primary)] text-xl">
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-gold)]">
                        {skill.title}
                      </h3>
                      <span className="rounded-full border border-[var(--color-accent-gold)]/20 bg-[var(--color-accent-gold)]/10 px-2 py-0.5 text-[10px] text-[var(--color-accent-gold)]">
                        {skill.tag}
                      </span>
                    </div>
                    {/* Toggle Switch */}
                    <div
                      className={`h-4 w-8 rounded-full p-0.5 transition-colors ${skill.active ? 'bg-[var(--color-accent-gold)]' : 'bg-[#6B6578]'}`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full bg-white transition-transform ${skill.active ? 'translate-x-4' : 'translate-x-0'}`}
                      ></div>
                    </div>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                    {skill.desc}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {skill.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-secondary)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
