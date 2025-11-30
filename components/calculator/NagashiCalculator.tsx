'use client';

import React, { useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHorseStore } from '@/store/useHorseStore';
import { BET_TYPES } from '@/lib/constants';
import {
  calculateBoxBets,
  calculateCombinations,
  cn,
} from '@/lib/utils';
import type { BetType } from '@/types';

export function NagashiCalculator() {
  const { horses } = useHorseStore();
  const [betType, setBetType] = useState<BetType>('sanrentan');
  const [axisHorse, setAxisHorse] = useState<number | null>(null);
  const [relatedHorses, setRelatedHorses] = useState<number[]>([]);
  const [pricePerBet, setPricePerBet] = useState(100);

  const horseNumbers = horses.length > 0
    ? horses.map((h) => h.number)
    : Array.from({ length: 18 }, (_, i) => i + 1);

  const toggleRelated = (num: number) => {
    if (num === axisHorse) return;
    setRelatedHorses((prev) =>
      prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num]
    );
  };

  const calculation = useMemo(() => {
    if (!axisHorse || relatedHorses.length === 0) {
      return { totalBets: 0, totalAmount: 0 };
    }

    let totalBets = 0;
    const relatedCount = relatedHorses.length;

    switch (betType) {
      case 'sanrentan':
        // 軸1頭ながし（1着固定の場合）: 相手から2頭を選ぶ順列
        totalBets = calculateBoxBets(relatedCount, 2);
        break;
      case 'sanrenpuku':
        // 軸1頭ながし: 相手から2頭を選ぶ組み合わせ
        totalBets = calculateCombinations(relatedCount, 2);
        break;
      case 'umaren':
        // 軸1頭ながし: 相手の数
        totalBets = relatedCount;
        break;
      case 'wide':
        // 軸1頭ながし: 相手の数
        totalBets = relatedCount;
        break;
    }

    return {
      totalBets,
      totalAmount: totalBets * pricePerBet,
    };
  }, [betType, axisHorse, relatedHorses, pricePerBet]);

  const clearAll = () => {
    setAxisHorse(null);
    setRelatedHorses([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          ながし買い計算
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 券種選択 */}
        <div className="space-y-2">
          <Label>券種</Label>
          <Select
            value={betType}
            onValueChange={(v) => setBetType(v as BetType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BET_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 軸馬選択 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              軸
            </span>
            軸馬を選択
          </Label>
          <div className="grid grid-cols-6 gap-1">
            {horseNumbers.map((num) => (
              <Button
                key={num}
                variant={axisHorse === num ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'text-xs',
                  axisHorse === num && 'bg-red-500 hover:bg-red-600'
                )}
                onClick={() => {
                  setAxisHorse(num);
                  setRelatedHorses((prev) => prev.filter((n) => n !== num));
                }}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* 相手馬選択 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
              相
            </span>
            相手馬を選択（{relatedHorses.length}頭）
          </Label>
          <div className="grid grid-cols-6 gap-1">
            {horseNumbers.map((num) => (
              <Button
                key={num}
                variant={relatedHorses.includes(num) ? 'default' : 'outline'}
                size="sm"
                disabled={num === axisHorse}
                className={cn(
                  'text-xs',
                  relatedHorses.includes(num) && 'bg-blue-500 hover:bg-blue-600',
                  num === axisHorse && 'opacity-50'
                )}
                onClick={() => toggleRelated(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* 金額設定 */}
        <div className="space-y-2">
          <Label>1点あたり金額</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={100}
              step={100}
              value={pricePerBet}
              onChange={(e) =>
                setPricePerBet(parseInt(e.target.value, 10) || 100)
              }
              className="w-32"
            />
            <span className="text-muted-foreground">円</span>
          </div>
        </div>

        {/* 計算結果 */}
        <div className="p-4 bg-primary/10 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">購入点数</span>
            <span className="text-xl font-bold">{calculation.totalBets}点</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">合計金額</span>
            <span className="text-2xl font-bold text-primary">
              ¥{calculation.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* クリアボタン */}
        <Button variant="outline" className="w-full" onClick={clearAll}>
          選択をクリア
        </Button>
      </CardContent>
    </Card>
  );
}
