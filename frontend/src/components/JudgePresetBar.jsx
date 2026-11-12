import React from 'react';
import { Play } from 'lucide-react';

export default function JudgePresetBar({ scenarios, onSelectScenario, activeScenarioId, loading }) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <div className="w-full bg-[#F4EFEB] border-b border-[#E8E1D7] py-2.5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        
        {/* Label */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#7B482C]"></span>
          <span className="text-[11px] font-semibold text-[#5C4D44] uppercase tracking-wider">
            Judge Scenarios:
          </span>
        </div>

        {/* Minimalist Horizontal Scenario Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {scenarios.map((scenario) => {
            const isActive = activeScenarioId === scenario.id;
            const badgeWord = scenario.badge.split(' ')[0];

            let badgeColor = "bg-[#EDE5DB] text-[#5C4D44] border-[#D8CDC0]";
            if (badgeWord.includes("CHANGED")) {
              badgeColor = "bg-[#F7EFE9] text-[#7B482C] border-[#E8D4C8]";
            } else if (badgeWord.includes("AGREES")) {
              badgeColor = "bg-[#EEF5EF] text-[#2A5A3B] border-[#C8DFCD]";
            } else if (badgeWord.includes("UNCERTAIN")) {
              badgeColor = "bg-[#FBF5E8] text-[#8C6218] border-[#EBDDBB]";
            }

            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                disabled={loading}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-2xs ${
                  isActive
                    ? 'bg-[#221813] text-[#FAF8F5] border-[#221813] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#42332A] hover:bg-[#FAF8F5] border-[#E8E1D7] hover:border-[#D8CFBF]'
                }`}
              >
                <span>{scenario.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono border ${badgeColor}`}>
                  {badgeWord}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
