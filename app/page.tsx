'use client';

import React, { useState } from 'react';
import { Trophy, Scan, Flag, Calculator, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';

// OCR Components
import { ImageUploader } from '@/components/ocr/ImageUploader';
import { OCRProcessor } from '@/components/ocr/OCRProcessor';
import { ResultEditor } from '@/components/ocr/ResultEditor';

// Race Components
import { RaceInfo } from '@/components/race/RaceInfo';
import { HorseList } from '@/components/race/HorseList';

// Prediction Components
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { PredictionDisplay } from '@/components/prediction/PredictionDisplay';

// Calculator Components
import { BoxCalculator } from '@/components/calculator/BoxCalculator';
import { FormationCalculator } from '@/components/calculator/FormationCalculator';
import { NagashiCalculator } from '@/components/calculator/NagashiCalculator';

// History Components
import { HistoryList } from '@/components/history/HistoryList';
import { Statistics } from '@/components/history/Statistics';

import type { OCRResult } from '@/types';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">競馬予想アプリ</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="ocr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ocr" className="flex items-center gap-1">
              <Scan className="h-4 w-4" />
              <span className="hidden sm:inline">OCR</span>
            </TabsTrigger>
            <TabsTrigger value="race" className="flex items-center gap-1">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">レース</span>
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">予想</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">計算</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">履歴</span>
            </TabsTrigger>
          </TabsList>

          {/* OCR Tab */}
          <TabsContent value="ocr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ImageUploader onImageSelect={setSelectedImage} />
                <OCRProcessor
                  imageData={selectedImage}
                  onResult={setOcrResult}
                />
              </div>
              <div>
                <ResultEditor result={ocrResult} />
              </div>
            </div>
          </TabsContent>

          {/* Race Tab */}
          <TabsContent value="race" className="space-y-6">
            <RaceInfo />
            <HorseList />
          </TabsContent>

          {/* Prediction Tab */}
          <TabsContent value="prediction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionForm />
              <PredictionDisplay />
            </div>
            <HorseList />
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BoxCalculator />
              <FormationCalculator />
              <NagashiCalculator />
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Statistics />
            <HistoryList />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>競馬予想アプリ © 2024</p>
      </footer>
    </div>
  );
}
