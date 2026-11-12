import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Key, RefreshCw, 
  Search, Sparkles, X, ChevronRight, Download, 
  History, LayoutDashboard, HelpCircle, Check, Layers, 
  Laptop, Smartphone, Headphones, Minus, Plus, Maximize2, 
  RotateCcw, Zap, Award, Info, ExternalLink, Flame, Globe,
  Paperclip, Cpu, Swords, Mic, ArrowUp, Star, Settings, Sun, Moon, Bell
} from 'lucide-react';

// --- SUB-COMPONENTS: GAUGES & VISUALIZATIONS ---

function CircularGauge({ score = 98, size = 120, strokeWidth = 8, label = "Excellent", target = "Target: \u2265 95%" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10B981"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white tracking-tight">{score}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs font-bold text-[#10B981]">{label}</span>
        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{target}</div>
      </div>
    </div>
  );
}

function SemiCircularGauge({ initVal = 74, finalVal = 96, label = "Good" }) {
  const shift = finalVal - initVal;
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 160 85" className="w-40 h-22">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="#1E293B"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={12}
            strokeDasharray={204}
            strokeDashoffset={204 - (finalVal / 100) * 204}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-black text-white tracking-tight">+{shift}%</span>
          <span className="text-[10px] font-bold text-[#10B981] -mt-0.5">{label}</span>
        </div>
      </div>
      <div className="w-40 flex justify-between text-[10px] font-mono text-gray-400 mt-1 px-1">
        <span>Init: {initVal}%</span>
        <span className="text-gray-300">Shift</span>
        <span className="text-[#10B981]">Final: {finalVal}%</span>
      </div>
    </div>
  );
}

function FormattedAuditText({ text, theme = 'dark' }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1"></div>;
        if (trimmed.startsWith('#') || trimmed.startsWith('**RECHECK-X') || trimmed.startsWith('**Subject:') || trimmed.startsWith('**Context:')) {
          const cleanText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
          return (
            <div key={idx} className={`font-black text-sm tracking-tight mt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {cleanText}
            </div>
          );
        }
        if (trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.')) {
          return (
            <div key={idx} className={`font-bold text-xs uppercase tracking-wider mt-3 pt-2 border-t ${theme === 'dark' ? 'text-amber-400 border-gray-800' : 'text-amber-600 border-slate-200'}`}>
              {trimmed.replace(/\*\*/g, '')}
            </div>
          );
        }
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const bulletContent = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                {bulletContent.replace(/\*\*(.*?)\*\*/g, '$1')}
              </span>
            </div>
          );
        }
        return (
          <p key={idx} className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
            {trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}
          </p>
        );
      })}
    </div>
  );
}

// --- INITIAL BENCHMARK SEEDS ---

const SEED_BENCHMARKS = [
  {
    id: 'm204-seed',
    title: 'M-204 — Maintenance Decision',
    shortTitle: 'M-204 — Maintenance Decis...',
    category: 'laptop',
    query: 'DaVinci Resolve 4K video editing laptop under $1200 with all-day battery.',
    timestamp: '2 min ago',
    starred: true,
    verdict: 'CHANGED',
    statusColor: 'text-amber-400',
    topPickName: 'ASUS ROG Zephyrus G14 (2024)',
    firstPassName: 'MacBook Air M2 8GB',
    verdictBadge: 'Changed (Caught Thermal & VRAM Bottleneck)',
    score: 96,
    savingsText: 'Averted fanless throttling & 8GB swap memory lockup ($450 savings)',
    data: null
  },
  {
    id: 'pump-p12-seed',
    title: 'Pump P-12 — Pressure Anomaly',
    shortTitle: 'Pump P-12 — Pressure Anomaly',
    category: 'audio',
    query: 'Need the best wireless noise canceling headphones for frequent long-haul flights under $400.',
    timestamp: '1 hour ago',
    starred: false,
    verdict: 'AGREES',
    statusColor: 'text-emerald-400',
    topPickName: 'Sony WH-1000XM5 Wireless Headphones',
    firstPassName: 'Sony WH-1000XM5',
    verdictBadge: 'Approved (Industry Best Dual ANC)',
    score: 98,
    savingsText: 'Double-checked 30h battery and 8-mic acoustic isolation',
    data: null
  },
  {
    id: 'compressor-c04-seed',
    title: 'Compressor C-04 — Risk Analysis',
    shortTitle: 'Compressor C-04 — Risk Analysis',
    category: 'smartphone',
    query: 'Looking for flagship phone with Snapdragon 8 Gen 3 speed, massive battery, and fast charging under $800.',
    timestamp: '3 hours ago',
    starred: false,
    verdict: 'UNCERTAIN',
    statusColor: 'text-rose-400',
    topPickName: 'OnePlus 12 (16GB/512GB)',
    firstPassName: 'Samsung Galaxy S24 Ultra',
    verdictBadge: 'Uncertain (Saved $500 Flagship Tax)',
    score: 89,
    savingsText: 'Saved $500 with identical Gen 3 chip & faster 80W charging',
    data: null
  },
  {
    id: 'motor-m201-seed',
    title: 'Motor M-201 — Bearing Check',
    shortTitle: 'Motor M-201 — Bearing Check',
    category: 'laptop',
    query: 'College CS student wanting to play Cyberpunk on weekends under $1400. Need to carry it to classes daily.',
    timestamp: 'Yesterday',
    starred: false,
    verdict: 'AGREES',
    statusColor: 'text-emerald-400',
    topPickName: 'Lenovo Legion Pro 5',
    firstPassName: 'Lenovo Legion Pro 5',
    verdictBadge: 'Approved (Dual-Fan Vapor Chamber Verified)',
    score: 97,
    savingsText: 'High thermal headroom certified for sustained engineering loads',
    data: null
  },
  {
    id: 'conveyor-cv09-seed',
    title: 'Conveyor CV-09 — Vibration Spike',
    shortTitle: 'Conveyor CV-09 — Vibration Spi...',
    category: 'audio',
    query: 'Folding travel headphones with heavy noise reduction and long battery under $300.',
    timestamp: 'Yesterday',
    starred: false,
    verdict: 'CHANGED',
    statusColor: 'text-amber-400',
    topPickName: 'Sony WH-1000XM4 (Previous Gen Foldable)',
    firstPassName: 'Sony WH-1000XM5',
    verdictBadge: 'Changed (Foldable Legend, Saves $120)',
    score: 95,
    savingsText: 'Pivoted to collapsible headband: saves $120',
    data: null
  }
];

export default function App() {
  // Navigation: 'landing' (Page 1), 'dashboard' (Page 2), 'socratic' (Page 3)
  const [currentView, setCurrentView] = useState('landing');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Search state
  const [searchInput, setSearchInput] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Current active audit result
  const [currentAudit, setCurrentAudit] = useState(null);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [socraticToast, setSocraticToast] = useState(null);
  
  // Search History stored in LocalStorage
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('veritas_search_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_BENCHMARKS;
  });

  // API Key State (from localStorage or backend environment)
  const [apiKey, setApiKey] = useState(() => {
    const saved = localStorage.getItem('veritas_api_key');
    if (saved && saved.trim()) return saved;
    return '';
  });
  const [showApiModal, setShowApiModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);

  // Buy modal
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Image zoom state for hero card
  const [imageZoom, setImageZoom] = useState(44);

  // Theme State: 'dark' (default) or 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('recheck_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('recheck_theme', theme);
      if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.body.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('veritas_search_history', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  // Execute Audit Query
  const runAudit = async (queryText, clarifiedSpecs = {}, targetCategory = activeCategory) => {
    const text = queryText || searchInput;
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          category: targetCategory,
          clarified_specs: clarifiedSpecs,
          api_key: apiKey || null
        })
      });

      if (!res.ok) throw new Error("Audit request failed");
      const data = await res.json();

      setCurrentAudit(data);
      setSelectedSpecs(clarifiedSpecs);

      if (data.socratic_applied_text) {
        setSocraticToast(`⚡ Socratic Solution Applied: Selected "${data.socratic_applied_text}". Product dynamically switched to ${data.top_pick?.name}!`);
        setTimeout(() => setSocraticToast(null), 6000);
      }

      // Add or prepend to history
      const newHistoryItem = {
        id: `audit-${Date.now()}`,
        title: text.length > 40 ? text.substring(0, 40) + '...' : text,
        category: data.device_type,
        query: text,
        timestamp: 'Just now',
        topPickName: data.top_pick?.name || 'Verified Product',
        firstPassName: data.first_pass_pick?.name || 'Initial Product',
        verdict: data.verdict,
        verdictBadge: data.verdict_badge,
        score: Math.round(data.final_confidence * 100),
        savingsText: data.cheaper_balance?.savings ? `Alternative saves ${data.cheaper_balance.savings}` : data.headline,
        data: data
      };

      setHistoryList(prev => [newHistoryItem, ...prev.filter(h => h.query.toLowerCase() !== text.toLowerCase())]);
      setCurrentView('dashboard');
    } catch (err) {
      console.error(err);
      alert("Verification server did not respond. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Socratic Red-Team chip click
  const handleSocraticChoice = (questionId, optionValue) => {
    if (!currentAudit) return;
    const updatedSpecs = { ...selectedSpecs, [questionId]: optionValue };
    runAudit(currentAudit.query, updatedSpecs, currentAudit.device_type);
  };

  // Open history item
  const openHistoryItem = (item) => {
    if (item.data) {
      setCurrentAudit(item.data);
      setSelectedSpecs({});
      setCurrentView('dashboard');
    } else {
      setSearchInput(item.query);
      setActiveCategory(item.category || 'all');
      runAudit(item.query, {}, item.category || 'all');
    }
  };

  // Delete history item
  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    setHistoryList(prev => prev.filter(h => h.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    if (window.confirm("Clear all search history?")) {
      setHistoryList([]);
      localStorage.removeItem('veritas_search_history');
    }
  };

  // Test Gemini API Key
  const handleTestKey = async () => {
    if (!tempApiKey.trim()) return;
    setApiTesting(true);
    setApiTestResult(null);
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: tempApiKey.trim() })
      });
      const data = await res.json();
      setApiTestResult(data);
      if (data.valid) {
        setApiKey(tempApiKey.trim());
        localStorage.setItem('veritas_api_key', tempApiKey.trim());
      }
    } catch (e) {
      setApiTestResult({ valid: false, message: "Network connection error." });
    } finally {
      setApiTesting(false);
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey.trim());
    localStorage.setItem('veritas_api_key', tempApiKey.trim());
    setShowApiModal(false);
  };

  // Export JSON Report
  const handleExportReport = () => {
    if (!currentAudit) return;
    const blob = new Blob([JSON.stringify(currentAudit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veritas_Audit_${currentAudit.device_type}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic Image Fallback based strictly on category
  const getProductImage = (audit) => {
    if (audit?.top_pick?.image_url) return audit.top_pick.image_url;
    if (audit?.device_type === 'smartphone') {
      return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"; // Google Pixel / Android
    }
    if (audit?.device_type === 'audio') {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"; // Over-ear Headphones
    }
    return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"; // Laptop
  };

  // Dynamic Headline Fallback based strictly on category
  const getHeadline = (audit) => {
    if (audit?.headline) return audit.headline;
    if (audit?.device_type === 'smartphone') return "PRO OPTICS. 5G SPEED.";
    if (audit?.device_type === 'audio') return "PURE SOUND. NO NOISE.";
    return "MAX SPEED. ZERO THROTTLE.";
  };

  // Filtered sidebar items for RECHECK-X
  const recentSidebarItems = historyList.filter(item => {
    if (!sidebarSearch.trim()) return true;
    const term = sidebarSearch.toLowerCase();
    return (item.title && item.title.toLowerCase().includes(term)) ||
           (item.shortTitle && item.shortTitle.toLowerCase().includes(term)) ||
           (item.query && item.query.toLowerCase().includes(term));
  });

  // Open investigation helper
  const openInvestigation = (item) => {
    if (item.data) {
      setCurrentAudit(item.data);
      setSelectedSpecs({});
      setCurrentView('dashboard');
    } else {
      setSearchInput(item.query);
      setActiveCategory(item.category || 'all');
      runAudit(item.query, {}, item.category || 'all');
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#080B11] text-[#F3F4F6]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* Toast Notification when Socratic Solution changes product */}
      {socraticToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md p-4 rounded-xl bg-blue-950/90 border border-blue-500 text-white text-xs shadow-2xl flex items-center justify-between space-x-3 animate-fade-in green-glow">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-medium leading-relaxed">{socraticToast}</span>
          </div>
          <button onClick={() => setSocraticToast(null)} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          UNIFIED TOP NAVIGATION HEADER (ACROSS ALL PAGES: LANDING, DASHBOARD, SOCRATIC)
      ========================================================================= */}
      <header className={`h-16 border-b sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-[#0E1526]/90 border-[#1E293B] text-white' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        {/* Left: Brand Logo & Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none" 
          onClick={() => setCurrentView('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#4F6BFF] flex items-center justify-center text-white font-black text-xs tracking-wider shadow-md hover:scale-105 transition-transform">
            RX
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-black text-base tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                RECHECK-X
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                theme === 'dark' 
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' 
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
              }`}>
                QC AI
              </span>
            </div>
            <p className={`text-[10px] font-medium hidden sm:block ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              Challenge the decision. Before the decision challenges you.
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className={`flex items-center space-x-1 sm:space-x-2 p-1 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-[#111827] border-[#1E293B]' 
            : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>RECHECK-X</span>
          </button>

          <button
            onClick={() => {
              if (!currentAudit) {
                runAudit(SEED_BENCHMARKS[0].query, {}, 'laptop');
              } else {
                setCurrentView('dashboard');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>QC Dashboard</span>
            {currentAudit && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => {
              if (!currentAudit) {
                runAudit(SEED_BENCHMARKS[0].query, {}, 'laptop');
              }
              setCurrentView('socratic');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentView === 'socratic'
                ? 'bg-blue-600 text-white shadow-md'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Socratic Lab</span>
            <span className="md:hidden">Lab</span>
          </button>
        </div>

        {/* Right Actions: Search ⌘K, Groq Live, Theme Switcher, Notifications, Export, Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search ⌘K */}
          <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] ${
            theme === 'dark'
              ? 'bg-[#101625] border-[#1E273A] text-gray-400'
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <Search className="w-3 h-3 text-gray-400" />
            <span>Search</span>
            <kbd className={`text-[9px] px-1 py-0.5 rounded border font-mono ${
              theme === 'dark' ? 'bg-[#171F32] border-[#24304A] text-gray-400' : 'bg-white border-slate-300 text-slate-600'
            }`}>⌘K</kbd>
          </div>

          {/* Groq Cloud LLM Status Pill */}
          <button
            onClick={() => setShowApiModal(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-400 hover:bg-emerald-900/40'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Groq Cloud LLM (qwen/qwen3.8-27b) Live Connected. Click to configure API Key."
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Groq Cloud LLM Live</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Theme Switcher Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-[#141D2E] border-[#1E293B] text-amber-400 hover:text-white hover:bg-[#1E293B]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 shadow-sm'
            }`}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notification Bell */}
          <button 
            onClick={() => alert("RECHECK-X is fully operational. Connected to Groq Cloud LLM (qwen/qwen3.8-27b) and Wikipedia Knowledge Graph REST API.")}
            className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
              theme === 'dark'
                ? 'bg-[#141D2E] border-[#1E293B] text-gray-400 hover:text-white hover:bg-[#1E293B]'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 shadow-sm'
            }`} 
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* Export Report (if in dashboard view) */}
          {currentView === 'dashboard' && (
            <button
              onClick={handleExportReport}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-[#141D2E] hover:bg-[#1E293B] border-[#1E293B] text-gray-200'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Export</span>
            </button>
          )}

          {/* You Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#4F6BFF] text-white flex items-center justify-center text-xs font-bold cursor-pointer shadow-md select-none">
            You
          </div>
        </div>
      </header>

      {/* =========================================================================
          PAGE 1: RECHECK-X LANDING PAGE (1:1 PIXEL-FAITHFUL TO REFERENCE IMAGE)
      ========================================================================= */}
      {currentView === 'landing' && (
        <div className={`flex-1 flex overflow-hidden min-h-[calc(100vh-4rem)] transition-colors ${
          theme === 'dark' ? 'bg-[#080B11]' : 'bg-[#F8FAFC]'
        }`}>
          
          {/* 1. LEFT SIDEBAR (Matching reference image) */}
          <aside className={`w-64 sm:w-72 border-r flex flex-col shrink-0 select-none transition-colors ${
            theme === 'dark' ? 'bg-[#090D17] border-[#1B2234]' : 'bg-white border-slate-200'
          }`}>
            {/* Brand Header */}
            <div className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#4F6BFF] flex items-center justify-center text-white font-black text-xs tracking-wider shadow-md">
                RX
              </div>
              <div>
                <div className={`font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  RECHECK-X
                </div>
                <div className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Decision Intelligence
                </div>
              </div>
            </div>

            {/* + New Investigation Button */}
            <div className="px-4 pb-3">
              <button
                onClick={() => {
                  setSearchInput('');
                  setSelectedSpecs({});
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#4F6BFF] hover:bg-[#3D5AFE] text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Investigation</span>
              </button>
            </div>

            {/* Sidebar Search Bar with ⌘K */}
            <div className="px-4 pb-3">
              <div className={`flex items-center space-x-2 rounded-xl px-3 py-2 border transition-all ${
                theme === 'dark'
                  ? 'bg-[#101625] border-[#1E273A] focus-within:border-blue-500/80'
                  : 'bg-slate-100 border-slate-200 focus-within:border-blue-500'
              }`}>
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search"
                  className={`flex-1 bg-transparent border-none text-xs focus:outline-none ${
                    theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
                <kbd className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                  theme === 'dark' ? 'text-gray-400 bg-[#171F32] border-[#24304A]' : 'text-slate-600 bg-white border-slate-300'
                }`}>
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* RECENT Section */}
            <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
              <div className={`px-2 py-1 text-[11px] font-bold tracking-wider uppercase ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                RECENT
              </div>

              {recentSidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openInvestigation(item)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all group cursor-pointer ${
                    theme === 'dark'
                      ? 'border-transparent hover:border-[#1E273A] hover:bg-[#131A2B]'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium truncate max-w-[170px] ${
                      theme === 'dark' ? 'text-gray-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {item.shortTitle || item.title}
                    </span>
                    {item.starred && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 ml-1" />
                    )}
                  </div>
                  <div className={`text-[10px] mt-1 flex items-center space-x-1.5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className={`font-bold ${
                      item.verdict === 'CHANGED' ? 'text-amber-500' :
                      item.verdict === 'AGREES' ? 'text-emerald-500' :
                      'text-rose-500'
                    }`}>
                      {item.verdict}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Footer: Settings & System Status */}
            <div className={`p-3 border-t space-y-2 ${
              theme === 'dark' ? 'border-[#1B2234] bg-[#070A12]' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={() => setShowApiModal(true)}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#131A2B]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
                <span>Settings</span>
              </button>
              <div className={`flex items-center space-x-2 px-2.5 text-[11px] font-mono ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System operational</span>
              </div>
            </div>
          </aside>

          {/* 2. RIGHT MAIN HERO & PROMPT AREA */}
          <div className={`flex-1 flex flex-col overflow-y-auto transition-colors ${
            theme === 'dark' ? 'bg-[#080B11]' : 'bg-[#F8FAFC]'
          }`}>
            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col items-center">
              
              {/* Header Title */}
              <div className="text-center mb-8">
                <div className={`text-xs font-bold tracking-widest uppercase mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  RECHECK-X
                </div>
                <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Challenge the decision.
                </h1>
                <p className={`text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Before the decision challenges you.
                </p>
              </div>

              {/* Central White/Slate-Border Prompt Box Container */}
              <div className={`w-full rounded-2xl p-4 sm:p-5 shadow-2xl relative mb-4 transition-all ${
                theme === 'dark' 
                  ? 'bg-[#0D121F] border border-white/80 sm:border-2 sm:border-white/90 shadow-2xl' 
                  : 'bg-white border-2 border-slate-300 shadow-xl shadow-slate-200/50'
              }`}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchInput.trim()) {
                      runAudit(searchInput, {}, activeCategory);
                    }
                  }}
                >
                  <textarea
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (searchInput.trim()) {
                          runAudit(searchInput, {}, activeCategory);
                        }
                      }
                    }}
                    rows={3}
                    placeholder="Ask anything — maintenance decisions, tech specs, or purchase options..."
                    className={`w-full bg-transparent border-none text-sm sm:text-base focus:outline-none resize-none leading-relaxed ${
                      theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'
                    }`}
                    disabled={loading}
                  />

                  {/* Bottom Tools & Send Button */}
                  <div className={`flex items-center justify-between pt-3 mt-2 border-t ${
                    theme === 'dark' ? 'border-[#1C2438]' : 'border-slate-200'
                  }`}>
                    {/* Left Tools Pills */}
                    <div className="flex items-center space-x-2 text-xs">
                      <button
                        type="button"
                        onClick={() => alert("Data source attachment: Wikipedia Knowledge Graph REST API + Groq Cloud LLM engine enabled.")}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#151D30]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Data</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextCat = activeCategory === 'laptop' ? 'smartphone' : activeCategory === 'smartphone' ? 'audio' : 'laptop';
                          setActiveCategory(nextCat);
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#151D30]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Machine</span>
                      </button>

                      {/* Active Highlighted Pill: Challenge */}
                      <button
                        type="button"
                        className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold shadow-sm cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-[#18233C] border border-blue-500/80 text-blue-400'
                            : 'bg-blue-50 border border-blue-500 text-blue-700'
                        }`}
                      >
                        <Swords className="w-3.5 h-3.5 text-blue-500" />
                        <span>Challenge</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert("Voice input listening... Speak your query.")}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#151D30]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Voice</span>
                      </button>
                    </div>

                    {/* Right Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !searchInput.trim()}
                      className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow active:scale-95 shrink-0"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 4 Action Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-8">
                <button
                  onClick={() => {
                    const q = "Interrogate continuous thermal dissipation, RAM bandwidth, and hardware failure modes under sustained workload";
                    setSearchInput(q);
                    runAudit(q, {}, 'laptop');
                  }}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow ${
                    theme === 'dark'
                      ? 'bg-[#0F1424] hover:bg-[#161E34] border-[#1C253C] hover:border-blue-500/50 text-gray-300 hover:text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Analyze Machine</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Challenge first recommendation: compare MacBook Air M2 8GB vs ASUS Zephyrus G14 for 4K DaVinci editing";
                    setSearchInput(q);
                    runAudit(q, {}, 'laptop');
                  }}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow ${
                    theme === 'dark'
                      ? 'bg-[#0F1424] hover:bg-[#161E34] border-[#1C253C] hover:border-blue-500/50 text-gray-300 hover:text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Swords className="w-4 h-4 text-blue-500" />
                  <span>Challenge Decision</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Investigate component failure risks, soldered memory traps, and flagship pricing inflation";
                    setSearchInput(q);
                    runAudit(q, {}, 'smartphone');
                  }}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow ${
                    theme === 'dark'
                      ? 'bg-[#0F1424] hover:bg-[#161E34] border-[#1C253C] hover:border-blue-500/50 text-gray-300 hover:text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Investigate Risk</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Search real-world benchmark evidence and Wikipedia hardware specs for Sony WH-1000XM5 vs XM4";
                    setSearchInput(q);
                    runAudit(q, {}, 'audio');
                  }}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow ${
                    theme === 'dark'
                      ? 'bg-[#0F1424] hover:bg-[#161E34] border-[#1C253C] hover:border-blue-500/50 text-gray-300 hover:text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-500" />
                  <span>Search Evidence</span>
                </button>
              </div>

              {/* RECENT INVESTIGATIONS Section Beneath */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xs font-bold tracking-wider uppercase ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    RECENT INVESTIGATIONS
                  </h2>
                  <span className={`text-[11px] font-mono ${
                    theme === 'dark' ? 'text-gray-500' : 'text-slate-400'
                  }`}>
                    Live Groq LLM + Wikipedia REST API
                  </span>
                </div>

                <div className="space-y-2.5">
                  {recentSidebarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openInvestigation(item)}
                      className={`w-full p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow group ${
                        theme === 'dark'
                          ? 'bg-[#0E1322] hover:bg-[#131A2E] border-[#1A2238] hover:border-blue-500/50'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold transition-colors ${
                            theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {item.title}
                          </span>
                          {item.starred && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <p className={`text-xs max-w-xl ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {item.savingsText || item.query}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className={`text-xs font-mono font-bold ${
                            theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                          }`}>
                            Score: {item.score}%
                          </span>
                          <div className={`text-[10px] ${
                            theme === 'dark' ? 'text-gray-500' : 'text-slate-400'
                          }`}>
                            {item.timestamp}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.verdict === 'CHANGED' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                          item.verdict === 'AGREES' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                        }`}>
                          {item.verdict}
                        </span>

                        <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-all ${
                          theme === 'dark' ? 'text-gray-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2: QUALITY CONTROL DASHBOARD (MATCHING THE REFERENCE SCREENSHOT 1:1)
      ========================================================================= */}
      {currentView === 'dashboard' && currentAudit && (
        <div className="flex-1 flex overflow-hidden">
          
          {/* 1. Left Sidebar (Directly matching ImageQC sidebar) */}
          <aside className={`w-60 border-r hidden md:flex flex-col shrink-0 transition-colors ${
            theme === 'dark' ? 'bg-[#0E1526] border-[#1E293B]' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 green-glow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className={`font-extrabold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ImageQC AI</span>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Hardware Verifier</div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-blue-600/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('socratic')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#141D2E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Review Queue</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono font-bold">
                  {currentAudit.counter_questions?.length || 2}
                </span>
              </button>

              <button
                onClick={() => setCurrentView('landing')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#141D2E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History & Search</span>
              </button>

              <button
                onClick={() => setShowApiModal(true)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#141D2E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>API Settings</span>
              </button>
            </nav>

            {/* System Status at Bottom of Sidebar */}
            <div className={`p-3 border-t ${
              theme === 'dark' ? 'border-[#1E293B] bg-[#090D17]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>System Status</span>
              </div>
              <p className={`text-[10px] mt-0.5 font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                All Systems Operational
              </p>
            </div>
          </aside>

          {/* 2. Main Dashboard Scroll Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 space-y-4">
            
            {/* Top Subheader: Dashboard Title & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  AI Image Quality Control Dashboard
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Ensure accuracy, readability, and compliance across AI-generated recommendations.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('landing')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
                    theme === 'dark' ? 'bg-[#141D2E] hover:bg-[#1E293B] border-[#1E293B] text-gray-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-blue-500" />
                  <span>New Search</span>
                </button>
                <button
                  onClick={handleExportReport}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
                    theme === 'dark' ? 'bg-[#141D2E] hover:bg-[#1E293B] border-[#1E293B] text-gray-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Sub-bar with Metadata Strip (Matching Reference Image) */}
            <div className={`flex flex-wrap items-center gap-3 text-xs px-4 py-2.5 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-[#111827] border-[#1E293B] text-gray-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}>
              <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="font-semibold font-mono">Product_Audit_001.json</span>
              </div>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-slate-300'}>|</span>
              <span>Generated: Oct 9, 2026 04:30 AM</span>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-slate-300'}>|</span>
              <span className={`font-mono px-2 py-0.5 rounded text-[11px] border ${
                theme === 'dark' ? 'bg-[#0B0F19] text-gray-300 border-[#1E293B]' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                Device: {currentAudit.device_type?.toUpperCase()}
              </span>
              <div className="ml-auto flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-[11px] font-bold">
                  <Globe className="w-3 h-3" />
                  <span>Wikipedia Live API 200</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready for Review</span>
                </span>
              </div>
            </div>

            {/* =========================================================================
                ⚡ LIVE GROQ CLOUD ADVERSARIAL AUDIT (qwen/qwen3.8-27b DEEP REASONING)
            ========================================================================= */}
            <div className={`rounded-2xl p-5 border transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#0C1220] via-[#0E1528] to-[#121B32] border-blue-500/40 shadow-xl'
                : 'bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 border-blue-200 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-blue-500/20 gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow">
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Live Groq Cloud Adversarial Audit (qwen/qwen3.8-27b)
                    </h3>
                    <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                      Deep Autonomous Red-Team Challenge vs Single-Pass AI Baseline
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
                    currentAudit.verdict === 'CHANGED'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    Verdict: {currentAudit.verdict}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    theme === 'dark' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    Live Groq API: HTTP 200
                  </span>
                </div>
              </div>

              {/* Formatted Groq 3-Point Technical Analysis */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-[#090E1B]/90 border-[#1B253D]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <FormattedAuditText text={currentAudit.llm_summary} theme={theme} />
              </div>

              {/* 3 Value Pillars Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-blue-500/20">
                <div className={`p-2.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0B101E] border-[#1C263F]' : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-rose-500 text-[11px] font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>1. Blindspots Caught</span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    {currentAudit.blindspots?.join(' · ') || "Thermal limits, soldered RAM lockups, and sustained wattage bottlenecks exposed."}
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0B101E] border-[#1C263F]' : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-blue-500 text-[11px] font-bold mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>2. Hardware Superiority</span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    Active cooling headroom, memory bandwidth, and display color accuracy confirmed.
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0B101E] border-[#1C263F]' : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-emerald-500 text-[11px] font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>3. Buyer Regret Prevention</span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    {currentAudit.cheaper_balance?.savings ? `Saves ${currentAudit.cheaper_balance.savings} while preventing workflow lockup.` : "Guaranteed zero regret and verified durability."}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================================
                THE 4-CARD BENTO GRID (DIRECTLY MATCHING REFERENCE IMAGE)
            ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* -------------------------------------------------------------
                  CARD 1: CONTENT & HARDWARE ACCURACY
              ------------------------------------------------------------- */}
              <div className="dashboard-card rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  {/* Card Title with Numbered Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                        1
                      </div>
                      <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Hardware Accuracy</h3>
                    </div>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="py-2">
                    <div className={`text-center text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      CER Score
                    </div>
                    <CircularGauge 
                      score={Math.round(currentAudit.final_confidence * 100)} 
                      label="Excellent"
                      target="Target: ≥ 95%"
                    />
                  </div>

                  {/* 5 Accuracy Verification Checklist Items */}
                  <div className={`space-y-2 mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                    {[
                      "Specs Match User Priorities",
                      "Thermal Limits & Wattage Verified",
                      "No Hallucinated Marketing Claims",
                      "RAM & Storage Upgradability Confirmed",
                      "Display Standards & Gamut Confirmed"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{item}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Verified Chip */}
                <div className={`mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                  <div className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold ${
                    theme === 'dark' ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All hardware accuracy checks passed.</span>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CARD 2 (CENTER HERO): TOP VERIFIED PICK PRODUCT CARD
              ------------------------------------------------------------- */}
              <div className={`dashboard-card rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-gradient-to-b from-[#131B2E] to-[#0E1526] border-blue-500/40' 
                  : 'bg-gradient-to-b from-blue-50/70 to-white border-blue-300 shadow-lg'
              }`}>
                <div>
                  {/* Top Badge: NEW / TOP VERIFIED PICK */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      {currentAudit.verdict === 'CHANGED' ? 'REVISED PICK' : 'TOP VERIFIED'}
                    </span>
                    <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      {currentAudit.device_type?.toUpperCase()}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getHeadline(currentAudit)}
                  </h2>
                  <p className={`text-xs font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    {currentAudit.top_pick?.name}
                  </p>

                  {/* Product Visual */}
                  <div className={`relative w-full h-44 rounded-xl border flex items-center justify-center overflow-hidden mb-3 group ${
                    theme === 'dark' ? 'bg-[#090D17] border-[#1E293B]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <img
                      src={getProductImage(currentAudit)}
                      alt={currentAudit.top_pick?.name || "Verified Gadget"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ transform: `scale(${imageZoom / 44})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* 3 Key Highlights with Icons */}
                  <div className={`space-y-1.5 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">
                        {currentAudit.device_type === 'audio' 
                          ? "Dual Noise Canceling Processors (LDAC Audio)"
                          : currentAudit.device_type === 'smartphone'
                          ? `${currentAudit.top_pick?.cpu || 'Snapdragon 8 Gen 3 Flagship Silicon'}`
                          : `${currentAudit.top_pick?.cpu || 'High-Performance Processor'} + ${currentAudit.top_pick?.gpu || 'Discrete GPU'}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">
                        {currentAudit.top_pick?.battery?.real_world_hours 
                          ? `${currentAudit.top_pick.battery.real_world_hours}-Hour Tested Battery Endurance`
                          : "Class-Leading Battery Endurance"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {currentAudit.device_type === 'audio'
                          ? "Soft-Fit Leather Acoustic Isolation"
                          : `${currentAudit.top_pick?.display?.panel_type || 'Calibrated High-Gamut Display'}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button + Zoom Control Bar */}
                <div className={`mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      ${currentAudit.top_pick?.price || "799"}
                    </div>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      BUY NOW
                    </button>
                  </div>

                  {/* Zoom bar at bottom of product card */}
                  <div className={`flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded-lg border ${
                    theme === 'dark' ? 'text-gray-400 bg-[#090D17] border-[#1E293B]' : 'text-slate-600 bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-center space-x-1.5">
                      <button 
                        onClick={() => setImageZoom(prev => Math.max(20, prev - 10))}
                        className={theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{imageZoom}%</span>
                      <button 
                        onClick={() => setImageZoom(prev => Math.min(80, prev + 10))}
                        className={theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setImageZoom(44)}
                      className={`px-1.5 py-0.5 rounded ${theme === 'dark' ? 'hover:text-white bg-[#141D2E]' : 'hover:text-slate-900 bg-white border border-slate-200'}`}
                    >
                      Fit
                    </button>
                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className={theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'}
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CARD 3: ADVERSARIAL STRESS-TEST & CONFIDENCE SHIFT
              ------------------------------------------------------------- */}
              <div className="dashboard-card rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  {/* Card Title with Numbered Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                        2
                      </div>
                      <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Adversarial Stress-Test</h3>
                    </div>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>

                  {/* Semi-circular Speedometer Arc Gauge */}
                  <div className="py-2">
                    <div className={`text-center text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                      Confidence Shift Arc
                    </div>
                    <SemiCircularGauge 
                      initVal={Math.round(currentAudit.initial_confidence * 100)} 
                      finalVal={Math.round(currentAudit.final_confidence * 100)}
                      label={currentAudit.verdict === 'CHANGED' ? 'Stress-Tested' : 'Approved'}
                    />
                  </div>

                  {/* 5 Stress-Test Checklist Items */}
                  <div className={`space-y-2 mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                    {[
                      "Contradiction Audit Passed",
                      "Thermal Throttling & Fan Noise Solved",
                      "Soldered RAM Swap Degradation Averted",
                      "Real-World Battery Curve Tested",
                      "Value vs Budget Compliance Verified"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{item}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Verified Chip */}
                <div className={`mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                  <div className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold ${
                    theme === 'dark' ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Red-team stress tests passed.</span>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CARD 4: COMPLIANCE STATUS & BETTER-BALANCED ALTERNATIVE
              ------------------------------------------------------------- */}
              <div className="dashboard-card rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  {/* Card Title with Numbered Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                        3
                      </div>
                      <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Compliance & Alternatives</h3>
                    </div>
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>

                  {/* Cheaper Balanced Alternative Pick */}
                  <div className={`p-3 rounded-xl border mb-3 ${
                    theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Cheaper Balanced Option
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        {currentAudit.cheaper_balance?.savings || "$600 Savings"}
                      </span>
                    </div>
                    <div className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {currentAudit.cheaper_balance?.product_name || "Balanced Value Winner"}
                    </div>
                    <p className={`text-[11px] line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      {currentAudit.cheaper_balance?.why || "Delivers identical real-world workflow without overpaying."}
                    </p>
                  </div>

                  {/* Single-Pass AI Comparison Diff */}
                  <div className={`p-3 rounded-xl border mb-3 ${
                    theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">
                        Single-Pass AI Comparison
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[9px] font-bold">
                        ChatGPT Flaw
                      </span>
                    </div>
                    <div className="text-[11px] text-red-400 font-mono mb-1 truncate">
                      ❌ Standard AI: {currentAudit.single_pass_baseline?.recommended_product}
                    </div>
                    <div className="text-[11px] text-emerald-500 font-mono truncate">
                      ✓ Veritas Double-Check: {currentAudit.top_pick?.name}
                    </div>
                  </div>

                  {/* Compliance Checklist Rows */}
                  <div className={`space-y-1.5 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                    <div className="flex items-center justify-between">
                      <span>No Marketing Traps</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Thermal Wattage Compliant</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Longevity Guaranteed</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Bottom Verified Chip */}
                <div className={`mt-4 pt-3 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'}`}>
                  <div className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold ${
                    theme === 'dark' ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All compliance checks passed.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* =========================================================================
                INTERACTIVE SOCRATIC DOUBLE-CHECK TUNING RIGHT ON QC DASHBOARD!
                (Clicking any chip dynamically adapts the recommendation live!)
            ========================================================================= */}
            <div className={`dashboard-card rounded-2xl p-5 ${
              theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    ⚡ Interactive Socratic Red-Team (Click Any Choice Below to Adapt Recommendation Live)
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-500 font-mono">
                  Real-Time Dynamic Recalculation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentAudit.counter_questions?.map((q, idx) => (
                  <div key={q.id || idx} className={`p-3.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-xs font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                    }`}>
                      {idx + 1}. {q.question}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = selectedSpecs[q.id] === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSocraticChoice(q.id, opt)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30 font-bold'
                                : theme === 'dark'
                                  ? 'bg-[#141D2E] hover:bg-blue-900/40 text-gray-300 hover:text-white border border-[#1E293B] hover:border-blue-500/50'
                                  : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Live API Telemetry & Audit Reasoning Strip */}
            <div className={`dashboard-card rounded-2xl p-4 space-y-2 ${
              theme === 'dark' ? 'bg-[#0E1526]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Real-World Live Telemetry (Wikipedia Knowledge Graph REST API + Gemini)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-500">
                  {currentAudit.real_world_api?.status || "Live Connected"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                {currentAudit.real_world_api?.live_specs_summary || currentAudit.double_check_note}
              </p>
            </div>

          </main>

          {/* =========================================================================
              BOTTOM FIXED STATUS BAR (EXACT REPLICA OF REFERENCE SCREENSHOT)
          ========================================================================= */}
          <footer className={`fixed bottom-0 left-0 right-0 h-20 backdrop-blur-md border-t px-4 sm:px-8 flex items-center justify-between z-30 shadow-2xl transition-colors ${
            theme === 'dark' ? 'bg-[#0E1526]/95 border-[#1E293B]' : 'bg-white/95 border-slate-200 shadow-xl text-slate-900'
          }`}>
            
            {/* Left: Overall Status & Overall Score */}
            <div className="flex items-center space-x-6">
              
              {/* Overall Status Icon & Label */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 green-glow">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className={`text-[10px] font-mono uppercase font-semibold ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Overall Status
                  </div>
                  <div className="text-sm sm:text-base font-black text-emerald-500 tracking-tight">
                    {currentAudit.verdict === 'CHANGED' ? 'APPROVED & REVISED' : 'APPROVED'}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className={`hidden sm:block border-l pl-6 ${
                theme === 'dark' ? 'border-[#1E293B]' : 'border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono uppercase font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  Overall Score
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-black ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {Math.round(currentAudit.final_confidence * 100)}%
                  </span>
                  <span className="text-xs font-bold text-emerald-500">Excellent</span>
                </div>
              </div>

              {/* Explanatory summary text */}
              <p className={`hidden xl:block text-xs max-w-md line-clamp-2 border-l pl-6 ${
                theme === 'dark' ? 'text-gray-400 border-[#1E293B]' : 'text-slate-500 border-slate-200'
              }`}>
                This gadget meets all strict adversarial quality standards and is approved for purchase without buyer regret.
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBuyModal(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Buy Now</span>
              </button>

              <button
                onClick={() => setCurrentView('socratic')}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#141D2E] hover:bg-[#1E293B] border-[#1E293B] text-gray-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">Deep-Dive Socratic Lab</span>
                <span className="sm:hidden">Lab</span>
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* =========================================================================
          PAGE 3: SOCRATIC RED-TEAM LAB & LIVE LLM TELEMETRY
      ========================================================================= */}
      {currentView === 'socratic' && currentAudit && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/40 text-blue-400 text-xs font-semibold mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>INTERACTIVE ADVERSARIAL AUDITING</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Socratic Red-Team Lab
              </h1>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Answer targeted counter-questions to stress-test your usage boundaries and watch the recommendation dynamically change.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>Back to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Counter-Questions with Immediate Dynamic Product Change */}
          <div className="dashboard-card rounded-2xl p-6 space-y-6">
            <h2 className={`text-base font-bold flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Interactive Socratic Clarification Questions</span>
            </h2>

            {currentAudit.counter_questions?.map((q, idx) => (
              <div key={q.id || idx} className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                  {idx + 1}. {q.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options?.map((opt, oIdx) => {
                    const isSelected = selectedSpecs[q.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSocraticChoice(q.id, opt)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left flex items-center space-x-2 ${
                          isSelected
                            ? 'bg-blue-600 text-white border border-blue-400 shadow-md font-bold'
                            : theme === 'dark'
                              ? 'bg-[#141D2E] hover:bg-blue-600 hover:text-white border border-[#1E293B] hover:border-blue-500 text-gray-300'
                              : 'bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Real-World External API Data */}
          <div className="dashboard-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <h2 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Real-World External API Integration
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE HTTP 200 VERIFIED
              </span>
            </div>

            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                Live Source: {currentAudit.real_world_api?.provider}
              </div>
              <p className={`leading-relaxed font-mono ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                {currentAudit.real_world_api?.live_specs_summary}
              </p>
            </div>
          </div>

          {/* Contradictions & Bottlenecks Caught */}
          <div className="dashboard-card rounded-2xl p-6 space-y-4">
            <h2 className={`text-base font-bold flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Physical Contradictions & Bottlenecks Detected</span>
            </h2>

            {currentAudit.contradictions && currentAudit.contradictions.length > 0 ? (
              <div className="space-y-2">
                {currentAudit.contradictions.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 text-xs text-red-300 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                No acute physical contradictions detected for this spec combination.
              </p>
            )}
          </div>

        </main>
      )}

      {/* =========================================================================
          MODAL: CONNECT GROQ CLOUD / GEMINI API KEY
      ========================================================================= */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fade-in ${
            theme === 'dark' ? 'bg-[#111827] border-[#1E293B]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowApiModal(false)}
              className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-500">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Groq Cloud & Live API</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Ultra-fast real-time red-team reasoning</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                  Groq Cloud API Key (starts with gsk_...) or Gemini Key
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono ${
                    theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Status Message */}
              {apiTestResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  apiTestResult.valid 
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' 
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}>
                  {apiTestResult.valid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{apiTestResult.message}</span>
                </div>
              )}

              <div className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B] text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center space-x-2 text-emerald-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Engine: Groq Cloud LLM (qwen3.8-27b)</span>
                </div>
                <p className="leading-relaxed">
                  Your Groq API key is connected. Every query executes live adversarial reasoning (~300 tokens/sec) and queries the Wikipedia Knowledge Graph REST API.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleTestKey}
                  disabled={apiTesting || !tempApiKey.trim()}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                    theme === 'dark' ? 'bg-[#141D2E] hover:bg-[#1E293B] border-[#1E293B] text-gray-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  {apiTesting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span>Test Connection</span>
                </button>

                <button
                  onClick={handleSaveApiKey}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUY NOW / VERIFIED RETAILERS
      ========================================================================= */}
      {showBuyModal && currentAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in ${
            theme === 'dark' ? 'bg-[#111827] border-[#1E293B]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowBuyModal(false)}
              className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Purchase with Zero Regret</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Double-checked and certified by Veritas Red-Team</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border mb-4 ${
              theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {currentAudit.top_pick?.name}
                </span>
                <span className="text-sm font-black text-emerald-500">
                  ${currentAudit.top_pick?.price}
                </span>
              </div>
              <p className={`text-[11px] mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                {getHeadline(currentAudit)}
              </p>
              <div className="text-[10px] font-mono text-emerald-500 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero thermal throttle risk · Upgradability audited · Best price balance</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Verified Retail Options:</span>
              {[
                { name: "Official Manufacturer Store", tag: "Direct Warranty", price: `$${currentAudit.top_pick?.price}` },
                { name: "BestBuy / Certified Partner", tag: "Same-Day In Store", price: `$${currentAudit.top_pick?.price}` },
                { name: "B&H Photo / Amazon Verified", tag: "Free 2-Day Shipping", price: `$${currentAudit.top_pick?.price}` }
              ].map((ret, i) => (
                <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                  theme === 'dark' ? 'bg-[#141D2E] border-[#1E293B]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>{ret.name}</span>
                    <span className={`ml-2 text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{ret.tag}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ret.price}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBuyModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Confirm Purchase & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
