import React from 'react';
import { AlertOctagon } from 'lucide-react';

const sev = {
  High: 'border-red-500/40 bg-red-500/10 text-red-300',
  Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Low: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
};

export default function RiskPanel({ risks = [] }) {
  if (!risks.length) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        No structured risks generated for this evaluation.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <AlertOctagon className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Risk Analysis</h3>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">{risks.length} risks</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {risks.map((r, i) => (
          <div key={i} className={`dashboard-card rounded-xl p-4 border ${sev[r.severity] || sev.Low}`}>
            <div className="text-xs font-bold text-[var(--text-primary)]">{r.title}</div>
            <div className="text-[10px] font-mono mt-1 opacity-90">
              Severity: {r.severity} · Likelihood: {r.likelihood || 'Unknown'}
            </div>
            <div className="text-[10px] mt-1 text-[var(--text-secondary)]">Category: {r.category}</div>
            <p className="text-[11px] mt-2 text-[var(--text-secondary)] leading-relaxed">{r.evidence}</p>
            <p className="text-[11px] mt-1 text-[var(--text-primary)]"><span className="font-semibold">Impact:</span> {r.impact}</p>
            <p className="text-[11px] mt-1 text-[var(--text-primary)]"><span className="font-semibold">Mitigation:</span> {r.mitigation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
