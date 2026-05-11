import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { computeDomainACWR, ACWR_STATUS_LABELS } from '../utils/acwr';
import { getHRIStatus, HRI_STATUS_LABELS } from '../utils/hri';
import { buildRecommendation, ADVICE_COLORS, ADVICE_DOT } from '../utils/recommendations';
import { StatusDot, statusTextColor } from './shared/StatusDot';
import { DomainBar } from './shared/DomainBar';

const DOMAIN_LABELS = ['Metabool', 'Mechanisch', 'Neuraal'] as const;
type DomainKey = 'metabolicLoad' | 'mechanicalLoad' | 'neuralLoad';
const DOMAIN_KEYS: DomainKey[] = ['metabolicLoad', 'mechanicalLoad', 'neuralLoad'];

function formatDate(): string {
  return new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
}

interface Props {
  onLogSession: () => void;
}

export function Overview({ onLogSession }: Props) {
  const { sessions, recoveryEntries, sports } = useStore();

  const domainACWRs = useMemo(
    () => DOMAIN_KEYS.map((key) => computeDomainACWR(sessions, key)),
    [sessions]
  );

  const latestRecovery = recoveryEntries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
  const hriStatus = latestRecovery ? getHRIStatus(latestRecovery.hri) : null;

  const rec = useMemo(
    () =>
      buildRecommendation(
        { metabolic: domainACWRs[0], mechanical: domainACWRs[1], neural: domainACWRs[2] },
        hriStatus
      ),
    [domainACWRs, hriStatus]
  );

  const recentSessions = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const spikes = domainACWRs
    .map((d, i) => ({ domain: DOMAIN_LABELS[i], spike: d.hasSpikeToday }))
    .filter((d) => d.spike);

  return (
    <div className="flex flex-col gap-5 pb-28 pt-6 px-4">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{formatDate()}</p>
        <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">HybriQ</h1>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Aanbeveling</p>
        <div className="flex items-center gap-2.5 mb-1">
          <span className={`w-3 h-3 rounded-full ${ADVICE_DOT[rec.advice]}`} />
          <span className={`text-xl font-black tracking-tight ${ADVICE_COLORS[rec.advice]}`}>
            {rec.label}
          </span>
        </div>
        <p className="text-sm text-zinc-400">{rec.subtitle}</p>
        {rec.restrictions.length > 0 && (
          <ul className="mt-3 space-y-1">
            {rec.restrictions.map((r) => (
              <li key={r} className="text-xs text-zinc-500 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Domain load */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Domein Belasting</p>
        <div className="space-y-3">
          {domainACWRs.map((d, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status={d.status} size="sm" />
                  <span className="text-sm font-semibold text-white">{DOMAIN_LABELS[i]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${statusTextColor(d.status)}`}>
                    {ACWR_STATUS_LABELS[d.status]}
                  </span>
                  <span className="text-lg font-black text-white tabular-nums">
                    {d.ratio !== null ? d.ratio.toFixed(2) : '—'}
                  </span>
                </div>
              </div>
              <DomainBar ratio={d.ratio} />
              {d.status !== 'insufficient' && (
                <div className="flex gap-4 mt-2 text-xs text-zinc-600">
                  <span>Acuut <span className="text-zinc-400">{Math.round(d.acute)} AU</span></span>
                  <span>Chronisch <span className="text-zinc-400">{Math.round(d.chronic)} AU/wk</span></span>
                </div>
              )}
              {d.status === 'insufficient' && (
                <p className="text-xs text-zinc-600 mt-2">{d.trainingDays} / 7 trainingsdagen geregistreerd</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spike warnings */}
      {spikes.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">Load Spike Detectie</p>
          {spikes.map((s) => (
            <p key={s.domain} className="text-sm text-red-300">
              {s.domain} – dagload meer dan 2x het weekgemiddelde
            </p>
          ))}
        </div>
      )}

      {/* Recovery */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Herstel</p>
        {latestRecovery ? (
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusDot status={hriStatus!} size="sm" />
                <span className="text-sm font-semibold text-white">HRI Score</span>
              </div>
              <span className="text-2xl font-black text-white">{latestRecovery.hri}</span>
            </div>
            <p className="text-xs text-zinc-400">{HRI_STATUS_LABELS[hriStatus!]}</p>
            <p className="text-xs text-zinc-600 mt-1">{latestRecovery.date}</p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228] text-center">
            <p className="text-sm text-zinc-500">Nog geen hersteldata beschikbaar</p>
            <p className="text-xs text-zinc-600 mt-1">Vul dagelijks je herstel in voor nauwkeurigere aanbevelingen</p>
          </div>
        )}
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Recente Sessies</p>
        </div>
        {recentSessions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#222228] text-center">
            <p className="text-sm text-zinc-500">Nog geen sessies gelogd</p>
            <button
              onClick={onLogSession}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              Log eerste sessie
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => {
              const sport = sports.find((sp) => sp.id === s.sportId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#141418] border border-[#222228]">
                  <div>
                    <p className="text-sm font-semibold text-white">{sport?.name ?? 'Onbekend'}</p>
                    <p className="text-xs text-zinc-500">{s.date} &middot; {s.duration} min &middot; RPE {s.rpe}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{s.sessionLoad} AU</p>
                    <p className="text-xs text-zinc-600">totaal</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
