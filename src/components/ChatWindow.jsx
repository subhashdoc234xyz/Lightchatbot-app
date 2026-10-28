import React, { useRef, useEffect } from 'react';
import { Zap, Plus, Settings, Sparkles, Code2, BrainCircuit, BookOpen, PenTool } from 'lucide-react';
import MessageBubble from './MessageBubble';

const SUGGESTIONS = [
  {
    icon: Code2,
    category: 'Code',
    title: 'Modern React Hook',
    prompt: 'Write a custom React hook for debouncing search input with TypeScript types.',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
  },
  {
    icon: BrainCircuit,
    category: 'Brainstorm',
    title: 'SaaS Architecture',
    prompt: 'Outline a modern scalable architecture for an AI real-time chat application.',
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300',
  },
  {
    icon: BookOpen,
    category: 'Explain',
    title: 'Quantum Physics',
    prompt: 'Explain quantum superposition and entanglement in simple, intuitive terms.',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  },
  {
    icon: PenTool,
    category: 'Write',
    title: 'Executive Summary',
    prompt: 'Write a compelling product launch announcement email for a high-performance developer tool.',
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-300',
  },
];

export default function ChatWindow({
  messages,
  isStreaming,
  onNewChat,
  onOpenSettings,
  onSelectPrompt,
  currentModelName = 'GPT OSS 120B',
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or streaming updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden ambient-bg relative">
      {/* Top ambient glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-800/80 safe-top select-none window-drag">
        {/* App Title & Glowing Thunder Logo */}
        <div className="flex items-center gap-3 window-no-drag">
          <div className="relative group cursor-pointer" onClick={onOpenSettings} title="Light AI Settings">
            {/* Animated glowing thunder badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-yellow-500/5 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-[0_0_28px_rgba(245,158,11,0.4)]">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-pulse" />
            </div>
            {/* Pulse ring */}
            <span className="absolute -inset-0.5 rounded-2xl bg-amber-500/20 blur-sm -z-10 group-hover:opacity-100 opacity-60 transition duration-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-1.5 leading-none">
                Light
              </h1>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
              <span>Luminous speed powered by Groq</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 window-no-drag">
          {/* Quick Model Pill */}
          <button
            onClick={onOpenSettings}
            title="Active Model (Click to change)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 group-hover:scale-110 transition-transform" />
            <span className="text-slate-200">{currentModelName}</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            title="Start new conversation"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-[0_0_16px_rgba(245,158,11,0.12)]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Open Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.length === 0 ? (
            /* Welcome / Empty Hero State */
            <div className="my-auto py-8 sm:py-12 px-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
              {/* Glowing Hero Thunder Badge */}
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-yellow-500/5 border border-amber-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-transform duration-500 hover:scale-105">
                  <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-amber-500/15 blur-xl -z-10 animate-pulse" />
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2.5">
                Illuminate Your Thoughts
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8 leading-relaxed font-normal">
                Ultra-fast, intelligent conversations powered by Groq LPU silicon. Ask anything, generate code, or explore ideas instantly.
              </p>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full text-left">
                {SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt?.(item.prompt)}
                      type="button"
                      className="group p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-200 cursor-pointer text-left shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-gradient-to-r ${item.color}`}>
                          {item.category}
                        </span>
                        <Icon className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[12px] text-slate-400 line-clamp-2 mt-1 group-hover:text-slate-300 leading-snug">
                        &ldquo;{item.prompt}&rdquo;
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Feature Highlights Pills */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Instant LPU Generation
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Context-Aware Chat
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
                  <Code2 className="w-3 h-3 text-emerald-400" />
                  Formatted Code Blocks
                </span>
              </div>
            </div>
          ) : (
            /* Render Message Bubbles */
            messages.map((msg, index) => (
              <MessageBubble
                key={msg.id || index}
                message={msg}
                isLastAssistant={index === messages.length - 1 && msg.role === 'assistant'}
                isStreaming={isStreaming}
              />
            ))
          )}

          {/* Thinking / Waiting for stream start indicator */}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-3 px-4 my-2 rounded-2xl bg-slate-900/60 border border-slate-800/60 w-fit backdrop-blur-md animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.3s]" />
                <span className="ml-2 font-medium text-slate-300">Light is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
