import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export type EdictStatus =
  '待承旨' | '待草拟' | '待审议' | '待派发' | '执行中' | '待回奏' | '已办结';

export interface HistoryLog {
  id: string;
  edictId: string;
  timestamp: string;
  action: string;
  operator: string;
  details: string;
}

export interface Edict {
  id: string;
  title: string;
  content: string;
  status: EdictStatus;
  type: '制书' | '敕书' | '敕牒';
  createdAt: string;
  seal: boolean;
}

interface WorkflowState {
  edicts: Edict[];
  history: HistoryLog[];
  isConnected: boolean; // WebSocket Connection Status
}

type WorkflowAction =
  | { type: 'CREATE_EDICT'; payload: Omit<Edict, 'id' | 'createdAt' | 'seal' | 'status'> }
  | { type: 'UPDATE_EDICT_STATUS'; payload: { id: string; status: EdictStatus; operator: string } }
  | { type: 'SEAL_EDICT'; payload: { id: string } }
  | { type: 'SET_CONNECTION'; payload: boolean }
  | { type: 'SYNC_FROM_SERVER'; payload: { edicts: Edict[]; history: HistoryLog[] } };

const initialState: WorkflowState = {
  edicts: [
    {
      id: 'EDICT-001',
      title: '重建洛阳南市水系',
      content: '着工部协同户部，于本月内调拨银两，疏浚南市水系，不得有误。',
      status: '待派发',
      type: '敕书',
      createdAt: new Date().toISOString(),
      seal: true,
    },
    {
      id: 'EDICT-002',
      title: '加急：突发系统漏洞修复',
      content: '刑部急奏，藏经阁数据存有漏洞，速令兵部进行热修复。',
      status: '执行中',
      type: '敕牒',
      createdAt: new Date().toISOString(),
      seal: true,
    },
  ],
  history: [
    {
      id: 'LOG-001',
      edictId: 'EDICT-001',
      timestamp: new Date().toISOString(),
      action: '拟旨',
      operator: '天堂·天子',
      details: '创建了敕书：重建洛阳南市水系',
    },
  ],
  isConnected: false,
};

const WorkflowContext = createContext<
  | {
      state: WorkflowState;
      dispatch: React.Dispatch<WorkflowAction>;
    }
  | undefined
>(undefined);

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'CREATE_EDICT': {
      const newEdict: Edict = {
        ...action.payload,
        id: `EDICT-${Date.now().toString().slice(-4)}`,
        status: '待承旨',
        createdAt: new Date().toISOString(),
        seal: false,
      };
      return {
        ...state,
        edicts: [newEdict, ...state.edicts],
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: newEdict.id,
            timestamp: new Date().toISOString(),
            action: '拟旨',
            operator: '天堂·天子',
            details: `创建了${newEdict.type}：${newEdict.title}`,
          },
          ...state.history,
        ],
      };
    }
    case 'UPDATE_EDICT_STATUS': {
      return {
        ...state,
        edicts: state.edicts.map((e) =>
          e.id === action.payload.id ? { ...e, status: action.payload.status } : e,
        ),
        history: [
          {
            id: `LOG-${Date.now()}`,
            edictId: action.payload.id,
            timestamp: new Date().toISOString(),
            action: '流转',
            operator: action.payload.operator,
            details: `状态变更为：${action.payload.status}`,
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
            timestamp: new Date().toISOString(),
            action: '盖玺',
            operator: '最高权限',
            details: '加盖传国玉玺，敕令生效',
          },
          ...state.history,
        ],
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
    default:
      return state;
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Real backend integration hook (Mocked WebSocket for demonstration)
  useEffect(() => {
    // In a real scenario: const ws = new WebSocket('wss://dynasty.yyc3.com/ws');

    // Simulate connection establishing
    const connectTimer = setTimeout(() => {
      dispatch({ type: 'SET_CONNECTION', payload: true });
      console.log('🔗 WebSocket connected: wss://dynasty.yyc3.com/ws');
    }, 1500);

    // Simulate random external state updates pushing in from Python/FastAPI Agents
    const mockServerEvents = setInterval(() => {
      // Simulate random backend push, e.g. Ministry executing a task automatically
      // In production, this parses event.data from ws.onmessage
    }, 15000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(mockServerEvents);
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
