/**
 * Consolidated market data schemas:
 * - CompanyGrading: Individual grading events
 * - CompanyGradingSummary: Summary of analyst gradings
 * - CompanyRatingSummary: Analyst rating summaries with various score components
 * - CompanyPriceTarget: Price target data
 * - CompanyPriceTargetSummary: Summary of price targets
 * - CompanyStockNews: Stock-related news
 * - CompanyGeneralNews: General company news
 * - CompanyPriceTargetNews: News related to price targets
 * - CompanyGradingNews: News related to grading changes
 */

// ========================
// GRADING INTERFACES
// ========================

export interface CompanyGrading {
  symbol: string;
  date: Date | string;
  grading_company?: string | null;
  previous_grade?: string | null;
  new_grade?: string | null;
  action?: string | null;
}

export interface CompanyGradingWrite extends CompanyGrading {
  company_id: number;
}

export interface CompanyGradingRead extends CompanyGrading {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyGradingSummary {
  symbol: string;
  buy: number;
  hold: number;
  sell: number;
  strong_buy: number;
  strong_sell: number;
  consensus: string;
}

export interface CompanyGradingSummaryRead extends CompanyGradingSummary {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyGradingSummaryWrite extends CompanyGradingSummary {
  company_id: number;
}

// ========================
// RATING INTERFACES
// ========================

export interface CompanyRatingSummary {
  symbol: string;
  rating?: string | null;
  overall_score?: number | null;
  discounted_cash_flow_score?: number | null;
  return_on_equity_score?: number | null;
  return_on_assets_score?: number | null;
  debt_to_equity_score?: number | null;
  price_to_earnings_score?: number | null;
  price_to_book_score?: number | null;
}

export interface CompanyRatingSummaryRead extends CompanyRatingSummary {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyRatingSummaryWrite extends CompanyRatingSummary {
  company_id: number;
}

// ========================
// PRICE TARGET INTERFACES
// ========================

export interface CompanyPriceTarget {
  symbol: string;
  target_high?: number | null;
  target_low?: number | null;
  target_consensus?: number | null;
  target_median?: number | null;
}

export interface CompanyPriceTargetRead extends CompanyPriceTarget {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyPriceTargetWrite extends CompanyPriceTarget {
  company_id: number;
}

export interface CompanyPriceTargetSummary {
  symbol: string;
  last_month_count: number;
  last_month_average_price_target: number;
  last_quarter_count: number;
  last_quarter_average_price_target: number;
  last_year_count: number;
  last_year_average_price_target: number;
  all_time_count: number;
  all_time_average_price_target: number;
  publishers?: string | null;
}

export interface CompanyPriceTargetSummaryRead extends CompanyPriceTargetSummary {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyPriceTargetSummaryWrite extends CompanyPriceTargetSummary {
  company_id: number;
}

// ========================
// NEWS INTERFACES
// ========================

export interface CompanyStockNews {
  symbol?: string | null;
  published_date: Date | string;
  publisher: string;
  news_title: string;
  news_url: string;
  text: string;
  image?: string | null;
  site?: string | null;
  sentiment?: string | null;
}

export interface CompanyStockNewsRead extends CompanyStockNews {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyStockNewsWrite extends CompanyStockNews {
  company_id: number;
}

export interface CompanyGeneralNews {
  symbol?: string | null;
  published_date: Date | string;
  publisher: string;
  news_title: string;
  news_url: string;
  text: string;
  image?: string | null;
  site?: string | null;
  sentiment?: string | null;
}

export interface CompanyGeneralNewsRead extends CompanyGeneralNews {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyGeneralNewsWrite extends CompanyGeneralNews {
  company_id: number;
}

export interface CompanyPriceTargetNews {
  symbol: string;
  published_date: Date | string;
  news_url: string;
  news_title: string;
  analyst_name: string;
  price_target: number;
  adj_price_target?: number | null;
  price_when_posted: number;
  news_publisher?: string | null;
  news_base_url?: string | null;
  analyst_company?: string | null;
  sentiment?: string | null;
}

export interface CompanyPriceTargetNewsWrite extends CompanyPriceTargetNews {
  company_id: number;
}

export interface CompanyPriceTargetNewsRead extends CompanyPriceTargetNews {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyGradingNews {
  symbol: string;
  published_date: Date | string;
  news_url: string;
  news_title: string;
  news_base_url?: string | null;
  news_publisher?: string | null;
  new_grade: string;
  previous_grade?: string | null;
  grading_company?: string | null;
  action?: string | null;
  price_when_posted: number;
  sentiment?: string | null;
}

export interface CompanyGradingNewsWrite extends CompanyGradingNews {
  company_id: number;
}

export interface CompanyGradingNewsRead extends CompanyGradingNews {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
