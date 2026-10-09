import React from 'react';
import { X, CheckCircle, ShieldCheck, XCircle } from 'lucide-react';

export default function BaselineComparisonModal({ isOpen, onClose, benchmarkData }) {
  if (!isOpen || !benchmarkData) return null;

  const { single_pass_baseline, veritas_double_check, verdict } = benchmarkData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#E8E1D7] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D7] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#221813] text-[#FAF8F5]">
              <ShieldCheck className="w-5 h-5 text-[#EFEAE2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#221813]">
                Baseline vs Double-Check AI
              </h2>
              <p className="text-xs text-[#7C6C63]">
                Why single-pass LLMs produce premature, costly recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E7F75] hover:text-[#221813] hover:bg-[#F4EFEB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left: Single-Pass */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#7C6C63] bg-[#EFEAE2] px-2 py-0.5 rounded-md border border-[#DFD5C8]">
                    Single-Pass AI
                  </span>
                  <span className="text-xs text-[#8E7F75] font-mono">
                    Claimed: {single_pass_baseline.claimed_confidence}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] text-[#8E7F75] block mb-0.5">Recommended Hardware:</span>
                  <span className="text-sm font-semibold text-[#221813]">{single_pass_baseline.recommended_product}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D7] text-xs text-[#5C4D44] italic mb-3">
                  "{single_pass_baseline.response_text}"
                </div>

                <div className="space-y-1.5 mb-3">
                  <span className="text-xs font-semibold text-[#7B482C] flex items-center space-x-1.5">
                    <XCircle className="w-3.5 h-3.5 text-[#7B482C]" />
                    <span>Gotchas Missed:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-[#7C6C63]">
                    {single_pass_baseline.critical_flaws_missed.map((flaw, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#9E6218] font-bold">✗</span>
                        <span>{flaw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E8E1D7] text-[11px] text-[#9E6218] font-medium">
                {single_pass_baseline.buyer_regret_risk}
              </div>
            </div>

            {/* Right: Veritas */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#C8DFCD] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#2A5A3B] bg-[#EEF5EF] px-2 py-0.5 rounded-md border border-[#C8DFCD]">
                    Veritas Double-Check
                  </span>
                  <span className="text-xs text-[#2A5A3B] font-mono font-semibold">
                    Verified: {veritas_double_check.final_confidence}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] text-[#8E7F75] block mb-0.5">Verified Hardware:</span>
                  <span className="text-sm font-semibold text-[#221813]">{veritas_double_check.recommended_product}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-xs text-[#5C4D44] mb-3 flex items-center justify-between">
                  <span>State:</span>
                  <span className="font-semibold text-[#221813] font-mono">
                    {veritas_double_check.verdict_badge}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <span className="text-xs font-semibold text-[#2A5A3B] flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2A5A3B]" />
                    <span>Stress-Tested & Resolved:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-[#42332A]">
                    {veritas_double_check.flaws_caught_and_resolved.map((sol, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#2A5A3B] font-bold">✓</span>
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#C8DFCD] text-[11px] text-[#2A5A3B] font-medium">
                {veritas_double_check.buyer_regret_risk}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E1D7] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#221813] bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
