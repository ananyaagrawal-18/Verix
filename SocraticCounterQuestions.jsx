import React from 'react';
import { MessageSquareText, Check } from 'lucide-react';

export default function SocraticCounterQuestions({
  questions = [],
  selectedAnswers = {},
  onAnswerQuestion,
  isSubmitting
}) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E1D7] rounded-2xl p-5 mb-5 shadow-xs">
      <div className="flex items-center space-x-2.5 mb-3">
        <div className="p-2 rounded-xl bg-[#F7F2EC] border border-[#DFD5C8] text-[#7B482C]">
          <MessageSquareText className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#221813] flex items-center space-x-2">
            <span>Socratic Counter-Questions</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#7B482C] border border-[#E8D9CB] font-mono">
              Clarifying Constraints
            </span>
          </h3>
          <p className="text-xs text-[#7C6C63]">
            Click any answer below to stress-test your requirements and update the decision in real-time.
          </p>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {questions.map((q, idx) => {
          const selectedVal = selectedAnswers[q.id];

          return (
            <div key={q.id || idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
              <div className="flex items-start space-x-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#7B482C] shrink-0">Q{idx + 1}.</span>
                <span className="text-xs font-semibold text-[#221813]">{q.question}</span>
              </div>

              {/* Clickable Option Chips */}
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedVal === opt;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => onAnswerQuestion(q.id, opt)}
                      disabled={isSubmitting}
                      className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#221813] text-[#FAF8F5] border-[#221813] shadow-xs'
                          : 'bg-[#FFFFFF] text-[#42332A] border-[#E8E1D7] hover:border-[#D8CFBF] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#EFEAE2] shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full border border-[#B0A294] shrink-0"></div>
                      )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
