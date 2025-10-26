// TypeScript interfaces for Grading schemas
// Generated from app/schemas/grading.py

export interface CompanyGrading {
  company_id: number;
  symbol: string;
  date: string;
  grading_company: string;
  previous_grade: string;
  new_grade: string;
  action: string;
}

export interface CompanyGradingWrite extends CompanyGrading {}

export interface CompanyGradingRead extends CompanyGrading {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyGradingSummary {
  company_id: number;
  symbol: string;
  buy: number;
  hold: number;
  sell: number;
  strong_buy: number;
  strong_sell: number;
  consensus: string;
}

export interface CompanyGradingSummaryRead extends CompanyGradingSummary {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyGradingSummaryWrite extends CompanyGradingSummary {}