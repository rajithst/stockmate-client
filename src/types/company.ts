/**
 * Core company schema and composite response types
 */

import type {
  CompanyBalanceSheetRead,
  CompanyCashFlowStatementRead,
  CompanyIncomeStatementRead,
  CompanyFinancialRatioRead,
} from './financial-statements';
import type {
  CompanyAnalystEstimateRead,
  CompanyDiscountedCashFlowRead,
  CompanyKeyMetricsRead,
} from './company-metrics';
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
  is_in_db: boolean;
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
  ratios?: CompanyFinancialRatioRead | null;
  grading_summary?: CompanyGradingSummaryRead | null;
  rating_summary?: CompanyRatingSummaryRead | null;
  dcf?: CompanyDiscountedCashFlowRead | null;
  price_target?: CompanyPriceTargetRead | null;
  price_change?: StockPriceChangeRead | null;
  price_target_summary?: CompanyPriceTargetSummaryRead | null;
  stock_prices?: StockPriceRead[] | null;
  fundamentals?: CompanyFundamentalsRead | null;
  latest_gradings: CompanyGradingRead[];
  analyst_estimates: CompanyAnalystEstimateRead[];
  price_target_news: CompanyPriceTargetNewsRead[];
  general_news: CompanyGeneralNewsRead[];
  grading_news: CompanyGradingNewsRead[];
  insights?: CompanyInsightsResponse | null;
}

export interface CompanyFinancialResponse {
  balance_sheets: CompanyBalanceSheetRead[];
  income_statements: CompanyIncomeStatementRead[];
  cash_flow_statements: CompanyCashFlowStatementRead[];
  key_metrics: CompanyKeyMetricsRead[];
  financial_ratios: CompanyFinancialRatioRead[];
  dividends: CompanyDividendRead[];
}

export interface CompanyInsight {
  year: number;
  quarter: string;
  value: number;
}

export interface CompanyInsightsResponse {
  net_income: CompanyInsight[];
  gross_profit_margin: CompanyInsight[];
  operating_profit_margin: CompanyInsight[];
  ebita: CompanyInsight[];
  free_cash_flow: CompanyInsight[];
  eps: CompanyInsight[];
  eps_diluted: CompanyInsight[];
  weighted_average_shs_out: CompanyInsight[];
  return_on_equity: CompanyInsight[];
  debt_to_equity_ratio: CompanyInsight[];
  total_debt: CompanyInsight[];
  operating_cash_flow: CompanyInsight[];
  market_cap: CompanyInsight[];
  dividend_yield: CompanyInsight[];
  revenue_by_product_segments: Record<string, CompanyInsight[]>;
}

export interface NonUSCompany {
  // === BASIC COMPANY INFORMATION ===
  symbol: string;
  short_name: string;
  long_name: string;
  quote_type: string;

  // === LOCATION & CONTACT ===
  country: string | null;
  state: string | null;
  city: string | null;
  address1: string | null;
  address2: string | null;
  zip: string | null;
  phone: string | null;
  website: string | null;
  ir_website: string | null;

  // === COMPANY CLASSIFICATION ===
  industry: string | null;
  industry_key: string | null;
  industry_display: string | null;
  sector: string | null;
  sector_key: string | null;
  sector_display: string | null;

  // === COMPANY DESCRIPTION & DETAILS ===
  long_business_summary: string | null;
  description: string | null;
  full_time_employees: number | null;
  image: string | null;
  default_image: boolean | null;

  // === EXCHANGE INFORMATION ===
  exchange: string;
  full_exchange_name: string;
  exchange_timezone_name: string | null;
  exchange_timezone_short_name: string | null;
  gmt_offset_milliseconds: number | null;
  market: string | null;
  market_state: string | null;

  // === IPO & TRADING INFO ===
  ipo_date: string | null; // ISO date string
  first_trade_date_milliseconds: number | null;
  tradeable: boolean | null;
  crypto_tradeable: boolean | null;

  // === PRICING INFORMATION ===
  currency: string;
  current_price: number | null;
  previous_close: number | null;
  open: number | null;
  day_low: number | null;
  day_high: number | null;
  regular_market_previous_close: number | null;
  regular_market_open: number | null;
  regular_market_day_low: number | null;
  regular_market_day_high: number | null;
  regular_market_price: number | null;
  regular_market_change: number | null;
  regular_market_change_percent: number | null;
  bid: number | null;
  ask: number | null;
  bid_size: number | null;
  ask_size: number | null;
  price_hint: number | null;

  // === VOLUME INFORMATION ===
  volume: number | null;
  regular_market_volume: number | null;
  average_volume: number | null;
  average_volume_10_days: number | null;
  average_daily_volume_10_day: number | null;
  average_daily_volume_3_month: number | null;

  // === MARKET CAPITALIZATION & SHARES ===
  market_cap: number | null;
  enterprise_value: number | null;
  shares_outstanding: number | null;
  implied_shares_outstanding: number | null;
  float_shares: number | null;
  held_percent_insiders: number | null;
  held_percent_institutions: number | null;

  // === 52 WEEK INFORMATION ===
  fifty_two_week_low: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low_change: number | null;
  fifty_two_week_low_change_percent: number | null;
  fifty_two_week_high_change: number | null;
  fifty_two_week_high_change_percent: number | null;
  fifty_two_week_range: string | null;
  fifty_two_week_change: number | null;
  fifty_two_week_change_percent: number | null;

  // === ALL TIME HIGH/LOW ===
  all_time_high: number | null;
  all_time_low: number | null;

  // === MOVING AVERAGES ===
  fifty_day_average: number | null;
  fifty_day_average_change: number | null;
  fifty_day_average_change_percent: number | null;
  two_hundred_day_average: number | null;
  two_hundred_day_average_change: number | null;
  two_hundred_day_average_change_percent: number | null;

  // === DIVIDEND INFORMATION ===
  dividend_rate: number | null;
  dividend_yield: number | null;
  trailing_annual_dividend_rate: number | null;
  trailing_annual_dividend_yield: number | null;
  five_year_avg_dividend_yield: number | null;
  ex_dividend_date: number | null;
  last_dividend_date: number | null;
  last_dividend_value: number | null;
  payout_ratio: number | null;

  // === VALUATION RATIOS ===
  trailing_pe: number | null;
  forward_pe: number | null;
  trailing_peg_ratio: number | null;
  price_to_sales_trailing_12_months: number | null;
  price_to_book: number | null;
  enterprise_to_revenue: number | null;

  // === EARNINGS & EPS ===
  trailing_eps: number | null;
  forward_eps: number | null;
  eps_trailing_twelve_months: number | null;
  eps_for_forward: number | null;
  earnings_growth: number | null;
  earnings_quarterly_growth: number | null;
  net_income_to_common: number | null;

  // === FINANCIAL METRICS ===
  book_value: number | null;
  total_cash: number | null;
  total_cash_per_share: number | null;
  total_debt: number | null;
  total_revenue: number | null;
  revenue_per_share: number | null;
  gross_profits: number | null;
  beta: number | null;

  // === PROFITABILITY & MARGINS ===
  profit_margins: number | null;
  gross_margins: number | null;
  operating_margins: number | null;
  ebitda_margins: number | null;

  // === RETURNS ===
  return_on_assets: number | null;
  return_on_equity: number | null;

  // === GROWTH ===
  revenue_growth: number | null;

  // === ANALYST INFORMATION ===
  number_of_analyst_opinions: number | null;
  recommendation_key: string | null;
  recommendation_mean: number | null;
  average_analyst_rating: string | null;
  target_mean_price: number | null;
  target_median_price: number | null;
  target_high_price: number | null;
  target_low_price: number | null;

  // === FISCAL YEAR INFORMATION ===
  last_fiscal_year_end: number | null;
  next_fiscal_year_end: number | null;
  most_recent_quarter: number | null;

  // === EARNINGS CALL INFORMATION ===
  earnings_timestamp: number | null;
  earnings_timestamp_start: number | null;
  earnings_timestamp_end: number | null;
  earnings_call_timestamp_start: number | null;
  earnings_call_timestamp_end: number | null;
  is_earnings_date_estimate: boolean | null;

  // === STOCK SPLIT INFORMATION ===
  last_split_factor: string | null;
  last_split_date: number | null;

  // === GOVERNANCE & RISK ===
  audit_risk: number | null;
  board_risk: number | null;
  compensation_risk: number | null;
  share_holder_rights_risk: number | null;
  overall_risk: number | null;
  governance_epoch_date: number | null;
  compensation_as_of_epoch_date: number | null;

  // === MISCELLANEOUS ===
  quote_source_name: string | null;
  triggerable: boolean | null;
  custom_price_alert_confidence: string | null;
  source_interval: number | null;
  exchange_data_delayed_by: number | null;
  message_board_id: string | null;
  has_pre_post_market_data: boolean | null;
  esg_populated: boolean | null;
  region: string | null;
  language: string | null;
  type_display: string | null;
  regular_market_day_range: string | null;
  regular_market_time: number | null;
  sand_p_52_week_change: number | null;
  max_age: number | null;
}
