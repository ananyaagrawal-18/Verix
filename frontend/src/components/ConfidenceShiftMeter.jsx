import React from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle, RefreshCw, HelpCircle } from 'lucide-react';

export default function ConfidenceShiftMeter({ initialConfidence, finalConfidence, confidenceDelta, verdict, verdictBadge }) {
  const initPct = Math.round((initialConfidence || 0) * 100);
  const finalPct = Math.round((finalConfidence || 0) * 100);
  const deltaPct = Math.round((confidenceDelta || 0) * 100);

  let VerdictIcon = CheckCircle;
  let bgBadge = "bg-[#EEF5EF] border-[#C8DFCD] text-[#2A5A3B]";
  let barFill = "bg-[#2A5A3B]";

  if (verdict === "CHANGED") {
    VerdictIcon = RefreshCw;
    bgBadge = "bg-[#F8EDE7] border-[#E8CFC2] text-[#7B482C]";
    barFill = "bg-[#7B482C]";
  } else if (verdict === "UNCERTAIN") {
    VerdictIcon = HelpCircle;
    bgBadge = "bg-[#FBF5E8] border-[#EEDDBB] text-[#8C6218]";
    barFill = "bg-[#8C6218]";
  }

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E1D7] rounded-2xl p-5 mb-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] font-semibold text-[#8E7F75] uppercase tracking-wider block mb-1">
            Verification Calculus & Confidence Delta
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-[#221813]">Decision Result:</span>
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bgBadge}`}>
              <VerdictIcon className="w-3.5 h-3.5" />
              <span>{verdictBadge || verdict}</span>
            </span>
          </div>
        </div>

        {/* Delta Indicator Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7]">
          <span className="text-xs text-[#7C6C63]">Confidence Shift:</span>
          <div className="flex items-center space-x-1 font-mono font-bold text-sm">
            {deltaPct > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-[#2A5A3B]" />
                <span className="text-[#2A5A3B]">+{deltaPct}%</span>
              </>
            ) : deltaPct < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-[#8C6218]" />
                <span className="text-[#8C6218]">{deltaPct}%</span>
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 text-[#7C6C63]" />
                <span className="text-[#7C6C63]">0%</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F0EBE3]">
        
        {/* Pass 1 Initial */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#7C6C63]">Pass 1: Initial Heuristic</span>
            <span className="font-mono font-semibold text-[#5C4D44]">{initPct}%</span>
          </div>
          <div className="w-full bg-[#F4EFEB] rounded-full h-2 overflow-hidden border border-[#E8E1D7]">
            <div
              className="bg-[#A8988C] h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${initPct}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#9E8E84] mt-1 block">Unchallenged first pass</span>
        </div>

        {/* Pass 2 Verified */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[#221813] font-medium">Pass 2: Post-Challenge Verified</span>
            <span className="font-mono font-bold text-[#221813]">{finalPct}%</span>
          </div>
          <div className="w-full bg-[#F4EFEB] rounded-full h-2 overflow-hidden border border-[#E8E1D7]">
            <div
              className={`h-2 rounded-full transition-all duration-700 ease-out ${barFill}`}
              style={{ width: `${finalPct}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#7C6C63] mt-1 block">Stress-tested against engineering constraints</span>
        </div>

      </div>
    </div>
  );
}
