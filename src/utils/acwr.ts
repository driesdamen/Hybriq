import type { Session, DomainACWR, ACWRStatus } from '../types';

const MIN_TRAINING_DAYS = 7;
const MAX_SCALE = 2.5;

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getStatus(ratio: number): ACWRStatus {
  if (ratio < 0.8) return 'underload';
  if (ratio <= 1.2) return 'optimal';
  if (ratio <= 1.5) return 'elevated';
  return 'high';
}

type DomainKey = 'metabolicLoad' | 'mechanicalLoad' | 'neuralLoad';

export function computeDomainACWR(sessions: Session[], domain: DomainKey): DomainACWR {
  const cutoff28 = daysAgoStr(28);
  const cutoff7 = daysAgoStr(7);
  const today = todayStr();

  const last28 = sessions.filter((s) => s.date >= cutoff28);
  const last7 = sessions.filter((s) => s.date >= cutoff7);

  const trainingDays = new Set(last28.map((s) => s.date)).size;
  const acuteSum = last7.reduce((sum, s) => sum + s[domain], 0);
  const chronicSum = last28.reduce((sum, s) => sum + s[domain], 0);

  if (trainingDays < MIN_TRAINING_DAYS) {
    return { acute: acuteSum, chronic: 0, ratio: null, status: 'insufficient', trainingDays, hasSpikeToday: false };
  }

  const chronic = chronicSum / 4;
  const ratio = chronic === 0 ? null : acuteSum / chronic;
  const status: ACWRStatus = ratio === null ? 'insufficient' : getStatus(ratio);

  const todayLoad = sessions.filter((s) => s.date === today).reduce((sum, s) => sum + s[domain], 0);
  const avgDailyLast7 = acuteSum / 7;
  const hasSpikeToday = avgDailyLast7 > 0 && todayLoad > 2 * avgDailyLast7;

  return { acute: acuteSum, chronic, ratio, status, trainingDays, hasSpikeToday };
}

export function acwrBarPosition(ratio: number): number {
  return Math.min((ratio / MAX_SCALE) * 100, 100);
}

export const ACWR_STATUS_LABELS: Record<ACWRStatus, string> = {
  underload: 'Onderbelasting',
  optimal: 'Optimaal',
  elevated: 'Verhoogd',
  high: 'Hoog risico',
  insufficient: 'Onvoldoende data',
};
