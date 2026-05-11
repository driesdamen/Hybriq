export type ACWRStatus = 'underload' | 'optimal' | 'elevated' | 'high' | 'insufficient';
export type HRIStatus = 'high' | 'moderate' | 'low';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type TrainingAdvice = 'train_hard' | 'train_adapted' | 'deload';

export interface SportType {
  id: string;
  name: string;
  factors: { metabolic: number; mechanical: number; neural: number };
}

export interface Session {
  id: string;
  sportId: string;
  date: string;
  duration: number;
  rpe: number;
  heartRate: number | null;
  sessionLoad: number;
  metabolicLoad: number;
  mechanicalLoad: number;
  neuralLoad: number;
  notes: string;
}

export interface DomainACWR {
  acute: number;
  chronic: number;
  ratio: number | null;
  status: ACWRStatus;
  trainingDays: number;
  hasSpikeToday: boolean;
}

export interface RecoveryEntry {
  id: string;
  date: string;
  sleepDuration: number;
  sleepQuality: number;
  muscleSoreness: number;
  subjectiveFatigue: number;
  hrv: number | null;
  hri: number;
}

export interface ScreeningResult {
  id: string;
  date: string;
  singleLegBalance: { left: number; right: number };
  hamstringBridge: { left: number; right: number };
  shoulderMobility: { left: number; right: number };
  hipMobility: { left: number; right: number };
}
