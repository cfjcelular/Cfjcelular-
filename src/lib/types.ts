export interface MarketSnapshot {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
}

export interface TradingSignal {
  type: 'long' | 'short' | 'neutral';
  pair: string;
  price: number;
  confidence: number;
  reasoning: string;
  targets: number[];
  stopLoss: number;
  timestamp: number;
}

export interface CalculatorState {
  margin: number;
  leverage: number;
  entryPrice: number;
  side: 'long' | 'short';
}
