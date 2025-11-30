'use client';

import React, { useState } from 'react';
import { History, Check, X, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useHorseStore } from '@/store/useHorseStore';
import { PREDICTION_TYPES } from '@/lib/constants';
import type { Prediction, ResultType } from '@/types';
import { cn } from '@/lib/utils';

export function HistoryList() {
  const { predictions, updateResult, deletePrediction } = usePredictionStore();
  const { horses } = useHorseStore();
  const [resultDialog, setResultDialog] = useState<{
    prediction: Prediction;
    result: ResultType;
  } | null>(null);
  const [payout, setPayout] = useState(0);

  const getHorseName = (horseId: string | undefined) => {
    if (!horseId) return '?';
    const horse = horses.find((h) => h.id === horseId);
    return horse ? `${horse.number}` : '?';
  };

  const handleResultSubmit = () => {
    if (resultDialog) {
      updateResult(
        resultDialog.prediction.id,
        resultDialog.result,
        resultDialog.result === 'hit' ? payout : 0
      );
      setResultDialog(null);
      setPayout(0);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            予想履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            予想履歴がありません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            予想履歴
            <span className="text-sm font-normal text-muted-foreground">
              ({predictions.length}件)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className={cn(
                'p-3 border rounded-lg space-y-2',
                prediction.result === 'hit' && 'bg-green-50 dark:bg-green-900/20 border-green-500',
                prediction.result === 'miss' && 'bg-red-50 dark:bg-red-900/20 border-red-500'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs">
                    {PREDICTION_TYPES[prediction.type].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {prediction.race.venue} {prediction.race.raceNumber}R
                  </span>
                  {prediction.race.raceName && (
                    <span className="text-sm">{prediction.race.raceName}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePrediction(prediction.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {prediction.type === 'fukusho' ? (
                  <span className="font-mono text-lg">
                    {getHorseName(prediction.horses.fukusho)}
                  </span>
                ) : (
                  <span className="font-mono text-lg">
                    {getHorseName(prediction.horses.first)} →{' '}
                    {getHorseName(prediction.horses.second)} →{' '}
                    {getHorseName(prediction.horses.third)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatDate(prediction.createdAt)}</span>

                {prediction.result ? (
                  <div className="flex items-center gap-2">
                    {prediction.result === 'hit' ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          的中 ¥{prediction.payout?.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">不的中</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() =>
                        setResultDialog({ prediction, result: 'hit' })
                      }
                    >
                      <Check className="h-4 w-4 mr-1" />
                      的中
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        updateResult(prediction.id, 'miss', 0);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      不的中
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 払戻金入力ダイアログ */}
      <Dialog
        open={!!resultDialog}
        onOpenChange={(open) => {
          if (!open) {
            setResultDialog(null);
            setPayout(0);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>払戻金を入力</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                step={10}
                value={payout}
                onChange={(e) => setPayout(parseInt(e.target.value, 10) || 0)}
                placeholder="払戻金額"
              />
              <span className="text-muted-foreground">円</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResultDialog(null)}>
              キャンセル
            </Button>
            <Button onClick={handleResultSubmit}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
