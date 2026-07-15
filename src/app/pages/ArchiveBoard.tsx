import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useWorkflow, HistoryLog } from '../store/WorkflowContext';
import { BambooIcon, EdictIcon } from '../components/ui/Icons';
import { ImperialEdict } from '../components/ui/ImperialEdict';
import { useModalDismiss } from '../components/ui/useModalDismiss';

export function ArchiveBoard() {
  const { state } = useWorkflow();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const completedEdicts = state.edicts.filter((e) => e.status === '已办结');
  const selectedEdict = state.edicts.find((e) => e.id === selectedId);

  const onBackdropClose = useModalDismiss(() => setSelectedId(null), !!selectedEdict);

  // Group history by edict
  const historyByEdict = state.history.reduce(
    (acc, log) => {
      if (!acc[log.edictId]) acc[log.edictId] = [];
      acc[log.edictId].push(log);
      return acc;
    },
    {} as Record<string, HistoryLog[]>,
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] max-w-[1200px] flex-col px-6 pt-6">
      <div className="mb-6 flex shrink-0 items-end justify-between border-b border-[var(--color-accent-gold)]/20 pb-4">
        <div>
          <h2 className="mb-2 flex items-center gap-2 font-serif text-2xl text-[var(--color-accent-gold)]">
            <BambooIcon className="h-6 w-6" /> 定鼎门 · 奏折阁
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            查看已办结任务的完整流转回溯与史料归档
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/edict')}
            className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--color-accent-gold)] transition-colors hover:bg-[var(--color-accent-gold)]/20"
          >
            返回旨意工坊
          </button>
        </div>
      </div>

      {completedEdicts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-[var(--color-text-secondary)]">
          <BambooIcon className="mb-4 h-16 w-16 opacity-20" />
          <p className="font-serif text-lg">尚无已归档的奏折</p>
        </div>
      ) : (
        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-4">
          {completedEdicts.map((edict, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={edict.id}
              className="flex gap-8 rounded-lg border border-[var(--color-accent-gold)]/30 bg-[#1A142A] p-6"
            >
              <div className="flex w-[300px] shrink-0 flex-col border-r border-[var(--color-text-secondary)]/20 pr-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex w-fit items-center gap-1 rounded bg-[var(--color-accent-gold)]/20 px-2 py-0.5 text-[10px] text-[var(--color-accent-gold)]">
                    <EdictIcon className="h-3 w-3" /> {edict.type}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                    #{edict.id.split('-')[1]}
                  </span>
                </div>
                <h3 className="mb-4 font-serif text-xl text-[var(--color-text-primary)]">
                  {edict.title}
                </h3>
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedId(edict.id)}
                    className="w-full rounded border border-[var(--color-text-secondary)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-sm text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)]"
                  >
                    查阅原文
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="mb-4 font-serif text-sm text-[var(--color-bamboo-brown)]">
                  全链路流转回溯
                </h4>
                <div className="relative">
                  <div className="absolute top-2 bottom-2 left-2 w-px bg-[var(--color-accent-gold)]/20"></div>
                  <div className="space-y-4">
                    {(historyByEdict[edict.id] || [])
                      .sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                      )
                      .map((log) => (
                        <div key={log.id} className="relative flex items-start gap-4 pl-8">
                          <div className="absolute top-1.5 left-[3px] h-2 w-2 rounded-full border border-[var(--color-accent-gold)] bg-[#1A142A]"></div>
                          <div className="w-[60px] shrink-0 pt-0.5 font-mono text-xs text-[var(--color-text-secondary)]">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--color-accent-gold)]">
                                {log.action}
                              </span>
                              <span className="text-xs text-[var(--color-text-secondary)]">
                                by {log.operator}
                              </span>
                            </div>
                            <div className="text-sm text-[var(--color-text-primary)]">
                              {log.details}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedEdict && (
        <div
          onClick={onBackdropClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0614]/85 p-4 backdrop-blur-sm"
        >
          <ImperialEdict
            title={selectedEdict.title}
            type={selectedEdict.type}
            content={selectedEdict.content}
            onClose={() => setSelectedId(null)}
          >
            <div className="flex w-full justify-center border-t border-[var(--color-accent-gold)]/20 pt-8">
              <div className="relative flex h-20 w-20 rotate-[-5deg] items-center justify-center border-4 border-[var(--color-accent-vermillion)] bg-[var(--color-accent-vermillion)]/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                <span
                  className="writing-vertical-rl text-center font-serif text-lg leading-tight font-bold text-[var(--color-accent-vermillion)]"
                  style={{ textShadow: '0 0 2px rgba(200,37,6,0.5)' }}
                >
                  受命于天
                  <br />
                  既寿永昌
                </span>
              </div>
            </div>
          </ImperialEdict>
        </div>
      )}
    </div>
  );
}
