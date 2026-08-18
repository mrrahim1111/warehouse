import React, { useState, useRef, useEffect } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { askWareMindAI } from '../../services/aiEngine';
import { BrainCircuit, Send, Sparkles, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  "Which orders are at risk of missing their SLA deadline?",
  "What is the current stockout risk for Zone A?",
  "Show me the top 5 orders by priority score",
  "Why was ORD-1042 classified as Critical priority?",
  "Which employees have high fatigue risk right now?",
  "Recommend optimal picker assignments for current wave",
  "What-if: What happens if supplier lead time doubles?",
  "Summarize today's warehouse health"
];

export const AIAssistantView: React.FC = () => {
  const { orders, inventory, exceptions, zones, employees } = useWarehouse();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Welcome to **WareMind AI Assistant**. I have full context over your warehouse operations including ${orders.length} active orders, ${inventory.length} SKUs, ${exceptions.filter(e => e.status !== 'Resolved').length} open exceptions, and ${employees.length} active personnel.\n\nI can answer questions about order priorities, inventory allocation, stockout risks, workforce efficiency, and more. Try asking me anything!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (query?: string) => {
    const text = query || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = askWareMindAI(text, { orders, inventory, exceptions, zones, employees });
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white">WareMind AI Assistant</h3>
          <p className="text-[11px] text-slate-400">Natural language interface to your warehouse operations</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400">LIVE CONTEXT</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-cyan-600/20 border border-cyan-500/20 text-white'
                : 'bg-slate-800/60 border border-slate-700/40 text-slate-200'
            }`}>
              <div className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              <p className={`mt-1.5 text-[10px] ${msg.role === 'user' ? 'text-cyan-400/60' : 'text-slate-500'}`}>{msg.timestamp}</p>
            </div>
            {msg.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                <User className="h-4 w-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                WareMind is analyzing your warehouse data...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {messages.length <= 2 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-800 hover:border-cyan-500/30 hover:text-white transition-all"
            >
              <Sparkles className="h-3 w-3 text-cyan-400 inline mr-1" />{q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask WareMind AI anything about your warehouse..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" /> Ask
        </button>
      </div>
    </div>
  );
};
