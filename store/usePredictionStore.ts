import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prediction, PredictionType, ResultType, Race } from '@/types';
import { generateId } from '@/lib/utils';

interface PredictionState {
  predictions: Prediction[];
  currentPrediction: {
    type: PredictionType;
    first?: string;
    second?: string;
    third?: string;
    fukusho?: string;
  };
  setCurrentPredictionType: (type: PredictionType) => void;
  setFirst: (horseId: string | undefined) => void;
  setSecond: (horseId: string | undefined) => void;
  setThird: (horseId: string | undefined) => void;
  setFukusho: (horseId: string | undefined) => void;
  savePrediction: (race: Race, investment?: number) => void;
  updateResult: (id: string, result: ResultType, payout?: number) => void;
  deletePrediction: (id: string) => void;
  clearCurrentPrediction: () => void;
  getStatistics: () => {
    total: number;
    hits: number;
    misses: number;
    hitRate: number;
    totalInvestment: number;
    totalPayout: number;
    returnRate: number;
  };
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set, get) => ({
      predictions: [],
      currentPrediction: {
        type: 'sanrentan',
      },
      setCurrentPredictionType: (type) =>
        set((state) => ({
          currentPrediction: { ...state.currentPrediction, type },
        })),
      setFirst: (horseId) =>
        set((state) => ({
          currentPrediction: { ...state.currentPrediction, first: horseId },
        })),
      setSecond: (horseId) =>
        set((state) => ({
          currentPrediction: { ...state.currentPrediction, second: horseId },
        })),
      setThird: (horseId) =>
        set((state) => ({
          currentPrediction: { ...state.currentPrediction, third: horseId },
        })),
      setFukusho: (horseId) =>
        set((state) => ({
          currentPrediction: { ...state.currentPrediction, fukusho: horseId },
        })),
      savePrediction: (race, investment) => {
        const { currentPrediction } = get();
        const prediction: Prediction = {
          id: generateId(),
          race,
          type: currentPrediction.type,
          horses: {
            first: currentPrediction.first,
            second: currentPrediction.second,
            third: currentPrediction.third,
            fukusho: currentPrediction.fukusho,
          },
          createdAt: new Date().toISOString(),
          investment,
        };
        set((state) => ({
          predictions: [prediction, ...state.predictions],
        }));
      },
      updateResult: (id, result, payout) =>
        set((state) => ({
          predictions: state.predictions.map((pred) =>
            pred.id === id ? { ...pred, result, payout } : pred
          ),
        })),
      deletePrediction: (id) =>
        set((state) => ({
          predictions: state.predictions.filter((pred) => pred.id !== id),
        })),
      clearCurrentPrediction: () =>
        set({
          currentPrediction: { type: 'sanrentan' },
        }),
      getStatistics: () => {
        const { predictions } = get();
        const completed = predictions.filter((p) => p.result);
        const hits = completed.filter((p) => p.result === 'hit').length;
        const misses = completed.filter((p) => p.result === 'miss').length;
        const totalInvestment = predictions.reduce((sum, p) => sum + (p.investment || 0), 0);
        const totalPayout = predictions
          .filter((p) => p.result === 'hit')
          .reduce((sum, p) => sum + (p.payout || 0), 0);

        return {
          total: predictions.length,
          hits,
          misses,
          hitRate: completed.length > 0 ? (hits / completed.length) * 100 : 0,
          totalInvestment,
          totalPayout,
          returnRate: totalInvestment > 0 ? (totalPayout / totalInvestment) * 100 : 0,
        };
      },
    }),
    {
      name: 'prediction-storage',
    }
  )
);
