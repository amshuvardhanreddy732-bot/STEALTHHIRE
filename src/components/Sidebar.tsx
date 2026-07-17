import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutDashboard, Compass, FileSearch, GraduationCap, MessageSquareCode, MailCheck, UserCheck, ShieldAlert, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function Sidebar() {
  const { user, currentPage, setPage, logout } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'job-seeker' },
    { id: 'explorer', label: 'Startup Explorer', icon: Compass, role: 'job-seeker' },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileSearch, role: 'job-seeker' },
    { id: 'skill-gap', label: 'Skill Gap', icon: GraduationCap, role: 'job-seeker' },
    { id: 'mentor', label: 'AI Career Mentor', icon: MessageSquareCode, role: 'job-seeker' },
    { id: 'outreach', label: 'Outreach Copilot', icon: MailCheck, role: 'job-seeker' },
    { id: 'profile', label: 'Profile & Saved', icon: UserCheck, role: 'job-seeker' },
    { id: 'admin', label: 'Admin Logs', icon: ShieldAlert, role: 'admin' },
  ];

  const visibleItems = menuItems.filter(item => {
    if (item.role === 'admin') {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <aside className="w-64 bg-gray-950/60 border-r border-white/5 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Discovery Console
          </p>
          <ul className="mt-3 space-y-1.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setPage(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/10 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar-indicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-indigo-500"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5 mb-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-semibold text-gray-200 truncate">{user?.name || 'Evaluator Guest'}</h4>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || 'guest@stealthhire.ai'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
