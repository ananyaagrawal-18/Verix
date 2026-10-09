import React, { useState } from 'react';
import { FileSearch, ChevronDown, ChevronUp } from 'lucide-react';

const statusStyle = {
  Verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Partially Verified': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Contradicted: 'bg-red-500/15 text-red-400 border-red-500/30',
  Unverified: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Outdated: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Not Applicable': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'Verification Unavailable': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

export default function ClaimsExplorer({ claims = [] }) {
  const [open, setOpen] = useState(null);

  if (!claims.length) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        No claims extracted for this decision.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <FileSearch className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Evidence & Claims Explorer</h3>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">{claims.length} claims</span>
      </div>
      {claims.map((c, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="dashboard-card rounded-xl border border-[var(--border)] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--bg-hover)] transition-colors"
            >
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-[var(--text-primary)] truncate">{c.claim}</div>
                <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded border ${statusStyle[c.status] || statusStyle.Unverified}`}>
                  {c.status}
                </span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-3 space-y-1.5 border-t border-[var(--border)] pt-2">
                <div className="text-[11px] text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Evidence:</span> {c.evidence}</div>
                <div className="text-[11px] text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Source:</span> {c.source}</div>
                <div className="text-[11px] text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Verified:</span> {c.verification_date}</div>
                <div className="text-[11px] text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Note:</span> {c.explanation}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
