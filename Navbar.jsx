import React from 'react';
import { GitCompare, Database, Info, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenArchitecture, onOpenBaseline, onOpenCatalog, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E1D7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <img src="/verix-logo.png" alt="VERIX" className="w-10 h-10 object-contain" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base text-[#221813] tracking-tight">VERIX</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#EFEAE2] text-[#7B482C] font-semibold border border-[#DFD5C8]">
                Double-Check AI
              </span>
            </div>
            <p className="text-[11px] text-[#7C6C63]">Adversarial Tech & Gadget Decision Assistant</p>
          </div>
        </div>

        {/* Center Hackathon Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E1D7] text-xs text-[#5C4D44] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9E623E]" />
          <span>Hackathon:</span>
          <span className="text-[#221813] font-medium italic">"An AI that double-checks its first answer"</span>
        </div>

        {/* Clean Action Navigation */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          <button
            onClick={onOpenCatalog}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C4D44] bg-[#FFFFFF] hover:bg-[#F4EFEB] hover:text-[#221813] border border-[#E8E1D7] transition-all cursor-pointer shadow-2xs"
            title="Browse hardware dataset"
          >
            <Database className="w-3.5 h-3.5 text-[#8E7F75]" />
            <span className="hidden sm:inline">Spec Catalog</span>
          </button>

          <button
            onClick={onOpenBaseline}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B482C] bg-[#F7F2EC] hover:bg-[#EFE7DE] border border-[#E3D6C9] transition-all cursor-pointer shadow-2xs"
            title="Compare Single-Pass Baseline vs Veritas"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#7B482C]" />
            <span>Baseline Diff</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#8E7F75] hover:text-[#221813] bg-[#FFFFFF] hover:bg-[#F4EFEB] border border-[#E8E1D7] transition-all cursor-pointer"
            title="View system methodology"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
