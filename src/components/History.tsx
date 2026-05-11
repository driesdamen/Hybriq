import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2 } from 'lucide-react';

export function History() {
  const { sessions, sports, removeSession } = useStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  const grouped = sorted.reduce<Record<string, typeof sorted>>((acc, s) => {
    (acc[s.date] ??= []).push(s);
    return acc;
  }, {});

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      removeSession(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 pt-6">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{sessions.length} sessions logged</p>
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-12 text-center text-zinc-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium text-zinc-300">No sessions yet</p>
          <p className="text-sm mt-1">Log a workout to see it here.</p>
        </div>
      ) : (
        <div className="px-4 space-y-5">
          {Object.entries(grouped).map(([date, daySessions]) => {
            const dayTotal = daySessions.reduce((s, x) => s + x.load, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'short',
                    })}
                  </p>
                  <p className="text-xs text-zinc-500">{dayTotal} AU total</p>
                </div>
                <div className="space-y-2">
                  {daySessions.map((s) => {
                    const sport = sports.find((sp) => sp.id === s.sportId);
                    return (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a22] border border-[#2a2a35]">
                        <span className="text-2xl flex-shrink-0">{sport?.emoji ?? '🏅'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{sport?.name ?? 'Unknown'}</p>
                          <p className="text-xs text-zinc-500">{s.duration} min · RPE {s.rpe} · {s.load} AU</p>
                          {s.notes && <p className="text-xs text-zinc-400 mt-0.5 truncate">{s.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                            confirmId === s.id
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
