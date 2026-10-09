import React from 'react';
import { GitCompare } from 'lucide-react';

export default function AlternativesTable({ comparison }) {
  if (!comparison) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        Comparison data not available.
      </div>
    );
  }

  if (!comparison.sufficient_data) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        {comparison.note || 'Insufficient verified alternatives for comparison.'}
      </div>
    );
  }

  const rows = comparison.rows || [];
  const weights = comparison.weights || {};
  const labels = comparison.criteria_labels || {};

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Alternative Comparison</h3>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)]">{comparison.note}</p>

      <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
        {Object.entries(weights).map(([k, v]) => (
          <span key={k} className="px-2 py-0.5 rounded border border-[var(--border)]">
            {labels[k] || k}: {(v * 100).toFixed(0)}%
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-[var(--bg-hover)] text-[var(--text-secondary)]">
            <tr>
              <th className="px-3 py-2 font-semibold">Product</th>
              <th className="px-3 py-2 font-semibold">Price (≈INR)</th>
              <th className="px-3 py-2 font-semibold">Budget</th>
              <th className="px-3 py-2 font-semibold">RAM</th>
              <th className="px-3 py-2 font-semibold">GPU</th>
              <th className="px-3 py-2 font-semibold">Weight</th>
              <th className="px-3 py-2 font-semibold">Overall</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={`border-t border-[var(--border)] ${r.is_primary ? 'bg-blue-500/5' : ''}`}>
                <td className="px-3 py-2 text-[var(--text-primary)] font-medium">
                  {r.name}
                  {r.is_primary && <span className="ml-1 text-[9px] text-blue-400 font-mono">PRIMARY</span>}
                </td>
                <td className="px-3 py-2 font-mono">₹{(r.price_inr_approx || 0).toLocaleString()}</td>
                <td className="px-3 py-2">{r.budget_fit}</td>
                <td className="px-3 py-2">{r.specs_summary?.ram_gb ?? '—'} GB</td>
                <td className="px-3 py-2 max-w-[140px] truncate">{r.specs_summary?.gpu || '—'}</td>
                <td className="px-3 py-2">{r.specs_summary?.weight_kg ?? '—'} kg</td>
                <td className="px-3 py-2 font-mono font-bold text-[var(--text-primary)]">
                  {((r.scores?.overall || 0) * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <div key={`pc-${r.id}`} className="dashboard-card rounded-xl p-3 border border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--text-primary)]">{r.name}</div>
            <div className="mt-1 text-[10px] text-emerald-400">Pros: {(r.pros || []).join('; ') || '—'}</div>
            <div className="mt-0.5 text-[10px] text-red-300">Cons: {(r.cons || []).join('; ') || '—'}</div>
            {r.missing_info?.length > 0 && (
              <div className="mt-0.5 text-[10px] text-[var(--text-secondary)]">Missing: {r.missing_info.join(', ')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
