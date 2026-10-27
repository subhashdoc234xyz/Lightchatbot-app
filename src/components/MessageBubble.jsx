import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, User, AlertCircle } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
      <div className={`flex max-w-[88%] md:max-w-[75%] gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm ${
            isUser
              ? 'bg-amber-500 text-slate-950 font-bold'
              : isError
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Lightbulb className="w-4 h-4 fill-amber-300/30 text-amber-300" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
            isUser
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none'
              : isError
              ? 'bg-red-950/40 border border-red-800/50 text-red-200 rounded-tl-none'
              : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : isError ? (
            <div className="flex items-start gap-2">
              <span className="text-red-300">{message.content}</span>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none space-y-2 prose-p:my-1 prose-pre:my-2 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-code:text-amber-300">
              <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
