import type { SportType } from '../types';

export const SPORTS: SportType[] = [
  { id: 'football', name: 'Voetbal', factors: { metabolic: 0.40, mechanical: 0.30, neural: 0.30 } },
  { id: 'running', name: 'Hardlopen', factors: { metabolic: 0.50, mechanical: 0.35, neural: 0.15 } },
  { id: 'cycling', name: 'Fietsen', factors: { metabolic: 0.55, mechanical: 0.25, neural: 0.20 } },
  { id: 'swimming', name: 'Zwemmen', factors: { metabolic: 0.55, mechanical: 0.30, neural: 0.15 } },
  { id: 'weightlifting', name: 'Gewichtheffen', factors: { metabolic: 0.20, mechanical: 0.50, neural: 0.30 } },
  { id: 'crossfit', name: 'CrossFit', factors: { metabolic: 0.35, mechanical: 0.35, neural: 0.30 } },
  { id: 'tennis', name: 'Tennis', factors: { metabolic: 0.35, mechanical: 0.30, neural: 0.35 } },
  { id: 'yoga', name: 'Yoga', factors: { metabolic: 0.20, mechanical: 0.40, neural: 0.40 } },
  { id: 'boxing', name: 'Boksen', factors: { metabolic: 0.35, mechanical: 0.25, neural: 0.40 } },
  { id: 'sprinting', name: 'Sprinten', factors: { metabolic: 0.30, mechanical: 0.35, neural: 0.35 } },
  { id: 'rowing', name: 'Roeien', factors: { metabolic: 0.50, mechanical: 0.35, neural: 0.15 } },
  { id: 'basketball', name: 'Basketball', factors: { metabolic: 0.40, mechanical: 0.25, neural: 0.35 } },
  { id: 'martial_arts', name: 'Vechtsport', factors: { metabolic: 0.35, mechanical: 0.25, neural: 0.40 } },
  { id: 'gymnastics', name: 'Turnen', factors: { metabolic: 0.25, mechanical: 0.35, neural: 0.40 } },
  { id: 'stretching', name: 'Stretchen', factors: { metabolic: 0.15, mechanical: 0.45, neural: 0.40 } },
];
