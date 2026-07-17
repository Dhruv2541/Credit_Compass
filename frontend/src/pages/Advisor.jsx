import React, { useState, useEffect, useRef } from 'react';
import { useAxios } from '../hooks/useAxios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  MessageSquare,
  Bot,
  User as UserIcon,
  TrendingUp,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

export const Advisor = () => {
  const [chatStatus, setChatStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [riskTier, setRiskTier] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  // Growth Simulator States
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(150);
  const [years, setYears] = useState(10);
  const [simData, setSimData] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const axios = useAxios();
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadChatStatus();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Run simulation if risk assessment is complete
    if (riskTier) {
      runSimulation();
    }
  }, [riskTier, initialAmount, monthlyContribution, years]);

  const loadChatStatus = async () => {
    setChatLoading(true);
    try {
      const response = await axios.get('/investment/chat/status');
      setChatStatus(response.data);
      
      // If assessment is complete, load determined portfolio
      if (response.data.chat_completed) {
        loadPortfolio();
      } else {
        // Start conversation if empty
        setMessages([
          {
            sender: 'bot',
            text: `Hi there! I am your conversational investment advisor. Let's ask a few questions to map your risk tolerance and build an educational growth projection. Ready?`
          },
          {
            sender: 'bot',
            text: response.data.next_question_text,
            options: response.data.options,
            questionId: response.data.next_question_id
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to load chat status:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      const pResponse = await axios.get('/investment/portfolio');
      setPortfolio(pResponse.data);
      // Heuristic mapping risk tier based on portfolio weighting
      if (pResponse.data.crypto > 10) setRiskTier('Aggressive');
      else if (pResponse.data.bonds > 40) setRiskTier('Conservative');
      else setRiskTier('Moderate');
    } catch (err) {
      // Profile not saved
    }
  };

  const handleSelectOption = async (questionId, option) => {
    setChatLoading(true);
    // Add user response to chat list
    setMessages((prev) => [...prev, { sender: 'user', text: option }]);

    try {
      const response = await axios.post('/investment/chat/message', {
        question_id: questionId,
        selected_option: option
      });
      
      const r = response.data;
      if (r.chat_completed) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Thank you! I have compiled your profile. You have been classified as a ${r.determined_risk_tier} Risk Investor. Here is your recommended asset allocation.`
          }
        ]);
        setRiskTier(r.determined_risk_tier);
        setPortfolio(r.recommended_allocation);
      } else {
        // Fetch next status to load question
        const statusResponse = await axios.get('/investment/chat/status');
        setChatStatus(statusResponse.data);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: statusResponse.data.next_question_text,
            options: statusResponse.data.options,
            questionId: statusResponse.data.next_question_id
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to submit message response:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const response = await axios.post('/investment/simulate', {
        initial_amount: parseFloat(initialAmount),
        monthly_contribution: parseFloat(monthlyContribution),
        time_horizon_years: parseInt(years),
        risk_tier: riskTier
      });
      setSimData(response.data);
    } catch (err) {
      console.error("Failed to run simulation:", err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post('/investment/chat/reset');
      setRiskTier(null);
      setPortfolio(null);
      setSimData(null);
      setMessages([]);
      loadChatStatus();
    } catch (err) {
      console.error("Failed to reset chat:", err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Investment Risk Advisor</h1>
        <p className="text-slate-400 mt-1">Complete your risk check dialogue to simulate portfolio growth expectations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Conversational Chat Console */}
        <div className="lg:col-span-5 flex flex-col h-[520px] glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-accentCyan" />
              Advisor Chat
            </span>
            {riskTier && (
              <button
                onClick={handleReset}
                className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={10} />
                Retake Quiz
              </button>
            )}
          </div>

          {/* Chat Bubble Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                    isBot ? 'bg-cyan-500/10 border-cyan-500/20 text-accentCyan' : 'bg-emerald-500/10 border-emerald-500/20 text-accentEmerald'
                  }`}>
                    {isBot ? <Bot size={16} /> : <UserIcon size={16} />}
                  </div>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isBot ? 'bg-slate-900/50 border border-white/5 text-slate-200' : 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-100'
                    }`}>
                      {msg.text}
                    </div>
                    {/* Render choice options for bot message if active */}
                    {isBot && msg.options && !riskTier && idx === messages.length - 1 && (
                      <div className="space-y-2 mt-2 pl-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            disabled={chatLoading}
                            onClick={() => handleSelectOption(msg.questionId, opt)}
                            className="w-full text-left p-2.5 text-xs rounded-xl bg-slate-900/40 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-accentCyan transition-all"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right Side: recommended portfolio & simulation charts */}
        <div className="lg:col-span-7 space-y-8">
          {riskTier && portfolio ? (
            <>
              {/* Asset Allocation Breakdown */}
              <div className="p-6 glass-card space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <TrendingUp size={18} className="text-accentEmerald" />
                  Recommended Asset Allocation ({riskTier})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Government Bonds</span>
                    <div className="text-xl font-bold text-white mt-1">{portfolio.bonds}%</div>
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Index ETFs</span>
                    <div className="text-xl font-bold text-accentCyan mt-1">{portfolio.etfs}%</div>
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Growth Equities</span>
                    <div className="text-xl font-bold text-accentEmerald mt-1">{portfolio.equities}%</div>
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Cryptocurrency</span>
                    <div className="text-xl font-bold text-accentRose mt-1">{portfolio.crypto}%</div>
                  </div>
                </div>
              </div>

              {/* Compound Growth Projections */}
              <div className="p-6 glass-card space-y-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <Sliders size={18} className="text-accentCyan" />
                  Compound growth Simulator
                </h2>
                
                {/* Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-slate-500">Initial Capital</span>
                      <span className="text-xs font-mono text-white">${initialAmount}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-slate-500">Monthly Addition</span>
                      <span className="text-xs font-mono text-white">${monthlyContribution}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-slate-500">Time Horizon</span>
                      <span className="text-xs font-mono text-white">{years} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                </div>

                {/* Recharts chart */}
                {simData && (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simData.projection_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(188, 86%, 43%)" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="hsl(188, 86%, 43%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#121826', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                          itemStyle={{ fontSize: '11px', color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="expected_value" name="Expected Growth" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        <Line type="monotone" dataKey="total_invested" name="Cumulative Cash" stroke="#475569" strokeDasharray="4 4" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Simulator Projections Callout */}
                {simData && (
                  <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Invested</span>
                      <div className="text-sm font-bold text-slate-300 mt-1">${simData.total_invested.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Low Return (FV)</span>
                      <div className="text-sm font-bold text-accentRose mt-1">${simData.future_value_conservative.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Expected Return (FV)</span>
                      <div className="text-sm font-bold text-accentEmerald mt-1">${simData.future_value_expected.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center p-12 glass-card text-center min-h-[420px]">
              <TrendingUp size={48} className="text-slate-700 animate-pulse mb-4" />
              <h3 className="text-lg font-semibold text-slate-200">Growth Projection Pending</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-1">
                Complete the risk profile questionnaire on the left to unlock recommended allocations and simulations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Advisor;
