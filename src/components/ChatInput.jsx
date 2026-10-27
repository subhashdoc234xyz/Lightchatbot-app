import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

export default function ChatInput({ onSendMessage, onStopStreaming, isStreaming, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
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
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 p-3 sm:p-4 safe-bottom">
      <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-950/80 border border-slate-800 focus-within:border-amber-500/60 rounded-2xl p-2 transition-all shadow-lg">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? "Light is thinking..." : "Ask Light anything... (Enter to send)"}
          rows={1}
          disabled={disabled && !isStreaming}
          className="flex-1 max-h-40 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none px-2 py-1.5"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStopStreaming}
            title="Stop generating"
            className="p-2 sm:p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            title="Send message"
            className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              text.trim() && !disabled
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
