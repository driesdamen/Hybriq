import type { ACWRResult } from '../types';

const CONFIG = {
  stable: { label: 'Stable', color: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400' },
  elevated: { label: 'Elevated', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  high: { label: 'High Risk', color: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
  insufficient: { label: 'No Data', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30', dot: 'bg-zinc-400' },
};

export function ACWRBadge({ result }: { result: ACWRResult }) {
  const cfg = CONFIG[result.status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
