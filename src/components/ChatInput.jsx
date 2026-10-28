import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Zap, X } from 'lucide-react';

export default function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled,
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isStreaming) {
      onStopStreaming?.();
      return;
    }

    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter without Shift, allow Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-[#070b14]/90 backdrop-blur-xl border-t border-slate-800/80 px-4 sm:px-6 pt-3 pb-3 sm:pb-4 safe-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Floating Command Bar */}
        <div className="relative flex items-end gap-2 bg-slate-900/80 border border-slate-800 focus-within:border-amber-500/60 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.18)] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 transition-all duration-300 shadow-2xl">
          {/* Subtle Thunder indicator */}
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 self-end mb-1 border border-amber-500/20 select-none">
            <Zap className="w-4 h-4 fill-amber-400/30" />
          </div>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "Light is illuminating an answer..."
                : "Ask Light anything... (Enter to send, Shift + Enter for newline)"
            }
            rows={1}
            disabled={disabled && !isStreaming}
            className="flex-1 max-h-44 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-[15px] leading-relaxed resize-none focus:outline-none px-2.5 py-1.5 scrollbar-thin"
          />

          {/* Clear text button if input is populated */}
          {text.trim() && !isStreaming && (
            <button
              type="button"
              onClick={() => setText('')}
              title="Clear input"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition self-end mb-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Send or Stop Button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopStreaming}
              title="Stop generation"
              className="p-2 sm:p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm self-end"
            >
              <Square className="w-4 h-4 fill-current animate-pulse" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || disabled}
              title="Send message"
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer self-end ${
                text.trim() && !disabled
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold hover:from-amber-300 hover:to-amber-400 active:scale-95 shadow-md shadow-amber-500/25'
                  : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer Subtext Helper */}
        <div className="flex items-center justify-between mt-2 px-2 text-[11px] text-slate-500 select-none">
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Enter ↵</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Shift + Enter</kbd> for newline</span>
          <span className="ml-auto flex items-center gap-1 text-slate-400">
            Powered by <span className="font-semibold text-slate-300">Groq LPUs</span>
          </span>
        </div>
      </div>
    </div>
  );
}
