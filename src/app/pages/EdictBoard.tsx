import React from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflow, Edict, EdictStatus } from '../store/WorkflowContext';
import { useDrag, useDrop } from 'react-dnd';
import { EdictIcon, BambooIcon, FishTokenIcon } from '../components/ui/Icons';
import { ImperialEdict } from '../components/ui/ImperialEdict';
import { ImperialSeal } from '../components/ui/ImperialSeal';
import { useModalDismiss } from '../components/ui/useModalDismiss';
import { useTranslation } from '@yyc3/i18n-react';

interface KanbanColumn {
  id: EdictStatus;
  label: string;
  min: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: '待承旨', label: '天堂 (待承旨)', min: '天' },
  { id: '待草拟', label: '中书 (待草拟)', min: '中' },
  { id: '待审议', label: '门下 (待审议)', min: '门' },
  { id: '待派发', label: '尚书 (待派发)', min: '尚' },
  { id: '执行中', label: '六部 (执行中)', min: '部' },
  { id: '待回奏', label: '六部 (待回奏)', min: '奏' },
  { id: '已办结', label: '定鼎门 (已办结)', min: '结' },
];

export function EdictBoard() {
  const { state, dispatch } = useWorkflow();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState('');
  const [draftContent, setDraftContent] = React.useState('');
  const [draftType, setDraftType] = React.useState<'制书' | '敕书' | '敕牒'>('敕书');

  const selectedEdict = state.edicts.find((e) => e.id === selectedId);

  const onBackdropCloseSelected = useModalDismiss(() => setSelectedId(null), !!selectedEdict);
  const onBackdropCloseDraft = useModalDismiss(() => setIsDrafting(false), isDrafting);

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftContent.trim()) return;
    dispatch({
      type: 'CREATE_EDICT',
      payload: { title: draftTitle, content: draftContent, type: draftType },
    });
    setIsDrafting(false);
    setDraftTitle('');
    setDraftContent('');
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] max-w-[1400px] flex-col px-6 pt-6">
      <div className="mb-6 flex shrink-0 items-end justify-between border-b border-[var(--color-accent-gold)]/20 pb-4">
        <div>
          <h2 className="mb-2 flex items-center gap-2 font-serif text-2xl text-[var(--color-accent-gold)]">
            <BambooIcon className="h-6 w-6" /> {t('edict.boardTitle')}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{t('edict.boardDesc')}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/archive')}
            className="rounded border border-[var(--color-text-secondary)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-gold)]"
          >
            {t('edict.archive')}
          </button>
          <button
            onClick={() => setIsDrafting(true)}
            className="rounded bg-[var(--color-accent-gold)] px-4 py-2 text-sm font-medium text-[var(--color-bg-primary)] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-colors hover:bg-[#E5C158]"
          >
            {t('edict.newEdict')}
          </button>
          <button
            onClick={() => navigate('/court')}
            className="rounded border border-[var(--color-accent-gold)] bg-[var(--color-bg-primary)] px-4 py-2 text-sm font-medium text-[var(--color-accent-gold)] transition-colors hover:bg-[var(--color-accent-gold)]/10"
          >
            {t('edict.backToCourt')}
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="custom-scrollbar flex flex-1 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            edicts={state.edicts.filter((e) => e.status === col.id)}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      {/* Edict Modal */}
      <AnimatePresence>
        {selectedEdict && (
          <div
            onClick={onBackdropCloseSelected}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0614]/85 p-4 backdrop-blur-sm"
          >
            <ImperialEdict
              title={selectedEdict.title}
              type={selectedEdict.type}
              content={selectedEdict.content}
              onClose={() => setSelectedId(null)}
            >
              <WorkflowActions edict={selectedEdict} />
            </ImperialEdict>
          </div>
        )}

        {isDrafting && (
          <div
            onClick={onBackdropCloseDraft}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0614]/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-lg border border-[var(--color-accent-gold)]/50 bg-[#1A142A] p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-accent-gold)] to-transparent"></div>
              <h3 className="mb-6 text-center font-serif text-2xl text-[var(--color-accent-gold)]">
                {t('edict.draftTitle')}
              </h3>

              <form onSubmit={handleDraftSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-serif text-sm text-[var(--color-bamboo-brown)]">
                    {t('edict.draftTypeLabel')}
                  </label>
                  <div className="flex gap-4">
                    {['制书', '敕书', '敕牒'].map((edictType) => (
                      <label
                        key={edictType}
                        className="flex cursor-pointer items-center gap-2 text-[var(--color-text-primary)]"
                      >
                        <input
                          type="radio"
                          name="type"
                          value={edictType}
                          checked={draftType === edictType}
                          onChange={(e) => setDraftType(e.target.value as '制书' | '敕书' | '敕牒')}
                          className="bg-transparent accent-[var(--color-accent-gold)]"
                        />
                        <span
                          className={
                            draftType === edictType ? 'text-[var(--color-accent-gold)]' : ''
                          }
                        >
                          {edictType}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-serif text-sm text-[var(--color-bamboo-brown)]">
                    {t('edict.draftTitleLabel')}
                  </label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full rounded border border-[var(--color-text-secondary)]/50 bg-[var(--color-bg-primary)] px-4 py-2 text-[var(--color-text-primary)] transition-colors focus:border-[var(--color-accent-gold)] focus:outline-none"
                    placeholder={t('edict.draftTitlePlaceholder')}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block font-serif text-sm text-[var(--color-bamboo-brown)]">
                    {t('edict.draftContentLabel')}
                  </label>
                  <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="h-32 w-full resize-none rounded border border-[var(--color-text-secondary)]/50 bg-[var(--color-bg-primary)] px-4 py-2 text-[var(--color-text-primary)] transition-colors focus:border-[var(--color-accent-gold)] focus:outline-none"
                    placeholder={t('edict.draftContentPlaceholder')}
                  />
                </div>

                <div className="mt-8 flex justify-end gap-4 border-t border-[var(--color-text-secondary)]/30 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDrafting(false)}
                    className="px-6 py-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {t('edict.draftCancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!draftTitle.trim() || !draftContent.trim()}
                    className="rounded bg-[var(--color-accent-vermillion)] px-8 py-2 font-serif tracking-widest text-[var(--color-text-primary)] shadow-lg transition-colors hover:bg-[#A01A04] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('edict.draftSubmit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanColumn({
  column,
  edicts,
  onSelect,
}: {
  column: KanbanColumn;
  edicts: Edict[];
  onSelect: (id: string) => void;
}) {
  const { dispatch } = useWorkflow();

  const [{ isOver }, dropRef] = useDrop({
    accept: 'EDICT',
    drop: (item: { id: string }) => {
      dispatch({
        type: 'UPDATE_EDICT_STATUS',
        payload: { id: item.id, status: column.id, operator: '操作员' },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef as unknown as React.LegacyRef<HTMLDivElement>}
      className={`flex w-[280px] shrink-0 flex-col overflow-hidden rounded-lg border bg-[#1A142A] transition-colors ${isOver ? 'border-[var(--color-accent-gold)]' : 'border-[var(--color-bg-secondary)]'}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-bg-primary)] bg-[var(--color-bg-secondary)] px-4 py-3">
        <span className="font-serif text-sm text-[var(--color-accent-gold)]">{column.label}</span>
        <span className="rounded bg-[var(--color-bg-primary)] px-2 py-0.5 font-mono text-xs text-[var(--color-bamboo-brown)]">
          {edicts.length}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {edicts.map((e) => (
          <EdictCard key={e.id} edict={e} onClick={() => onSelect(e.id)} />
        ))}
      </div>
    </div>
  );
}

function EdictCard({ edict, onClick }: { edict: Edict; onClick: () => void }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'EDICT',
    item: { id: edict.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef as unknown as React.LegacyRef<HTMLDivElement>}
      onClick={onClick}
      className={`cursor-pointer rounded border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-secondary)] p-3 transition-all hover:border-[var(--color-accent-gold)]/50 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${
            edict.type === '敕书'
              ? 'bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]'
              : edict.type === '敕牒'
                ? 'bg-[var(--color-accent-vermillion)]/20 text-[var(--color-accent-vermillion)]'
                : 'bg-[var(--color-text-primary)]/10 text-[var(--color-text-primary)]'
          }`}
        >
          <EdictIcon className="h-3 w-3" /> {edict.type}
        </span>
        <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">
          #{edict.id.split('-')[1]}
        </span>
      </div>
      <h3 className="mb-3 line-clamp-2 font-serif text-sm text-[var(--color-text-primary)]">
        {edict.title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {edict.seal && (
            <>
              <FishTokenIcon className="h-4 w-4 text-[var(--color-accent-gold)]" />
              <span className="sr-only">已盖玺发牌</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          {new Date(edict.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function WorkflowActions({ edict }: { edict: Edict }) {
  const { dispatch } = useWorkflow();
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex w-full items-end justify-between gap-6 border-t border-[var(--color-accent-gold)]/20 pt-6">
      <div className="flex-1">
        <p className="mb-2 font-serif text-xs font-bold text-[var(--color-bamboo-brown)]">
          {t('edict.workflowActionsLabel')}
        </p>
        <div className="flex gap-2">
          {edict.status === '待承旨' && (
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_EDICT_STATUS',
                  payload: { id: edict.id, status: '待草拟', operator: '明堂' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              承旨分拣
            </button>
          )}
          {edict.status === '待草拟' && (
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_EDICT_STATUS',
                  payload: { id: edict.id, status: '待审议', operator: '中书省' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              提交草拟
            </button>
          )}
          {edict.status === '待审议' && (
            <>
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_EDICT_STATUS',
                    payload: { id: edict.id, status: '待派发', operator: '门下省' },
                  })
                }
                className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
              >
                准奏
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_EDICT_STATUS',
                    payload: { id: edict.id, status: '待草拟', operator: '门下省' },
                  })
                }
                className="rounded border border-[var(--color-accent-vermillion)]/50 bg-[var(--color-bg-primary)] px-4 py-2 text-xs text-[var(--color-accent-vermillion)] hover:bg-[var(--color-accent-vermillion)]/20"
              >
                封驳
              </button>
            </>
          )}
          {edict.status === '待派发' && (
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_EDICT_STATUS',
                  payload: { id: edict.id, status: '执行中', operator: '尚书省' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              核发鱼符
            </button>
          )}
          {edict.status === '执行中' && (
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_EDICT_STATUS',
                  payload: { id: edict.id, status: '待回奏', operator: '六部' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              办结
            </button>
          )}
          {edict.status === '待回奏' && (
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_EDICT_STATUS',
                  payload: { id: edict.id, status: '已办结', operator: '六部' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              上呈回奏
            </button>
          )}
        </div>
      </div>
      <div>
        <ImperialSeal
          sealed={edict.seal}
          onSeal={() => dispatch({ type: 'SEAL_EDICT', payload: { id: edict.id } })}
          disabled={edict.status === '已办结'}
        />
      </div>
    </div>
  );
}
