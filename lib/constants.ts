export const VENUES = [
  '京都',
  '東京',
  '阪神',
  '中山',
  '中京',
  '小倉',
  '新潟',
  '福島',
  '札幌',
  '函館',
] as const;

export const RACE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const WAKU_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-400' },
  2: { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-900' },
  3: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600' },
  4: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600' },
  5: { bg: 'bg-yellow-400', text: 'text-gray-900', border: 'border-yellow-400' },
  6: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600' },
  7: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500' },
  8: { bg: 'bg-pink-400', text: 'text-white', border: 'border-pink-400' },
};

export const RUNNING_STYLES = {
  nige: { label: '逃げ', color: 'bg-red-500', textColor: 'text-red-500' },
  senko: { label: '先行', color: 'bg-orange-500', textColor: 'text-orange-500' },
  sashi: { label: '差し', color: 'bg-blue-500', textColor: 'text-blue-500' },
  oikomi: { label: '追込', color: 'bg-purple-500', textColor: 'text-purple-500' },
} as const;

export const PREDICTION_TYPES = {
  sanrentan: { label: '三連単', description: '1着・2着・3着を順番通りに予想' },
  sanrenpuku: { label: '三連複', description: '3着以内の3頭を予想（順不同）' },
  fukusho: { label: '複勝', description: '3着以内に入る馬を1頭予想' },
} as const;

export const BET_TYPES = {
  sanrentan: { label: '三連単', minHorses: 3 },
  sanrenpuku: { label: '三連複', minHorses: 3 },
  umaren: { label: '馬連', minHorses: 2 },
  wide: { label: 'ワイド', minHorses: 2 },
} as const;

// クイックリンク生成関数
// Note: These URLs are placeholders. Real implementations would need venue codes
// and proper URL formatting based on each site's API/URL structure
export const QUICK_LINKS = {
  // 楽天競馬: Uses date in YYYYMMDD format for race card lookup
  rakuten: (date: string) => 
    `https://keiba.rakuten.co.jp/race_card/list/RACEID/${date.replace(/-/g, '')}`,
  // netkeiba: Links to top page (would need race ID for specific race)
  netkeiba: () => 
    `https://race.netkeiba.com/top/`,
  // JRA公式: Links to main page
  jra: () => 
    `https://www.jra.go.jp/`,
} as const;
