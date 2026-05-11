import { acwrBarPosition } from '../../utils/acwr';

const MAX = 2.5;
const ZONES = [
  { width: (0.8 / MAX) * 100, color: 'bg-blue-500/20' },
  { width: (0.4 / MAX) * 100, color: 'bg-green-500/20' },
  { width: (0.3 / MAX) * 100, color: 'bg-amber-500/20' },
  { width: (1.0 / MAX) * 100, color: 'bg-red-500/20' },
];

const MARKERS = [
  { value: 0.8, label: '0.8' },
  { value: 1.2, label: '1.2' },
  { value: 1.5, label: '1.5' },
];

export function DomainBar({ ratio }: { ratio: number | null }) {
  const pos = ratio !== null ? acwrBarPosition(ratio) : null;

  return (
    <div className="mt-3">
      <div className="relative h-2.5 rounded-full overflow-hidden flex">
        {ZONES.map((z, i) => (
          <div key={i} className={`h-full ${z.color}`} style={{ width: `${z.width}%` }} />
        ))}
        {pos !== null && (
          <div
            className="absolute top-0 bottom-0 w-px bg-white/80"
            style={{ left: `${pos}%` }}
          />
        )}
      </div>
      <div className="relative h-3 mt-0.5">
        {MARKERS.map((m) => (
          <span
            key={m.value}
            className="absolute text-[9px] text-zinc-600 -translate-x-1/2"
            style={{ left: `${(m.value / MAX) * 100}%` }}
          >
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
