import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, ExternalLink, Eye, EyeOff, Check, Zap, ShieldCheck } from 'lucide-react';
import { AVAILABLE_MODELS, DEFAULT_MODEL, getApiKey } from '../services/groq';

export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('groq_api_key') || '');
      setModel(localStorage.getItem('groq_model') || DEFAULT_MODEL);
      setSavedAlert(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEffectiveKey = apiKey.trim() || getApiKey();
  const hasKey = Boolean(currentEffectiveKey);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('groq_api_key', apiKey.trim());
    localStorage.setItem('groq_model', model);
    setSavedAlert(true);
    setTimeout(() => {
      onSave?.();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0a0f1d] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Ambient background glow inside modal */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Settings & Configuration
              </h2>
              <p className="text-xs text-slate-400">Configure your Groq API & AI model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Key Status Banner */}
          <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs border ${
            hasKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {hasKey ? 'API Key is connected & ready' : 'No API Key detected yet'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-black/30">
              {hasKey ? 'Active' : 'Setup Required'}
            </span>
          </div>

          {/* Groq API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Groq API Key
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-medium transition"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiKey ? 'gsk_...' : 'Paste custom Groq key (or leaves blank if using .env)'}
                className="w-full bg-[#060911] border border-slate-800 focus:border-amber-500/70 focus:shadow-[0_0_15px_rgba(245,158,11,0.15)] rounded-xl px-3.5 py-2.5 pr-10 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Stored locally on your machine. Never transmitted anywhere except directly to Groq.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              AI Model
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#060911] border border-slate-800 focus:border-amber-500/70 focus:shadow-[0_0_15px_rgba(245,158,11,0.15)] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition cursor-pointer"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              GPT OSS 120B offers premier intelligence. GPT OSS 20B provides instant, lightweight answers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer"
            >
              {savedAlert ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
