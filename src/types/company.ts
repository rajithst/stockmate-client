/**
 * Core company schema and composite response types
 */

import type {
  CompanyBalanceSheetRead,
  CompanyCashFlowStatementRead,
  CompanyIncomeStatementRead,
  CompanyFinancialRatioRead,
} from './financial-statements';
import type { CompanyDiscountedCashFlowRead, CompanyKeyMetricsRead } from './company-metrics';
import type {
  CompanyGradingRead,
  CompanyGradingSummaryRead,
  CompanyGeneralNewsRead,
  CompanyGradingNewsRead,
  CompanyPriceTargetNewsRead,
  CompanyPriceTargetRead,
  CompanyPriceTargetSummaryRead,
  CompanyRatingSummaryRead,
} from './market-data';
import type { StockPriceChangeRead, CompanyDividendRead, StockPriceRead } from './quote';

// ========================
// COMPANY INTERFACES
// ========================

export interface Company {
  symbol: string;
  company_name: string;
  market_cap: number;
  currency: string;
  exchange_full_name: string;
  exchange: string;
  industry?: string | null;
  website?: string | null;
  description?: string | null;
  sector?: string | null;
  country?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  image?: string | null;
  ipo_date?: Date | string | null;
}

export interface CompanyRead extends Company {
  price?: number | null;
  daily_price_change?: number | null;
  daily_price_change_percent?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CompanyWrite extends Company {}

// ========================
// COMPANY COMPOSITE RESPONSE INTERFACES
// ========================

export interface CompanyFundamentalsRead {
  // Valuation Metrics
  market_cap?: number | null;
  price_to_earnings_ratio?: number | null;
  price_to_sales_ratio?: number | null;
  price_to_book_ratio?: number | null;

  // Cashflow Metrics
  free_cash_flow_yield?: number | null;
  earnings_yield?: number | null;

  // Profitability Margins
  gross_profit_margin?: number | null;
  operating_profit_margin?: number | null;
  net_profit_margin?: number | null;

  // Balance Sheet Metrics
  current_ratio?: number | null;
  debt_to_equity_ratio?: number | null;
  return_on_equity?: number | null;
  return_on_assets?: number | null;

  // Dividend Metrics
  dividend_yield?: number | null;
  dividend?: number | null;
  dividend_frequency?: string | null;
}

export interface CompanyPageResponse {
  company: CompanyRead;
  grading_summary?: CompanyGradingSummaryRead | null;
  rating_summary?: CompanyRatingSummaryRead | null;
  dcf?: CompanyDiscountedCashFlowRead | null;
  price_target?: CompanyPriceTargetRead | null;
  price_change?: StockPriceChangeRead | null;
  price_target_summary?: CompanyPriceTargetSummaryRead | null;
  stock_prices?: StockPriceRead[] | null;
  fundamentals?: CompanyFundamentalsRead | null;
  latest_gradings: CompanyGradingRead[];
  price_target_news: CompanyPriceTargetNewsRead[];
  general_news: CompanyGeneralNewsRead[];
  grading_news: CompanyGradingNewsRead[];
}

export interface CompanyFinancialResponse {
  balance_sheets: CompanyBalanceSheetRead[];
  income_statements: CompanyIncomeStatementRead[];
  cash_flow_statements: CompanyCashFlowStatementRead[];
  key_metrics: CompanyKeyMetricsRead[];
  financial_ratios: CompanyFinancialRatioRead[];
  dividends: CompanyDividendRead[];
}
