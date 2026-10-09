import React from 'react';
import { AlertTriangle, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

const severityColor = {
  High: 'text-red-400 border-red-500/40 bg-red-500/10',
  Medium: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  Low: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
};

const statusIcon = {
  Detected: AlertTriangle,
  Reviewed: Eye,
  Resolved: CheckCircle2,
};

export default function BiasDashboard({ findings = [] }) {
  if (!findings.length) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        No bias signals flagged for this evaluation. Absence of flags does not prove the decision is unbiased.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Bias Detection Report</h3>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">{findings.length} signal(s)</span>
      </div>
      {findings.map((f, i) => {
        const Icon = statusIcon[f.status] || AlertTriangle;
        return (
          <div
            key={i}
            className={`dashboard-card rounded-xl p-4 border ${severityColor[f.severity] || severityColor.Low}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{f.bias_type}</div>
                <div className="text-[10px] font-mono mt-0.5 opacity-80">
                  Severity: {f.severity} · Status: {f.status}
                </div>
              </div>
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">{f.evidence}</p>
            {f.affected_claims?.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {f.affected_claims.map((c, j) => (
                  <li key={j} className="text-[10px] font-mono text-[var(--text-secondary)]">• {c}</li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-[11px] text-[var(--text-primary)]">
              <span className="font-semibold">Correction:</span> {f.recommended_correction}
            </div>
            {f.limitations && (
              <div className="mt-1 text-[10px] text-[var(--text-secondary)] italic">Limitation: {f.limitations}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
