import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SPORTS } from '../data/sports';
import { computeHRI } from '../utils/hri';
import type { Session, RecoveryEntry, ScreeningResult, SportType } from '../types';

interface StoreState {
  sports: SportType[];
  sessions: Session[];
  recoveryEntries: RecoveryEntry[];
  screenings: ScreeningResult[];
  addSession: (data: Omit<Session, 'id'>) => void;
  removeSession: (id: string) => void;
  addRecovery: (data: Omit<RecoveryEntry, 'id' | 'hri'>) => void;
  addScreening: (data: Omit<ScreeningResult, 'id'>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      sports: SPORTS,
      sessions: [],
      recoveryEntries: [],
      screenings: [],

      addSession: (data) =>
        set((s) => ({
          sessions: [...s.sessions, { ...data, id: crypto.randomUUID() }],
        })),

      removeSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),

      addRecovery: (data) => {
        const hri = computeHRI(data);
        set((s) => ({
          recoveryEntries: [
            ...s.recoveryEntries.filter((e) => e.date !== data.date),
            { ...data, id: crypto.randomUUID(), hri },
          ],
        }));
      },

      addScreening: (data) =>
        set((s) => ({
          screenings: [...s.screenings, { ...data, id: crypto.randomUUID() }],
        })),
    }),
    { name: 'hybriq-v2' }
  )
);
