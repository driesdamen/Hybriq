import type { RecoveryEntry, HRIStatus } from '../types';

export function computeHRI(entry: Omit<RecoveryEntry, 'id' | 'hri'>): number {
  const sleepDurationScore = Math.min(entry.sleepDuration / 8, 1) * 20;
  const sleepQualityScore = ((entry.sleepQuality - 1) / 4) * 20;
  const sorenessScore = ((5 - entry.muscleSoreness) / 4) * 30;
  const fatigueScore = ((10 - entry.subjectiveFatigue) / 9) * 30;

  return Math.round(sleepDurationScore + sleepQualityScore + sorenessScore + fatigueScore);
}

export function getHRIStatus(hri: number): HRIStatus {
  if (hri > 75) return 'high';
  if (hri >= 50) return 'moderate';
  return 'low';
}

export const HRI_STATUS_LABELS: Record<HRIStatus, string> = {
  high: 'Hoge intensiteit toegestaan',
  moderate: 'Zone 2 aanbevolen',
  low: 'Actief herstel',
};
