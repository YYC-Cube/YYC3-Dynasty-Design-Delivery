import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Send, Mic, Trash2 } from 'lucide-react';

export function AIAssistantHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('对话');
  const [messages, setMessages] = useState([
    { id: 1, type: 'user', text: '查看集群状态' },
    {
      id: 2,
      type: 'assistant',
      role: '天枢',
      text: '【圣旨】\n朕已阅。着中书省即刻草拟方案，门下省严加审议\n— 天子御批',
    },
  ]);
  const [input, setInput] = useState('');

  const roles = ['帝', '太', '中', '门', '尚', '户', '礼', '兵', '刑', '工', '吏', '早'];
  const tabs = ['对话', '命令', '提示词', '配置'];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), type: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant',
          role: '天枢',
          text: '臣已收到旨意，正在处理中...',
        },
      ]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group fixed right-8 bottom-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded bg-gradient-to-br from-[var(--color-accent-gold)] to-[#8B7322] shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
            title="王朝助理"
          >
            <span className="text-2xl">✨</span>
            <div className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--color-bg-primary)] bg-[var(--color-ministry-bronze)]"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-8 bottom-8 z-50 flex h-[680px] w-[520px] flex-col overflow-hidden rounded-lg border border-[var(--color-accent-gold)]/30 bg-[var(--color-bg-primary)]/95 shadow-[0_0_60px_rgba(212,175,55,0.1)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex h-[52px] items-center justify-between border-b border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] px-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔶</span>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[var(--color-accent-gold)]">
                    天枢 · Navigator
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    Model: GPT-4o · 全局调度就绪 · 4命令
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <button className="p-1 transition-colors hover:text-[var(--color-accent-gold)]">
                  <Trash2 size={16} />
                </button>
                <button className="p-1 transition-colors hover:text-[var(--color-accent-gold)]">
                  <Maximize2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 transition-colors hover:text-[var(--color-accent-gold)]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Roles Bar */}
            <div className="hide-scrollbar flex h-10 items-center gap-2 overflow-x-auto border-b border-[var(--color-accent-gold)]/10 bg-[var(--color-bg-secondary)]/50 px-2">
              {roles.map((role) => (
                <button
                  key={role}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] font-serif text-xs transition-all hover:border-[var(--color-accent-gold)]/50 hover:bg-[var(--color-accent-gold)]/10"
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex h-9 gap-6 border-b border-[var(--color-accent-gold)]/10 bg-[var(--color-bg-secondary)]/30 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-full border-b-2 text-xs transition-colors ${activeTab === tab ? 'border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-none border border-[var(--color-accent-gold)]/20 bg-[var(--color-accent-gold)]/10 px-4 py-3 text-sm text-[var(--color-text-primary)]">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="relative max-w-[85%] rounded-2xl rounded-bl-none border border-[var(--color-text-secondary)]/30 bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)]">
                      <div className="mb-1 flex items-center gap-1 font-serif text-xs text-[var(--color-accent-gold)]">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-bg-primary)] text-[10px]">
                          ✨
                        </span>
                        {msg.role}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className="mt-2 flex justify-end">
                        <button className="flex items-center gap-1 rounded bg-[var(--color-bg-primary)] px-2 py-1 text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-gold)]">
                          📋 复制
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex h-14 items-center gap-2 border-t border-[var(--color-accent-gold)]/20 bg-[var(--color-bg-secondary)] px-3">
              <button className="p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-gold)]">
                <Mic size={18} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入旨意... (Enter发送)"
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]"
              />
              <button
                onClick={handleSend}
                className="flex items-center gap-1 rounded bg-[var(--color-accent-gold)] px-4 py-1.5 text-sm font-medium text-[var(--color-bg-primary)] transition-colors hover:bg-[#E5C158]"
              >
                发送
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
