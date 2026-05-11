import type { ACWRStatus, HRIStatus, RiskLevel } from '../../types';

type AnyStatus = ACWRStatus | HRIStatus | RiskLevel;

const DOT_COLOR: Record<string, string> = {
  underload: 'bg-blue-400',
  optimal: 'bg-green-400',
  elevated: 'bg-amber-400',
  high: 'bg-red-400',
  insufficient: 'bg-zinc-500',
  moderate: 'bg-amber-400',
  low: 'bg-green-400',
};

const TEXT_COLOR: Record<string, string> = {
  underload: 'text-blue-400',
  optimal: 'text-green-400',
  elevated: 'text-amber-400',
  high: 'text-red-400',
  insufficient: 'text-zinc-500',
  moderate: 'text-amber-400',
  low: 'text-green-400',
};

interface Props {
  status: AnyStatus;
  size?: 'xs' | 'sm' | 'md';
}

const SIZES = { xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5' };

export function StatusDot({ status, size = 'sm' }: Props) {
  return <span className={`inline-block rounded-full flex-shrink-0 ${SIZES[size]} ${DOT_COLOR[status]}`} />;
}

export function statusTextColor(status: AnyStatus): string {
  return TEXT_COLOR[status] ?? 'text-zinc-400';
}
