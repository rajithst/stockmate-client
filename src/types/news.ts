// TypeScript interfaces for News schemas
// Generated from app/schemas/news.py

export interface CompanyStockNews {
  company_id?: number;
  symbol?: string;
  published_date: string; // ISO date string
  publisher: string;
  news_title: string;
  news_url: string;
  text: string;
  image?: string;
  site?: string;
  sentiment?: string;
}

export interface CompanyStockNewsRead extends CompanyStockNews {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyStockNewsWrite extends CompanyStockNews {}

export interface CompanyGeneralNews {
  company_id?: number;
  symbol?: string;
  published_date: string; // ISO date string
  publisher: string;
  news_title: string;
  news_url: string;
  text: string;
  image?: string;
  site?: string;
  sentiment?: string;
}

export interface CompanyGeneralNewsRead extends CompanyGeneralNews {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyGeneralNewsWrite extends CompanyGeneralNews {}

export interface CompanyPriceTargetNews {
  company_id: number;
  symbol: string;
  published_date: string; // ISO date string
  news_url: string;
  news_title: string;
  analyst_name: string;
  price_target: number;
  adj_price_target?: number;
  price_when_posted: number;
  news_publisher?: string;
  news_base_url?: string;
  analyst_company?: string;
  sentiment?: string;
}

export interface CompanyPriceTargetNewsWrite extends CompanyPriceTargetNews {}

export interface CompanyPriceTargetNewsRead extends CompanyPriceTargetNews {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}

export interface CompanyGradingNews {
  company_id: number;
  symbol: string;
  published_date: string; // ISO date string
  news_url: string;
  news_title: string;
  news_base_url?: string;
  news_publisher?: string;
  new_grade: string;
  previous_grade?: string;
  grading_company?: string;
  action?: string;
  price_when_posted: number;
  sentiment?: string;
}

export interface CompanyGradingNewsWrite extends CompanyGradingNews {}

export interface CompanyGradingNewsRead extends CompanyGradingNews {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}