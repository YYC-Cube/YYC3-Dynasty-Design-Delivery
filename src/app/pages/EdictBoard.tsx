import React from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflow } from '../store/WorkflowContext';
import type { Edict, EdictStatus } from '../domain';
import { getValidTransitions, STATE_ORG_MAP } from '../domain';
import { useDrag, useDrop } from 'react-dnd';
import { EdictIcon, BambooIcon, FishTokenIcon } from '../components/ui/Icons';
import { ImperialEdict } from '../components/ui/ImperialEdict';
import { ImperialSeal } from '../components/ui/ImperialSeal';
import { useModalDismiss } from '../components/ui/useModalDismiss';
import { useTranslation } from '@yyc3/i18n-react';

const COLUMN_IDS: EdictStatus[] = [
  '待承旨',
  '待草拟',
  '待审议',
  '待派发',
  '执行中',
  '待回奏',
  '已办结',
];

// Transition action labels for each status→status pair
const TRANSITION_KEYS: Record<string, string> = {
  '待承旨→待草拟': 'intakeToDraft',
  '待草拟→待审议': 'draftToReview',
  '待审议→待派发': 'reviewToApprove',
  '待审议→待草拟': 'reviewToReject',
  '待派发→执行中': 'dispatchToExecute',
  '待派发→待执行': 'dispatchToQueue',
  '待执行→执行中': 'queueToExecute',
  '执行中→待回奏': 'executeToReport',
  '执行中→已办结': 'executeToDone',
  '待回奏→已办结': 'reportToDone',
  '待回奏→待审议': 'reportToReview',
  '待回奏→执行中': 'reportToExecute',
  '待复核→已办结': 'confirmApprove',
  '待复核→待回奏': 'confirmReject',
  '阻塞中→待草拟': 'unblockToDraft',
  '阻塞中→待审议': 'unblockToReview',
  '阻塞中→待派发': 'unblockToDispatch',
  '阻塞中→待执行': 'unblockToQueue',
  '阻塞中→执行中': 'unblockToExecute',
  '阻塞中→待回奏': 'unblockToReport',
};

// ── Off-pipeline states (shown in a compact tray, not main columns) ──
const OFF_PIPELINE_IDS: EdictStatus[] = ['待执行', '待复核', '阻塞中', '已撤销'];
const OFF_PIPELINE_ACCENTS: Partial<Record<EdictStatus, string>> = {
  待执行: 'var(--color-accent-azure)',
  待复核: 'var(--color-accent-amber)',
  阻塞中: 'var(--color-accent-vermillion)',
  已撤销: 'var(--color-text-secondary)',
};

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
        {COLUMN_IDS.map((colId) => (
          <KanbanColumn
            key={colId}
            columnId={colId}
            edicts={state.edicts.filter((e) => e.status === colId)}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      {/* Off-Pipeline Tray (待执行/待复核/阻塞中/已撤销) */}
      {(() => {
        const offPipelineEdicts = state.edicts.filter((e) => OFF_PIPELINE_IDS.includes(e.status));
        if (offPipelineEdicts.length === 0) return null;
        return (
          <div className="mt-2 flex shrink-0 gap-2 border-t border-[var(--color-bg-secondary)] pt-3">
            {OFF_PIPELINE_IDS.map((trayId) => {
              const trayEdicts = offPipelineEdicts.filter((e) => e.status === trayId);
              if (trayEdicts.length === 0) return null;
              const accent = OFF_PIPELINE_ACCENTS[trayId];
              return (
                <div
                  key={trayId}
                  className="flex items-center gap-1 rounded border px-2 py-1"
                  style={{
                    borderColor: `${accent}40`,
                    backgroundColor: `${accent}0D`,
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: accent }}>
                    {t(`edict.offPipeline.${trayId}`)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">
                    {trayEdicts.length}
                  </span>
                  {trayEdicts.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className="ml-1 max-w-[120px] truncate rounded bg-[var(--color-bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      title={e.title}
                    >
                      {e.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })()}

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
                          {t(`edict.type.${edictType}`)}
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
  columnId,
  edicts,
  onSelect,
}: {
  columnId: EdictStatus;
  edicts: Edict[];
  onSelect: (id: string) => void;
}) {
  const { dispatch } = useWorkflow();
  const { t } = useTranslation();

  const [{ isOver }, dropRef] = useDrop({
    accept: 'EDICT',
    drop: (item: { id: string; currentStatus: EdictStatus }) => {
      if (item.currentStatus === columnId) return;
      dispatch({
        type: 'TRANSITION_EDICT',
        payload: { id: item.id, target: columnId, operator: '操作员' },
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
        <span className="font-serif text-sm text-[var(--color-accent-gold)]">
          {t(`edict.columnLabels.${columnId}`)}
        </span>
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
  const { t } = useTranslation();
  const [{ isDragging }, dragRef] = useDrag({
    type: 'EDICT',
    item: { id: edict.id, currentStatus: edict.status },
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
          <EdictIcon className="h-3 w-3" /> {t(`edict.type.${edict.type}`)}
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
              <span className="sr-only">{t('edict.sealedHint')}</span>
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

  // Get valid transitions from the state machine
  const validTargets = getValidTransitions(edict.status);
  const org = STATE_ORG_MAP[edict.status] || '—';

  // For blocked edicts, show the unblock targets
  // For pending confirm, show approve/reject
  // For terminal, no actions
  if (edict.pendingConfirm) {
    return (
      <div className="mt-4 flex w-full items-end justify-between gap-6 border-t border-[var(--color-accent-amber)]/30 pt-6">
        <div className="flex-1">
          <p className="mb-2 font-serif text-xs font-bold text-[var(--color-accent-amber)]">
            {t('edict.pendingConfirmTitle')}
          </p>
          <p className="mb-3 text-xs text-[var(--color-text-secondary)]">
            {t('edict.pendingConfirmPrefix')}「
            {t(`edict.status.${edict.pendingConfirm.targetState}`)}」
            {t('edict.pendingConfirmSuffix')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                dispatch({
                  type: 'CONFIRM_EDICT',
                  payload: { id: edict.id, action: 'approve' },
                })
              }
              className="rounded border border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] px-4 py-2 text-xs text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20"
            >
              {t('edict.approve')}
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: 'CONFIRM_EDICT',
                  payload: { id: edict.id, action: 'reject', reason: t('edict.rejectReason') },
                })
              }
              className="rounded border border-[var(--color-accent-vermillion)]/50 bg-[var(--color-bg-primary)] px-4 py-2 text-xs text-[var(--color-accent-vermillion)] hover:bg-[var(--color-accent-vermillion)]/20"
            >
              {t('edict.reject')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex w-full items-end justify-between gap-6 border-t border-[var(--color-accent-gold)]/20 pt-6">
      <div className="flex-1">
        <p className="mb-2 font-serif text-xs font-bold text-[var(--color-bamboo-brown)]">
          {t('edict.workflowActionsLabel')} · {t('edict.currentOrgPrefix')}：{org}
        </p>
        <div className="flex flex-wrap gap-2">
          {validTargets.map((target) => {
            const transitionKey = TRANSITION_KEYS[`${edict.status}→${target}`];
            const label = transitionKey
              ? t(`edict.transition.${transitionKey}`)
              : t(`edict.status.${target}`);
            const isDanger = target === '已撤销' || target === '待草拟';
            const isBlock = target === '阻塞中';
            return (
              <button
                key={target}
                onClick={() =>
                  dispatch({
                    type: 'TRANSITION_EDICT',
                    payload: { id: edict.id, target, operator: org, remark: label },
                  })
                }
                className={`rounded border px-4 py-2 text-xs transition-colors ${
                  isDanger
                    ? 'border-[var(--color-accent-vermillion)]/50 bg-[var(--color-bg-primary)] text-[var(--color-accent-vermillion)] hover:bg-[var(--color-accent-vermillion)]/20'
                    : isBlock
                      ? 'border-[var(--color-accent-amber)]/50 bg-[var(--color-bg-primary)] text-[var(--color-accent-amber)] hover:bg-[var(--color-accent-amber)]/20'
                      : 'border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-secondary)] text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20'
                }`}
              >
                {label}
              </button>
            );
          })}
          {validTargets.length === 0 && (
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t('edict.noActions')}
            </span>
          )}
        </div>
      </div>
      <div>
        <ImperialSeal
          sealed={edict.seal}
          onSeal={() => dispatch({ type: 'SEAL_EDICT', payload: { id: edict.id } })}
          disabled={edict.status === '已办结' || edict.status === '已撤销'}
        />
      </div>
    </div>
  );
}
