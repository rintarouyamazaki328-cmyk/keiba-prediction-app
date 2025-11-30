export type RunningStyle = 'nige' | 'senko' | 'sashi' | 'oikomi';

export interface Horse {
  id: string;
  waku: number; // 1-8
  number: number; // 馬番
  name: string;
  jockey: string;
  style: RunningStyle;
  odds: number;
}

export interface Race {
  date: string;
  venue: string;
  raceNumber: number;
  raceName: string;
}

export type PredictionType = 'sanrentan' | 'sanrenpuku' | 'fukusho';
export type ResultType = 'hit' | 'miss';

export interface Prediction {
  id: string;
  race: Race;
  type: PredictionType;
  horses: {
    first?: string;
    second?: string;
    third?: string;
    fukusho?: string;
  };
  createdAt: string;
  result?: ResultType;
  payout?: number;
  investment?: number;
}

export type BetType = 'sanrentan' | 'sanrenpuku' | 'umaren' | 'wide';

export interface BetCalculation {
  type: BetType;
  betMethod: 'box' | 'formation' | 'nagashi';
  selections: number[];
  pricePerBet: number;
  totalBets: number;
  totalAmount: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  horses: Partial<Horse>[];
}
