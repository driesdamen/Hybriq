import type { ACWRResult } from '../types';

const ADVICE: Record<string, string> = {
  stable: 'Load is well managed. Safe to progress.',
  elevated: 'Workload increasing. Monitor fatigue closely.',
  high: 'Sharp spike detected. Reduce load or add recovery.',
  insufficient: 'Need at least 7 training days in 28 days.',
};

const COLOR: Record<string, string> = {
  stable: '#22c55e',
  elevated: '#f59e0b',
  high: '#ef4444',
  insufficient: '#71717a',
};

export function ACWRGauge({ result, label }: { result: ACWRResult; label: string }) {
  const ratio = result.ratio ?? 0;
  const displayRatio = result.status === 'insufficient' ? '—' : ratio.toFixed(2);

  // Arc from 0.5 to 2.5 mapped onto 0–180 degrees
  const clampedRatio = Math.min(Math.max(ratio, 0.5), 2.5);
  const angle = ((clampedRatio - 0.5) / 2) * 180;
  const radians = ((angle - 90) * Math.PI) / 180;
  const needleX = 50 + 36 * Math.cos(radians);
  const needleY = 50 + 36 * Math.sin(radians);

  const color = COLOR[result.status];

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#1a1a22] border border-[#2a2a35]">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>

      <div className="relative w-28 h-16">
        <svg viewBox="0 0 100 55" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#2a2a35"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored zones */}
          <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
          <path d="M 50 10 A 40 40 0 0 1 76 18" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
          <path d="M 76 18 A 40 40 0 0 1 90 50" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.3" />

          {/* Needle */}
          {result.status !== 'insufficient' && (
            <line
              x1="50"
              y1="50"
              x2={needleX}
              y2={needleY}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          <circle cx="50" cy="50" r="3" fill={color} />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0.5">
          <span className="text-xl font-bold" style={{ color }}>{displayRatio}</span>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400 leading-relaxed max-w-[160px]">
        {ADVICE[result.status]}
      </p>

      {result.status !== 'insufficient' && (
        <div className="flex gap-4 text-xs text-zinc-500">
          <span>Acute <span className="text-zinc-300 font-medium">{result.acute.toFixed(0)}</span></span>
          <span>Chronic <span className="text-zinc-300 font-medium">{result.chronic.toFixed(0)}</span></span>
        </div>
      )}
    </div>
  );
}
