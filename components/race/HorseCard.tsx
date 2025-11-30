'use client';

import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Horse } from '@/types';
import { WAKU_COLORS, RUNNING_STYLES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface HorseCardProps {
  horse: Horse;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  selectionRank?: 'first' | 'second' | 'third' | 'fukusho';
  onClick?: () => void;
}

export function HorseCard({
  horse,
  onEdit,
  onDelete,
  isSelected,
  selectionRank,
  onClick,
}: HorseCardProps) {
  const wakuColor = WAKU_COLORS[horse.waku] || WAKU_COLORS[1];
  const styleInfo = RUNNING_STYLES[horse.style];

  const selectionStyles = {
    first: 'ring-4 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    second: 'ring-4 ring-gray-300 bg-gray-50 dark:bg-gray-700/20',
    third: 'ring-4 ring-amber-600 bg-amber-50 dark:bg-amber-900/20',
    fukusho: 'ring-4 ring-green-500 bg-green-50 dark:bg-green-900/20',
  };

  return (
    <Card
      className={cn(
        'transition-all cursor-pointer hover:shadow-md',
        isSelected && selectionRank && selectionStyles[selectionRank]
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* 枠番 */}
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2',
              wakuColor.bg,
              wakuColor.text,
              wakuColor.border
            )}
          >
            {horse.waku}
          </div>

          {/* 馬番 */}
          <div className="w-8 h-8 rounded flex items-center justify-center bg-muted font-bold">
            {horse.number}
          </div>

          {/* 馬名・騎手 */}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{horse.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {horse.jockey}
            </div>
          </div>

          {/* 脚質 */}
          <div
            className={cn(
              'px-2 py-1 rounded text-xs font-medium text-white',
              styleInfo.color
            )}
          >
            {styleInfo.label}
          </div>

          {/* オッズ */}
          <div className="text-right min-w-[60px]">
            <div className="font-bold text-primary">
              {horse.odds > 0 ? horse.odds.toFixed(1) : '-'}
            </div>
            <div className="text-xs text-muted-foreground">倍</div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* 選択中の表示 */}
        {isSelected && selectionRank && (
          <div className="mt-2 text-center">
            <span className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-bold',
              selectionRank === 'first' && 'bg-yellow-400 text-yellow-900',
              selectionRank === 'second' && 'bg-gray-300 text-gray-900',
              selectionRank === 'third' && 'bg-amber-600 text-white',
              selectionRank === 'fukusho' && 'bg-green-500 text-white'
            )}>
              {selectionRank === 'first' && '1着予想'}
              {selectionRank === 'second' && '2着予想'}
              {selectionRank === 'third' && '3着予想'}
              {selectionRank === 'fukusho' && '複勝予想'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
