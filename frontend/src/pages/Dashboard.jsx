import React, { useState, useEffect } from 'react';
import { useAxios } from '../hooks/useAxios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignOutModal } from '../components/SignOutModal/SignOutModal';
import {
  Gauge,
  TrendingUp,
  HelpCircle,
  Activity,
  PlusCircle,
  MinusCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  TrendingDown,
  LogOut
} from 'lucide-react';

export const Dashboard = () => {
  const [savingsRate, setSavingsRate] = useState(15.0);
  const [rentDelays, setRentDelays] = useState(0);
  const [utilityDelays, setUtilityDelays] = useState(0);
  const [activeSubs, setActiveSubs] = useState(3);
  const [debtToIncome, setDebtToIncome] = useState(20.0);
  
  const [scoreData, setScoreData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayScore, setDisplayScore] = useState(300);
  
  const axios = useAxios();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!scoreData?.credit_score) {
      setDisplayScore(300);
      return;
    }
    
    const startScore = 300;
    const endScore = scoreData.credit_score;
    const duration = 1200; // 1.2 seconds
    let startTime = null;
    let animationFrameId;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      
      // Cubic-bezier easeOutCubic: f(t) = 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - t, 3);
      const currentVal = Math.round(startScore + (endScore - startScore) * ease);
      
      setDisplayScore(currentVal);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scoreData?.credit_score]);

  useEffect(() => {
    // Load pre-existing signals on mount if they exist
    const loadSignals = async () => {
      try {
        const response = await axios.get('/credit/signals');
        const s = response.data;
        setSavingsRate(s.monthly_savings_rate);
        setRentDelays(s.rent_delays);
        setUtilityDelays(s.utility_delays);
        setActiveSubs(s.active_subscriptions);
        setDebtToIncome(s.debt_to_income);
        
        // Trigger prediction for initial load
        handleSubmit(null, s);
      } catch (err) {
        // Safe to ignore if they haven't submitted yet
      }
    };
    loadSignals();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await axios.get('/credit/history');
      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Failed to load scoring history:", err);
    }
  };

  const handleSubmit = async (e, customSignals = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = customSignals ? {
      monthly_savings_rate: customSignals.monthly_savings_rate,
      rent_delays: customSignals.rent_delays,
      utility_delays: customSignals.utility_delays,
      active_subscriptions: customSignals.active_subscriptions,
      debt_to_income: customSignals.debt_to_income
    } : {
      monthly_savings_rate: parseFloat(savingsRate),
      rent_delays: parseInt(rentDelays),
      utility_delays: parseInt(utilityDelays),
      active_subscriptions: parseInt(activeSubs),
      debt_to_income: parseFloat(debtToIncome)
    };

    try {
      const response = await axios.post('/credit/predict', payload);
      setScoreData(response.data);
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to calculate credit score. Please verify inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to color-code risk tiers
  const getLikelihoodColor = (tier) => {
    if (tier === "High Likelihood") return "text-accentEmerald bg-emerald-500/10 border-emerald-500/20";
    if (tier === "Moderate Likelihood") return "text-accentAmber bg-amber-500/10 border-amber-500/20";
    return "text-accentRose bg-rose-500/10 border-rose-500/20";
  };

  // Calculate SVG gauge parameters
  const score = scoreData?.credit_score || 300;
  const percentage = (score - 300) / 550; // Map [300, 850] to [0, 1]
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  const strokeDashoffset = halfCircumference - (percentage * halfCircumference);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Alternative Credit Assessment</h1>
          <p className="text-slate-400 mt-1">Submit non-traditional financial indicators to check your simulated credit rating.</p>
        </div>
        
        {/* User Profile Badge */}
        {user && (
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full py-1.5 px-3.5 backdrop-blur-md shadow-sm w-fit self-end md:self-auto">
            {/* Circular Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 select-none">
              {user.first_name ? user.first_name[0].toUpperCase() : ''}
              {user.last_name ? user.last_name[0].toUpperCase() : ''}
            </div>
            {/* Name and Email Stack */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-100 leading-tight">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
            {/* Sign Out Button */}
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full p-1.5 transition-colors duration-200 cursor-pointer flex items-center justify-center shrink-0 border-l border-white/5 pl-2 ml-1"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-accentRose">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="lg:col-span-5 p-6 pb-6 glass-card space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Activity size={18} className="text-accentCyan" />
            Financial Indicators
          </h2>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Monthly Savings Rate (%)
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{savingsRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={savingsRate}
              onChange={(e) => setSavingsRate(e.target.value)}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <p className="text-[11px] text-slate-300 mt-1">Percentage of monthly gross income deposited to savings.</p>
          </div>
 
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Rent Delays (Last 12 Mo.)
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{rentDelays} Days</span>
            </div>
            <input
              type="number"
              min="0"
              max="60"
              value={rentDelays}
              onChange={(e) => setRentDelays(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:bg-slate-900/60 hover:shadow-[0_0_10px_rgba(74,222,128,0.05)] focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] text-sm transition-all duration-300"
            />
            <p className="text-[11px] text-slate-300 mt-1">Total days late paying rent across the past calendar year.</p>
          </div>
 
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Utility Delays (Last 12 Mo.)
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{utilityDelays} Days</span>
            </div>
            <input
              type="number"
              min="0"
              max="60"
              value={utilityDelays}
              onChange={(e) => setUtilityDelays(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:bg-slate-900/60 hover:shadow-[0_0_10px_rgba(74,222,128,0.05)] focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] text-sm transition-all duration-300"
            />
            <p className="text-[11px] text-slate-300 mt-1">Late days on electricity, water, gas, or phone bills.</p>
          </div>
 
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Active Subscription Count
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{activeSubs} Accounts</span>
            </div>
            <input
              type="number"
              min="0"
              max="15"
              value={activeSubs}
              onChange={(e) => setActiveSubs(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:bg-slate-900/60 hover:shadow-[0_0_10px_rgba(74,222,128,0.05)] focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] text-sm transition-all duration-300"
            />
            <p className="text-[11px] text-slate-300 mt-1">Streaming services, SaaS tools, and gym memberships.</p>
          </div>
 
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Debt-To-Income Ratio (%)
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">{debtToIncome}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="0.5"
              value={debtToIncome}
              onChange={(e) => setDebtToIncome(e.target.value)}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <p className="text-[11px] text-slate-300 mt-1">Total monthly debt obligations relative to gross salary.</p>
          </div>
          <motion.button
            whileHover={{ y: -2, scale: 1.02, boxShadow: "0 0 25px rgba(16, 185, 129, 0.45)" }}
            whileTap={{ scale: 0.96 }}
            initial={{ boxShadow: "0 0 15px rgba(74, 222, 128, 0.35)" }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed border border-transparent animate-btn-shimmer transition-colors duration-300 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Financial Data...
              </span>
            ) : (
              "Calculate Credit Score"
            )}
          </motion.button>
        </form>

        {/* Right Hand Scoring Gauges & SHAP charts */}
        <div className="lg:col-span-7 space-y-8">
          {scoreData ? (
            <>
              {/* Score Display Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 glass-card items-center">
                {/* SVG Gauge */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-44 h-28 flex items-center justify-center overflow-hidden">
                    <svg className="absolute top-0 w-44 h-44 transform -rotate-180">
                      <defs>
                        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" /> {/* Amber */}
                          <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
                        </linearGradient>
                      </defs>
                      <circle
                        cx="88"
                        cy="88"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={halfCircumference}
                      />
                      <circle
                        cx="88"
                        cy="88"
                        r={radius}
                        fill="transparent"
                        stroke="url(#gauge-gradient)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={halfCircumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-[stroke-dashoffset] duration-[1200ms] [transition-timing-function:cubic-bezier(0.25,1,0.5,1)]"
                        strokeLinecap="round"
                      />
                      {/* Zone Tick Marks */}
                      {[300, 550, 700, 850].map((val) => {
                        const tickP = (val - 300) / 550;
                        const tickAngle = tickP * Math.PI;
                        const x1 = 88 + 66 * Math.cos(tickAngle);
                        const y1 = 88 + 66 * Math.sin(tickAngle);
                        const x2 = 88 + 72 * Math.cos(tickAngle);
                        const y2 = 88 + 72 * Math.sin(tickAngle);
                        return (
                          <line
                            key={val}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute bottom-1 flex flex-col items-center">
                      <span className="text-3xl font-black text-white">{displayScore}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Alternative Index</span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full px-6 text-[10px] font-semibold text-slate-400 mt-2">
                    <span>300 (LOW)</span>
                    <span>850 (HIGH)</span>
                  </div>
                </div>
 
                {/* Score details */}
                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Assessment Outcome</span>
                    <div className={`mt-2 px-3 py-1.5 rounded-lg border text-sm font-bold inline-block ${getLikelihoodColor(scoreData.probability_class)}`}>
                      {scoreData.probability_class}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This score indicates the likelihood of qualifying for financial services using alternative indicators. A higher rating indicates stronger savings rates and clean payment patterns.
                  </p>
                </div>
              </div>
 
              {/* SHAP explainability card */}
              <div className="p-6 glass-card space-y-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <TrendingUp size={18} className="text-emerald-400" />
                  SHAP Explainability (Feature Impact Analysis)
                </h2>
                <div className="space-y-4">
                  {scoreData.top_impacts.map((impact, index) => {
                    const isPositive = impact.direction === "positive";
                    return (
                      <div key={impact.feature} className="space-y-2 group">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 capitalize">{impact.feature.replace(/_/g, ' ')}</span>
                          <span className={isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {isPositive ? '+' : ''}{impact.impact_value.toFixed(2)} SHAP Impact
                          </span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="bg-slate-800/80 h-2 rounded-full overflow-hidden flex relative">
                          <div
                            style={{ 
                              width: `${Math.min((Math.abs(impact.impact_value) / 2.0) * 100, 100)}%`,
                              transitionDelay: `${index * 80}ms`
                            }}
                            className={`h-full transition-all duration-700 ease-out ${isPositive ? 'bg-emerald-500' : 'bg-rose-500 ml-auto'}`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal pl-2 border-l border-white/5 group-hover:border-white/20 transition-colors">
                          {impact.feature === "savings_rate"
                            ? impact.description.replace(/\d+(\.\d+)?%/, `${savingsRate}%`)
                            : impact.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center p-12 glass-card text-center min-h-[350px]">
              <Gauge size={48} className="text-slate-700 animate-pulse mb-4" />
              <h3 className="text-lg font-semibold text-slate-200">No Assessment Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-1">
                Enter your financial indicators on the left and click calculate to assess alternative credit viability.
              </p>
            </div>
          )}
        </div>
      </div>
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};
export default Dashboard;
