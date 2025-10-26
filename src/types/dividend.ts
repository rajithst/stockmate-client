// TypeScript interfaces for Dividend schemas
// Generated from app/schemas/dividend.py

export interface CompanyDividend {
  company_id: number;
  symbol: string;
  date: string;
  record_date?: string;
  payment_date?: string;
  declaration_date?: string;
  dividend?: number;
  adj_dividend?: number;
  dividend_yield?: number;
  frequency?: string;
}

export interface CompanyDividendWrite extends CompanyDividend {}

export interface CompanyDividendRead extends CompanyDividend {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface DividendCalendar {
  symbol: string;
  date: string;
  record_date?: string;
  payment_date?: string;
  declaration_date?: string;
  adj_dividend?: number;
  dividend?: number;
  dividend_yield?: number;
  frequency?: string;
}

export interface DividendCalendarWrite extends DividendCalendar {}

export interface DividendCalendarRead extends DividendCalendar {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}