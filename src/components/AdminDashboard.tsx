import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SystemLog } from '../types';
import { Shield, Database, Activity, RefreshCw, Cpu, Server, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { addToast } = useStore();
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalStartups: number;
    totalOpportunitiesSaved: number;
    platformAtsScoreAvg: number;
    apiUptime: string;
    systemLogsCount: number;
  } | null>(null);

  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      
      const logsRes = await fetch('/api/admin/logs');
      const logsData = await logsRes.json();

      if (statsRes.ok && logsRes.ok) {
        setStats(statsData.stats);
        setLogs(logsData.logs);
      }
    } catch {
      addToast('Failed to pull system logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleInjectStartupSignal = async () => {
    // Add toast visual feedback
    addToast('Injecting unlisted stealth seed round into predictive models...', 'info');
    
    // Simulate a server trigger and update state
    setTimeout(() => {
      if (stats) {
        setStats({
          ...stats,
          totalStartups: stats.totalStartups + 1,
          systemLogsCount: stats.systemLogsCount + 1
        });
      }
      
      const injectedLog: SystemLog = {
        id: `log-${Date.now()}`,
        message: 'ADMIN ACTION: Ingested private seed profile (Solana Labs grid project). Recalculating indexes.',
        level: 'info',
        timestamp: new Date().toISOString(),
        category: 'Ingestion'
      };
      setLogs(prev => [injectedLog, ...prev]);
      addToast('Seed signal injected! System metrics recalculated successfully.', 'success');
    }, 1200);
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'warn':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'all') return true;
    return log.level === activeTab;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2.5">
            <Shield className="w-8 h-8 text-indigo-400" />
            <span>Operational Admin Panel</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            System status monitoring page. Review live telemetry logs, monitor micro-service uptimes, and execute manual cache overrides.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-all"
            title="Refresh logs feed"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          
          <button
            onClick={handleInjectStartupSignal}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Inject Startup Signal</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Active Startups</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{stats.totalStartups} Profiles</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">System Uptime</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{stats.apiUptime}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Saved Opportunities</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{stats.totalOpportunitiesSaved} Active</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Platform Users</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{stats.totalUsers} Members</h3>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry log output table */}
      <div className="p-6 rounded-3xl bg-gray-900/40 border border-white/5 space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live System Telemetry</h3>
          
          {/* Severity tabs */}
          <div className="flex gap-1.5">
            {(['all', 'info', 'warn', 'error'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all border ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Ingest Box */}
        <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-500 animate-pulse">Pulling telemetry logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">No logs captured matching severity filter.</div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3 bg-gray-950/40 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[11px]"
              >
                <div className="flex items-start gap-2.5">
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase tracking-wider shrink-0 border ${getLogLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-300 leading-normal">{log.message}</p>
                    <span className="text-[9px] text-gray-500 mt-0.5 block">Category: {log.category}</span>
                  </div>
                </div>

                <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 md:text-right font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
