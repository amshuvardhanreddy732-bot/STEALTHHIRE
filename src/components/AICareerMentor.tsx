import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Send, Sparkles, Trash2, HelpCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

// Custom lightweight Markdown-to-JSX renderer to ensure React 19 compatibility
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs leading-relaxed text-gray-200">
      {lines.map((line, index) => {
        let trimmed = line.trim();
        
        // 1. Headers
        if (trimmed.startsWith('### ')) {
          return <h4 key={index} className="text-sm font-extrabold text-white mt-4 font-display">{trimmed.replace('### ', '')}</h4>;
        }
        if (trimmed.startsWith('## ')) {
          return <h3 key={index} className="text-md font-extrabold text-white mt-4 font-display">{trimmed.replace('## ', '')}</h3>;
        }

        // 2. Bullet list
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 pl-3">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{trimmed.substring(2)}</span>
            </div>
          );
        }

        // 3. Simple text processing (handling basic bolding)
        const parts = line.split('**');
        if (parts.length > 1) {
          return (
            <p key={index}>
              {parts.map((part, i) => (
                i % 2 === 1 ? <strong key={i} className="text-white font-extrabold">{part}</strong> : part
              ))}
            </p>
          );
        }

        return line ? <p key={index}>{line}</p> : <div key={index} className="h-2" />;
      })}
    </div>
  );
}

export default function AICareerMentor() {
  const { chatMessages, sendChatMessage, clearChat, isChatLoading, user } = useStore();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Which startups match my active stack?',
    'Write a founder pitch for CognitiveOS',
    'Summarize stealth funding signals',
    'How do I acquire Rust/gRPC skills?'
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const msg = input;
    setInput('');
    await sendChatMessage(msg);
  };

  const handleSuggestedClick = async (prompt: string) => {
    if (isChatLoading) return;
    await sendChatMessage(prompt);
  };

  // Scroll anchor
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  return (
    <div className="p-6 md:p-8 flex flex-col justify-between max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
      
      {/* Top Console Row */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <BrainCircuit className="w-6.5 h-6.5 text-indigo-400 animate-pulse" />
            <span>AI Career Mentor</span>
          </h1>
          <p className="text-gray-400 text-[11px] mt-0.5">Stealth Hiring intelligence consultant. Ready for prompts.</p>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-rose-400 rounded-xl bg-white/5 border border-transparent hover:border-rose-500/10 transition-all flex items-center gap-1 text-xs font-semibold"
          title="Clear session history"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Session</span>
        </button>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 max-h-[55vh] pr-2">
        {chatMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-2xl border ${
                  isAssistant
                    ? 'bg-gray-900/40 border-white/5 rounded-tl-none'
                    : 'bg-indigo-600/15 border-indigo-500/20 text-gray-100 rounded-tr-none shadow-md shadow-indigo-500/5'
                }`}
              >
                {isAssistant ? (
                  <MarkdownText text={msg.text} />
                ) : (
                  <p className="text-xs leading-relaxed font-semibold">{msg.text}</p>
                )}
                <span className="text-[9px] text-gray-600 block mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Streaming Thinking State */}
        {isChatLoading && (
          <div className="flex gap-4 justify-start">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="p-4 rounded-2xl bg-gray-900/40 border border-white/5 rounded-tl-none flex items-center gap-2">
              <span className="text-xs text-indigo-300 font-semibold animate-pulse">Consulting network registries...</span>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips & Input Form */}
      <div className="pt-4 border-t border-white/5 space-y-4 shrink-0">
        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(prompt)}
              disabled={isChatLoading}
              className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:text-indigo-300 px-3 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-45"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box form */}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isChatLoading}
            placeholder="Ask mentor: 'What tech stack is CognitiveOS scaling?' or 'Optimize my cold pitch'..."
            className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl py-4.5 pl-5 pr-14 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-600 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isChatLoading || !input.trim()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
