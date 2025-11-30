'use client';

import React, { useState } from 'react';
import { Edit, Check, Plus, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useHorseStore } from '@/store/useHorseStore';
import type { OCRResult, RunningStyle } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ResultEditorProps {
  result: OCRResult | null;
}

export function ResultEditor({ result }: ResultEditorProps) {
  const [editedText, setEditedText] = useState(result?.text || '');
  const [isEditing, setIsEditing] = useState(false);
  const { addHorse } = useHorseStore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (result?.text) {
      setEditedText(result.text);
    }
  }, [result]);

  const handleAddHorses = () => {
    if (!result?.horses || result.horses.length === 0) {
      toast({
        title: 'エラー',
        description: '馬の情報が見つかりません',
        variant: 'destructive',
      });
      return;
    }

    let addedCount = 0;
    for (const horse of result.horses) {
      if (horse.number && horse.name) {
        addHorse({
          waku: horse.waku || Math.ceil(horse.number / 2),
          number: horse.number,
          name: horse.name,
          jockey: horse.jockey || '',
          style: (horse.style as RunningStyle) || 'sashi',
          odds: horse.odds || 0,
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      toast({
        title: '追加完了',
        description: `${addedCount}頭の馬を追加しました`,
      });
    }
  };

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            読み取り結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            画像をアップロードしてOCRを実行してください
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            読み取り結果
          </span>
          <span className="flex items-center gap-1 text-sm font-normal">
            <Percent className="h-4 w-4" />
            信頼度: {Math.round(result.confidence)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">読み取りテキスト</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  完了
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  編集
                </>
              )}
            </Button>
          </div>
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={8}
            />
          ) : (
            <pre className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap overflow-auto max-h-48">
              {editedText || '（テキストなし）'}
            </pre>
          )}
        </div>

        {result.horses.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">
              検出された馬: {result.horses.length}頭
            </span>
            <div className="space-y-1">
              {result.horses.map((horse, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded text-sm flex items-center gap-2"
                >
                  <span className="font-mono">{horse.number || '?'}</span>
                  <span>{horse.name || '(不明)'}</span>
                  {horse.jockey && (
                    <span className="text-muted-foreground">
                      ({horse.jockey})
                    </span>
                  )}
                  {horse.odds && (
                    <span className="text-primary ml-auto">
                      {horse.odds}倍
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleAddHorses}>
              <Plus className="h-4 w-4 mr-2" />
              馬を追加する
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
