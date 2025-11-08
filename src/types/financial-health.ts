/**
 * Consolidated financial health schemas:
 * - CompanyFinancialHealth: Health indicators and metrics
 * - CompanyFinancialScore: Financial scoring models (Altman, Piotroski)
 */

import type { CompanyRead } from './company';

// ========================
// FINANCIAL HEALTH INTERFACES
// ========================

export interface CompanyFinancialHealth {
  symbol: string;
  section: string;
  metric: string;
  benchmark: string;
  value: string;
  status: string;
  insight?: string | null;
}

export interface CompanyFinancialHealthWrite extends CompanyFinancialHealth {
  company_id: number;
}

export interface CompanyFinancialHealthRead extends CompanyFinancialHealth {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyFinancialHealthResponse {
  company: CompanyRead;
  profitability_analysis: [CompanyFinancialHealthRead];
  efficiency_analysis: [CompanyFinancialHealthRead];
  liquidity_and_short_term_solvency: [CompanyFinancialHealthRead];
  leverage_and_capital_structure: [CompanyFinancialHealthRead];
  valuation_and_market_multiples: [CompanyFinancialHealthRead];
  cashflow_strength: [CompanyFinancialHealthRead];
  asset_quality_and_capital_efficiency: [CompanyFinancialHealthRead];
  dividend_and_shareholder_returns: [CompanyFinancialHealthRead];
  per_share_performance: [CompanyFinancialHealthRead];
  tax_and_cost_structure: [CompanyFinancialHealthRead];
}

// ========================
// FINANCIAL SCORE INTERFACES
// ========================

export interface CompanyFinancialScore {
  symbol: string;
  reported_currency?: string | null;
  altman_z_score?: number | null;
  piotroski_score?: number | null;
  working_capital?: number | null;
  total_assets?: number | null;
  retained_earnings?: number | null;
  ebit?: number | null;
  market_cap?: number | null;
  total_liabilities?: number | null;
  revenue?: number | null;
}

export interface CompanyFinancialScoresWrite extends CompanyFinancialScore {
  company_id: number;
}

export interface CompanyFinancialScoresRead extends CompanyFinancialScore {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
