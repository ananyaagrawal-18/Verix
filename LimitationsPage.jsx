import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';

const FALLBACK = {
  notice: 'This system supports decision-making; it does not guarantee correctness. Verify important details with the original source or seller.',
  limitations: [
    { title: 'AI-generated verification can still be wrong', impact: 'Incorrect recommendations possible.', mitigation: 'Verify critical details with primary sources.' },
    { title: 'External sources may be unavailable or outdated', impact: 'Claims may be unverified.', mitigation: 'System labels missing checks explicitly.' },
    { title: 'Prices and stock can change', impact: 'Budget conclusions may expire.', mitigation: 'Confirm live retailer price and stock.' },
    { title: 'Bias detection can produce false positives/negatives', impact: 'Over or under flagging.', mitigation: 'Review evidence and limitations on each finding.' },
    { title: 'Confidence scores are not calibrated probabilities', impact: '90% is not a 90% chance of correctness.', mitigation: 'Use as a relative signal only.' },
  ],
};

export default function LimitationsPage({ onBack }) {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    fetch('/api/limitations')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setData(j))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <h1 className="text-lg font-black text-[var(--text-primary)]">Limitations & Reliability</h1>
        </div>
        {onBack && (
          <button type="button" onClick={onBack} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            ← Back
          </button>
        )}
      </div>

      <div className="dashboard-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-100/90 leading-relaxed">{data.notice}</p>
      </div>

      <div className="space-y-3">
        {(data.limitations || []).map((lim, i) => (
          <div key={i} className="dashboard-card rounded-xl p-4 border border-[var(--border)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">{lim.title}</div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1"><span className="font-semibold text-[var(--text-primary)]">Impact:</span> {lim.impact}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5"><span className="font-semibold text-[var(--text-primary)]">Mitigation:</span> {lim.mitigation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
