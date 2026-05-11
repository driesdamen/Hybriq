import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { LoadCategory } from '../types';

const CATEGORY_LABELS: Record<LoadCategory, string> = {
  cardio: '❤️ Cardio',
  strength: '💪 Strength',
  mobility: '🤸 Mobility',
};

const today = () => new Date().toISOString().split('T')[0];

export function AddSession({ onDone }: { onDone: () => void }) {
  const { sports, addSession } = useStore();
  const [category, setCategory] = useState<LoadCategory>('cardio');
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState(today());
  const [duration, setDuration] = useState(30);
  const [rpe, setRpe] = useState(6);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const filteredSports = sports.filter((s) => s.category === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportId) return;
    addSession({ sportId, date, duration, rpe, notes });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNotes('');
      setDuration(30);
      setRpe(6);
      setDate(today());
      onDone();
    }, 800);
  };

  const estimatedLoad = duration * rpe;

  return (
    <div className="flex flex-col gap-5 pb-24 pt-6">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-white">Log Session</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Session Load = Duration × RPE</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
        {/* Category picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_LABELS) as LoadCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat); setSportId(''); }}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  category === cat
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[#1a1a22] border-[#2a2a35] text-zinc-400'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Sport picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Sport</label>
          <div className="grid grid-cols-2 gap-2">
            {filteredSports.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSportId(s.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  sportId === s.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[#1a1a22] border-[#2a2a35] text-zinc-300'
                }`}
              >
                <span>{s.emoji}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today()}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a22] border border-[#2a2a35] text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Duration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Duration</label>
            <span className="text-sm font-bold text-white">{duration} min</span>
          </div>
          <input
            type="range"
            min={5}
            max={180}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>5 min</span><span>180 min</span>
          </div>
        </div>

        {/* RPE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">RPE (Perceived Effort)</label>
            <span className="text-sm font-bold text-white">{rpe} / 10</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRpe(v)}
                className={`h-9 rounded-lg text-xs font-bold transition-all ${
                  v <= rpe
                    ? v <= 4
                      ? 'bg-green-500 text-white'
                      : v <= 7
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-[#2a2a35] text-zinc-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            {rpe <= 3 ? 'Very easy' : rpe <= 5 ? 'Moderate' : rpe <= 7 ? 'Hard' : rpe <= 9 ? 'Very hard' : 'Max effort'}
          </p>
        </div>

        {/* Estimated load */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a22] border border-[#2a2a35]">
          <span className="text-sm text-zinc-400">Estimated Load</span>
          <span className="text-xl font-bold text-white">{estimatedLoad} <span className="text-sm font-normal text-zinc-400">AU</span></span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a22] border border-[#2a2a35] text-white text-sm focus:outline-none focus:border-blue-500 resize-none placeholder:text-zinc-600"
          />
        </div>

        <button
          type="submit"
          disabled={!sportId || saved}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : sportId
              ? 'bg-blue-600 text-white active:scale-[0.98]'
              : 'bg-[#2a2a35] text-zinc-600 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Saved!' : 'Log Session'}
        </button>
      </form>
    </div>
  );
}
