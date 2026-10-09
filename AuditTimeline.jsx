import React from 'react';
import { ListOrdered } from 'lucide-react';

export default function AuditTimeline({ events = [] }) {
  if (!events.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <ListOrdered className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Audit Trail</h3>
      </div>
      <ol className="relative border-l border-[var(--border)] ml-2 space-y-3">
        {events.map((e, i) => (
          <li key={i} className="ml-4">
            <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-violet-500/80 border border-violet-300/40" />
            <div className="text-[11px] font-mono text-violet-300">Step {e.step}: {e.event}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">{e.detail}</div>
            {e.timestamp && <div className="text-[9px] text-[var(--text-secondary)] opacity-70">{e.timestamp}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
}
