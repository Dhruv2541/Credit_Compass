import React, { useState, useEffect } from 'react';
import { useAxios } from '../hooks/useAxios';
import {
  Gauge,
  TrendingUp,
  HelpCircle,
  Activity,
  PlusCircle,
  MinusCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  TrendingDown
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
  
  const axios = useAxios();

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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Alternative Credit Assessment</h1>
        <p className="text-slate-400 mt-1">Submit non-traditional financial indicators to check your simulated credit rating.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-accentRose">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="lg:col-span-5 p-6 glass-card space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Activity size={18} className="text-accentCyan" />
            Financial Indicators
          </h2>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Monthly Savings Rate (%)
              </label>
              <span className="text-xs font-mono text-accentEmerald">{savingsRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={savingsRate}
              onChange={(e) => setSavingsRate(e.target.value)}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Percentage of monthly gross income deposited to savings.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rent Delays (Last 12 Mo.)
              </label>
              <span className="text-xs font-mono text-white">{rentDelays} Days</span>
            </div>
            <input
              type="number"
              min="0"
              max="60"
              value={rentDelays}
              onChange={(e) => setRentDelays(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">Total days late paying rent across the past calendar year.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Utility Delays (Last 12 Mo.)
              </label>
              <span className="text-xs font-mono text-white">{utilityDelays} Days</span>
            </div>
            <input
              type="number"
              min="0"
              max="60"
              value={utilityDelays}
              onChange={(e) => setUtilityDelays(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">Late days on electricity, water, gas, or phone bills.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Subscription Count
              </label>
              <span className="text-xs font-mono text-white">{activeSubs} Accounts</span>
            </div>
            <input
              type="number"
              min="0"
              max="15"
              value={activeSubs}
              onChange={(e) => setActiveSubs(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">Streaming services, SaaS tools, and gym memberships.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Debt-To-Income Ratio (%)
              </label>
              <span className="text-xs font-mono text-accentRose">{debtToIncome}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="0.5"
              value={debtToIncome}
              onChange={(e) => setDebtToIncome(e.target.value)}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Total monthly debt obligations relative to gross salary.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-accentCyan font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Running AI Inference..." : "Calculate Credit Score"}
          </button>
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
                        stroke="url(#gauge-grad)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={halfCircumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(343, 90%, 60%)" />
                          <stop offset="50%" stopColor="hsl(38, 92%, 50%)" />
                          <stop offset="100%" stopColor="hsl(162, 76%, 41%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute bottom-1 flex flex-col items-center">
                      <span className="text-3xl font-black text-white">{scoreData.credit_score}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Alternative Index</span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full px-6 text-[10px] font-semibold text-slate-500 mt-2">
                    <span>300 (LOW)</span>
                    <span>850 (HIGH)</span>
                  </div>
                </div>

                {/* Score details */}
                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Assessment Outcome</span>
                    <div className={`mt-2 px-3 py-1.5 rounded-lg border text-sm font-semibold inline-block ${getLikelihoodColor(scoreData.probability_class)}`}>
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
                  <TrendingUp size={18} className="text-accentEmerald" />
                  SHAP Explainability (Feature Impact Analysis)
                </h2>
                <div className="space-y-4">
                  {scoreData.top_impacts.map((impact) => {
                    const isPositive = impact.direction === "positive";
                    return (
                      <div key={impact.feature} className="space-y-2 group">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 capitalize">{impact.feature.replace(/_/g, ' ')}</span>
                          <span className={isPositive ? 'text-accentEmerald' : 'text-accentRose'}>
                            {isPositive ? '+' : ''}{impact.impact_value.toFixed(2)} SHAP Impact
                          </span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex relative">
                          {isPositive ? (
                            <div
                              style={{ width: `${Math.min(100, Math.abs(impact.impact_value) * 60)}%` }}
                              className="h-full bg-emerald-500/80 rounded-full"
                            />
                          ) : (
                            <div
                              style={{ width: `${Math.min(100, Math.abs(impact.impact_value) * 60)}%` }}
                              className="h-full bg-rose-500/80 rounded-full ml-auto"
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal pl-2 border-l border-white/5 group-hover:border-white/20 transition-colors">
                          {impact.description}
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
    </div>
  );
};
export default Dashboard;
