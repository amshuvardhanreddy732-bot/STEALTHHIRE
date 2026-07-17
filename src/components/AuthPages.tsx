import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, Key, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPagesProps {
  view: 'login' | 'signup' | 'forgot' | 'verify';
}

export default function AuthPages({ view }: AuthPagesProps) {
  const { login, register, setPage, isAuthLoading, authError, addToast } = useStore();
  
  // Sign up state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'job-seeker' | 'admin'>('job-seeker');
  
  // Verification code
  const [verifyCode, setVerifyCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all credentials', 'warning');
      return;
    }
    const success = await login(email, password);
    if (success) {
      setPage('dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please complete all form fields', 'warning');
      return;
    }
    const success = await register(name, email, password, role);
    if (success) {
      setPage('verify');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) {
      addToast('Please input the dispatched 6-digit pin code', 'warning');
      return;
    }
    addToast('Email verification completed successfully', 'success');
    setPage(role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email to dispatch reset', 'warning');
      return;
    }
    addToast('A password reset link has been dispatched to your mailbox.', 'success');
    setPage('login');
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 grid-bg">
      <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 rounded-3xl bg-gray-900/60 border border-white/10 backdrop-blur-xl shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          
          {view === 'login' && (
            <>
              <h2 className="text-3xl font-extrabold text-white font-display">Welcome Back</h2>
              <p className="text-sm text-gray-400 mt-2">Access your stealth pipeline opportunities</p>
            </>
          )}

          {view === 'signup' && (
            <>
              <h2 className="text-3xl font-extrabold text-white font-display">Create Account</h2>
              <p className="text-sm text-gray-400 mt-2">Unlock unlisted high-growth startup profiles</p>
            </>
          )}

          {view === 'verify' && (
            <>
              <h2 className="text-3xl font-extrabold text-white font-display">Verify Email</h2>
              <p className="text-sm text-gray-400 mt-2">Input the verification PIN dispatched to your email</p>
            </>
          )}

          {view === 'forgot' && (
            <>
              <h2 className="text-3xl font-extrabold text-white font-display">Reset Password</h2>
              <p className="text-sm text-gray-400 mt-2">We will dispatch a secure reset pipeline link</p>
            </>
          )}
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Demo Helper Banner */}
        {view === 'login' && (
          <div className="mb-6 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 leading-normal">
            💡 <strong>Sandbox demo credentials:</strong><br/>
            Job Seeker: <code className="text-white">amshuvardhanreddy732@gmail.com</code> / pass<br/>
            Administrator: <code className="text-white">admin@stealthhire.ai</code> / pass
          </div>
        )}

        {/* Render Appropriate Form */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => setPage('forgot')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-4 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthLoading ? 'Authenticating...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setPage('signup')}
                className="text-indigo-400 font-bold hover:underline"
              >
                Join StealthList
              </button>
            </p>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amshu Vardhan"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Profile Sandbox Mode</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setRole('job-seeker')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    role === 'job-seeker'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    role === 'admin'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-4 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthLoading ? 'Creating Workspace...' : 'Register Profile'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setPage('login')}
                className="text-indigo-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {view === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Verification PIN Code</label>
              <div className="relative">
                <Key className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="e.g. 842095"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-center text-sm font-bold tracking-widest text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>Verify Pipeline</span>
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Dispatch Link
            </button>

            <button
              type="button"
              onClick={() => setPage('login')}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold text-gray-400 transition-all"
            >
              Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
