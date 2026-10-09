import React from 'react';
import { BadgeCheck, RefreshCw, HelpCircle } from 'lucide-react';

const styles = {
  AGREES: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    Icon: BadgeCheck,
    label: 'AGREES — Original recommendation supported',
  },
  CHANGED: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    Icon: RefreshCw,
    label: 'CHANGED — Evidence justifies a different recommendation',
  },
  UNCERTAIN: {
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    Icon: HelpCircle,
    label: 'UNCERTAIN — Insufficient or contradictory evidence',
  },
};

export default function FinalDecisionBanner({ finalDecision, disclaimer }) {
  if (!finalDecision) return null;
  const st = styles[finalDecision.status] || styles.UNCERTAIN;
  const Icon = st.Icon;

  return (
    <div className={`dashboard-card rounded-2xl p-5 border ${st.border} ${st.bg}`}>
      <div className={`flex items-center gap-2 text-sm font-black ${st.text}`}>
        <Icon className="w-5 h-5" />
        {st.label}
      </div>
      <div className="mt-3 grid gap-2 text-[12px] text-[var(--text-secondary)] md:grid-cols-2">
        <div>
          <span className="font-semibold text-[var(--text-primary)]">Initial:</span> {finalDecision.initial_recommendation || '—'}
        </div>
        <div>
          <span className="font-semibold text-[var(--text-primary)]">Final:</span> {finalDecision.final_recommendation || '—'}
        </div>
      </div>
      {finalDecision.change_reason && (
        <p className="mt-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
          <span className="font-semibold text-[var(--text-primary)]">Reason for change:</span> {finalDecision.change_reason}
        </p>
      )}
      {finalDecision.unresolved_risks?.length > 0 && (
        <div className="mt-2">
          <div className="text-[11px] font-semibold text-[var(--text-primary)]">Unresolved high risks</div>
          <ul className="mt-1 space-y-0.5">
            {finalDecision.unresolved_risks.map((r, i) => (
              <li key={i} className="text-[11px] text-red-300">• {r}</li>
            ))}
          </ul>
        </div>
      )}
      {finalDecision.evidence_limitations?.length > 0 && (
        <div className="mt-2 text-[10px] text-[var(--text-secondary)]">
          Evidence limitations: {finalDecision.evidence_limitations.join(' · ')}
        </div>
      )}
      {disclaimer && (
        <p className="mt-3 text-[10px] italic text-amber-200/80 border-t border-[var(--border)] pt-2">{disclaimer}</p>
      )}
    </div>
  );
}
