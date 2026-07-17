import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, ArrowRight, TrendingUp, Cpu, UploadCloud, Users, Layers, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { setPage } = useStore();
  const [dragActive, setDragActive] = useState(false);

  const stats = [
    { label: 'Stealth Funding Analyzed', value: '$120M+' },
    { label: 'Hiring Prediction Accuracy', value: '94%' },
    { label: 'Time Advantage (Before Posts)', value: '14 Days' },
    { label: 'Active VC Partners', value: '35+' }
  ];

  const benefits = [
    {
      title: 'Analyze Pre-Posting Signals',
      desc: 'We map tech stack modifications, news leaks, executive departures, and seed funding registrations to flag companies about to list.',
      icon: Cpu,
      color: 'text-indigo-400'
    },
    {
      title: 'Generate Instant Hyper-Outreach',
      desc: 'Our integrated Gemini model structures personalized cold emails, LinkedIn connection templates, and pitch metrics for the founders.',
      icon: Sparkles,
      color: 'text-purple-400'
    },
    {
      title: 'Assess ATS & Gap Breakdown',
      desc: 'Understand how your resume registers against stealth job requirements and map a direct, structured roadmap to acquire missing skills.',
      icon: Layers,
      color: 'text-emerald-400'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Take the guest directly to signup/analyzer page
    setPage('signup');
  };

  return (
    <div className="relative isolate overflow-hidden bg-gray-950 grid-bg min-h-screen">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/3 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-8 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover Unlisted Startup Roles First</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Land your next role before <br />
            <span className="ai-gradient-text">the job is even posted</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            StealthHire AI continuously monitors private registries, funding announcements, tech-stack alterations, and news cycles to surface unlisted hiring opportunities before they hit job boards.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setPage('signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-indigo-400 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage('login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-4 text-base font-bold text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Stealth List</span>
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </button>
          </div>
        </motion.div>

        {/* Dynamic Image Reference Onboarding Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl mt-16 px-4"
        >
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => setPage('signup')}
            className={`cursor-pointer border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${
              dragActive
                ? 'border-indigo-400 bg-indigo-500/10 scale-102 shadow-2xl'
                : 'border-white/10 bg-gray-900/40 backdrop-blur-md hover:border-indigo-500/30 hover:bg-gray-900/60'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 pulse">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">Drop your resume to scan the Stealth Network</h3>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              Drop your PDF, Word document, or plain text resume to instantly match your profile with unlisted startup roles.
            </p>
            <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              No registration required to match
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="mx-auto max-w-6xl mt-24">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-900/30 border border-white/5 backdrop-blur-md">
                <p className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="mt-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features / Benefits Section */}
        <div className="mx-auto max-w-6xl mt-32 text-left">
          <h2 className="font-display text-3xl font-bold text-center text-white mb-16">
            Under-the-radar intelligence. Powering your job hunt.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-gray-900/35 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group">
                  <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform ${benefit.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-display">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mx-auto max-w-6xl mt-32 text-center">
          <h2 className="font-display text-2xl font-semibold text-gray-400 mb-12">
            Praised by Silicon Valley candidates and hiring managers
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-3xl bg-gray-900/20 border border-white/5 backdrop-blur-sm">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-base text-gray-300 italic">
                "StealthHire AI found three seed-stage startups with major tech integrations in their public Github, indicating massive growth. I reached out to the founder of ScribeBio using the customized email template and got interviewed 3 days before they ever listed the Senior Backend position. Unbelievable utility!"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs">AM</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Anuj Mehta</h4>
                  <p className="text-xs text-gray-500">Placed Senior Staff Engineer @ ScribeBio</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gray-900/20 border border-white/5 backdrop-blur-sm">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-base text-gray-300 italic">
                "As an early-stage CTO, I do not have time to screen hundreds of candidates or review unoptimized resumes. StealthHire brought me candidates who understood our custom CUDA and PyTorch tech struggles perfectly, pointing precisely to where they could optimize our platform. Stealth recruitment is the best recruitment."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xs">AT</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dr. Aris Thorne</h4>
                  <p className="text-xs text-gray-500">Chief Scientific Officer @ ScribeBio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-12 border-t border-white/5 text-center text-sm text-gray-500">
          <p>© 2026 StealthHire AI. Operating under stealth signals pipeline protocol.</p>
        </div>
      </div>
    </div>
  );
}
