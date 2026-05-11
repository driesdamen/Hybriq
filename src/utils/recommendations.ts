import type { DomainACWR, TrainingAdvice, HRIStatus } from '../types';

interface Domains {
  metabolic: DomainACWR;
  mechanical: DomainACWR;
  neural: DomainACWR;
}

export interface Recommendation {
  advice: TrainingAdvice;
  label: string;
  subtitle: string;
  restrictions: string[];
}

export function buildRecommendation(domains: Domains, hriStatus: HRIStatus | null): Recommendation {
  const restrictions: string[] = [];

  if (domains.mechanical.status === 'high') restrictions.push('Vermijd sprinten en zwaar beenwerk');
  if (domains.neural.status === 'high') restrictions.push('Vermijd maximale lifts en sparring');
  if (domains.metabolic.status === 'high') restrictions.push('Geen intervallen – houd zone 2');

  const allHigh =
    domains.metabolic.status === 'high' &&
    domains.mechanical.status === 'high' &&
    domains.neural.status === 'high';

  if (allHigh) restrictions.push('Volledige deload aanbevolen');

  if (hriStatus === 'low') restrictions.push('Herstel onvoldoende – actief herstel');

  const anyHigh =
    domains.metabolic.status === 'high' ||
    domains.mechanical.status === 'high' ||
    domains.neural.status === 'high';

  const anyElevated =
    domains.metabolic.status === 'elevated' ||
    domains.mechanical.status === 'elevated' ||
    domains.neural.status === 'elevated';

  if (anyHigh || hriStatus === 'low') {
    return {
      advice: 'deload',
      label: 'Deload',
      subtitle: allHigh ? 'Alle domeinen overbelast' : 'Belasting te hoog – verlaag intensiteit',
      restrictions,
    };
  }

  if (anyElevated || hriStatus === 'moderate') {
    return {
      advice: 'train_adapted',
      label: 'Train Aangepast',
      subtitle: 'Verhoogde belasting – houd rekening met restricties',
      restrictions,
    };
  }

  const anyUnderload =
    domains.metabolic.status === 'underload' ||
    domains.mechanical.status === 'underload' ||
    domains.neural.status === 'underload';

  if (anyUnderload) {
    return {
      advice: 'train_hard',
      label: 'Verhoog Belasting',
      subtitle: 'Belasting laag – ruimte om progressie te maken',
      restrictions,
    };
  }

  return {
    advice: 'train_hard',
    label: 'Train Hard',
    subtitle: 'Alle domeinen optimaal',
    restrictions,
  };
}

export const ADVICE_COLORS: Record<TrainingAdvice, string> = {
  train_hard: 'text-green-400',
  train_adapted: 'text-amber-400',
  deload: 'text-red-400',
};

export const ADVICE_DOT: Record<TrainingAdvice, string> = {
  train_hard: 'bg-green-400',
  train_adapted: 'bg-amber-400',
  deload: 'bg-red-400',
};
