'use client';

import React, { useState, useMemo } from 'react';
import { Box } from 'lucide-react';
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
  sanrentanBox,
  sanrenpukuBox,
  umarenBox,
  wideBox,
} from '@/lib/utils';
import type { BetType } from '@/types';

export function BoxCalculator() {
  const { horses } = useHorseStore();
  const [betType, setBetType] = useState<BetType>('sanrentan');
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const [pricePerBet, setPricePerBet] = useState(100);

  const toggleHorse = (horseNumber: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horseNumber)
        ? prev.filter((n) => n !== horseNumber)
        : [...prev, horseNumber]
    );
  };

  const calculation = useMemo(() => {
    const count = selectedHorses.length;
    let totalBets = 0;

    switch (betType) {
      case 'sanrentan':
        totalBets = sanrentanBox(count);
        break;
      case 'sanrenpuku':
        totalBets = sanrenpukuBox(count);
        break;
      case 'umaren':
        totalBets = umarenBox(count);
        break;
      case 'wide':
        totalBets = wideBox(count);
        break;
    }

    return {
      totalBets,
      totalAmount: totalBets * pricePerBet,
    };
  }, [betType, selectedHorses, pricePerBet]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          ボックス買い計算
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

        {/* 馬選択 */}
        <div className="space-y-2">
          <Label>
            馬を選択（{selectedHorses.length}頭選択中）
          </Label>
          <div className="grid grid-cols-6 gap-2">
            {horses.length > 0
              ? horses.map((horse) => (
                  <Button
                    key={horse.id}
                    variant={
                      selectedHorses.includes(horse.number)
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => toggleHorse(horse.number)}
                  >
                    {horse.number}
                  </Button>
                ))
              : Array.from({ length: 18 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={
                      selectedHorses.includes(num) ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => toggleHorse(num)}
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

        {/* 選択クリア */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSelectedHorses([])}
        >
          選択をクリア
        </Button>
      </CardContent>
    </Card>
  );
}
