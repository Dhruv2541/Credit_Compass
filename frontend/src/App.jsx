import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignOutModal } from './components/SignOutModal/SignOutModal';
import { motion } from 'framer-motion';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Advisor } from './pages/Advisor';
import { LayoutDashboard, MessageSquareCode, LogOut, Compass } from 'lucide-react';
import { IntroAnimation } from './components/IntroAnimation/IntroAnimation';
import { useIntroSession } from './components/IntroAnimation/useIntroSession';
import { SmokyBackground } from './components/SmokyBackground/SmokyBackground';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bgDark">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Sidebar Layout Wrapper
const DashboardLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-sidebar hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center"
          >
            <Compass size={24} className="text-emerald-400 animate-spin-slow" />
          </motion.div>
          <motion.span
            initial={{ x: -12, opacity: 0, filter: "blur(4px)", textShadow: "0 0 15px rgba(52, 211, 153, 0.9), 0 0 8px rgba(6, 182, 212, 0.6)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)", textShadow: "0 0 0px rgba(52, 211, 153, 0)" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="font-bold text-white/90 text-lg tracking-tight"
          >
            Credit Compass
          </motion.span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/dashboard"
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors duration-200 z-10 ${
              isActive('/dashboard') ? 'text-white/90 font-bold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            {isActive('/dashboard') && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl -z-10 shadow-[0_0_15px_rgba(74,222,128,0.08)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            to="/advisor"
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors duration-200 z-10 ${
              isActive('/advisor') ? 'text-white/90 font-bold' : 'text-white/60 hover:text-white/90'
            }`}
          >
            {isActive('/advisor') && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <MessageSquareCode size={16} />
            Advisor
          </Link>
        </nav>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Page Header/Navbar */}
        <header className="md:hidden glass-navbar p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            {/* Brand Logo & Text (only visible on mobile to avoid duplicate logos since desktop has sidebar logo) */}
            <div className="md:hidden flex items-center gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center justify-center"
              >
                <Compass size={20} className="text-accentEmerald" />
              </motion.div>
              <motion.span
                initial={{ x: -12, opacity: 0, filter: "blur(4px)", textShadow: "0 0 15px rgba(52, 211, 153, 0.9), 0 0 8px rgba(6, 182, 212, 0.6)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)", textShadow: "0 0 0px rgba(52, 211, 153, 0)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="font-bold text-white text-base tracking-tight"
              >
                Credit Compass
              </motion.span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative">
            {/* Mobile-only Navigation Links */}
            <div className="md:hidden flex items-center gap-5 mr-3">
              <Link
                to="/dashboard"
                className={`relative py-1 text-xs font-bold transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dash
                {isActive('/dashboard') && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
              <Link
                to="/advisor"
                className={`relative py-1 text-xs font-bold transition-colors duration-200 ${
                  isActive('/advisor') ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Advisor
                {isActive('/advisor') && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </div>
            
            {/* Modern User Profile Badge */}
            {user && (
              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full py-1.5 px-3.5 backdrop-blur-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 select-none">
                  {user.first_name ? user.first_name[0].toUpperCase() : ''}
                  {user.last_name ? user.last_name[0].toUpperCase() : ''}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-100 leading-tight">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            
            {/* Refined Sign Out Button */}
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full p-2 transition-colors duration-200 cursor-pointer flex items-center justify-center shrink-0"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        {/* Persistent Educational Disclaimer Footer */}
        <footer className="glass-navbar border-t border-white/5 py-4 px-6 text-center text-[10px] text-slate-500 uppercase tracking-widest fixed bottom-0 left-0 right-0 md:left-64 z-10">
          ⚠️ Disclaimer: Credit Compass is a simulated educational tool. Predictions and portfolio growth projections are synthetic.
        </footer>

        <SignOutModal
          isOpen={isSignOutModalOpen}
          onClose={() => setIsSignOutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
};

export const App = () => {
  const { showIntro, completeIntro } = useIntroSession();

  return (
    <AuthProvider>
      {/* Base Background Fallback */}
      <div className="fixed inset-0 bg-[#080C14] -z-55" />
      
      {/* Canvas Smoky Swirl Animation */}
      <SmokyBackground />
      
      {/* Ambient Radial Background Glows */}
      <div className="fixed -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(16,185,129,0)_80%)] blur-[120px] pointer-events-none -z-40" />
      <div className="fixed -bottom-[10%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.05)_0%,rgba(20,184,166,0)_80%)] blur-[120px] pointer-events-none -z-40" />
      
      {/* Tech HUD Dot Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none -z-30 tech-dot-grid" />

      {showIntro && <IntroAnimation onComplete={completeIntro} />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/advisor"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Advisor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
