import type { ScreeningResult, RiskLevel, DomainACWR } from '../types';

interface AreaRisk {
  area: string;
  level: RiskLevel;
  reasons: string[];
  routine: string[];
}

function asymmetry(left: number, right: number): number {
  const max = Math.max(left, right);
  if (max === 0) return 0;  
  return Math.abs(left - right) / max;
}

function avgScore(left: number, right: number): number {
  return (left + right) / 2;
}

export function computePrehabRisks(
  screening: ScreeningResult,
  mechanical: DomainACWR,
  neural: DomainACWR
): AreaRisk[] {
  const risks: AreaRisk[] = [];

  // Hamstring risk
  {
    const reasons: string[] = [];
    const asym = asymmetry(screening.hamstringBridge.left, screening.hamstringBridge.right);
    const avg = avgScore(screening.hamstringBridge.left, screening.hamstringBridge.right);
    if (asym > 0.15) reasons.push(`Asymmetrie ${Math.round(asym * 100)}% (links vs rechts)`);
    if (avg < 3) reasons.push('Lage kracht score');
    if (mechanical.status === 'elevated' || mechanical.status === 'high') reasons.push('Hoge mechanische belasting');
    risks.push({
      area: 'Hamstring',
      level: reasons.length === 0 ? 'low' : reasons.length === 1 ? 'moderate' : 'high',
      reasons,
      routine: ['Nordic curls', 'Single leg RDL', 'Isometrische holds'],
    });
  }

  // Shoulder risk
  {
    const reasons: string[] = [];
    const asym = asymmetry(screening.shoulderMobility.left, screening.shoulderMobility.right);
    const avg = avgScore(screening.shoulderMobility.left, screening.shoulderMobility.right);
    if (asym > 0.15) reasons.push(`Asymmetrie ${Math.round(asym * 100)}%`);
    if (avg < 3) reasons.push('Beperkte schouder mobiliteit');
    if (neural.status === 'elevated' || neural.status === 'high') reasons.push('Hoge neurale belasting');
    risks.push({
      area: 'Schouder',
      level: reasons.length === 0 ? 'low' : reasons.length === 1 ? 'moderate' : 'high',
      reasons,
      routine: ['Band pull-aparts', 'Face pulls', 'Wall slides'],
    });
  }

  // Balance / Ankle risk
  {
    const reasons: string[] = [];
    const asym = asymmetry(screening.singleLegBalance.left, screening.singleLegBalance.right);
    const avg = avgScore(screening.singleLegBalance.left, screening.singleLegBalance.right);
    if (asym > 0.15) reasons.push(`Asymmetrie ${Math.round(asym * 100)}%`);
    if (avg < 3) reasons.push('Beperkte enkelmobiliteit / balans');
    risks.push({
      area: 'Balans / Enkel',
      level: reasons.length === 0 ? 'low' : reasons.length === 1 ? 'moderate' : 'high',
      reasons,
      routine: ['Single leg stance progressie', 'Y-balance oefeningen', 'Calf raises'],
    });
  }

  // Hip risk
  {
    const reasons: string[] = [];
    const asym = asymmetry(screening.hipMobility.left, screening.hipMobility.right);
    const avg = avgScore(screening.hipMobility.left, screening.hipMobility.right);
    if (asym > 0.15) reasons.push(`Asymmetrie ${Math.round(asym * 100)}%`);
    if (avg < 3) reasons.push('Beperkte hip mobiliteit');
    if (mechanical.status === 'elevated' || mechanical.status === 'high') reasons.push('Hoge mechanische belasting');
    risks.push({
      area: 'Heup / Lies',
      level: reasons.length === 0 ? 'low' : reasons.length === 1 ? 'moderate' : 'high',
      reasons,
      routine: ['Hip flexor stretch', '90/90 stretches', 'Copenhagen plank'],
    });
  }

  return risks;
}

export const RISK_DOT: Record<RiskLevel, string> = {
  low: 'bg-green-400',
  moderate: 'bg-amber-400',
  high: 'bg-red-400',
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Laag risico',
  moderate: 'Matig risico',
  high: 'Hoog risico',
};
