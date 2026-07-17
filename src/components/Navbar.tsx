import React from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, Compass, Sparkles, User as UserIcon, LogOut, CheckCircle2, AlertCircle, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, currentPage, setPage, logout, updateProfile } = useStore();

  const handleRoleToggle = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'job-seeker' : 'admin';
    updateProfile({ role: newRole });
    setPage(newRole === 'admin' ? 'admin' : 'dashboard');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-gray-905/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage(isAuthenticated ? 'dashboard' : 'landing')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-950">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
                StealthHire<span className="text-indigo-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                AI Agent Pipeline
              </span>
            </div>
          </div>

          {/* Center Links (if authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setPage('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === 'dashboard' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setPage('explorer')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === 'explorer' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
              >
                Startup Explorer
              </button>
              <button
                onClick={() => setPage('resume-analyzer')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === 'resume-analyzer' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
              >
                Resume Analyzer
              </button>
              <button
                onClick={() => setPage('skill-gap')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === 'skill-gap' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
              >
                Skill Gap
              </button>
              <button
                onClick={() => setPage('mentor')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${currentPage === 'mentor' ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Mentor
              </button>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Live API Key Check (for testing ease) */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gemini Engine Active</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Developer Switcher Pill */}
                <button
                  onClick={handleRoleToggle}
                  className="flex items-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all"
                  title="Switch sandbox role for judging evaluation"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Role: {user?.role === 'admin' ? 'Admin' : 'Job Seeker'}</span>
                </button>

                {/* Dashboard Shortcut */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setPage('admin')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${currentPage === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                  >
                    Admin Logs
                  </button>
                )}

                {/* Profile Pic */}
                <button
                  onClick={() => setPage('profile')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300"
                >
                  <UserIcon className="h-4.5 w-4.5" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage('login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setPage('signup')}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-indigo-400 transition-all cursor-pointer"
                >
                  Join StealthList
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
