import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Advisor } from './pages/Advisor';
import { LayoutDashboard, MessageSquareCode, LogOut, Compass } from 'lucide-react';
import { IntroAnimation } from './components/IntroAnimation/IntroAnimation';
import { useIntroSession } from './components/IntroAnimation/useIntroSession';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-bgDark">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-sidebar hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <Compass size={24} className="text-accentEmerald animate-spin-slow" />
          <span className="font-bold text-white text-lg">Credit Compass</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
              isActive('/dashboard')
                ? 'bg-emerald-500/10 text-accentEmerald border border-emerald-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            to="/advisor"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
              isActive('/advisor')
                ? 'bg-cyan-500/10 text-accentCyan border border-cyan-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
            }`}
          >
            <MessageSquareCode size={16} />
            Advisor
          </Link>
        </nav>

        {/* User profile callout & logout button */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {user && (
            <div className="px-4 py-2 bg-slate-900/30 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-white">{user.first_name} {user.last_name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden glass-navbar p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-accentEmerald" />
            <span className="font-bold text-white">Credit Compass</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-slate-400 hover:text-white text-xs font-bold">Dash</Link>
            <Link to="/advisor" className="text-slate-400 hover:text-white text-xs font-bold">Advisor</Link>
            <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 text-xs font-bold">Out</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        {/* Persistent Educational Disclaimer Footer */}
        <footer className="glass-navbar border-t border-white/5 py-4 px-6 text-center text-[10px] text-slate-500 uppercase tracking-widest fixed bottom-0 left-0 right-0 md:left-64 z-10">
          ⚠️ Disclaimer: Credit Compass is a simulated educational tool. Predictions and portfolio growth projections are synthetic.
        </footer>
      </div>
    </div>
  );
};

export const App = () => {
  const { showIntro, completeIntro } = useIntroSession();

  return (
    <AuthProvider>
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
