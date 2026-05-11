import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { computeHRI, getHRIStatus, HRI_STATUS_LABELS } from '../utils/hri';
import { StatusDot, statusTextColor } from './shared/StatusDot';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

const SORENESS_LABELS: Record<number, string> = {
  1: 'Geen', 2: 'Licht', 3: 'Matig', 4: 'Zwaar', 5: 'Ernstig',
};

const QUALITY_LABELS: Record<number, string> = {
  1: 'Slecht', 2: 'Matig', 3: 'Redelijk', 4: 'Goed', 5: 'Uitstekend',
};

interface RatingProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
  activeColor?: string;
}

function Rating({ value, max, onChange, activeColor = 'bg-blue-500' }: RatingProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 h-9 rounded-xl text-sm font-bold transition-all border ${
            v === value
              ? `${activeColor} border-transparent text-white`
              : 'bg-[#141418] border-[#222228] text-zinc-500'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function RecoveryScreen() {
  const { addRecovery, recoveryEntries } = useStore();
  const [sleepDuration, setSleepDuration] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [muscleSoreness, setMuscleSoreness] = useState(2);
  const [subjectiveFatigue, setSubjectiveFatigue] = useState(4);
  const [hrv, setHrv] = useState('');
  const [saved, setSaved] = useState(false);

  const preview = useMemo(
    () => computeHRI({ date: todayStr(), sleepDuration, sleepQuality, muscleSoreness, subjectiveFatigue, hrv: hrv ? Number(hrv) : null }),
    [sleepDuration, sleepQuality, muscleSoreness, subjectiveFatigue, hrv]
  );
  const previewStatus = getHRIStatus(preview);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addRecovery({ date: todayStr(), sleepDuration, sleepQuality, muscleSoreness, subjectiveFatigue, hrv: hrv ? Number(hrv) : null });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const history = [...recoveryEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="flex flex-col gap-6 pb-28 pt-6 px-4">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Herstel</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Hybrid Recovery Index – dagelijkse check-in</p>
      </div>

      {/* Live HRI preview */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">HRI Vandaag</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusDot status={previewStatus} size="md" />
              <span className={`text-sm font-semibold ${statusTextColor(previewStatus)}`}>
                {HRI_STATUS_LABELS[previewStatus]}
              </span>
            </div>
          </div>
          <span className="text-4xl font-black text-white">{preview}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[#222228] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              previewStatus === 'high' ? 'bg-green-500' : previewStatus === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${preview}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Sleep duration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Slaapduur</p>
            <span className="text-sm font-bold text-white">{sleepDuration} uur</span>
          </div>
          <input
            type="range" min={0} max={12} step={0.5}
            value={sleepDuration}
            onChange={(e) => setSleepDuration(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>0u</span><span>12u</span>
          </div>
        </div>

        {/* Sleep quality */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Slaapkwaliteit</p>
            <span className="text-sm font-bold text-white">{QUALITY_LABELS[sleepQuality]}</span>
          </div>
          <Rating value={sleepQuality} max={5} onChange={setSleepQuality} activeColor="bg-blue-500" />
        </div>

        {/* Muscle soreness */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Spierpijn</p>
            <span className="text-sm font-bold text-white">{SORENESS_LABELS[muscleSoreness]}</span>
          </div>
          <Rating
            value={muscleSoreness}
            max={5}
            onChange={setMuscleSoreness}
            activeColor={muscleSoreness <= 2 ? 'bg-green-500' : muscleSoreness <= 3 ? 'bg-amber-500' : 'bg-red-500'}
          />
        </div>

        {/* Subjective fatigue */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Vermoeidheid</p>
            <span className="text-sm font-bold text-white">{subjectiveFatigue} / 10</span>
          </div>
          <input
            type="range" min={1} max={10} step={1}
            value={subjectiveFatigue}
            onChange={(e) => setSubjectiveFatigue(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>Fris</span><span>Uitgeput</span>
          </div>
        </div>

        {/* HRV optional */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">HRV (optioneel)</p>
          <input
            type="number"
            value={hrv}
            onChange={(e) => setHrv(e.target.value)}
            placeholder="ms"
            min={10} max={200}
            className="w-full px-4 py-3 rounded-xl bg-[#141418] border border-[#222228] text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-4 rounded-2xl text-base font-black tracking-tight transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white active:scale-[0.98]'
          }`}
        >
          {saved ? 'Opgeslagen' : 'Herstel Opslaan'}
        </button>
      </form>

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Herstelgeschiedenis</p>
          <div className="space-y-2">
            {history.map((e) => {
              const s = getHRIStatus(e.hri);
              return (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-[#141418] border border-[#222228]">
                  <div className="flex items-center gap-2">
                    <StatusDot status={s} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{HRI_STATUS_LABELS[s]}</p>
                      <p className="text-xs text-zinc-500">{e.date}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-white">{e.hri}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
