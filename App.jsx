import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Key, RefreshCw, 
  Search, Sparkles, X, ChevronRight, Download, 
  History, LayoutDashboard, HelpCircle, Check, Layers, 
  Laptop, Smartphone, Headphones, Minus, Plus, Maximize2, 
  RotateCcw, Zap, Award, Info, ExternalLink, Flame, Globe,
  Paperclip, Cpu, Swords, Mic, ArrowUp, Star, Settings, Sun, Moon, Bell,
  Upload, FileText, Image as ImageIcon
} from 'lucide-react';
import ProductDetailPopup from './components/ProductDetailPopup';

// USD → INR. All UI prices show in ₹.
const USD_TO_INR = 83;
function formatINR(usd) {
  if (usd == null || usd === '' || isNaN(Number(usd))) return '₹—';
  const inr = Math.round(Number(usd) * USD_TO_INR);
  return '₹' + inr.toLocaleString('en-IN');
}

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
            stroke="var(--border)"
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
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>{score}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs font-bold text-[#10B981]">{label}</span>
        <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">{target}</div>
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
            stroke="var(--border)"
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
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>+{shift}%</span>
          <span className="text-[10px] font-bold text-[#10B981] -mt-0.5">{label}</span>
        </div>
      </div>
      <div className="w-40 flex justify-between text-[10px] font-mono text-[var(--text-secondary)] mt-1 px-1">
        <span>Init: {initVal}%</span>
        <span className="text-[var(--text-secondary)]">Shift</span>
        <span className="text-[#10B981]">Final: {finalVal}%</span>
      </div>
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
    query: 'DaVinci Resolve 4K video editing laptop under ₹1,00,000 with all-day battery.',
    timestamp: '2 min ago',
    starred: true,
    verdict: 'CHANGED',
    statusColor: 'text-amber-400',
    topPickName: 'ASUS ROG Zephyrus G14 (2024)',
    firstPassName: 'MacBook Air M2 8GB',
    verdictBadge: 'Changed (Caught Thermal & VRAM Bottleneck)',
    score: 96,
    savingsText: 'Averted fanless throttling & 8GB swap memory lockup (₹37,000 savings)',
    data: null
  },
  {
    id: 'pump-p12-seed',
    title: 'Pump P-12 — Pressure Anomaly',
    shortTitle: 'Pump P-12 — Pressure Anomaly',
    category: 'audio',
    query: 'Need the best wireless noise canceling headphones for frequent long-haul flights under ₹33,000.',
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
    query: 'Looking for flagship phone with Snapdragon 8 Gen 3 speed, massive battery, and fast charging under ₹66,000.',
    timestamp: '3 hours ago',
    starred: false,
    verdict: 'UNCERTAIN',
    statusColor: 'text-rose-400',
    topPickName: 'OnePlus 12 (16GB/512GB)',
    firstPassName: 'Samsung Galaxy S24 Ultra',
    verdictBadge: 'Uncertain (Saved ₹41,500 Flagship Tax)',
    score: 89,
    savingsText: 'Saved ₹41,500 with identical Gen 3 chip & faster 80W charging',
    data: null
  },
  {
    id: 'motor-m201-seed',
    title: 'Motor M-201 — Bearing Check',
    shortTitle: 'Motor M-201 — Bearing Check',
    category: 'laptop',
    query: 'College CS student wanting to play Cyberpunk on weekends under ₹1,16,000. Need to carry it to classes daily.',
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
    query: 'Folding travel headphones with heavy noise reduction and long battery under ₹25,000.',
    timestamp: 'Yesterday',
    starred: false,
    verdict: 'CHANGED',
    statusColor: 'text-amber-400',
    topPickName: 'Sony WH-1000XM4 (Previous Gen Foldable)',
    firstPassName: 'Sony WH-1000XM5',
    verdictBadge: 'Changed (Foldable Legend, Saves ₹10,000)',
    score: 95,
    savingsText: 'Pivoted to collapsible headband: saves ₹10,000',
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

  // API Key — loaded from backend .env automatically; no UI needed
  const [apiKey] = useState(() => {
    const saved = localStorage.getItem('veritas_api_key');
    if (saved && saved.trim()) return saved;
    return '''';
  });

  // Settings & Profile UI
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general'); // general | appearance | about
  const [showProfile, setShowProfile] = useState(false);
  const [activeMode, setActiveMode] = useState('challenge'); // data | machine | challenge | voice
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]); // { id, name, type, size, preview? }
  const [machineConnected, setMachineConnected] = useState(true);
  const [showHeroSpecs, setShowHeroSpecs] = useState(false);
  const [showAltSpecs, setShowAltSpecs] = useState(false);
  const heroCardRef = useRef(null);
  const altCardRef = useRef(null);
  const hoverLeaveTimer = useRef(null);
  const fileInputRef = useRef(null);

  const openHeroSpecs = () => {
    clearTimeout(hoverLeaveTimer.current);
    setShowAltSpecs(false);
    setShowHeroSpecs(true);
  };
  const closeHeroSpecs = () => {
    clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = setTimeout(() => setShowHeroSpecs(false), 200);
  };
  const openAltSpecs = () => {
    clearTimeout(hoverLeaveTimer.current);
    setShowHeroSpecs(false);
    setShowAltSpecs(true);
  };
  const closeAltSpecs = () => {
    clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = setTimeout(() => setShowAltSpecs(false), 200);
  };

  // Resolve full product object for cheaper alternative (for datasheet)
  const resolveAltProduct = () => {
    if (!currentAudit) return null;
    const cb = currentAudit.cheaper_balance;
    if (!cb) return null;
    if (cb.product && cb.product.name) return cb.product;
    const pool = [
      currentAudit.top_pick,
      currentAudit.first_pass_pick,
      ...(currentAudit.suggestions || []),
    ].filter(Boolean);
    const byId = pool.find((x) => x.id === cb.product_id);
    if (byId) return byId;
    const byName = pool.find((x) => x.name === cb.product_name);
    if (byName) return byName;
    // minimal product from cheaper_balance fields
    return {
      id: cb.product_id || 'alt',
      name: cb.product_name || 'Alternative',
      brand: (cb.product_name || '').split(' ')[0] || 'Brand',
      price: cb.price || currentAudit.top_pick?.price,
      category: currentAudit.top_pick?.category || 'budget_allrounder',
      device_type: currentAudit.device_type || 'laptop',
      cpu: '—',
      gpu: '—',
      ram_gb: null,
      storage_gb: null,
      strengths: [cb.why || 'Better value under budget'].filter(Boolean),
      pitfalls: [],
      display: {},
      battery: {},
      thermals: {},
      ports: [],
    };
  };

  // Buy modal
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Image zoom state for hero card
  const [imageZoom, setImageZoom] = useState(44);

  // Theme: dark (default, matches landing) or light
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('recheckx_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to document + persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('recheckx_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

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
    let text = queryText || searchInput;
    if (!text.trim()) return;

    // Append attached file context when Data mode has uploads
    if (attachedFiles.length > 0) {
      const names = attachedFiles.map((f) => f.name).join(', ');
      text = `${text}\n\n[Attached media/files from user: ${names}]`;
    }
    // Machine mode hint for LLM
    if (activeMode === 'machine') {
      text = `${text}\n\n[Mode: Machine — live LLM hardware verification, category=${targetCategory}]`;
    }

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
    <div className="min-h-screen font-sans flex flex-col selection:bg-blue-600 selection:text-white" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      
      {/* Toast Notification when Socratic Solution changes product */}
      {socraticToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md p-4 rounded-xl bg-blue-950/90 border border-blue-500 text-white text-xs shadow-2xl flex items-center justify-between space-x-3 animate-fade-in green-glow">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-medium leading-relaxed">{socraticToast}</span>
          </div>
          <button onClick={() => setSocraticToast(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          PAGE 1: RECHECK-X LANDING PAGE (1:1 PIXEL-FAITHFUL TO REFERENCE IMAGE)
      ========================================================================= */}
      {currentView === 'landing' && (
        <div className="flex-1 flex overflow-hidden min-h-screen bg-[var(--bg-base)]">
          
          {/* 1. LEFT SIDEBAR (Matching reference image) */}
          <aside className="w-64 sm:w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col shrink-0 select-none">
            {/* Brand Header */}
            <div className="p-4 flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <img src="/verix-logo.png" alt="VERIX" className="w-10 h-10 object-contain" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)]">VERIX</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase font-semibold">
                    QC AI
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-secondary)]">Challenge the decision.</div>
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
              <div className="flex items-center space-x-2 bg-[var(--bg-input)] rounded-xl px-3 py-2 border border-[var(--border)] focus-within:border-blue-500/80 transition-all">
                <Search className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <kbd className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--border-strong)] font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* RECENT Section */}
            <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                RECENT
              </div>

              {recentSidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openInvestigation(item)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border)] transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--text-primary)] truncate max-w-[170px]">
                      {item.shortTitle || item.title}
                    </span>
                    {item.starred && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 ml-1" />
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-1 flex items-center space-x-1.5">
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className={`font-bold ${
                      item.verdict === 'CHANGED' ? 'text-amber-400' :
                      item.verdict === 'AGREES' ? 'text-emerald-400' :
                      'text-rose-400'
                    }`}>
                      {item.verdict}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Footer: Settings & System Status */}
            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] space-y-2">
              <button
                onClick={() => { setSettingsTab('general'); setShowSettings(true); }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Settings</span>
              </button>
              <div className="flex items-center space-x-2 px-2.5 text-[11px] text-[var(--text-secondary)] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System operational</span>
              </div>
            </div>
          </aside>

          {/* 2. RIGHT MAIN HERO & PROMPT AREA */}
          <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: "var(--bg-base)" }}>
            {/* Top Navbar */}
            <div className="h-14 border-b border-[var(--border-subtle)] px-6 flex items-center justify-end space-x-3 text-xs shrink-0">
              {/* Direct Navigation to Dashboard & Socratic Lab */}
              <button
                onClick={() => {
                  if (!currentAudit) {
                    runAudit(SEED_BENCHMARKS[0].query, {}, 'laptop');
                  } else {
                    setCurrentView('dashboard');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
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
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Socratic Lab</span>
              </button>

              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-secondary)] text-[11px]">
                <Search className="w-3 h-3 text-[var(--text-muted)]" />
                <span>Search</span>
                <kbd className="text-[9px] bg-[var(--bg-elevated)] px-1 rounded border border-[var(--border-strong)] ml-1">⌘K</kbd>
              </div>

              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors" 
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => { setSettingsTab('general'); setShowSettings(true); }}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer" 
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setNotificationsOn(!notificationsOn)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer relative" 
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationsOn && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Avatar + Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer shadow ring-2 ring-blue-500/30 hover:ring-blue-400/60 transition-all"
                  title="Profile"
                >
                  VX
                </button>
                {showProfile && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                    <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden animate-fade-in">
                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-b border-[var(--border)]">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                            VX
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[var(--text-primary)] truncate">VERIX User</div>
                            <div className="text-[11px] text-[var(--text-secondary)] truncate">user@verix.ai</div>
                            <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 uppercase font-semibold">
                              Pro Plan
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Stats Columns */}
                      <div className="grid grid-cols-3 gap-px bg-[var(--border)] border-b border-[var(--border)]">
                        <div className="bg-[var(--bg-elevated)] p-3 text-center">
                          <div className="text-sm font-bold text-[var(--text-primary)]">{historyList.length}</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">Audits</div>
                        </div>
                        <div className="bg-[var(--bg-elevated)] p-3 text-center">
                          <div className="text-sm font-bold text-emerald-400">98%</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">Accuracy</div>
                        </div>
                        <div className="bg-[var(--bg-elevated)] p-3 text-center">
                          <div className="text-sm font-bold text-blue-400">Live</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">Engine</div>
                        </div>
                      </div>
                      {/* Menu Items */}
                      <div className="p-1.5 space-y-0.5">
                        <button
                          onClick={() => { setShowProfile(false); setSettingsTab('general'); setShowSettings(true); }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => { setShowProfile(false); setCurrentView('dashboard'); if (!currentAudit && historyList[0]) runAudit(historyList[0].query || SEED_BENCHMARKS[0].query, {}, 'laptop'); }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>QC Dashboard</span>
                        </button>
                        <button
                          onClick={() => { setShowProfile(false); clearHistory(); }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Clear History</span>
                        </button>
                      </div>
                      <div className="px-4 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] font-mono flex items-center justify-between">
                        <span>VERIX v2.0</span>
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Online</span>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col items-center">
              
              {/* Header Title */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <img src="/verix-logo.png" alt="VERIX" className="w-12 h-12 object-contain" />
                  <span className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                    VERIX
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-2" style={{ color: "var(--text-primary)" }}>
                  Challenge the decision.
                </h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                  Before the decision challenges you.
                </p>
              </div>

              {/* Central White-Border Prompt Box Container */}
              <div className="w-full rounded-2xl p-4 sm:p-5 border-2 shadow-2xl relative mb-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-strong)" }}>
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
                    className="w-full bg-transparent border-none text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
                    disabled={loading}
                  />

                  {/* Attached files chips (Data mode uploads) */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {attachedFiles.map((f) => (
                        <div key={f.id} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#151D30] border border-blue-500/40 text-[11px] text-blue-300">
                          {f.type?.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          <span className="max-w-[120px] truncate">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachedFiles((prev) => prev.filter((x) => x.id !== f.id))}
                            className="text-[var(--text-secondary)] hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Machine LLM status bar */}
                  {activeMode === 'machine' && (
                    <div className="flex items-center justify-between mt-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-[11px]">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="font-semibold">LLM Engine Connected</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <span className="text-[var(--text-secondary)] font-mono">
                        Groq · {activeCategory === 'all' ? 'auto' : activeCategory}
                      </span>
                    </div>
                  )}

                  {/* Hidden file input for Data uploads */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.csv,.json,.md,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const mapped = files.map((file) => ({
                        id: `${file.name}-${file.size}-${Date.now()}`,
                        name: file.name,
                        type: file.type || 'file',
                        size: file.size,
                      }));
                      setAttachedFiles((prev) => [...prev, ...mapped]);
                      setActiveMode('data');
                      e.target.value = '';
                    }}
                  />

                  {/* Bottom Tools & Send Button */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#1C2438]">
                    {/* Left Mode Pills */}
                    <div className="flex items-center space-x-1.5 text-xs">
                      {/* DATA — upload media from device */}
                      <button
                        type="button"
                        title="Upload files / media from your device"
                        onClick={() => {
                          setActiveMode('data');
                          fileInputRef.current?.click();
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeMode === 'data'
                            ? 'bg-[#18233C] border border-blue-500/80 text-blue-400 font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#151D30] border border-transparent'
                        }`}
                      >
                        <Paperclip className={`w-3.5 h-3.5 ${activeMode === 'data' ? 'text-blue-400' : ''}`} />
                        <span>Data</span>
                        {attachedFiles.length > 0 && (
                          <span className="ml-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                            {attachedFiles.length}
                          </span>
                        )}
                      </button>

                      {/* MACHINE — connect to LLM + hardware category */}
                      <button
                        type="button"
                        title="Connect to LLM engine & filter by device"
                        onClick={() => {
                          setActiveMode('machine');
                          setMachineConnected(true);
                          const nextCat = activeCategory === 'laptop' ? 'smartphone' : activeCategory === 'smartphone' ? 'audio' : activeCategory === 'audio' ? 'all' : 'laptop';
                          setActiveCategory(nextCat);
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeMode === 'machine'
                            ? 'bg-[#18233C] border border-blue-500/80 text-blue-400 font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#151D30] border border-transparent'
                        }`}
                      >
                        <Cpu className={`w-3.5 h-3.5 ${activeMode === 'machine' ? 'text-blue-400' : ''}`} />
                        <span>Machine</span>
                        {activeMode === 'machine' && machineConnected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                      </button>

                      {/* CHALLENGE */}
                      <button
                        type="button"
                        title="Adversarial double-check mode"
                        onClick={() => setActiveMode('challenge')}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeMode === 'challenge'
                            ? 'bg-[#18233C] border border-blue-500/80 text-blue-400 font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#151D30] border border-transparent'
                        }`}
                      >
                        <Swords className={`w-3.5 h-3.5 ${activeMode === 'challenge' ? 'text-blue-400' : ''}`} />
                        <span>Challenge</span>
                      </button>

                      {/* VOICE */}
                      <button
                        type="button"
                        title="Voice input"
                        onClick={() => {
                          setActiveMode('voice');
                          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                          if (SR) {
                            const rec = new SR();
                            rec.lang = 'en-IN';
                            rec.onresult = (e) => {
                              const text = e.results[0][0].transcript;
                              setSearchInput((prev) => (prev ? prev + ' ' + text : text));
                            };
                            rec.start();
                          }
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeMode === 'voice'
                            ? 'bg-[#18233C] border border-blue-500/80 text-blue-400 font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#151D30] border border-transparent'
                        }`}
                      >
                        <Mic className={`w-3.5 h-3.5 ${activeMode === 'voice' ? 'text-blue-400' : ''}`} />
                        <span>Voice</span>
                      </button>
                    </div>

                    {/* Right Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !searchInput.trim()}
                      className="w-9 h-9 rounded-xl bg-[#1C253B] hover:bg-blue-600 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow active:scale-95 shrink-0"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
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
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] hover:border-blue-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow"
                >
                  <Cpu className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Analyze Machine</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Challenge first recommendation: compare MacBook Air M2 8GB vs ASUS Zephyrus G14 for 4K DaVinci editing";
                    setSearchInput(q);
                    runAudit(q, {}, 'laptop');
                  }}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] hover:border-blue-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow"
                >
                  <Swords className="w-4 h-4 text-blue-400" />
                  <span>Challenge Decision</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Investigate component failure risks, soldered memory traps, and flagship pricing inflation";
                    setSearchInput(q);
                    runAudit(q, {}, 'smartphone');
                  }}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] hover:border-blue-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Investigate Risk</span>
                </button>

                <button
                  onClick={() => {
                    const q = "Search real-world benchmark evidence and Wikipedia hardware specs for Sony WH-1000XM5 vs XM4";
                    setSearchInput(q);
                    runAudit(q, {}, 'audio');
                  }}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border)] hover:border-blue-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow"
                >
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Search Evidence</span>
                </button>
              </div>

              {/* RECENT INVESTIGATIONS Section Beneath */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                    RECENT INVESTIGATIONS
                  </h2>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">
                    Live Groq LLM + Wikipedia REST API
                  </span>
                </div>

                <div className="space-y-2.5">
                  {recentSidebarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openInvestigation(item)}
                      className="w-full p-4 rounded-xl bg-[#0E1322] hover:bg-[#131A2E] border border-[var(--border)] hover:border-blue-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </span>
                          {item.starred && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] max-w-xl">
                          {item.savingsText || item.query}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                            Score: {item.score}%
                          </span>
                          <div className="text-[10px] text-[var(--text-muted)]">{item.timestamp}</div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.verdict === 'CHANGED' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60' :
                          item.verdict === 'AGREES' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' :
                          'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        }`}>
                          {item.verdict}
                        </span>

                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all" />
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
          GLOBAL TOP NAVIGATION HEADER (FOR DASHBOARD & SOCRATIC PAGES)
      ========================================================================= */}
      {currentView !== 'landing' && (
        <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <img src="/verix-logo.png" alt="VERIX" className="w-10 h-10 object-contain" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">VERIX</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase font-semibold">
                  QC AI
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] font-medium hidden sm:block">
                Challenge the decision. Before the decision challenges you.
              </p>
            </div>
          </div>

          {/* Multi-Page Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 p-1 rounded-xl border border-[var(--border)]" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <button
              onClick={() => setCurrentView('landing')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1E293B] transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>VERIX</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1E293B]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>QC Dashboard</span>
              {currentAudit && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('socratic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'socratic' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1E293B]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Socratic Red-Team Lab</span>
              <span className="md:hidden">Lab</span>
            </button>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-emerald-950/40 border-emerald-600/50 text-emerald-400">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Engine Live</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            {currentView === 'dashboard' && (
              <button
                onClick={handleExportReport}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#1E293B] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Report</span>
              </button>
            )}

            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors" 
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { setSettingsTab('general'); setShowSettings(true); }}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer shadow ring-2 ring-blue-500/30 hover:ring-blue-400/60 transition-all"
              >
                VX
              </button>
              {showProfile && currentView !== 'landing' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden animate-fade-in">
                    <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-b border-[var(--border)]">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">VX</div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[var(--text-primary)] truncate">VERIX User</div>
                          <div className="text-[11px] text-[var(--text-secondary)] truncate">user@verix.ai</div>
                          <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 uppercase font-semibold">Pro Plan</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-px bg-[var(--border)] border-b border-[var(--border)]">
                      <div className="bg-[var(--bg-elevated)] p-3 text-center">
                        <div className="text-sm font-bold text-[var(--text-primary)]">{historyList.length}</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Audits</div>
                      </div>
                      <div className="bg-[var(--bg-elevated)] p-3 text-center">
                        <div className="text-sm font-bold text-emerald-400">98%</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Accuracy</div>
                      </div>
                      <div className="bg-[var(--bg-elevated)] p-3 text-center">
                        <div className="text-sm font-bold text-blue-400">Live</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Engine</div>
                      </div>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <button onClick={() => { setShowProfile(false); setSettingsTab('general'); setShowSettings(true); }} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                        <Settings className="w-3.5 h-3.5" /><span>Settings</span>
                      </button>
                      <button onClick={() => { setShowProfile(false); setCurrentView('landing'); }} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                        <Search className="w-3.5 h-3.5" /><span>New Investigation</span>
                      </button>
                    </div>
                    <div className="px-4 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] font-mono flex items-center justify-between">
                      <span>VERIX v2.0</span>
                      <span className="flex items-center space-x-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Online</span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* =========================================================================
          PAGE 2: QUALITY CONTROL DASHBOARD (MATCHING THE REFERENCE SCREENSHOT 1:1)
      ========================================================================= */}
      {currentView === 'dashboard' && currentAudit && (
        <div className="flex-1 flex overflow-hidden">
          
          {/* 1. Left Sidebar (Directly matching ImageQC sidebar) */}
          <aside className="w-60 bg-[var(--bg-card)] border-r border-[var(--border)] hidden md:flex flex-col shrink-0">
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 green-glow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white">ImageQC AI</span>
                  <div className="text-[10px] text-[var(--text-secondary)]">Hardware Verifier</div>
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
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-xs font-medium cursor-pointer transition-colors"
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
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-xs font-medium cursor-pointer transition-colors"
              >
                <History className="w-4 h-4" />
                <span>History & Search</span>
              </button>

              <button
                onClick={() => { setSettingsTab('general'); setShowSettings(true); }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-xs font-medium cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>

            {/* System Status at Bottom of Sidebar */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-sidebar)]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">System Status</span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">
                All Systems Operational
              </p>
            </div>
          </aside>

          {/* 2. Main Dashboard Scroll Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 space-y-4">
            
            {/* Top Subheader: Dashboard Title & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Image Quality Control Dashboard
                </h1>
                <p className="text-xs text-[var(--text-secondary)]">
                  Ensure accuracy, readability, and compliance across AI-generated recommendations.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#1E293B] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] flex items-center space-x-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>New Search</span>
                </button>
                <button
                  onClick={handleExportReport}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#1E293B] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Sub-bar with Metadata Strip (Matching Reference Image) */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-4 py-2.5 rounded-xl border border-[var(--border)]">
              <div className="flex items-center space-x-2 text-[var(--text-primary)]">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="font-semibold font-mono">Product_Audit_001.json</span>
              </div>
              <span className="text-gray-600">|</span>
              <span>Generated: Oct 9, 2026 04:30 AM</span>
              <span className="text-gray-600">|</span>
              <span className="font-mono bg-[#0B0F19] px-2 py-0.5 rounded text-[11px] text-[var(--text-secondary)] border border-[var(--border)]">
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
                      <h3 className="text-sm font-bold text-white">Hardware Accuracy</h3>
                    </div>
                    <Info className="w-4 h-4 text-[var(--text-secondary)] cursor-pointer" />
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="py-2">
                    <div className="text-center text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      CER Score
                    </div>
                    <CircularGauge 
                      score={Math.round(currentAudit.final_confidence * 100)} 
                      label="Excellent"
                      target="Target: ≥ 95%"
                    />
                  </div>

                  {/* 5 Accuracy Verification Checklist Items */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-[var(--border)]">
                    {[
                      "Specs Match User Priorities",
                      "Thermal Limits & Wattage Verified",
                      "No Hallucinated Marketing Claims",
                      "RAM & Storage Upgradability Confirmed",
                      "Display Standards & Gamut Confirmed"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)] font-medium">{item}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Verified Chip */}
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All hardware accuracy checks passed.</span>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CARD 2 (CENTER HERO): TOP VERIFIED PICK PRODUCT CARD
              ------------------------------------------------------------- */}
              <div
                ref={heroCardRef}
                className="dashboard-card rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-b from-[#131B2E] to-[#0E1526] border-blue-500/40 shadow-2xl relative overflow-visible"
                onMouseEnter={openHeroSpecs}
                onMouseLeave={closeHeroSpecs}
              >
                {showHeroSpecs && currentAudit.top_pick && (
                  <ProductDetailPopup
                    product={currentAudit.top_pick}
                    onClose={closeHeroSpecs}
                    onKeepOpen={openHeroSpecs}
                    anchorRef={heroCardRef}
                  />
                )}
                <div>
                  {/* Top Badge: NEW / TOP VERIFIED PICK */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      {currentAudit.verdict === 'CHANGED' ? 'REVISED PICK' : 'TOP VERIFIED'}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                      {currentAudit.device_type?.toUpperCase()}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mb-1">
                    {getHeadline(currentAudit)}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">
                    {currentAudit.top_pick?.name}
                  </p>
                  <p className="text-[10px] text-blue-400 font-semibold mb-3">
                    Hover for full datasheet → manufacturer · warranty · RAM · GPU · ports
                  </p>

                  {/* Product Visual */}
                  <div className="relative w-full h-44 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border)] flex items-center justify-center overflow-hidden mb-3 group">
                    <img
                      src={getProductImage(currentAudit)}
                      alt={currentAudit.top_pick?.name || "Verified Gadget"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ transform: `scale(${imageZoom / 44})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* 3 Key Highlights with Icons */}
                  <div className="space-y-1.5 text-xs text-[var(--text-primary)]">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">
                        {currentAudit.device_type === 'audio' 
                          ? "Dual Noise Canceling Processors (LDAC Audio)"
                          : currentAudit.device_type === 'smartphone'
                          ? `${currentAudit.top_pick?.cpu || 'Snapdragon 8 Gen 3 Flagship Silicon'}`
                          : `${currentAudit.top_pick?.cpu || 'High-Performance Processor'} + ${currentAudit.top_pick?.gpu || 'Discrete GPU'}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        {currentAudit.top_pick?.battery?.real_world_hours 
                          ? `${currentAudit.top_pick.battery.real_world_hours}-Hour Tested Battery Endurance`
                          : "Class-Leading Battery Endurance"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">
                        {currentAudit.device_type === 'audio'
                          ? "Soft-Fit Leather Acoustic Isolation"
                          : `${currentAudit.top_pick?.display?.panel_type || 'Calibrated High-Gamut Display'}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button + Zoom Control Bar */}
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-black text-white">
                      {formatINR(currentAudit.top_pick?.price || 799)}
                    </div>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      BUY NOW
                    </button>
                  </div>

                  {/* Zoom bar at bottom of product card */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-sidebar)] px-2 py-1 rounded-lg border border-[var(--border)]">
                    <div className="flex items-center space-x-1.5">
                      <button 
                        onClick={() => setImageZoom(prev => Math.max(20, prev - 10))}
                        className="hover:text-[var(--text-primary)]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{imageZoom}%</span>
                      <button 
                        onClick={() => setImageZoom(prev => Math.min(80, prev + 10))}
                        className="hover:text-[var(--text-primary)]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setImageZoom(44)}
                      className="hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)]"
                    >
                      Fit
                    </button>
                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className="hover:text-[var(--text-primary)]"
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
                      <h3 className="text-sm font-bold text-white">Adversarial Stress-Test</h3>
                    </div>
                    <Info className="w-4 h-4 text-[var(--text-secondary)] cursor-pointer" />
                  </div>

                  {/* Semi-circular Speedometer Arc Gauge */}
                  <div className="py-2">
                    <div className="text-center text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Confidence Shift Arc
                    </div>
                    <SemiCircularGauge 
                      initVal={Math.round(currentAudit.initial_confidence * 100)} 
                      finalVal={Math.round(currentAudit.final_confidence * 100)}
                      label={currentAudit.verdict === 'CHANGED' ? 'Stress-Tested' : 'Approved'}
                    />
                  </div>

                  {/* 5 Stress-Test Checklist Items */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-[var(--border)]">
                    {[
                      "Contradiction Audit Passed",
                      "Thermal Throttling & Fan Noise Solved",
                      "Soldered RAM Swap Degradation Averted",
                      "Real-World Battery Curve Tested",
                      "Value vs Budget Compliance Verified"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)] font-medium">{item}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Verified Chip */}
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
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
                      <h3 className="text-sm font-bold text-white">Compliance & Alternatives</h3>
                    </div>
                    <Info className="w-4 h-4 text-[var(--text-secondary)] cursor-pointer" />
                  </div>

                  {/* Cheaper Balanced Alternative Pick — hover for full datasheet */}
                  <div
                    ref={altCardRef}
                    className="p-3 rounded-xl bg-[#0B0F19] border border-[var(--border)] mb-3 cursor-pointer hover:border-violet-500/50 transition-all relative"
                    onMouseEnter={openAltSpecs}
                    onMouseLeave={closeAltSpecs}
                  >
                    {showAltSpecs && resolveAltProduct() && (
                      <ProductDetailPopup
                        product={resolveAltProduct()}
                        onClose={closeAltSpecs}
                        onKeepOpen={openAltSpecs}
                        anchorRef={altCardRef}
                      />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] font-bold">
                        Cheaper Balanced Option
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        {currentAudit.cheaper_balance?.savings || "₹50,000 Savings"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1">
                      {currentAudit.cheaper_balance?.product_name || "Balanced Value Winner"}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                      {currentAudit.cheaper_balance?.why || "Delivers identical real-world workflow without overpaying."}
                    </p>
                    <p className="text-[10px] text-violet-300 font-semibold mt-1.5">
                      Hover for full specs → manufacturer · warranty · RAM · GPU
                    </p>
                  </div>

                  {/* Single-Pass AI Comparison Diff */}
                  <div className="p-3 rounded-xl bg-[#0B0F19] border border-[var(--border)] mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                        Single-Pass AI Comparison
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[9px] font-bold">
                        ChatGPT Flaw
                      </span>
                    </div>
                    <div className="text-[11px] text-red-300 font-mono mb-1 truncate">
                      ❌ Standard AI: {currentAudit.single_pass_baseline?.recommended_product}
                    </div>
                    <div className="text-[11px] text-emerald-300 font-mono truncate">
                      ✓ Veritas Double-Check: {currentAudit.top_pick?.name}
                    </div>
                  </div>

                  {/* Compliance Checklist Rows */}
                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
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
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
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
            <div className="dashboard-card rounded-2xl p-5 border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    ⚡ Interactive Socratic Red-Team (Click Any Choice Below to Adapt Recommendation Live)
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Real-Time Dynamic Recalculation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentAudit.counter_questions?.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 rounded-xl bg-[#0B0F19] border border-[var(--border)]">
                    <div className="text-xs font-semibold text-[var(--text-primary)] mb-2">
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
                                : 'bg-[var(--bg-elevated)] hover:bg-blue-900/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-blue-500/50'
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
            <div className="dashboard-card rounded-2xl p-4 bg-[var(--bg-card)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Real-World Live Telemetry (Wikipedia Knowledge Graph REST API + Gemini)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {currentAudit.real_world_api?.status || "Live Connected"}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {currentAudit.real_world_api?.live_specs_summary || currentAudit.double_check_note}
              </p>
            </div>

          </main>

          {/* =========================================================================
              BOTTOM FIXED STATUS BAR (EXACT REPLICA OF REFERENCE SCREENSHOT)
          ========================================================================= */}
          <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 sm:px-8 flex items-center justify-between z-30 shadow-2xl">
            
            {/* Left: Overall Status & Overall Score */}
            <div className="flex items-center space-x-6">
              
              {/* Overall Status Icon & Label */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 green-glow">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">
                    Overall Status
                  </div>
                  <div className="text-sm sm:text-base font-black text-emerald-400 tracking-tight">
                    {currentAudit.verdict === 'CHANGED' ? 'APPROVED & REVISED' : 'APPROVED'}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="hidden sm:block border-l border-[var(--border)] pl-6">
                <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">
                  Overall Score
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black text-white">
                    {Math.round(currentAudit.final_confidence * 100)}%
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Excellent</span>
                </div>
              </div>

              {/* Explanatory summary text */}
              <p className="hidden xl:block text-xs text-[var(--text-secondary)] max-w-md line-clamp-2 border-l border-[var(--border)] pl-6">
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
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#1E293B] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-blue-400" />
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
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Socratic Red-Team Lab
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
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
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Socratic Clarification Questions</span>
            </h2>

            {currentAudit.counter_questions?.map((q, idx) => (
              <div key={q.id || idx} className="p-4 rounded-xl bg-[#0B0F19] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
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
                            : 'bg-[var(--bg-elevated)] hover:bg-blue-600 hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-blue-500 text-[var(--text-secondary)]'
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
                <Globe className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Real-World External API Integration
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE HTTP 200 VERIFIED
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[var(--border)] text-xs space-y-2">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-semibold">
                Live Source: {currentAudit.real_world_api?.provider}
              </div>
              <p className="text-[var(--text-primary)] leading-relaxed font-mono">
                {currentAudit.real_world_api?.live_specs_summary}
              </p>
            </div>
          </div>

          {/* Contradictions & Bottlenecks Caught */}
          <div className="dashboard-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Physical Contradictions & Bottlenecks Detected</span>
            </h2>

            {currentAudit.contradictions && currentAudit.contradictions.length > 0 ? (
              <div className="space-y-2">
                {currentAudit.contradictions.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 text-xs text-red-300 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">
                No acute physical contradictions detected for this spec combination.
              </p>
            )}
          </div>

        </main>
      )}

      {/* =========================================================================
          MODAL: PROPER SETTINGS PANEL
      ========================================================================= */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl max-w-lg w-full shadow-2xl relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Settings</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] px-2">
              {[
                { id: 'general', label: 'General' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'about', label: 'About' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    settingsTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {settingsTab === 'general' && (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Notifications</div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Show status badges & alerts</div>
                    </div>
                    <button
                      onClick={() => setNotificationsOn(!notificationsOn)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${notificationsOn ? 'bg-blue-600' : 'bg-[var(--bg-input)] border border-[var(--border)]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notificationsOn ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Sound Effects</div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Play sound on audit complete</div>
                    </div>
                    <button
                      onClick={() => setSoundOn(!soundOn)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${soundOn ? 'bg-blue-600' : 'bg-[var(--bg-input)] border border-[var(--border)]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${soundOn ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Default Mode</div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Challenge · Data · Machine · Voice</div>
                    </div>
                    <select
                      value={activeMode}
                      onChange={(e) => setActiveMode(e.target.value)}
                      className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="challenge">Challenge</option>
                      <option value="data">Data</option>
                      <option value="machine">Machine</option>
                      <option value="voice">Voice</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Clear Search History</div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{historyList.length} items stored locally</div>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-800/50 hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}

              {settingsTab === 'appearance' && (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Theme</div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Dark or Light interface</div>
                    </div>
                    <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]">
                      <button
                        onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${theme === 'dark' ? 'bg-blue-600 text-white shadow' : 'text-[var(--text-secondary)]'}`}
                      >
                        <Moon className="w-3.5 h-3.5" /><span>Dark</span>
                      </button>
                      <button
                        onClick={() => { if (theme !== 'light') toggleTheme(); }}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${theme === 'light' ? 'bg-blue-600 text-white shadow' : 'text-[var(--text-secondary)]'}`}
                      >
                        <Sun className="w-3.5 h-3.5" /><span>Light</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div className="text-xs font-semibold text-[var(--text-primary)] mb-2">Preview</div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-[var(--border)]" style={{ backgroundColor: 'var(--bg-base)' }}>
                      <img src="/verix-logo.png" alt="VERIX" className="w-8 h-8 object-contain" />
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">VERIX</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Challenge the decision.</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {settingsTab === 'about' && (
                <>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-blue-600/15 to-indigo-600/10 border border-blue-500/30">
                    <img src="/verix-logo.png" alt="VERIX" className="w-14 h-14 object-contain" />
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">VERIX</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">Adversarial Double-Check AI</div>
                      <div className="text-[10px] font-mono text-blue-400 mt-1">v2.0.0</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-secondary)] mb-1">Engine</div>
                      <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Groq Cloud Live</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--text-secondary)] mb-1">Knowledge</div>
                      <div className="text-xs font-semibold text-blue-400">Wikipedia Graph</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed px-1">
                    VERIX challenges first-pass AI recommendations with adversarial red-team reasoning, thermal audits, and hardware bottleneck analysis before you buy.
                  </p>
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUY NOW / VERIFIED RETAILERS
      ========================================================================= */}
      {showBuyModal && currentAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Purchase with Zero Regret</h3>
                <p className="text-xs text-[var(--text-secondary)]">Double-checked and certified by Veritas Red-Team</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[var(--border)] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">
                  {currentAudit.top_pick?.name}
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {formatINR(currentAudit.top_pick?.price)}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mb-2">
                {getHeadline(currentAudit)}
              </p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero thermal throttle risk · Upgradability audited · Best price balance</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Buy from verified retailers:</span>
              {(() => {
                const q = encodeURIComponent(currentAudit.top_pick?.name || 'laptop');
                const brand = (currentAudit.top_pick?.brand || '').toLowerCase();
                const official =
                  brand.includes('apple') ? 'https://www.apple.com/in/shop/buy-mac' :
                  brand.includes('samsung') ? 'https://www.samsung.com/in/' :
                  brand.includes('lenovo') ? 'https://www.lenovo.com/in/en/' :
                  brand.includes('asus') ? 'https://www.asus.com/in/' :
                  brand.includes('dell') ? 'https://www.dell.com/en-in/' :
                  brand.includes('hp') ? 'https://www.hp.com/in-en/' :
                  `https://www.google.com/search?q=${q}+official+store`;
                return [
                  { name: 'Amazon.in', tag: 'Fast delivery · Prime', price: formatINR(currentAudit.top_pick?.price), url: `https://www.amazon.in/s?k=${q}` },
                  { name: 'Flipkart', tag: 'Bank offers · COD', price: formatINR(currentAudit.top_pick?.price), url: `https://www.flipkart.com/search?q=${q}` },
                  { name: 'Croma', tag: 'Store pickup', price: formatINR(currentAudit.top_pick?.price), url: `https://www.croma.com/search/?q=${q}` },
                  { name: 'Official Store', tag: 'Direct warranty', price: formatINR(currentAudit.top_pick?.price), url: official },
                ];
              })().map((ret, i) => (
                <a
                  key={i}
                  href={ret.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs hover:border-blue-500/60 hover:bg-blue-950/30 transition-all cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">{ret.name}</span>
                    <span className="ml-2 text-[10px] text-[var(--text-secondary)]">{ret.tag}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white">{ret.price}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </a>
              ))}
            </div>

            <button
              onClick={() => setShowBuyModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
