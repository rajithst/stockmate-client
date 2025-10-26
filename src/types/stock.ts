// TypeScript interfaces for Stock schemas
// Generated from app/schemas/stock.py

export interface CompanyStockSplit {
  company_id: number;
  symbol: string;
  date: string;
  numerator: number;
  denominator: number;
}

export interface CompanyStockSplitWrite extends CompanyStockSplit {}

export interface CompanyStockSplitRead extends CompanyStockSplit {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyStockPeer {
  company_id: number;
  symbol: string;
  company_name: string;
  price: number;
  market_cap: number;
}

export interface CompanyStockPeerWrite extends CompanyStockPeer {}

export interface CompanyStockPeerRead extends CompanyStockPeer {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}