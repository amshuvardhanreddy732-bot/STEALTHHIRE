import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { INITIAL_STARTUPS } from '../data';
import { UserCheck, Tag, Plus, Mail, ArrowRight, Trash2, Award, Briefcase, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
  const { user, bookmarks, toggleBookmark, updateProfile, setPage, addToast } = useStore();
  const [newSkill, setNewSkill] = useState('');

  const savedList = bookmarks.map(bookmark => {
    const startup = INITIAL_STARTUPS.find(s => s.id === bookmark.startupId);
    return {
      bookmark,
      startup
    };
  }).filter(item => item.startup !== undefined);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !user) return;
    if (user.skills.includes(newSkill.trim())) {
      addToast('Skill already present in matrix', 'warning');
      return;
    }
    const updatedSkills = [...user.skills, newSkill.trim()];
    updateProfile({ skills: updatedSkills });
    setNewSkill('');
    addToast(`Added ${newSkill.trim()} skill tag!`, 'success');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!user) return;
    const updatedSkills = user.skills.filter(s => s !== skill);
    updateProfile({ skills: updatedSkills });
    addToast(`Removed ${skill} skill tag`, 'info');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-indigo-400" />
          <span>Profile & Opportunity Hub</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Review your stealth profile metadata, manage technical credentials, and coordinate bookmarked startup outreach tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: User stats & skill manager (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* User metadata */}
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl text-white">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div>
                <h3 className="text-md font-bold text-white font-display">{user?.name || 'Vanguard Member'}</h3>
                <p className="text-xs text-gray-500">{user?.email || 'amshuvardhanreddy732@gmail.com'}</p>
                <span className="inline-block rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wide mt-2">
                  Role: {user?.role || 'Job Seeker'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Match Score</p>
                <p className="text-xl font-extrabold text-white">{user?.skillScore || 0}%</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">CV Compatibility</p>
                <p className="text-xl font-extrabold text-indigo-400">{user?.atsScore || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Active Skills matrix tags list */}
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-4 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4.5 h-4.5 text-indigo-400" />
              <span>Technical Skills Inventory</span>
            </h3>

            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-1.5 min-h-[50px] bg-white/5 p-3 rounded-2xl border border-white/5">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, i) => (
                  <span
                    key={i}
                    onClick={() => handleRemoveSkill(skill)}
                    className="group rounded-lg bg-indigo-500/10 hover:bg-rose-500/10 hover:text-rose-400 border border-indigo-500/20 hover:border-rose-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 cursor-pointer transition-all flex items-center gap-1.5"
                    title="Click to remove"
                  >
                    <span>{skill}</span>
                    <span className="text-[9px] text-indigo-400 group-hover:text-rose-400 font-bold">×</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-600 italic">No skills registered. Run the CV analyzer.</span>
              )}
            </div>

            {/* Form to append skills */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill tag, e.g. FastAPI, Go"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right: Bookmarks opportunity matrix (7 columns) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-4 backdrop-blur-md h-full">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bookmarked Stealth Startups</h3>
            
            {savedList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">No startups currently bookmarked.</p>
                <button
                  onClick={() => setPage('explorer')}
                  className="mt-4 text-xs font-bold text-indigo-400 hover:underline"
                >
                  Explore Stealth List
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedList.map((item) => (
                  <div
                    key={item.startup!.id}
                    className="p-5 rounded-2xl bg-gray-950/50 border border-white/5 hover:border-white/10 transition-all flex justify-between items-center"
                  >
                    <div className="truncate pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-lg ${item.startup!.logo} flex items-center justify-center font-bold text-xs text-white shrink-0`}>
                          {item.startup!.name[0]}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{item.startup!.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{item.startup!.industry}</p>
                        </div>
                      </div>
                      {item.bookmark.notes && (
                        <p className="text-[10px] text-indigo-300 italic truncate mt-2">"{item.bookmark.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPage('outreach', item.startup!.id)}
                        className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400 transition-all border border-indigo-500/20"
                        title="Generate pitch campaign"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(item.startup!.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 transition-all border border-rose-500/20"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
