import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, HelpCircle, ShieldAlert } from 'lucide-react';

export default function RedTeamCritique({ redTeam, firstPassProduct, onSelectAlternative }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!redTeam) return null;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E1D7] rounded-2xl p-5 mb-5 shadow-xs">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#FAF5EE] border border-[#ECD9C0] text-[#7B482C]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#221813] flex items-center space-x-2">
              <span>Stage 2: Red-Team Devil's Advocate Audit</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8EDE7] text-[#7B482C] border border-[#E8CFC2] font-mono">
                Stress-Test
              </span>
            </h3>
            <p className="text-xs text-[#7C6C63]">
              Auditing <span className="text-[#221813] font-medium">{firstPassProduct?.name}</span> for thermal and memory traps
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#7C6C63] hover:text-[#221813] flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] transition-colors cursor-pointer"
        >
          <span>{isExpanded ? "Hide Details" : "View Red-Team Audit"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 mt-3 border-t border-[#F0EBE3] animate-fade-in">
          
          {/* Arguments Against */}
          <div>
            <h4 className="text-xs font-semibold text-[#7B482C] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Arguments Raised Against Initial Proposal:</span>
            </h4>
            <div className="space-y-2">
              {redTeam.arguments_against?.map((arg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE2D4] text-xs text-[#42332A] leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: arg.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#221813] font-semibold">$1</strong>') }} />
                </div>
              ))}
            </div>
          </div>

          {/* Missing Facts */}
          {redTeam.missing_data && redTeam.missing_data.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE2D4] text-xs">
              <span className="font-semibold text-[#221813] flex items-center space-x-1.5 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#7B482C]" />
                <span>Unspecified Prompt Variables Detected:</span>
              </span>
              <ul className="space-y-1 text-[#5C4D44]">
                {redTeam.missing_data.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#7B482C] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Hardware */}
          {redTeam.alternatives && redTeam.alternatives.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-[#5C4D44] uppercase tracking-wider block mb-2">
                Alternative Hardware Explored:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {redTeam.alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#7B482C] font-mono uppercase font-semibold">{alt.brand}</span>
                        <span className="text-xs font-bold font-mono text-[#221813]">${alt.price}</span>
                      </div>
                      <span className="font-semibold text-[#221813] line-clamp-1">{alt.name}</span>
                      <p className="text-[11px] text-[#7C6C63] mt-1 line-clamp-2">
                        {alt.strengths?.[0] || alt.cpu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
