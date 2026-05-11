import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { computeDomainACWR } from '../utils/acwr';
import { computePrehabRisks, RISK_DOT, RISK_LABEL } from '../utils/prehab';
import { StatusDot } from './shared/StatusDot';
import type { ScreeningResult } from '../types';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

interface ScoreInputProps {
  label: string;
  value: { left: number; right: number };
  onChange: (v: { left: number; right: number }) => void;
}

function ScoreInput({ label, value, onChange }: ScoreInputProps) {
  return (
    <div className="p-4 rounded-xl bg-[#141418] border border-[#222228]">
      <p className="text-sm font-semibold text-white mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {(['left', 'right'] as const).map((side) => (
          <div key={side}>
            <p className="text-xs text-zinc-500 mb-1.5">{side === 'left' ? 'Links' : 'Rechts'}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ ...value, [side]: v })}
                  className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all border ${
                    value[side] === v
                      ? v <= 2 ? 'bg-red-500 border-transparent text-white'
                        : v === 3 ? 'bg-amber-500 border-transparent text-white'
                        : 'bg-green-500 border-transparent text-white'
                      : 'bg-[#222228] border-transparent text-zinc-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {Math.abs(value.left - value.right) / Math.max(value.left, value.right) > 0.15 && (
        <p className="text-xs text-amber-400 mt-2">
          Asymmetrie {Math.round(Math.abs(value.left - value.right) / Math.max(value.left, value.right) * 100)}%
        </p>
      )}
    </div>
  );
}

export function PrehabScreen() {
  const { sessions, screenings, addScreening } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [balance, setBalance] = useState({ left: 3, right: 3 });
  const [hamstring, setHamstring] = useState({ left: 3, right: 3 });
  const [shoulder, setShoulder] = useState({ left: 3, right: 3 });
  const [hip, setHip] = useState({ left: 3, right: 3 });

  const mechanical = useMemo(() => computeDomainACWR(sessions, 'mechanicalLoad'), [sessions]);
  const neural = useMemo(() => computeDomainACWR(sessions, 'neuralLoad'), [sessions]);

  const latestScreening = [...screenings].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;

  const risks = useMemo(
    () => latestScreening ? computePrehabRisks(latestScreening, mechanical, neural) : [],
    [latestScreening, mechanical, neural]
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<ScreeningResult, 'id'> = {
      date: todayStr(),
      singleLegBalance: balance,
      hamstringBridge: hamstring,
      shoulderMobility: shoulder,
      hipMobility: hip,
    };
    addScreening(data);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-6 px-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Prehab</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Preventief risicoprofiel – niet medisch</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          {showForm ? 'Annuleren' : 'Screening'}
        </button>
      </div>

      {/* Screening form */}
      {showForm && (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Score per oefening (1 = slecht, 5 = uitstekend)</p>
          </div>
          <ScoreInput label="Single Leg Balance" value={balance} onChange={setBalance} />
          <ScoreInput label="Hamstring Bridge Hold" value={hamstring} onChange={setHamstring} />
          <ScoreInput label="Schoudermobiliteit" value={shoulder} onChange={setShoulder} />
          <ScoreInput label="Hip Mobiliteit" value={hip} onChange={setHip} />
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl text-base font-black tracking-tight transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {saved ? 'Opgeslagen' : 'Screening Opslaan'}
          </button>
        </form>
      )}

      {/* Risk indicators */}
      {!showForm && latestScreening && (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Laatste screening</p>
            <p className="text-xs text-zinc-600">{latestScreening.date}</p>
          </div>
          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.area} className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${RISK_DOT[risk.level]}`} />
                    <span className="text-sm font-semibold text-white">{risk.area}</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    risk.level === 'low' ? 'text-green-400' : risk.level === 'moderate' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {RISK_LABEL[risk.level]}
                  </span>
                </div>

                {risk.reasons.length > 0 && (
                  <ul className="space-y-0.5 mb-3">
                    {risk.reasons.map((r) => (
                      <li key={r} className="text-xs text-zinc-500 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}

                {(risk.level === 'moderate' || risk.level === 'high') && (
                  <div className="border-t border-[#222228] pt-2">
                    <p className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-widest">Prehab routine</p>
                    <ul className="space-y-0.5">
                      {risk.routine.map((ex) => (
                        <li key={ex} className="text-xs text-zinc-300 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!showForm && !latestScreening && (
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#222228] text-center">
          <p className="text-sm font-semibold text-white mb-1">Nog geen screening gedaan</p>
          <p className="text-xs text-zinc-500 mb-4">Doe een 5-minuten screening om je risicoprofiel op te stellen</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold"
          >
            Start Screening
          </button>
        </div>
      )}

      {/* Mechanical load context */}
      {latestScreening && (
        <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Belastingscontext</p>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-zinc-500">Mechanisch ACWR</p>
              <p className="text-sm font-bold text-white">
                {mechanical.ratio !== null ? mechanical.ratio.toFixed(2) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Neuraal ACWR</p>
              <p className="text-sm font-bold text-white">
                {neural.ratio !== null ? neural.ratio.toFixed(2) : '—'}
              </p>
            </div>
            <div>
              <StatusDot status={mechanical.status} size="sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
