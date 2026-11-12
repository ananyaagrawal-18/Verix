import React from 'react';
import { X, Layers } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border border-[#E8E1D7] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D7] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#221813] text-[#FAF8F5]">
              <Layers className="w-5 h-5 text-[#EFEAE2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#221813]">
                System Methodology & State Machine
              </h2>
              <p className="text-xs text-[#7C6C63]">
                Veritas Double-Check Decision Architecture
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#5C4D44]">
          
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7]">
            <span className="font-semibold text-[#221813] block mb-1 text-xs">
              Problem Statement: An AI That Double-Checks Its First Answer
            </span>
            <p className="text-[#5C4D44] leading-relaxed">
              Typical LLMs rush to answer incomplete prompts with high confidence, missing critical hardware constraints like thermal throttling, soldered 8GB RAM, and washed-out screen gamuts. Veritas enforces a 3-stage adversarial loop that questions its initial pick, presents Socratic counter-questions, and verifies the final choice with an explicit confidence shift.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D7]">
              <span className="font-mono text-[10px] text-[#7B482C] uppercase font-bold block mb-1">Stage 1</span>
              <h4 className="font-semibold text-[#221813] text-xs mb-1">First-Pass Proposal</h4>
              <p className="text-[#7C6C63] text-[11px]">
                Heuristic retrieval from 15+ candidate gadgets. Assigns initial confidence score.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D7]">
              <span className="font-mono text-[10px] text-[#7B482C] uppercase font-bold block mb-1">Stage 2</span>
              <h4 className="font-semibold text-[#221813] text-xs mb-1">Devil's Advocate Audit</h4>
              <p className="text-[#7C6C63] text-[11px]">
                Stress-tests against thermal choke, memory pressure, and prompts Socratic counter-questions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D7]">
              <span className="font-mono text-[10px] text-[#7B482C] uppercase font-bold block mb-1">Stage 3</span>
              <h4 className="font-semibold text-[#221813] text-xs mb-1">Reconciliation & Verdict</h4>
              <p className="text-[#7C6C63] text-[11px]">
                Computes Initial % ➔ Final % delta. Emits AGREES, CHANGED, or UNCERTAIN.
              </p>
            </div>
          </div>

          {/* Tri-state definition */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-2">
            <span className="font-semibold text-[#221813] block">Result States</span>
            <div className="space-y-1.5 text-[11px]">
              <div><strong className="text-[#2A5A3B]">AGREES:</strong> Initial hardware withstands all stress-tests; confidence rises (+Δ).</div>
              <div><strong className="text-[#7B482C]">CHANGED:</strong> Flaw exposed (e.g. thermal throttling); pivots to superior hardware.</div>
              <div><strong className="text-[#9E6218]">UNCERTAIN:</strong> Irresolvable trade-off (e.g. Local LLM vs $700 budget); flags human decision.</div>
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
