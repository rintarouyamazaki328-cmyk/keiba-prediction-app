'use client';

import React, { useState, useMemo } from 'react';
import { Grid3x3 } from 'lucide-react';
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
import { formationBets, cn } from '@/lib/utils';

export function FormationCalculator() {
  const { horses } = useHorseStore();
  const [isOrdered, setIsOrdered] = useState(true);
  const [firstSelection, setFirstSelection] = useState<number[]>([]);
  const [secondSelection, setSecondSelection] = useState<number[]>([]);
  const [thirdSelection, setThirdSelection] = useState<number[]>([]);
  const [pricePerBet, setPricePerBet] = useState(100);

  const horseNumbers = horses.length > 0
    ? horses.map((h) => h.number)
    : Array.from({ length: 18 }, (_, i) => i + 1);

  const toggleSelection = (
    num: number,
    selection: number[],
    setSelection: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelection((prev) =>
      prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num]
    );
  };

  const calculation = useMemo(() => {
    const totalBets = formationBets(
      firstSelection,
      secondSelection,
      thirdSelection,
      isOrdered
    );
    return {
      totalBets,
      totalAmount: totalBets * pricePerBet,
    };
  }, [firstSelection, secondSelection, thirdSelection, isOrdered, pricePerBet]);

  const clearAll = () => {
    setFirstSelection([]);
    setSecondSelection([]);
    setThirdSelection([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5" />
          フォーメーション計算
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 券種選択 */}
        <div className="space-y-2">
          <Label>券種</Label>
          <Select
            value={isOrdered ? 'sanrentan' : 'sanrenpuku'}
            onValueChange={(v) => setIsOrdered(v === 'sanrentan')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sanrentan">三連単</SelectItem>
              <SelectItem value="sanrenpuku">三連複</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 1着/選択1 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-yellow-900 text-xs flex items-center justify-center font-bold">
              1
            </span>
            {isOrdered ? '1着' : '選択1'}（{firstSelection.length}頭）
          </Label>
          <div className="grid grid-cols-6 gap-1">
            {horseNumbers.map((num) => (
              <Button
                key={num}
                variant={firstSelection.includes(num) ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'text-xs',
                  firstSelection.includes(num) && 'bg-yellow-500 hover:bg-yellow-600'
                )}
                onClick={() =>
                  toggleSelection(num, firstSelection, setFirstSelection)
                }
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* 2着/選択2 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-900 text-xs flex items-center justify-center font-bold">
              2
            </span>
            {isOrdered ? '2着' : '選択2'}（{secondSelection.length}頭）
          </Label>
          <div className="grid grid-cols-6 gap-1">
            {horseNumbers.map((num) => (
              <Button
                key={num}
                variant={secondSelection.includes(num) ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'text-xs',
                  secondSelection.includes(num) && 'bg-gray-500 hover:bg-gray-600'
                )}
                onClick={() =>
                  toggleSelection(num, secondSelection, setSecondSelection)
                }
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* 3着/選択3 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
            {isOrdered ? '3着' : '選択3'}（{thirdSelection.length}頭）
          </Label>
          <div className="grid grid-cols-6 gap-1">
            {horseNumbers.map((num) => (
              <Button
                key={num}
                variant={thirdSelection.includes(num) ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'text-xs',
                  thirdSelection.includes(num) && 'bg-amber-600 hover:bg-amber-700'
                )}
                onClick={() =>
                  toggleSelection(num, thirdSelection, setThirdSelection)
                }
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
