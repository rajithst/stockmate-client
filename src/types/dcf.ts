// TypeScript interfaces for DCF schemas
// Generated from app/schemas/dcf.py

export interface DiscountedCashFlow {
  company_id: number;
  symbol: string;
  date: string;
  dcf: number;
  stock_price: number;
}

export interface DiscountedCashFlowRead extends DiscountedCashFlow {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface DiscountedCashFlowWrite extends DiscountedCashFlow {}