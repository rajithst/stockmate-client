// TypeScript interfaces for Rating schemas
// Generated from app/schemas/rating.py

export interface CompanyRatingSummary {
  company_id: number;
  symbol: string;
  rating: string;
  overall_score: number;
  discounted_cash_flow_score: number;
  return_on_equity_score: number;
  return_on_assets_score: number;
  debt_to_equity_score: number;
  price_to_earnings_score: number;
  price_to_book_score: number;
}

export interface CompanyRatingSummaryRead extends CompanyRatingSummary {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyRatingSummaryWrite extends CompanyRatingSummary {}
