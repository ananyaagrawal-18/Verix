import React from 'react';
import { Swords, CheckCircle2, XCircle } from 'lucide-react';

export default function ChallengePanel({ challenge }) {
  if (!challenge) {
    return (
      <div className="dashboard-card rounded-2xl p-5 text-sm text-[var(--text-secondary)]">
        Challenge data not available for this evaluation.
      </div>
    );
  }

  const survives = challenge.survives_challenge;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Challenge This Decision</h3>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
          survives
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
            : 'border-red-500/40 bg-red-500/10 text-red-400'
        }`}>
          {survives ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {survives ? 'Survives challenge' : 'Does not fully survive'}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Section title="Assumptions that could be wrong" items={challenge.assumptions_that_could_be_wrong} />
        <Section title="Contradicting evidence" items={challenge.contradicting_evidence} />
        <Section title="Missing information" items={challenge.missing_information} />
        <Section title="Failure under different conditions" items={challenge.failure_conditions} />
        <Section title="Strongest counterarguments" items={challenge.strongest_counterarguments} />
      </div>

      {challenge.cheaper_or_better_fit && typeof challenge.cheaper_or_better_fit === 'object' && (
        <div className="dashboard-card rounded-xl p-4 border border-blue-500/30">
          <div className="text-xs font-bold text-blue-300">Cheaper / alternative fit</div>
          <div className="text-sm text-[var(--text-primary)] mt-1">
            {challenge.cheaper_or_better_fit.name || challenge.cheaper_or_better_fit.product?.name || 'See alternatives'}
          </div>
        </div>
      )}

      <div className="text-[11px] text-[var(--text-secondary)] space-y-1">
        <p><span className="font-semibold text-[var(--text-primary)]">Outdated dependency:</span> {challenge.outdated_dependency}</p>
        <p><span className="font-semibold text-[var(--text-primary)]">Priority sensitivity:</span> {challenge.priority_sensitivity}</p>
      </div>
    </div>
  );
}

function Section({ title, items }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  return (
    <div className="dashboard-card rounded-xl p-4 border border-[var(--border)]">
      <div className="text-xs font-bold text-[var(--text-primary)] mb-2">{title}</div>
      {list.length === 0 ? (
        <div className="text-[11px] text-[var(--text-secondary)]">None flagged.</div>
      ) : (
        <ul className="space-y-1">
          {list.map((item, i) => (
            <li key={i} className="text-[11px] text-[var(--text-secondary)] leading-relaxed">• {typeof item === 'string' ? item : JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
