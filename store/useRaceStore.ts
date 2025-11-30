import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Race } from '@/types';
import { formatDate } from '@/lib/utils';

interface RaceState {
  race: Race;
  setRace: (race: Partial<Race>) => void;
  resetRace: () => void;
}

const defaultRace: Race = {
  date: formatDate(new Date()),
  venue: '東京',
  raceNumber: 1,
  raceName: '',
};

export const useRaceStore = create<RaceState>()(
  persist(
    (set) => ({
      race: defaultRace,
      setRace: (raceData) =>
        set((state) => ({
          race: { ...state.race, ...raceData },
        })),
      resetRace: () => set({ race: defaultRace }),
    }),
    {
      name: 'race-storage',
    }
  )
);
