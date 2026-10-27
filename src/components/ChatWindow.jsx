import React, { useRef, useEffect } from 'react';
import { Lightbulb, Plus, Settings, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  messages,
  isStreaming,
  onNewChat,
  onOpenSettings,
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 safe-top select-none">
        {/* App Title & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-sm shadow-amber-500/10">
            <Lightbulb className="w-5 h-5 text-amber-400 fill-amber-400/30" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-1.5 leading-none">
              Light
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                AI
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight">Fast, luminous chat</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onNewChat}
            title="Start new chat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 transition cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="my-auto text-center py-12 px-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
                Welcome to Light
              </h2>
              <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                Your fast, intelligent AI companion powered by Groq. Ask questions, brainstorm ideas, write code, or just talk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full text-left">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  ⚡ &ldquo;Explain quantum computing in simple terms&rdquo;
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  💡 &ldquo;Give me 5 creative morning routines&rdquo;
                </div>
              </div>
            </div>
          ) : (
            /* Message Bubbles */
            messages.map((msg, index) => (
              <MessageBubble key={msg.id || index} message={msg} />
            ))
          )}

          {/* Typing Indicator while waiting for initial stream response */}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="ml-1 text-slate-400">Light is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
