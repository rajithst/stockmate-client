// TypeScript interfaces for Financial Score schemas
// Generated from app/schemas/financial_score.py

export interface CompanyFinancialScore {
  company_id: number;
  symbol: string;
  reported_currency?: string;
  altman_z_score?: number;
  piotroski_score?: number;
  working_capital?: number;
  total_assets?: number;
  retained_earnings?: number;
  ebit?: number;
  market_cap?: number;
  total_liabilities?: number;
  revenue?: number;
}

export interface CompanyFinancialScoresWrite extends CompanyFinancialScore {}

export interface CompanyFinancialScoresRead extends CompanyFinancialScore {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}