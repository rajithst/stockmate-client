// TypeScript interfaces for Quote schemas
// Generated from app/schemas/quote.py

export interface StockPriceChangeBase {
  company_id: number;
  symbol: string;
  one_day?: number;
  five_day?: number;
  one_month?: number;
  three_month?: number;
  six_month?: number;
  ytd?: number;
  one_year?: number;
  three_year?: number;
  five_year?: number;
  ten_year?: number;
}

export interface StockPriceChangeWrite extends StockPriceChangeBase {}

export interface StockPriceChangeRead extends StockPriceChangeBase {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}