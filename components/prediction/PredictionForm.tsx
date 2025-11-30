'use client';

import React from 'react';
import { Trophy, Target, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePredictionStore } from '@/store/usePredictionStore';
import { useHorseStore } from '@/store/useHorseStore';
import { useRaceStore } from '@/store/useRaceStore';
import { useToast } from '@/components/ui/use-toast';
import { PREDICTION_TYPES } from '@/lib/constants';
import type { PredictionType } from '@/types';

export function PredictionForm() {
  const {
    currentPrediction,
    setCurrentPredictionType,
    setFirst,
    setSecond,
    setThird,
    setFukusho,
    savePrediction,
    clearCurrentPrediction,
  } = usePredictionStore();
  const { horses } = useHorseStore();
  const { race } = useRaceStore();
  const { toast } = useToast();

  const handleSave = () => {
    if (currentPrediction.type === 'fukusho') {
      if (!currentPrediction.fukusho) {
        toast({
          title: 'エラー',
          description: '複勝予想の馬を選択してください',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (
        !currentPrediction.first ||
        !currentPrediction.second ||
        !currentPrediction.third
      ) {
        toast({
          title: 'エラー',
          description: '1着・2着・3着を全て選択してください',
          variant: 'destructive',
        });
        return;
      }
    }

    savePrediction(race);
    clearCurrentPrediction();
    toast({
      title: '保存完了',
      description: '予想を保存しました',
    });
  };

  const getHorseName = (horseId: string | undefined) => {
    if (!horseId) return '';
    const horse = horses.find((h) => h.id === horseId);
    return horse ? `${horse.number}. ${horse.name}` : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          予想入力
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 予想タイプ選択 */}
        <div className="space-y-2">
          <Label>予想タイプ</Label>
          <Select
            value={currentPrediction.type}
            onValueChange={(v) => setCurrentPredictionType(v as PredictionType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PREDICTION_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label} - {value.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 三連単・三連複の場合 */}
        {(currentPrediction.type === 'sanrentan' ||
          currentPrediction.type === 'sanrenpuku') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-yellow-900 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                {currentPrediction.type === 'sanrentan' ? '1着予想' : '選択1'}
              </Label>
              <Select
                value={currentPrediction.first || 'none'}
                onValueChange={(v) => setFirst(v === 'none' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="馬を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未選択</SelectItem>
                  {horses.map((horse) => (
                    <SelectItem key={horse.id} value={horse.id}>
                      {horse.number}. {horse.name} ({horse.odds}倍)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-900 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                {currentPrediction.type === 'sanrentan' ? '2着予想' : '選択2'}
              </Label>
              <Select
                value={currentPrediction.second || 'none'}
                onValueChange={(v) => setSecond(v === 'none' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="馬を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未選択</SelectItem>
                  {horses.map((horse) => (
                    <SelectItem key={horse.id} value={horse.id}>
                      {horse.number}. {horse.name} ({horse.odds}倍)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                {currentPrediction.type === 'sanrentan' ? '3着予想' : '選択3'}
              </Label>
              <Select
                value={currentPrediction.third || 'none'}
                onValueChange={(v) => setThird(v === 'none' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="馬を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未選択</SelectItem>
                  {horses.map((horse) => (
                    <SelectItem key={horse.id} value={horse.id}>
                      {horse.number}. {horse.name} ({horse.odds}倍)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* 複勝の場合 */}
        {currentPrediction.type === 'fukusho' && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              複勝予想
            </Label>
            <Select
              value={currentPrediction.fukusho || 'none'}
              onValueChange={(v) => setFukusho(v === 'none' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="馬を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">未選択</SelectItem>
                {horses.map((horse) => (
                  <SelectItem key={horse.id} value={horse.id}>
                    {horse.number}. {horse.name} ({horse.odds}倍)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* プレビュー */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="text-sm font-medium">予想内容</div>
          {currentPrediction.type === 'fukusho' ? (
            <div className="text-lg">
              {getHorseName(currentPrediction.fukusho) || '未選択'}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-lg">
              <span>{getHorseName(currentPrediction.first) || '?'}</span>
              <span className="text-muted-foreground">→</span>
              <span>{getHorseName(currentPrediction.second) || '?'}</span>
              <span className="text-muted-foreground">→</span>
              <span>{getHorseName(currentPrediction.third) || '?'}</span>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCurrentPrediction}>
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            予想を保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
