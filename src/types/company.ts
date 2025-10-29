// TypeScript interfaces for Company schemas
// Generated from app/schemas/company.py

// TypeScript interfaces for Company schemas
// Generated from app/schemas/company.py
import type { CompanyBalanceSheetRead } from './balance_sheet';
import type { CompanyCashFlowStatementRead } from './cashflow';
import type { DiscountedCashFlowRead } from './dcf';
import type { CompanyDividendRead } from './dividend';
import type { CompanyFinancialHealthRead } from './financial_health';
import type { CompanyFinancialRatioRead } from './financial_ratio';
import type { CompanyGradingRead, CompanyGradingSummaryRead } from './grading';
import type { CompanyIncomeStatementRead } from './income_statement';
import type { CompanyKeyMetricsRead } from './key_metrics';
import type {
  CompanyGeneralNewsRead,
  CompanyGradingNewsRead,
  CompanyPriceTargetNewsRead,
} from './news';
import type { CompanyPriceTargetRead, CompanyPriceTargetSummaryRead } from './price_target';
import type { StockPriceChangeRead } from './quote';
import type { CompanyRatingSummaryRead } from './rating';
import type { CompanyTechnicalIndicatorRead } from './technical_indicator';

export interface Company {
  symbol: string;
  company_name: string;
  price: number;
  market_cap: number;
  currency: string;
  exchange_full_name: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  sector: string;
  country: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  ipo_date: string;
}

export interface CompanyRead extends Company {
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface CompanyWrite extends Company {}

export interface CompanyPageResponse {
  company: CompanyRead;
  grading_summary: CompanyGradingSummaryRead;
  rating_summary: CompanyRatingSummaryRead;
  dcf: DiscountedCashFlowRead;
  price_target: CompanyPriceTargetRead;
  price_change: StockPriceChangeRead;
  price_target_summary: CompanyPriceTargetSummaryRead;
  latest_gradings: CompanyGradingRead[];
  price_target_news: CompanyPriceTargetNewsRead[];
  general_news: CompanyGeneralNewsRead[];
  grading_news: CompanyGradingNewsRead[];
  technical_indicators: CompanyTechnicalIndicatorRead[];
}

export interface CompanyFinancialsResponse {
  balance_sheets: CompanyBalanceSheetRead[];
  income_statements: CompanyIncomeStatementRead[];
  cash_flow_statements: CompanyCashFlowStatementRead[];
  key_metrics: CompanyKeyMetricsRead[];
  financial_ratios: CompanyFinancialRatioRead[];
  dividends: CompanyDividendRead[];
}

export interface CompanyFinancialHealthResponse {
  company: CompanyRead;
  profitability: CompanyFinancialHealthRead[];
  efficiency: CompanyFinancialHealthRead[];
  liquidity_and_solvency: CompanyFinancialHealthRead[];
  cashflow_strength: CompanyFinancialHealthRead[];
  valuation: CompanyFinancialHealthRead[];
  growth_and_investment: CompanyFinancialHealthRead[];
  dividend_and_shareholder_return: CompanyFinancialHealthRead[];
}
