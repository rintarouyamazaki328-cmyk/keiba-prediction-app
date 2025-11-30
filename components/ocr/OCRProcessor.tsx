'use client';

import React, { useState, useCallback } from 'react';
import { Loader2, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { performOCR } from '@/lib/ocr';
import type { OCRResult } from '@/types';

interface OCRProcessorProps {
  imageData: string | null;
  onResult: (result: OCRResult) => void;
}

export function OCRProcessor({ imageData, onResult }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runOCR = useCallback(async () => {
    if (!imageData) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await performOCR(imageData, (p) => setProgress(p));
      onResult(result);
    } catch (err) {
      setError('OCR処理中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [imageData, onResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          OCR処理
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                画像を解析中... {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <Button
          className="w-full"
          onClick={runOCR}
          disabled={!imageData || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              解析中...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4 mr-2" />
              OCR実行
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          ※ 初回実行時は日本語データのダウンロードに時間がかかります
        </p>
      </CardContent>
    </Card>
  );
}
