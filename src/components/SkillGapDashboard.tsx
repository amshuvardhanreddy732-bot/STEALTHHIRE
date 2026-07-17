import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GraduationCap, Code, Rocket, BookOpen, CheckCircle, ChevronRight, Play, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RoadmapNode {
  id: string;
  title: string;
  type: 'concept' | 'project' | 'course';
  desc: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'locked' | 'available' | 'completed';
}

export default function SkillGapDashboard() {
  const { user, updateProfile, addToast } = useStore();
  
  // Hardcoded roadmap nodes designed specifically to match FastAPI, Go, Rust and AI agent gaps
  const [nodes, setNodes] = useState<RoadmapNode[]>([
    {
      id: 'node-1',
      title: 'Advanced Async Python & FastAPI Frameworks',
      type: 'concept',
      desc: 'Master concurrency, async/await pipelines, and Pydantic validation structures in high-performance API architectures.',
      duration: '4 Hours',
      difficulty: 'Intermediate',
      status: 'available'
    },
    {
      id: 'node-2',
      title: 'Dockerizing FastAPI Worker nodes & Redis pipelines',
      type: 'project',
      desc: 'Hands-on: Build a local parallel image processor that parses webhook queues securely using task sandboxing.',
      duration: '8 Hours',
      difficulty: 'Intermediate',
      status: 'available'
    },
    {
      id: 'node-3',
      title: 'Rust System Integrations for WASM Edge Computing',
      type: 'course',
      desc: 'Deep-dive into Memory Safety, Concurrency primitives, and lock-free data registers in microgrid IoT controllers.',
      duration: '15 Hours',
      difficulty: 'Advanced',
      status: 'locked'
    },
    {
      id: 'node-4',
      title: 'Designing decentralized P2P telemetry networks',
      type: 'project',
      desc: 'Hands-on: Deploy a decentralized telemetry node using Rust and WebAssembly to ingest high-frequency IoT sensors.',
      duration: '12 Hours',
      difficulty: 'Advanced',
      status: 'locked'
    }
  ]);

  const handleCompleteNode = (id: string) => {
    const nodeIndex = nodes.findIndex(n => n.id === id);
    if (nodeIndex === -1) return;

    const updated = [...nodes];
    updated[nodeIndex].status = 'completed';

    // Unlock subsequent nodes if present
    if (nodeIndex + 1 < updated.length) {
      updated[nodeIndex + 1].status = 'available';
    }

    setNodes(updated);
    addToast('Task completed! Your Skill Score index is updating...', 'success');

    // Simulate update store skills score
    if (user) {
      const completedCount = updated.filter(n => n.status === 'completed').length;
      updateProfile({
        skills: [...user.skills, updated[nodeIndex].title.split(' ')[0]], // append seed skill
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Code className="w-5 h-5 text-indigo-400" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default:
        return <Rocket className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-400 animate-pulse" />
          <span>Stealth Skill Gap Diagnostics</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Bridge the exact technical discrepancies between your CV and unlisted startup profiles via sequential roadmaps.
        </p>
      </div>

      {/* Progress Metric Ring */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/20 to-transparent border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-md font-bold text-white font-display">Fast-Track Your Pre-Market Match Score</h3>
          <p className="text-xs text-gray-400 max-w-md">
            Complete the interactive training elements below. Each completion synchronizes with your profile score, boosting candidate match rankings within our active seed venture pools.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-2xl border border-white/5">
          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase font-semibold">Active Syllabus</span>
            <p className="text-2xl font-extrabold text-white">4 Modules</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase font-semibold">Completed</span>
            <p className="text-2xl font-extrabold text-indigo-400">
              {nodes.filter(n => n.status === 'completed').length} / 4
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Timeline Node Stack */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interactive Syllabus Timeline</h3>
        
        <div className="space-y-4">
          {nodes.map((node, i) => {
            const isCompleted = node.status === 'completed';
            const isAvailable = node.status === 'available';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : isAvailable
                    ? 'bg-gray-900/40 border-white/10'
                    : 'bg-gray-900/10 border-white/5 opacity-40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Indicator / Icon badge */}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : isAvailable
                      ? 'bg-indigo-500/10 border-indigo-500/20'
                      : 'bg-white/5 border-white/5'
                  }`}>
                    {getIcon(node.type)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-200">{node.title}</h4>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-gray-500 uppercase tracking-wide">
                        {node.type}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                        node.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {node.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-2xl">{node.desc}</p>
                    <span className="text-[10px] text-gray-500 block mt-2">Expected commitment: {node.duration}</span>
                  </div>
                </div>

                {/* Module action button */}
                <div className="shrink-0 w-full md:w-auto">
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 w-full md:w-auto justify-center">
                      <CheckCircle className="w-4 h-4" />
                      <span>Certified</span>
                    </div>
                  )}

                  {isAvailable && (
                    <button
                      onClick={() => handleCompleteNode(node.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {isLocked && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl cursor-not-allowed">
                      <span>Locked</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
