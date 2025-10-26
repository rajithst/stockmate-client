// TypeScript interfaces for Price Target schemas
// Generated from app/schemas/price_target.py

export interface CompanyPriceTarget {
  company_id: number;
  symbol: string;
  target_high: number;
  target_low: number;
  target_consensus: number;
  target_median: number;
}

export interface CompanyPriceTargetRead extends CompanyPriceTarget {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyPriceTargetWrite extends CompanyPriceTarget {}

export interface CompanyPriceTargetSummary {
  company_id: number;
  symbol: string;
  last_month_count: number;
  last_month_average_price_target: number;
  last_quarter_count: number;
  last_quarter_average_price_target: number;
  last_year_count: number;
  last_year_average_price_target: number;
  all_time_count: number;
  all_time_average_price_target: number;
  publishers?: string;
}

export interface CompanyPriceTargetSummaryRead extends CompanyPriceTargetSummary {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyPriceTargetSummaryWrite extends CompanyPriceTargetSummary {}
