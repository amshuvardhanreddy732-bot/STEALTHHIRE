import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UploadCloud, FileText, Github, Linkedin, Globe, Sparkles, CheckCircle, BrainCircuit, ListCollapse, Award, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ResumeAnalyzer() {
  const { user, updateProfile, addToast } = useStore();
  const [resumeText, setResumeText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [stepMsg, setStepMsg] = useState('');
  const [results, setResults] = useState<{
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestedImprovements: string[];
    detectedSkills: string[];
  } | null>(null);

  const steps = [
    'Initializing secure sandbox...',
    'Parsing file layout & formatting blocks...',
    'Extracting technical skill matrices...',
    'Cross-referencing 4 high-growth startup profiles...',
    'Running predictive model matching index...',
    'Synthesizing critique via Gemini engine...'
  ];

  const runMockLoadingAndQuery = async () => {
    if (!resumeText.trim()) {
      addToast('Please input your resume text to begin analysis', 'warning');
      return;
    }
    
    setAnalyzing(true);
    setResults(null);
    
    // Cycle through messages to give an Apple-like polished feel
    for (let i = 0; i < steps.length; i++) {
      setStepMsg(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, githubUrl, linkedinUrl, portfolioUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis model offline');

      setResults(data);
      addToast('Resume scanned successfully!', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-indigo-400" />
          <span>ATS Resume Analyzer</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Scan your background details against stealth hiring profiles to obtain diagnostic scores and recommended improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Inputs Panel - 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-5 backdrop-blur-md">
            
            {/* Input Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Portfolio Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="GitHub Link"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="LinkedIn Link"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="Portfolio Link"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Resume Text Input Ingestion */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Copy/Paste Resume Text</span>
                <span className="text-[10px] text-gray-500 font-medium">Plain Text Format</span>
              </h3>
              
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste the full contents of your CV / resume here..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-mono leading-relaxed placeholder:text-gray-700"
              />
            </div>

            {/* Action Trigger */}
            <button
              onClick={runMockLoadingAndQuery}
              disabled={analyzing}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <BrainCircuit className="w-5 h-5 animate-pulse" />
              <span>{analyzing ? 'Analyzing background...' : 'Launch AI Diagnostics'}</span>
            </button>

          </div>
        </div>

        {/* Results Panel - 5 Columns */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            
            {/* 1. Idle State */}
            {!analyzing && !results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[350px] p-8 rounded-3xl border-2 border-dashed border-white/15 bg-gray-900/10 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-md font-bold text-white font-display">Awaiting AI Diagnostic Input</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-normal">
                  Paste your resume details and click "Launch AI Diagnostics" to trigger deep neural-net compatibility scans.
                </p>
              </motion.div>
            )}

            {/* 2. Analyzing State (Pulsing Skeleton) */}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-md flex flex-col justify-between h-full min-h-[350px]"
              >
                <div className="space-y-6">
                  <div className="flex gap-4 items-center animate-pulse">
                    <div className="h-12 w-12 bg-white/10 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <div className="h-2 bg-white/5 rounded w-full" />
                    <div className="h-2 bg-white/5 rounded w-5/6" />
                    <div className="h-2 bg-white/5 rounded w-4/5" />
                  </div>
                </div>

                <div className="text-center pt-8">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 mb-3">
                    <BrainCircuit className="w-4 h-4 animate-spin" />
                  </div>
                  <h4 className="text-xs font-bold text-indigo-300">{stepMsg}</h4>
                </div>
              </motion.div>
            )}

            {/* 3. Results Diagnostics View */}
            {!analyzing && results && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-2xl space-y-6 h-fit"
              >
                {/* Visual ATS Ring Header */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-20 h-20">
                      <circle cx="40" cy="40" r="34" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-indigo-500"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="213"
                        strokeDashoffset={213 - (213 * results.atsScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-md font-extrabold text-white">{results.atsScore}%</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Neural ATS Matching Index</h3>
                    <p className="text-xs text-gray-500 mt-1">Excellent stack coverage. Highlight optimization areas.</p>
                  </div>
                </div>

                {/* Parsed Technical Skills */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span>Parsed Skill Matrix</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {results.detectedSkills.map((skill, i) => (
                      <span key={i} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Strengths */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Top Career Strengths</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {results.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="text-[11px] text-gray-400 leading-normal flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Core Gaps */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <ListCollapse className="w-4 h-4 text-amber-400" />
                    <span>Identified Weaknesses & Gaps</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {results.weaknesses.slice(0, 3).map((weak, i) => (
                      <li key={i} className="text-[11px] text-gray-400 leading-normal flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actionable recommendations */}
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wide mb-2">Suggested Optimizations</h4>
                  <ul className="space-y-1.5">
                    {results.suggestedImprovements.slice(0, 2).map((improve, i) => (
                      <li key={i} className="text-[10px] text-gray-400 leading-normal flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">→</span>
                        <span>{improve}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
