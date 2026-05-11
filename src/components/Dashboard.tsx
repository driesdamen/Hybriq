import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { computeACWR, computeACWRByCategory } from '../utils/acwr';
import { ACWRGauge } from './ACWRGauge';
import { ACWRBadge } from './ACWRBadge';
import type { LoadCategory } from '../types';

const CATEGORY_LABELS: Record<LoadCategory, string> = {
  cardio: '❤️ Cardio',
  strength: '💪 Strength',
  mobility: '🤸 Mobility',
};

export function Dashboard() {
  const { sessions, sports } = useStore();

  const overall = useMemo(() => computeACWR(sessions), [sessions]);
  const byCategory = useMemo(() => computeACWRByCategory(sessions, sports), [sessions, sports]);

  const recentSessions = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-white">Load Overview</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Acute:Chronic Workload Ratio</p>
      </div>

      {/* Overall ACWR */}
      <div className="px-4">
        <div className="p-5 rounded-2xl bg-[#1a1a22] border border-[#2a2a35]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Overall ACWR</p>
              <p className="text-4xl font-bold text-white mt-1">
                {overall.ratio === null ? '—' : overall.ratio.toFixed(2)}
              </p>
            </div>
            <ACWRBadge result={overall} />
          </div>

          {/* Load bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Acute (7d avg)</span>
              <span className="text-zinc-300 font-medium">{overall.acute.toFixed(0)} AU</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#2a2a35]">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(100, (overall.acute / Math.max(overall.chronic, 1)) * 60)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Chronic (28d avg)</span>
              <span className="text-zinc-300 font-medium">{overall.chronic.toFixed(0)} AU</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#2a2a35]">
              <div className="h-full rounded-full bg-zinc-500" style={{ width: '60%' }} />
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            {overall.trainingDays} training day{overall.trainingDays !== 1 ? 's' : ''} in the last 28 days
          </p>
        </div>
      </div>

      {/* Category gauges */}
      <div className="px-4">
        <p className="text-sm font-semibold text-zinc-300 mb-3">By Category</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(CATEGORY_LABELS) as LoadCategory[]).map((cat) => (
            <ACWRGauge key={cat} result={byCategory[cat]} label={CATEGORY_LABELS[cat]} />
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div className="px-4">
          <p className="text-sm font-semibold text-zinc-300 mb-3">Recent Sessions</p>
          <div className="space-y-2">
            {recentSessions.map((s) => {
              const sport = sports.find((sp) => sp.id === s.sportId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a22] border border-[#2a2a35]">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sport?.emoji ?? '🏅'}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{sport?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-zinc-500">{s.date} · {s.duration}min · RPE {s.rpe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{s.load}</p>
                    <p className="text-xs text-zinc-500">AU</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div className="px-4 py-8 text-center text-zinc-500">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-medium text-zinc-300">No sessions yet</p>
          <p className="text-sm mt-1">Log your first workout to start tracking load.</p>
        </div>
      )}
    </div>
  );
}
