import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import SeekerDashboard from './components/SeekerDashboard';
import StartupExplorer from './components/StartupExplorer';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import SkillGapDashboard from './components/SkillGapDashboard';
import AICareerMentor from './components/AICareerMentor';
import OutreachGenerator from './components/OutreachGenerator';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import ToastContainer from './components/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { currentPage, isAuthenticated, isAuthLoading, checkSession } = useStore();

  // On mount, restore session if mock token exists
  useEffect(() => {
    checkSession();
  }, []);

  const renderPageView = () => {
    // Public routes
    if (currentPage === 'landing') return <LandingPage />;
    if (currentPage === 'login') return <AuthPages view="login" />;
    if (currentPage === 'signup') return <AuthPages view="signup" />;
    if (currentPage === 'forgot') return <AuthPages view="forgot" />;
    if (currentPage === 'verify') return <AuthPages view="verify" />;

    // Protected Route Interceptor
    if (!isAuthenticated) {
      return <AuthPages view="login" />;
    }

    // Protected Views
    switch (currentPage) {
      case 'dashboard':
        return <SeekerDashboard />;
      case 'explorer':
        return <StartupExplorer />;
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'skill-gap':
        return <SkillGapDashboard />;
      case 'mentor':
        return <AICareerMentor />;
      case 'outreach':
        return <OutreachGenerator />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <SeekerDashboard />;
    }
  };

  const isFullWidthPage = ['landing', 'login', 'signup', 'forgot', 'verify'].includes(currentPage);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider animate-pulse">
          Sychronizing Stealth Network...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Toast notifications drawer */}
      <ToastContainer />

      {/* Global Navbar */}
      <Navbar />

      {/* Primary Workspace Layout */}
      {isFullWidthPage ? (
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderPageView()}
            </motion.div>
          </AnimatePresence>
        </main>
      ) : (
        <div className="flex-1 flex">
          {/* Authenticated Left Navigation */}
          <Sidebar />

          {/* Scrolling Main Body View */}
          <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto bg-gray-905">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.99, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                {renderPageView()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
