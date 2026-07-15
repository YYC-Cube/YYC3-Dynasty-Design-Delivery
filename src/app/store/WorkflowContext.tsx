import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

import type { Edict, EdictStatus, EdictMessage, HistoryLog } from '../domain';
import { resolveTransition, isValidTransition, sanitizeText } from '../domain';

// ── State ────────────────────────────────────────────────────────────────

interface WorkflowState {
  edicts: Edict[];
  history: HistoryLog[];
  isConnected: boolean;
}

type WorkflowAction =
  | {
      type: 'CREATE_EDICT';
      payload: Omit<
        Edict,
        'id' | 'createdAt' | 'updatedAt' | 'seal' | 'status' | 'flowLog' | 'progressLog' | 'todos'
      >;
    }
  | {
      type: 'TRANSITION_EDICT';
      payload: { id: string; target: EdictStatus; operator: string; remark?: string };
    }
  | {
      type: 'CONFIRM_EDICT';
      payload: { id: string; action: 'approve' | 'reject'; reason?: string };
    }
  | { type: 'SEAL_EDICT'; payload: { id: string } }
  | {
      type: 'ADD_PROGRESS';
      payload: { id: string; agent: string; agentLabel: string; text: string };
    }
  | { type: 'SET_CONNECTION'; payload: boolean }
  | { type: 'SYNC_FROM_SERVER'; payload: { edicts: Edict[]; history: HistoryLog[] } }
  | { type: 'HANDLE_WS_EVENT'; payload: EdictMessage };

// ── Initial State ────────────────────────────────────────────────────────

const now = () => new Date().toISOString();

const initialState: WorkflowState = {
  edicts: [
    {
      id: 'EDICT-001',
      title: '重建洛阳南市水系',
      content: '着工部协同户部，于本月内调拨银两，疏浚南市水系，不得有误。',
      status: '待派发',
      type: '敕书',
      createdAt: now(),
      updatedAt: now(),
      seal: true,
      priority: '中',
      creator: '天堂·天子',
      flowLog: [
        {
          at: now(),
          from: '待承旨',
          to: '待草拟',
          remark: '承旨分拣',
          agent: 'taizi',
          agentLabel: '明堂·太子',
        },
        {
          at: now(),
          from: '待草拟',
          to: '待审议',
          remark: '起草方案',
          agent: 'zhongshu',
          agentLabel: '中书省',
        },
        {
          at: now(),
          from: '待审议',
          to: '待派发',
          remark: '准奏',
          agent: 'menxia',
          agentLabel: '门下省',
        },
      ],
      progressLog: [],
      todos: [],
    },
    {
      id: 'EDICT-002',
      title: '加急：突发系统漏洞修复',
      content: '刑部急奏，藏经阁数据存有漏洞，速令兵部进行热修复。',
      status: '执行中',
      type: '敕牒',
      createdAt: now(),
      updatedAt: now(),
      seal: true,
      priority: '紧急',
      creator: '天堂·天子',
      flowLog: [
        {
          at: now(),
          from: '待承旨',
          to: '待草拟',
          remark: '急奏',
          agent: 'taizi',
          agentLabel: '明堂·太子',
        },
        {
          at: now(),
          from: '待草拟',
          to: '待审议',
          remark: '速拟方案',
          agent: 'zhongshu',
          agentLabel: '中书省',
        },
        {
          at: now(),
          from: '待审议',
          to: '待派发',
          remark: '准奏',
          agent: 'menxia',
          agentLabel: '门下省',
        },
        {
          at: now(),
          from: '待派发',
          to: '执行中',
          remark: '核发鱼符',
          agent: 'shangshu',
          agentLabel: '尚书省',
        },
      ],
      progressLog: [],
      todos: [],
    },
  ],
  history: [
    {
      id: 'LOG-001',
      edictId: 'EDICT-001',
      timestamp: now(),
      action: '拟旨',
      operator: '天堂·天子',
      details: '创建了敕书：重建洛阳南市水系',
    },
  ],
  isConnected: false,
};

// ── Reducer ──────────────────────────────────────────────────────────────

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'CREATE_EDICT': {
      const ts = now();
      const newEdict: Edict = {
        ...action.payload,
        title: sanitizeText(action.payload.title, 200),
        content: sanitizeText(action.payload.content, 2000),
        id: `EDICT-${Date.now().toString().slice(-6)}`,
        status: '待承旨',
        createdAt: ts,
        updatedAt: ts,
        seal: false,
        flowLog: [],
        progressLog: [],
        todos: [],
      };
      return {
        ...state,
        edicts: [newEdict, ...state.edicts],
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: newEdict.id,
            timestamp: ts,
            action: '拟旨',
            operator: '天堂·天子',
            details: `创建了${newEdict.type}：${newEdict.title}`,
          },
          ...state.history,
        ],
      };
    }

    case 'TRANSITION_EDICT': {
      const edict = state.edicts.find((e) => e.id === action.payload.id);
      if (!edict) return state;

      if (!isValidTransition(edict.status, action.payload.target)) {
        console.warn(`[StateMachine] 非法流转被拒绝: ${edict.status} → ${action.payload.target}`);
        return state;
      }

      const resolved = resolveTransition(
        edict.status,
        action.payload.target,
        action.payload.operator,
      );
      const ts = now();

      const updatedEdict: Edict = {
        ...edict,
        status: resolved.status,
        updatedAt: ts,
        pendingConfirm: resolved.pendingConfirm,
        flowLog: [
          ...edict.flowLog,
          {
            at: ts,
            from: edict.status,
            to: resolved.status,
            remark: action.payload.remark || resolved.pendingConfirm ? '待复核确认' : '',
            agent: action.payload.operator,
            agentLabel: action.payload.operator,
          },
        ],
      };

      return {
        ...state,
        edicts: state.edicts.map((e) => (e.id === action.payload.id ? updatedEdict : e)),
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: action.payload.id,
            timestamp: ts,
            action: resolved.pendingConfirm ? '待复核' : '流转',
            operator: action.payload.operator,
            details: resolved.pendingConfirm
              ? `请求流转至${action.payload.target}，待${resolved.pendingConfirm.confirmBy}复核`
              : `状态变更为：${resolved.status}`,
          },
          ...state.history,
        ],
      };
    }

    case 'CONFIRM_EDICT': {
      const edict = state.edicts.find((e) => e.id === action.payload.id);
      if (!edict || !edict.pendingConfirm) return state;

      const ts = now();
      const approved = action.payload.action === 'approve';
      const newStatus = approved ? edict.pendingConfirm.targetState : '待回奏';

      return {
        ...state,
        edicts: state.edicts.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                status: newStatus,
                updatedAt: ts,
                pendingConfirm: undefined,
                flowLog: [
                  ...e.flowLog,
                  {
                    at: ts,
                    from: '待复核',
                    to: newStatus,
                    remark: approved ? '复核通过' : `复核驳回：${action.payload.reason || ''}`,
                    agent: e.pendingConfirm!.confirmBy,
                    agentLabel: e.pendingConfirm!.confirmBy,
                  },
                ],
              }
            : e,
        ),
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: action.payload.id,
            timestamp: ts,
            action: approved ? '复核通过' : '复核驳回',
            operator: edict.pendingConfirm.confirmBy,
            details: approved
              ? `确认流转至${newStatus}`
              : `驳回至待回奏：${action.payload.reason || ''}`,
          },
          ...state.history,
        ],
      };
    }

    case 'SEAL_EDICT': {
      return {
        ...state,
        edicts: state.edicts.map((e) => (e.id === action.payload.id ? { ...e, seal: true } : e)),
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: action.payload.id,
            timestamp: now(),
            action: '盖玺',
            operator: '最高权限',
            details: '加盖传国玉玺，敕令生效',
          },
          ...state.history,
        ],
      };
    }

    case 'ADD_PROGRESS': {
      const ts = now();
      return {
        ...state,
        edicts: state.edicts.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                updatedAt: ts,
                progressLog: [
                  ...e.progressLog,
                  {
                    at: ts,
                    agent: action.payload.agent,
                    agentLabel: action.payload.agentLabel,
                    text: sanitizeText(action.payload.text, 500),
                  },
                ],
              }
            : e,
        ),
      };
    }

    case 'SET_CONNECTION': {
      return { ...state, isConnected: action.payload };
    }

    case 'SYNC_FROM_SERVER': {
      return {
        ...state,
        edicts: action.payload.edicts,
        history: action.payload.history,
      };
    }

    case 'HANDLE_WS_EVENT': {
      // Framework WebSocket protocol: { type: 'event', topic, data }
      // For now, log the event — real implementation would update state per topic
      console.log(
        '[WS] EdictMessage received:',
        action.payload.type,
        action.payload.from,
        '→',
        action.payload.to,
      );
      return state;
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────

const WorkflowContext = createContext<
  | {
      state: WorkflowState;
      dispatch: React.Dispatch<WorkflowAction>;
    }
  | undefined
>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // WebSocket integration hook
  // Protocol aligned with Framework: wss://<host>/ws → { type: 'event', topic, data }
  useEffect(() => {
    // In production: const ws = new WebSocket('wss://dynasty.yyc3.top/ws');
    // ws.onmessage = (e) => {
    //   const msg = JSON.parse(e.data) as { type: string; topic: string; data: EdictMessage };
    //   if (msg.type === 'event' && msg.data) {
    //     dispatch({ type: 'HANDLE_WS_EVENT', payload: msg.data });
    //   }
    // };

    const connectTimer = setTimeout(() => {
      dispatch({ type: 'SET_CONNECTION', payload: true });
      console.log('🔗 WebSocket connected: wss://dynasty.yyc3.top/ws');
    }, 1500);

    return () => {
      clearTimeout(connectTimer);
      // ws.close();
      dispatch({ type: 'SET_CONNECTION', payload: false });
    };
  }, []);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>{children}</WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

// ── Legacy compat: re-export types for existing consumers ─────────────────
export type { Edict, EdictStatus, HistoryLog, EdictMessage };
