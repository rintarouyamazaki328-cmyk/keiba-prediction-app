'use client';

import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useHorseStore } from '@/store/useHorseStore';
import { useToast } from '@/components/ui/use-toast';
import type { RunningStyle } from '@/types';

export function QuickInput() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { addHorse } = useHorseStore();
  const { toast } = useToast();

  const parseAndAddHorses = () => {
    const lines = inputText.trim().split('\n');
    let addedCount = 0;

    for (const line of lines) {
      // CSV形式: 枠番,馬番,馬名,騎手名,脚質,オッズ
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        const waku = parseInt(parts[0], 10) || 1;
        const number = parseInt(parts[1], 10);
        const name = parts[2];
        const jockey = parts[3] || '';
        const styleMap: Record<string, RunningStyle> = {
          '逃げ': 'nige',
          '先行': 'senko',
          '差し': 'sashi',
          '追込': 'oikomi',
          'nige': 'nige',
          'senko': 'senko',
          'sashi': 'sashi',
          'oikomi': 'oikomi',
        };
        const style: RunningStyle = styleMap[parts[4]] || 'sashi';
        const odds = parseFloat(parts[5]) || 0;

        if (number && name) {
          addHorse({
            waku: Math.min(8, Math.max(1, waku)),
            number,
            name,
            jockey,
            style,
            odds,
          });
          addedCount++;
        }
      }
    }

    if (addedCount > 0) {
      toast({
        title: '追加完了',
        description: `${addedCount}頭の馬を追加しました`,
      });
      setInputText('');
      setOpen(false);
    } else {
      toast({
        title: 'エラー',
        description: '正しい形式で入力してください',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          クイック入力
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>クイック入力（CSV形式）</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">
              形式: 枠番,馬番,馬名,騎手名,脚質,オッズ
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              脚質: 逃げ, 先行, 差し, 追込
            </p>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`例:\n1,1,ウマムスメ,田中騎手,先行,5.5\n1,2,ゴールドシップ,山田騎手,追込,3.2`}
            rows={8}
          />
          <Button onClick={parseAndAddHorses} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            馬を追加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
