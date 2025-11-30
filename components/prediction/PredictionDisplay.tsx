'use client';

import React from 'react';
import { Eye, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useHorseStore } from '@/store/useHorseStore';
import { PREDICTION_TYPES } from '@/lib/constants';

export function PredictionDisplay() {
  const { currentPrediction } = usePredictionStore();
  const { horses } = useHorseStore();

  const getHorse = (horseId: string | undefined) => {
    if (!horseId) return null;
    return horses.find((h) => h.id === horseId);
  };

  const firstHorse = getHorse(currentPrediction.first);
  const secondHorse = getHorse(currentPrediction.second);
  const thirdHorse = getHorse(currentPrediction.third);
  const fukushoHorse = getHorse(currentPrediction.fukusho);

  const predictionInfo = PREDICTION_TYPES[currentPrediction.type];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          現在の予想
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
              {predictionInfo.label}
            </span>
          </div>

          {currentPrediction.type === 'fukusho' ? (
            <div className="text-center py-4">
              {fukushoHorse ? (
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {fukushoHorse.number}
                  </div>
                  <div className="text-xl font-medium">{fukushoHorse.name}</div>
                  <div className="text-muted-foreground">
                    {fukushoHorse.jockey}
                  </div>
                  <div className="text-primary font-bold">
                    {fukushoHorse.odds}倍
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">馬を選択してください</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* 1着 */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentPrediction.type === 'sanrentan' ? '1着' : '選択1'}
                </div>
                {firstHorse ? (
                  <>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {firstHorse.number}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {firstHorse.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {firstHorse.jockey}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl text-muted-foreground">?</div>
                )}
              </div>

              {/* 2着 */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Trophy className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentPrediction.type === 'sanrentan' ? '2着' : '選択2'}
                </div>
                {secondHorse ? (
                  <>
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {secondHorse.number}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {secondHorse.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {secondHorse.jockey}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl text-muted-foreground">?</div>
                )}
              </div>

              {/* 3着 */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Trophy className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentPrediction.type === 'sanrentan' ? '3着' : '選択3'}
                </div>
                {thirdHorse ? (
                  <>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {thirdHorse.number}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {thirdHorse.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {thirdHorse.jockey}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl text-muted-foreground">?</div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
