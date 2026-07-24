import React, { useState, useEffect, useRef } from 'react';
import { useAxios } from '../hooks/useAxios';
import { motion } from 'framer-motion';
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
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignOutModal } from '../components/SignOutModal/SignOutModal';
import {
  MessageSquare,
  Bot,
  User as UserIcon,
  TrendingUp,
  RefreshCw,
  Sliders,
  DollarSign,
  LogOut
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    text: "What is your primary financial objective?",
    options: [
      "Protect my savings against inflation (Low risk)",
      "Grow my savings steadily over time (Balanced)",
      "Maximize returns with aggressive growth (High risk)"
    ]
  },
  {
    id: 2,
    text: "What is your planned investment horizon?",
    options: [
      "Short term: Less than 2 years",
      "Medium term: 2 to 7 years",
      "Long term: More than 7 years"
    ]
  },
  {
    id: 3,
    text: "How would you react if your portfolio fell 10% in a month?",
    options: [
      "Sell everything immediately to prevent further loss",
      "Do nothing and wait for the market to recover",
      "Buy more assets at the lower price"
    ]
  },
  {
    id: 4,
    text: "What percentage of your income can you comfortably allocate to investing?",
    options: [
      "Under 5% of monthly income",
      "5% to 15% of monthly income",
      "Over 15% of monthly income"
    ]
  },
  {
    id: 5,
    text: "How would you rate your knowledge of financial markets?",
    options: [
      "Beginner: I don't know much about stocks/bonds",
      "Intermediate: I understand core concepts (mutual funds, ETFs)",
      "Advanced: I actively track and trade assets"
    ]
  }
];

export const Advisor = () => {
  const [chatStatus, setChatStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [riskTier, setRiskTier] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  const [scoreData, setScoreData] = useState(null);
  const [showThinkingBubble, setShowThinkingBubble] = useState(false);

  // Growth Simulator States
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(150);
  const [years, setYears] = useState(10);
  const [simData, setSimData] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const axios = useAxios();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const rebuildMessageHistory = (rawResponses, nextQuestionText, nextQuestionOptions, nextQuestionId, chatCompleted, finalRiskTier) => {
    const list = [
      {
        sender: 'bot',
        text: `Hi there! I am your conversational investment advisor. Let's ask a few questions to map your risk tolerance and build an educational growth projection. Ready?`
      }
    ];

    QUESTIONS.forEach((q) => {
      const answer = rawResponses[q.id.toString()] || rawResponses[q.id];
      if (answer) {
        list.push({
          sender: 'bot',
          text: q.text
        });
        list.push({
          sender: 'user',
          text: answer
        });
      }
    });

    if (!chatCompleted && nextQuestionText) {
      list.push({
        sender: 'bot',
        text: nextQuestionText,
        options: nextQuestionOptions,
        questionId: nextQuestionId
      });
    } else if (chatCompleted) {
      const tier = finalRiskTier || riskTier;
      if (tier) {
        list.push({
          sender: 'bot',
          text: `Thank you! I have compiled your profile. You have been classified as a ${tier} Risk Investor. Here is your recommended asset allocation.`
        });
      }
    }

    return list;
  };

  useEffect(() => {
    loadChatStatus();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when new messages or thinking bubble updates
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showThinkingBubble]);

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

      if (response.data.chat_completed) {
        const pResponse = await axios.get('/investment/portfolio');
        setPortfolio(pResponse.data);
        let tier = 'Moderate';
        if (pResponse.data.crypto > 10) tier = 'Aggressive';
        else if (pResponse.data.bonds > 40) tier = 'Conservative';
        setRiskTier(tier);

        const historyList = rebuildMessageHistory(
          response.data.raw_responses || {},
          null,
          null,
          null,
          true,
          tier
        );
        setMessages(historyList);
      } else {
        // Only show thinking bubble if there are no responses yet
        const rawResps = response.data.raw_responses || {};
        if (Object.keys(rawResps).length === 0) {
          setShowThinkingBubble(true);
          await new Promise((resolve) => setTimeout(resolve, 600));
          setShowThinkingBubble(false);
        }

        const historyList = rebuildMessageHistory(
          rawResps,
          response.data.next_question_text,
          response.data.options,
          response.data.next_question_id,
          false
        );
        setMessages(historyList);
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

      // Display thinking animation before revealing answer/next question
      setShowThinkingBubble(true);
      await new Promise((resolve) => setTimeout(resolve, 450));
      setShowThinkingBubble(false);

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
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
      loadChatStatus();
    } catch (err) {
      console.error("Failed to reset chat:", err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Investment Risk Advisor</h1>
          <p className="text-muted mt-1 text-sm">Complete your risk check dialogue to simulate portfolio growth expectations.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Conversational Chat Console */}
        <div className="lg:col-span-5 flex flex-col h-[520px] glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-bgSurface/30">
            <span className="text-sm font-semibold text-textPrimary flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              Advisor Chat
            </span>
            {riskTier && (
              <button
                onClick={handleReset}
                className="text-[10px] uppercase tracking-wider font-semibold text-muted hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={10} />
                Retake Quiz
              </button>
            )}
          </div>

          {/* Chat Bubble Container */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';
              const isLastBotMsg = isBot && idx === messages.length - 1 && !riskTier;
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${isBot ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/10 border-secondary/20 text-secondary'
                    }`}>
                    {isBot ? <Bot size={16} /> : <UserIcon size={16} />}
                  </div>
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isBot ? 'bg-bgSurface/50 border border-white/5 text-textSecondary' : 'bg-secondary/15 border border-secondary/20 text-textPrimary'
                      } ${isLastBotMsg ? 'question-bubble-enter' : ''}`}>
                      {isLastBotMsg ? (
                        msg.text.split(' ').map((word, wIdx) => (
                          <span
                            key={wIdx}
                            className="inline-block opacity-0 animate-[fade-in_0.2s_ease-out_forwards]"
                            style={{ animationDelay: `${wIdx * 0.035}s` }}
                          >
                            {word}&nbsp;
                          </span>
                        ))
                      ) : (
                        msg.text
                      )}
                    </div>
                    {/* Render choice options for bot message if active */}
                    {isBot && msg.options && !riskTier && idx === messages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                        className="space-y-2 mt-2 pl-1"
                      >
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            disabled={chatLoading}
                            onClick={() => handleSelectOption(msg.questionId, opt)}
                            className="w-full text-left p-2.5 text-xs rounded-xl bg-bgDark/40 border border-white/5 hover:border-accentCyan/30 hover:border-l-accentCyan border-l-2 border-transparent text-textSecondary hover:text-primary transition-all duration-200 cursor-pointer hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(15,179,204,0.15)]"
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
            {riskTier && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
                  <span>✓ Quiz Complete — Recommendation Updated</span>
                </div>
              </div>
            )}
            {showThinkingBubble && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 bg-primary/10 border-primary/20 text-primary">
                  <Bot size={16} />
                </div>
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="p-3 rounded-2xl text-[10px] leading-none bg-bgSurface/50 border border-white/5 text-textSecondary flex items-center gap-1.5 h-9 w-fit">
                    <span className="dot-thinking animate-pulse" style={{ animationDelay: '0s' }}>●</span>
                    <span className="dot-thinking animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="dot-thinking animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right Side: recommended portfolio & simulation charts */}
        <div className="lg:col-span-7 space-y-8">
          {riskTier && portfolio ? (
            <>
              {/* Asset Allocation Breakdown */}
              <div className="p-6 glass-card space-y-4">
                <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2 border-b border-white/5 pb-3">
                  <TrendingUp size={18} className="text-success" />
                  Recommended Asset Allocation ({riskTier})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-bgSurface/40 border border-white/5 rounded-xl text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Government Bonds</span>
                      <div className="text-xl font-bold text-textPrimary mt-1">{portfolio.bonds}%</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-muted text-left space-y-1.5">
                      <div className="flex justify-between">
                        <span>Initial:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(initialAmount) * (portfolio.bonds / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(monthlyContribution) * (portfolio.bonds / 100)).toLocaleString()}</span>
                      </div>
                      {simData && (
                        <div className="flex justify-between text-primary/95 border-t border-white/5 pt-1.5 mt-1.5">
                          <span>Projected:</span>
                          <span className="font-mono font-bold">${Math.round(Number(simData.future_value_expected) * (portfolio.bonds / 100)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-bgSurface/40 border border-white/5 rounded-xl text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Index ETFs</span>
                      <div className="text-xl font-bold text-primary mt-1">{portfolio.etfs}%</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-muted text-left space-y-1.5">
                      <div className="flex justify-between">
                        <span>Initial:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(initialAmount) * (portfolio.etfs / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(monthlyContribution) * (portfolio.etfs / 100)).toLocaleString()}</span>
                      </div>
                      {simData && (
                        <div className="flex justify-between text-primary/95 border-t border-white/5 pt-1.5 mt-1.5">
                          <span>Projected:</span>
                          <span className="font-mono font-bold">${Math.round(Number(simData.future_value_expected) * (portfolio.etfs / 100)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-bgSurface/40 border border-white/5 rounded-xl text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Growth Equities</span>
                      <div className="text-xl font-bold text-success mt-1">{portfolio.equities}%</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-muted text-left space-y-1.5">
                      <div className="flex justify-between">
                        <span>Initial:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(initialAmount) * (portfolio.equities / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(monthlyContribution) * (portfolio.equities / 100)).toLocaleString()}</span>
                      </div>
                      {simData && (
                        <div className="flex justify-between text-primary/95 border-t border-white/5 pt-1.5 mt-1.5">
                          <span>Projected:</span>
                          <span className="font-mono font-bold">${Math.round(Number(simData.future_value_expected) * (portfolio.equities / 100)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-bgSurface/40 border border-white/5 rounded-xl text-center flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Cryptocurrency</span>
                      <div className="text-xl font-bold text-danger mt-1">{portfolio.crypto}%</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-muted text-left space-y-1.5">
                      <div className="flex justify-between">
                        <span>Initial:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(initialAmount) * (portfolio.crypto / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-mono text-textPrimary font-medium">${Math.round(Number(monthlyContribution) * (portfolio.crypto / 100)).toLocaleString()}</span>
                      </div>
                      {simData && (
                        <div className="flex justify-between text-primary/95 border-t border-white/5 pt-1.5 mt-1.5">
                          <span>Projected:</span>
                          <span className="font-mono font-bold">${Math.round(Number(simData.future_value_expected) * (portfolio.crypto / 100)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compound Growth Projections */}
              <div className="p-6 glass-card space-y-6">
                <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2 border-b border-white/5 pb-2">
                  <Sliders size={18} className="text-primary" />
                  Compound growth Simulator
                </h2>

                {/* Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-muted">Initial Capital</span>
                      <span className="text-xs font-mono text-textPrimary font-semibold">${initialAmount}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-muted">Monthly Addition</span>
                      <span className="text-xs font-mono text-textPrimary font-semibold">${monthlyContribution}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase font-semibold tracking-wider text-muted">Time Horizon</span>
                      <span className="text-xs font-mono text-textPrimary font-semibold">{years} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
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
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                          itemStyle={{ fontSize: '11px', color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="expected_value" name="Expected Growth" stroke="#2563EB" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        <Line type="monotone" dataKey="total_invested" name="Cumulative Cash" stroke="#64748B" strokeDasharray="4 4" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Simulator Projections Callout */}
                {simData && (
                  <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Invested</span>
                      <div className="text-sm font-bold text-textPrimary font-mono mt-1">${simData.total_invested.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Low Return (FV)</span>
                      <div className="text-sm font-bold text-danger font-mono mt-1">${simData.future_value_conservative.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Expected Return (FV)</span>
                      <div className="text-sm font-bold text-success font-mono mt-1">${simData.future_value_expected.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center p-12 glass-card text-center min-h-[420px]">
              <TrendingUp size={48} className="text-muted/40 animate-pulse mb-4" />
              <h3 className="text-base font-semibold text-textPrimary">Growth Projection Pending</h3>
              <p className="text-muted text-xs max-w-sm mt-1 leading-relaxed">
                Complete the risk profile questionnaire on the left to unlock recommended allocations and simulations.
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
export default Advisor;
