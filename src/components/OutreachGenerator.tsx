import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { INITIAL_STARTUPS } from '../data';
import { Mail, Linkedin, Twitter, Copy, Check, RefreshCw, Send, Sparkles, Loader2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OutreachGenerator() {
  const { outreachStartupId, user, addToast } = useStore();
  const [selectedId, setSelectedId] = useState(outreachStartupId || INITIAL_STARTUPS[0]?.id || '');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [generating, setGenerating] = useState(false);
  
  const [outreach, setOutreach] = useState<{
    coldEmail: string;
    linkedInMessage: string;
    twitterMessage: string;
  } | null>(null);

  // Copy success indicator state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (outreachStartupId) {
      setSelectedId(outreachStartupId);
    }
  }, [outreachStartupId]);

  const selectedStartup = INITIAL_STARTUPS.find(s => s.id === selectedId);

  const handleGenerate = async () => {
    if (!selectedId) {
      addToast('Please select a stealth startup target', 'warning');
      return;
    }

    setGenerating(true);
    setOutreach(null);

    try {
      const res = await fetch('/api/outreach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: selectedId,
          userProfile: user,
          targetRole
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Outreach generator offline');

      setOutreach(data);
      addToast('Tailored templates compiled successfully!', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          <span>Outreach Copilot</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Draft hyper-personalized, founder-oriented cold pitch copy tailored to private funding structures and technical pain points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Configurations Form Panel */}
        <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-5 h-fit backdrop-blur-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Outreach Parameters</h3>
          
          {/* Startup Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Startup</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              {INITIAL_STARTUPS.map(s => (
                <option key={s.id} value={s.id} className="bg-gray-950">{s.name}</option>
              ))}
            </select>
          </div>

          {/* Target Role Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Position</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {selectedStartup && (
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-[11px] leading-relaxed">
              <p className="text-indigo-300 font-bold uppercase tracking-wider text-[9px]">Target Signal Context</p>
              <p className="text-gray-200"><strong>Stage:</strong> {selectedStartup.fundingStage} ({selectedStartup.fundingAmount})</p>
              <p className="text-gray-400"><strong>Key Need:</strong> {selectedStartup.problemsIdentified[0]}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling Pitch...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate Campaign</span>
              </>
            )}
          </button>
        </div>

        {/* Results Showcase Panel - 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Empty State */}
            {!generating && !outreach && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center rounded-3xl border-2 border-dashed border-white/10 bg-gray-900/10 h-full flex flex-col items-center justify-center space-y-4"
              >
                <HelpCircle className="w-12 h-12 text-gray-500" />
                <h3 className="text-md font-bold text-white font-display">Awaiting Campaign Compilation</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
                  Configure your target startup and click "Generate Campaign" to let Gemini model construct tailor-made outreach copy.
                </p>
              </motion.div>
            )}

            {/* Loading Gifs / Pulses */}
            {generating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-md space-y-6 animate-pulse"
              >
                <div className="h-5 bg-white/10 rounded w-1/4" />
                <div className="h-24 bg-white/5 rounded-2xl w-full" />
                <div className="h-5 bg-white/10 rounded w-1/4 pt-6" />
                <div className="h-16 bg-white/5 rounded-2xl w-full" />
              </motion.div>
            )}

            {/* Tailored Campaign Presentation */}
            {!generating && outreach && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* 1. Cold Email */}
                <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 backdrop-blur-md relative space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>Channel: Cold Founder Email</span>
                    </span>
                    <button
                      onClick={() => handleCopy(outreach.coldEmail, 'email')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 flex items-center gap-1 text-[10px] font-bold"
                    >
                      {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto bg-gray-950/40 p-4 rounded-xl border border-white/5">
                    {outreach.coldEmail}
                  </pre>
                </div>

                {/* 2. LinkedIn Request (300 limit warning) */}
                <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 backdrop-blur-md relative space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      <Linkedin className="w-4 h-4 text-indigo-400" />
                      <span>Channel: LinkedIn Connection request (Max 300 Chars)</span>
                    </span>
                    <button
                      onClick={() => handleCopy(outreach.linkedInMessage, 'linkedin')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 flex items-center gap-1 text-[10px] font-bold"
                    >
                      {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-gray-950/40 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-300 leading-relaxed">{outreach.linkedInMessage}</p>
                    <span className={`text-[10px] block mt-3 text-right font-bold ${outreach.linkedInMessage.length > 300 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      Length: {outreach.linkedInMessage.length} / 300 characters
                    </span>
                  </div>
                </div>

                {/* 3. Twitter Message */}
                <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 backdrop-blur-md relative space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      <Twitter className="w-4 h-4 text-indigo-400" />
                      <span>Channel: X / Twitter Direct Pitch</span>
                    </span>
                    <button
                      onClick={() => handleCopy(outreach.twitterMessage, 'twitter')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 flex items-center gap-1 text-[10px] font-bold"
                    >
                      {copiedKey === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'twitter' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-gray-950/40 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-300 leading-relaxed">{outreach.twitterMessage}</p>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
