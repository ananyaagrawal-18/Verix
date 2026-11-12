import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function DoubleCheckStepper({ currentStage = 3, verdict }) {
  const steps = [
    {
      num: 1,
      title: "1. Initial Proposal",
      subtitle: "Baseline Heuristic",
      icon: Sparkles,
      color: "text-[#5C4D44]",
    },
    {
      num: 2,
      title: "2. Red-Team Challenge",
      subtitle: "Adversarial Stress-Test",
      icon: AlertTriangle,
      color: "text-[#7B482C]",
    },
    {
      num: 3,
      title: "3. Reconciled Verdict",
      subtitle: verdict ? `State: ${verdict}` : "Confidence Shift",
      icon: CheckCircle,
      color: verdict === "AGREES" ? "text-[#2A5A3B]" : verdict === "CHANGED" ? "text-[#7B482C]" : "text-[#8C6218]",
    }
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E1D7] rounded-2xl p-4 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStage >= step.num;
          return (
            <React.Fragment key={step.num}>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isCompleted
                      ? `bg-[#F7F2EC] border-[#DECFC1] ${step.color}`
                      : 'bg-[#FAF8F5] border-[#E8E1D7] text-[#9E8E84]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#221813] block">{step.title}</span>
                  <span className="text-[11px] text-[#7C6C63] truncate block">{step.subtitle}</span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden sm:flex text-[#C8BCB0] px-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
