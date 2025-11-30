import { createWorker } from 'tesseract.js';
import type { Horse, OCRResult, RunningStyle } from '@/types';

// 画像を前処理する関数
export async function preprocessImage(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 画像を描画
      ctx.drawImage(img, 0, 0);
      
      // グレースケール化とコントラスト強調
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // グレースケール化
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // コントラスト強調
        const contrast = 1.5;
        const factor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100));
        const newGray = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
        
        data[i] = newGray;
        data[i + 1] = newGray;
        data[i + 2] = newGray;
      }
      
      ctx.putImageData(imageDataObj, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageData;
  });
}

// OCR処理を実行
export async function performOCR(
  imageData: string,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const worker = await createWorker('jpn', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress * 100);
      }
    },
  });

  const preprocessedImage = await preprocessImage(imageData);
  
  const { data } = await worker.recognize(preprocessedImage);
  
  await worker.terminate();
  
  const horses = parseHorseData(data.text);
  
  return {
    text: data.text,
    confidence: data.confidence,
    horses,
  };
}

// OCR結果から馬情報を抽出
// 日本の競馬出馬表の一般的なフォーマットを解析
function parseHorseData(text: string): Partial<Horse>[] {
  const lines = text.split('\n').filter(line => line.trim());
  const horses: Partial<Horse>[] = [];
  
  // 馬番、馬名、騎手名のパターンを探す
  // Pattern groups:
  // (\d{1,2}) - 馬番 (horse number, 1-2 digits)
  // \s*[番枠]? - optional separator like 番 or 枠
  // ([ァ-ヶー]+|[一-龥]+) - 馬名 (horse name in katakana or kanji)
  // ([ァ-ヶー]+|[一-龥]+)? - 騎手名 (jockey name, optional)
  const horsePattern = /(\d{1,2})\s*[番枠]?\s*([ァ-ヶー]+|[一-龥]+)\s*([ァ-ヶー]+|[一-龥]+)?/;
  // オッズパターン: 数字（小数点含む）+ 倍
  const oddsPattern = /(\d+\.?\d*)\s*倍?/;
  
  for (const line of lines) {
    const horseMatch = line.match(horsePattern);
    if (horseMatch) {
      const horse: Partial<Horse> = {
        number: parseInt(horseMatch[1], 10),
        name: horseMatch[2] || '',
        jockey: horseMatch[3] || '',
        style: 'sashi' as RunningStyle,
      };
      
      // オッズを探す
      const oddsMatch = line.match(oddsPattern);
      if (oddsMatch) {
        horse.odds = parseFloat(oddsMatch[1]);
      }
      
      // 枠番を計算（馬番から推測、18頭フルゲートの場合）
      if (horse.number) {
        horse.waku = Math.ceil(horse.number / 2);
        if (horse.waku > 8) horse.waku = 8;
      }
      
      horses.push(horse);
    }
  }
  
  return horses;
}

// ファイルを画像データに変換
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
