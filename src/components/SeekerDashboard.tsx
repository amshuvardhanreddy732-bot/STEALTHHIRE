import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, TrendingUp, Compass, Award, Calendar, ExternalLink, ArrowRight, CheckCircle2, ChevronRight, FileSearch } from 'lucide-react';
import { INITIAL_STARTUPS } from '../data';

export default function SeekerDashboard() {
  const { user, setPage, toggleBookmark, bookmarks } = useStore();

  // Pick some top matches
  const matchedStartups = INITIAL_STARTUPS.filter((startup) => {
    // Basic match check based on user skills
    const matchCount = startup.techStack.filter(skill => user?.skills.includes(skill)).length;
    return matchCount > 0 || startup.matchScore > 70;
  });

  const isBookmarked = (id: string) => bookmarks.some(b => b.startupId === id);

  const stats = [
    { label: 'Profile Score', value: `${user?.profileComplete || 0}%`, sub: 'Parsed via Resume', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Matching Stealth Signals', value: matchedStartups.length, sub: 'Based on your stack', icon: Compass, color: 'text-indigo-400' },
    { label: 'Hiring Prediction Probability', value: '92%', sub: 'Pre-market advantage', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Technical Skill Rating', value: `${user?.skillScore || 0}%`, sub: 'Calculated index', icon: Award, color: 'text-amber-400' },
  ];

  // AI-generated predictive insights
  const aiInsights = [
    {
      title: 'Hiring Signal: CognitiveOS',
      desc: 'Our monitoring systems flagged a massive Series A led by Sequoia. Their primary engineering lead is updating their backend infrastructure with FastAPI. This matches your React + Node/TypeScript stack perfectly.',
      actionLabel: 'Generate Outreach Template',
      targetPage: 'outreach',
      targetId: '1',
      badge: 'Immediate Priority'
    },
    {
      title: 'Infrastructure Alert: Helios Climate',
      desc: 'Helios Climate Grid just registered a new AWS VPC cluster in the us-east-1 region, indicating a Brooklyn pilot scale-out. Adding Go or gRPC to your skill matrix will trigger a 94% match rate.',
      actionLabel: 'Check Skill Gaps',
      targetPage: 'skill-gap',
      badge: 'Recommended Skill'
    }
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-950/40 to-transparent p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Welcome, {user?.name || 'Vanguard Member'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Stealth pipeline active: We identified <span className="text-indigo-300 font-semibold">{INITIAL_STARTUPS.length} hidden funding events</span> matching your preferences.
          </p>
        </div>
        <button
          onClick={() => setPage('resume-analyzer')}
          className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-4 py-2.5 text-xs font-semibold text-indigo-300 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Scan Latest CV</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl bg-gray-900/35 border border-white/5 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h2>
              <p className="text-[11px] text-gray-500 mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: AI Recommendations vs Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: AI Signals & Weekly Digest */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Real-Time AI Signal Diagnostics</span>
            </h3>
            
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-indigo-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold text-indigo-400 border-l border-b border-white/5 uppercase tracking-wider">
                    {insight.badge}
                  </div>
                  <h4 className="text-md font-bold text-gray-200 pr-16">{insight.title}</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{insight.desc}</p>
                  
                  <button
                    onClick={() => setPage(insight.targetPage as any, insight.targetId)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Bookmarks / Matching start-ups */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white font-display">Target Pre-Market Startups</h3>
              <button onClick={() => setPage('explorer')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View All Startups</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {matchedStartups.slice(0, 2).map((startup) => (
                <div key={startup.id} className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-lg ${startup.logo} flex items-center justify-center font-bold text-xs text-white`}>
                          {startup.name[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{startup.name}</h4>
                          <span className="text-[10px] text-gray-400">{startup.industry}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 uppercase tracking-wide">
                        Match: {startup.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-normal">{startup.tagline}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Hiring Signal</p>
                      <span className="text-xs font-bold text-white">{startup.hiringProbability}</span>
                    </div>
                    <button
                      onClick={() => setPage('explorer', startup.id)}
                      className="rounded-xl bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-gray-200 transition-all border border-white/5 cursor-pointer"
                    >
                      Analyze Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Weekly Digest & Speed CTAs */}
        <div className="space-y-8">
          {/* Weekly Opportunity Digest */}
          <div className="p-6 rounded-3xl bg-gray-900/50 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-md font-bold text-white font-display">Weekly Opportunity Digest</h3>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Our automated crawlers compiled early hiring markers for the week of July 17, 2026.
            </p>

            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Series A filings detected</p>
                  <p className="text-[11px] text-gray-500">2 deep tech teams completed unregistered Series A equity pipelines.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">AWS Cluster triggers</p>
                  <p className="text-[11px] text-gray-500">3 SaaS teams expanded Kubernetes nodes, indicating engineering scaling.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">ATS Key Term Migrations</p>
                  <p className="text-[11px] text-gray-500">FastAPI, Rust, and LLM orchestration are experiencing a 300% surge.</p>
                </div>
              </li>
            </ul>

            <button
              onClick={() => setPage('explorer')}
              className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Scan Active Signals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Block */}
          <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-xl" />
            
            <h4 className="text-md font-bold text-white font-display mb-2">Resume Compatibility</h4>
            <p className="text-xs text-indigo-200/80 leading-normal mb-5">
              Upload your resume and links to generate predictive match indexes against our stealth database profiles.
            </p>

            <button
              onClick={() => setPage('resume-analyzer')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <FileSearch className="w-4 h-4" />
              <span>ATS Resume Analyzer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
