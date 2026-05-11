import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Session } from '../types';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

const RPE_LABELS: Record<number, string> = {
  1: 'Heel licht', 2: 'Licht', 3: 'Matig licht', 4: 'Matig',
  5: 'Gemiddeld', 6: 'Iets zwaar', 7: 'Zwaar', 8: 'Heel zwaar',
  9: 'Maximaal', 10: 'Absolute max',
};

interface Props {
  onDone: () => void;
}

export function LogSession({ onDone }: Props) {
  const { sports, addSession } = useStore();
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState(todayStr());
  const [duration, setDuration] = useState(60);
  const [rpe, setRpe] = useState(6);
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const sport = sports.find((s) => s.id === sportId);
  const sessionLoad = duration * rpe;
  const metabolicLoad = sport ? Math.round(sessionLoad * sport.factors.metabolic) : 0;
  const mechanicalLoad = sport ? Math.round(sessionLoad * sport.factors.mechanical) : 0;
  const neuralLoad = sport ? Math.round(sessionLoad * sport.factors.neural) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport) return;
    const session: Omit<Session, 'id'> = {
      sportId,
      date,
      duration,
      rpe,
      heartRate: heartRate ? Number(heartRate) : null,
      sessionLoad,
      metabolicLoad,
      mechanicalLoad,
      neuralLoad,
      notes,
    };
    addSession(session);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSportId('');
      setDuration(60);
      setRpe(6);
      setHeartRate('');
      setNotes('');
      setDate(todayStr());
      onDone();
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-6 px-4">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Sessie Loggen</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Belasting = RPE x Duur x Sportfactor</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Sport selection */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Sport</p>
          <div className="grid grid-cols-2 gap-2">
            {sports.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSportId(s.id)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-left border transition-all ${
                  sportId === s.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[#141418] border-[#222228] text-zinc-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Domain factors preview */}
        {sport && (
          <div className="p-3 rounded-xl bg-[#141418] border border-[#222228]">
            <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-widest">Sportfactoren</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-zinc-500">Metabool</p>
                <p className="text-sm font-bold text-white">{Math.round(sport.factors.metabolic * 100)}%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Mechanisch</p>
                <p className="text-sm font-bold text-white">{Math.round(sport.factors.mechanical * 100)}%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Neuraal</p>
                <p className="text-sm font-bold text-white">{Math.round(sport.factors.neural * 100)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Datum</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayStr()}
            className="w-full px-4 py-3 rounded-xl bg-[#141418] border border-[#222228] text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Duration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Duur</p>
            <span className="text-sm font-bold text-white">{duration} min</span>
          </div>
          <input
            type="range" min={5} max={180} step={5}
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
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">RPE (Inspanningsniveau)</p>
            <span className="text-sm font-bold text-white">{rpe} / 10</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRpe(v)}
                className={`h-9 rounded-lg text-xs font-bold transition-all ${
                  v === rpe
                    ? v <= 4 ? 'bg-green-500 text-white' : v <= 7 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                    : 'bg-[#222228] text-zinc-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">{RPE_LABELS[rpe]}</p>
        </div>

        {/* HR optional */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Gemiddelde hartslag (optioneel)</p>
          <input
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="bpm"
            min={40} max={220}
            className="w-full px-4 py-3 rounded-xl bg-[#141418] border border-[#222228] text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
          />
        </div>

        {/* Load preview */}
        {sport && (
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Belasting Verdeling</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Metabool</span>
                <span className="font-bold text-white">{metabolicLoad} AU</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Mechanisch</span>
                <span className="font-bold text-white">{mechanicalLoad} AU</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Neuraal</span>
                <span className="font-bold text-white">{neuralLoad} AU</span>
              </div>
              <div className="border-t border-[#222228] pt-2 flex justify-between text-sm">
                <span className="text-zinc-300 font-semibold">Totaal</span>
                <span className="font-black text-white">{sessionLoad} AU</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Notities (optioneel)</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hoe voelde de sessie?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-[#141418] border border-[#222228] text-white text-sm focus:outline-none focus:border-blue-500 resize-none placeholder:text-zinc-600"
          />
        </div>

        <button
          type="submit"
          disabled={!sportId || saved}
          className={`w-full py-4 rounded-2xl text-base font-black tracking-tight transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : sportId
              ? 'bg-blue-600 text-white active:scale-[0.98]'
              : 'bg-[#1e1e26] text-zinc-600 cursor-not-allowed'
          }`}
        >
          {saved ? 'Opgeslagen' : 'Sessie Opslaan'}
        </button>
      </form>
    </div>
  );
}
