import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Startup } from '../types';
import { Search, SlidersHorizontal, MapPin, DollarSign, BrainCircuit, Network, Calendar, HelpCircle, Mail, Bookmark, ExternalLink, X, PlusCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StartupExplorer() {
  const { user, selectedStartupId, setPage, toggleBookmark, bookmarks, addToast } = useStore();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local filters matching the store criteria
  const [search, setSearch] = useState('');
  const [fundingStage, setFundingStage] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [probability, setProbability] = useState('');
  const [remote, setRemote] = useState<boolean | null>(null);
  
  // Modal detail view
  const [activeDetailStartup, setActiveDetailStartup] = useState<Startup | null>(null);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (fundingStage) queryParams.append('fundingStage', fundingStage);
      if (industry) queryParams.append('industry', industry);
      if (location) queryParams.append('location', location);
      if (probability) queryParams.append('hiringProbability', probability);
      if (remote !== null) queryParams.append('remote', String(remote));

      const res = await fetch(`/api/startups?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setStartups(data.startups);
      }
    } catch {
      addToast('Failed to sync startups from stealth network', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [search, fundingStage, industry, location, probability, remote]);

  // Handle selected startup from dashboard
  useEffect(() => {
    if (selectedStartupId) {
      const matched = startups.find(s => s.id === selectedStartupId);
      if (matched) {
        setActiveDetailStartup(matched);
      } else {
        // Query individually if needed
        fetch(`/api/startups/${selectedStartupId}`)
          .then(res => res.json())
          .then(data => {
            if (data.startup) setActiveDetailStartup(data.startup);
          });
      }
    }
  }, [selectedStartupId, startups]);

  const isBookmarked = (id: string) => bookmarks.some(b => b.startupId === id);

  return (
    <div className="p-6 md:p-8 space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">Startup Discovery Explorer</h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse and filter stealth startup signals analyzed by funding tiers and growth rates.
          </p>
        </div>
      </div>

      {/* Faceted Search & Filters */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Filters Rail */}
        <div className="p-6 rounded-3xl bg-gray-950/60 border border-white/5 space-y-6 h-fit backdrop-blur-md">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Faceted Filters</span>
            </h3>
            <button
              onClick={() => {
                setSearch('');
                setFundingStage('');
                setIndustry('');
                setLocation('');
                setProbability('');
                setRemote(null);
              }}
              className="text-xs font-semibold text-gray-500 hover:text-indigo-400 transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="React, Sequoia, FastAPI..."
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Funding Tiers */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Funding Stage</label>
            <select
              value={fundingStage}
              onChange={(e) => setFundingStage(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="" className="bg-gray-950">All Tiers</option>
              <option value="Pre-seed" className="bg-gray-950">Pre-seed</option>
              <option value="Seed" className="bg-gray-950">Seed Round</option>
              <option value="Series A" className="bg-gray-950">Series A</option>
              <option value="Series B" className="bg-gray-950">Series B</option>
              <option value="Series C+" className="bg-gray-950">Series C+</option>
            </select>
          </div>

          {/* Hiring Probability */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hiring Signal Confidence</label>
            <select
              value={probability}
              onChange={(e) => setProbability(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="" className="bg-gray-950">All Confidences</option>
              <option value="Very High" className="bg-gray-950">Very High Probability</option>
              <option value="High" className="bg-gray-950">High Probability</option>
              <option value="Medium" className="bg-gray-950">Medium Probability</option>
              <option value="Low" className="bg-gray-950">Low Probability</option>
            </select>
          </div>

          {/* Location Focus */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location / Hub</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="" className="bg-gray-950">Global / Remote</option>
              <option value="San Francisco" className="bg-gray-950">San Francisco Bay Area</option>
              <option value="Brooklyn" className="bg-gray-950">New York / Brooklyn</option>
              <option value="Boston" className="bg-gray-950">Boston Biotech Hub</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fully Remote Setup</span>
            <button
              onClick={() => setRemote(remote === null ? true : remote === true ? false : null)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-all ${
                remote === true
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : remote === false
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {remote === true ? 'Remote Only' : remote === false ? 'Onsite Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Bento Results Grid */}
        <div className="xl:col-span-3 space-y-6">
          
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-6 rounded-3xl bg-gray-900/30 border border-white/5 h-64 animate-pulse flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 bg-white/5 rounded-2xl" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/5 rounded w-1/3" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-16 bg-white/5 rounded-xl w-full" />
                  </div>
                  <div className="h-8 bg-white/5 rounded-xl w-1/4" />
                </div>
              ))}
            </div>
          ) : startups.length === 0 ? (
            <div className="p-12 text-center bg-gray-900/10 border border-white/5 rounded-3xl">
              <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No Stealth Signals Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
                No private startup registrations matched your current search parameters. Try clearing some faceted filters.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {startups.map((startup) => (
                <div
                  key={startup.id}
                  className="p-6 rounded-3xl bg-gray-900/35 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Upper Row */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex gap-3">
                        <div className={`h-12 w-12 rounded-2xl ${startup.logo} flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-black/30`}>
                          {startup.name[0]}
                        </div>
                        <div>
                          <h3 className="text-md font-bold text-white group-hover:text-indigo-300 transition-colors">{startup.name}</h3>
                          <span className="text-xs text-gray-400">{startup.industry}</span>
                        </div>
                      </div>

                      {/* Score Gauge */}
                      <div className="flex flex-col items-end">
                        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1 text-[10px] font-extrabold text-indigo-400">
                          Match: {startup.matchScore}%
                        </span>
                        <span className="text-[9px] text-gray-500 mt-1">{startup.growthRate} Growth</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-gray-200 line-clamp-1">{startup.tagline}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-3">{startup.description}</p>
                    
                    {/* Technology tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {startup.techStack.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                          {tech}
                        </span>
                      ))}
                      {startup.techStack.length > 4 && (
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                          +{startup.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-300">
                      <DollarSign className="w-4 h-4 text-indigo-400" />
                      <span>{startup.fundingAmount} ({startup.fundingStage})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(startup.id);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked(startup.id)
                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                        title="Bookmark opportunity"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveDetailStartup(startup)}
                        className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600 px-4 py-2 text-xs font-bold text-indigo-300 hover:text-white transition-all cursor-pointer"
                      >
                        Details & Predictions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Startup Details Modal Component */}
      <AnimatePresence>
        {activeDetailStartup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailStartup(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-gray-900 border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative p-6 md:p-8 space-y-6 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDetailStartup(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title Row */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className={`h-16 w-16 rounded-2xl ${activeDetailStartup.logo} flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-black/40`}>
                    {activeDetailStartup.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white font-display flex items-center gap-2">
                      <span>{activeDetailStartup.name}</span>
                      <a href={activeDetailStartup.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </h2>
                    <p className="text-indigo-300 text-sm font-semibold mt-0.5">{activeDetailStartup.industry} • {activeDetailStartup.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Hiring Advantage</p>
                    <p className="text-xs font-extrabold text-white">{activeDetailStartup.hiringProbability} Probability</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Predictive Match</p>
                    <p className="text-xs font-extrabold text-indigo-400">{activeDetailStartup.matchScore}% Compatibility</p>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <blockquote className="border-l-2 border-indigo-500 pl-4 py-1 italic text-gray-300 text-sm">
                "{activeDetailStartup.tagline}"
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                
                {/* Left 2 Columns */}
                <div className="md:col-span-2 space-y-6">
                  {/* Company Overview */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Stealth Analysis Overview</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeDetailStartup.description}</p>
                  </div>

                  {/* Identified Problems */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                      <BrainCircuit className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Identified Growth Obstacles (Hiring Drivers)</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {activeDetailStartup.problemsIdentified.map((prob, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-gray-400 leading-normal">
                          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Funding Timeline */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Funding Timeline History</span>
                    </h4>
                    <div className="space-y-4 relative border-l border-white/5 ml-2.5 pl-5">
                      {activeDetailStartup.fundingTimeline.map((item, i) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-7 top-1 h-3.5 w-3.5 rounded-full bg-indigo-500/20 border-2 border-indigo-500" />
                          <p className="text-xs font-bold text-white">{item.stage} — {item.amount}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Dispatched: {item.date} • Lead Investor: {item.investor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 1 Column */}
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5 h-fit">
                  {/* Detailed Tech Stack */}
                  <div>
                    <h4 className="text-xs font-extrabold text-white mb-3 uppercase tracking-wider">Technology Stack Detail</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{activeDetailStartup.technologyStackDetail}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetailStartup.techStack.map((tech, idx) => (
                        <span key={idx} className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-semibold text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Required Skills to Match */}
                  <div>
                    <h4 className="text-xs font-extrabold text-white mb-2 uppercase tracking-wider">Required Skills Gaps</h4>
                    <div className="space-y-1.5">
                      {activeDetailStartup.recommendedSkills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400">{skill}</span>
                          {user?.skills.includes(skill) ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" /> Matched
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold">Unacquired</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outreach Call to Action */}
                  <button
                    onClick={() => {
                      setActiveDetailStartup(null);
                      setPage('outreach', activeDetailStartup.id);
                    }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Generate Cold Pitch</span>
                  </button>
                </div>

              </div>

              {/* Latest News Articles */}
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Stealth Network News Signal</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeDetailStartup.latestNews.map((news, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h5 className="text-xs font-bold text-gray-200 line-clamp-1">{news.title}</h5>
                        <span className="text-[9px] text-indigo-400 shrink-0 font-semibold">{news.source}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{news.summary}</p>
                      <span className="text-[9px] text-gray-500 block mt-2">{news.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
