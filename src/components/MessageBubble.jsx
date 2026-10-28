import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Zap, User, AlertCircle, Copy, Check, Terminal } from 'lucide-react';

// Code block with Copy button and language header
function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-slate-800/90 bg-[#070b14] shadow-lg group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 overflow-x-auto text-[13px] leading-relaxed font-mono text-slate-200">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

export default function MessageBubble({ message, isLastAssistant, isStreaming }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error('Failed to copy message', e);
    }
  };

  return (
    <div
      className={`group flex w-full my-3.5 transition-all duration-300 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex max-w-[92%] sm:max-w-[82%] md:max-w-[75%] gap-2.5 sm:gap-3 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar Badge with Luminous Glow */}
        <div
          className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-semibold select-none transition-transform duration-300 group-hover:scale-105 ${
            isUser
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : isError
              ? 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/10'
              : 'bg-slate-900 border border-amber-400/30 text-amber-400 shadow-md shadow-amber-500/10'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          )}
        </div>

        {/* Message Bubble Body */}
        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg break-words transition-all duration-200 ${
              isUser
                ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-sm shadow-amber-500/15'
                : isError
                ? 'bg-red-950/30 border border-red-800/60 text-red-200 rounded-tl-sm backdrop-blur-md'
                : 'bg-slate-900/70 border border-slate-800/80 text-slate-100 rounded-tl-sm backdrop-blur-md hover:border-slate-700/80 shadow-black/40'
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] font-normal leading-relaxed">
                {message.content}
              </div>
            ) : isError ? (
              <div className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="text-red-300">{message.content}</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-[14px] sm:text-[15px] leading-relaxed space-y-2">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      if (!inline) {
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                      }
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 font-mono text-[12px] sm:text-[13px] border border-amber-400/20"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="my-1.5 leading-relaxed text-slate-200">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="my-2 space-y-1 list-disc pl-4 text-slate-200">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="my-2 space-y-1 list-decimal pl-4 text-slate-200">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="text-slate-200 marker:text-amber-400">{children}</li>;
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="my-2 pl-3.5 border-l-2 border-amber-400/70 text-slate-300 italic bg-amber-400/[0.03] py-1 rounded-r-lg">
                          {children}
                        </blockquote>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="my-3 overflow-x-auto rounded-xl border border-slate-800">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">{children}</thead>;
                    },
                    th({ children }) {
                      return <th className="px-3 py-2 font-semibold">{children}</th>;
                    },
                    td({ children }) {
                      return <td className="px-3 py-2 border-b border-slate-800/50 text-slate-300">{children}</td>;
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition"
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {/* Animated cursor when this message is actively streaming */}
                {isLastAssistant && isStreaming && (
                  <span className="cursor-blink inline-block w-1.5 h-4 ml-1 bg-amber-400 rounded-sm translate-y-0.5" />
                )}
              </div>
            )}
          </div>

          {/* Action Toolbar below assistant message */}
          {!isUser && !isError && message.content && (
            <div className="flex items-center gap-1.5 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={handleCopyMessage}
                title="Copy full message"
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy message</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
