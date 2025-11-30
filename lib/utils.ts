import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateBoxBets(n: number, r: number): number {
  // n個からr個を選ぶ順列
  if (n < r) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
  }
  return result;
}

export function calculateCombinations(n: number, r: number): number {
  // n個からr個を選ぶ組み合わせ
  if (n < r) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
    result /= (i + 1);
  }
  return result;
}

export function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 三連単のボックス買い点数
export function sanrentanBox(horseCount: number): number {
  return calculateBoxBets(horseCount, 3);
}

// 三連複のボックス買い点数
export function sanrenpukuBox(horseCount: number): number {
  return calculateCombinations(horseCount, 3);
}

// 馬連のボックス買い点数
export function umarenBox(horseCount: number): number {
  return calculateCombinations(horseCount, 2);
}

// ワイドのボックス買い点数
export function wideBox(horseCount: number): number {
  return calculateCombinations(horseCount, 2);
}

// 三連単のながし点数（軸1頭）
export function sanrentanNagashi(axisPosition: 'first' | 'second' | 'third', relatedCount: number): number {
  // 軸1頭から相手への点数
  return calculateBoxBets(relatedCount, 2);
}

// 三連複のながし点数（軸1頭）
export function sanrenpukuNagashi(relatedCount: number): number {
  return calculateCombinations(relatedCount, 2);
}

// フォーメーション点数計算
export function formationBets(
  first: number[],
  second: number[],
  third: number[],
  isOrdered: boolean = true
): number {
  if (isOrdered) {
    // 三連単フォーメーション
    let count = 0;
    for (const f of first) {
      for (const s of second) {
        if (s === f) continue;
        for (const t of third) {
          if (t === f || t === s) continue;
          count++;
        }
      }
    }
    return count;
  } else {
    // 三連複フォーメーション
    const combinations = new Set<string>();
    for (const f of first) {
      for (const s of second) {
        if (s === f) continue;
        for (const t of third) {
          if (t === f || t === s) continue;
          const sorted = [f, s, t].sort((a, b) => a - b).join('-');
          combinations.add(sorted);
        }
      }
    }
    return combinations.size;
  }
}
