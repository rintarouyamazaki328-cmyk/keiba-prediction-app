import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Horse, RunningStyle } from '@/types';
import { generateId } from '@/lib/utils';

interface HorseState {
  horses: Horse[];
  addHorse: (horse: Omit<Horse, 'id'>) => void;
  updateHorse: (id: string, horse: Partial<Horse>) => void;
  deleteHorse: (id: string) => void;
  setHorses: (horses: Horse[]) => void;
  clearHorses: () => void;
  sortByOdds: () => void;
  sortByNumber: () => void;
  filterByStyle: (style: RunningStyle | null) => Horse[];
}

export const useHorseStore = create<HorseState>()(
  persist(
    (set, get) => ({
      horses: [],
      addHorse: (horseData) =>
        set((state) => ({
          horses: [...state.horses, { ...horseData, id: generateId() }],
        })),
      updateHorse: (id, horseData) =>
        set((state) => ({
          horses: state.horses.map((horse) =>
            horse.id === id ? { ...horse, ...horseData } : horse
          ),
        })),
      deleteHorse: (id) =>
        set((state) => ({
          horses: state.horses.filter((horse) => horse.id !== id),
        })),
      setHorses: (horses) => set({ horses }),
      clearHorses: () => set({ horses: [] }),
      sortByOdds: () =>
        set((state) => ({
          horses: [...state.horses].sort((a, b) => a.odds - b.odds),
        })),
      sortByNumber: () =>
        set((state) => ({
          horses: [...state.horses].sort((a, b) => a.number - b.number),
        })),
      filterByStyle: (style) => {
        const { horses } = get();
        if (!style) return horses;
        return horses.filter((horse) => horse.style === style);
      },
    }),
    {
      name: 'horse-storage',
    }
  )
);
