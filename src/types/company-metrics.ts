/**
 * Consolidated company metrics schemas:
 * - CompanyAnalystEstimate: Analyst forecasts (revenue, EBITDA, EPS)
 * - CompanyKeyMetrics: Market caps, EV ratios, ROA/ROE/ROIC, efficiency metrics
 * - CompanyDiscountedCashFlow: DCF valuation (dcf value, stock price)
 * - CompanyRevenueProductSegmentation: Revenue breakdown by product/business segment
 */

// ========================
// ANALYST ESTIMATE INTERFACES
// ========================

export interface CompanyAnalystEstimate {
  symbol: string;
  date: Date | string;
  // Revenue estimates (in millions)
  revenue_low?: number | null;
  revenue_high?: number | null;
  revenue_avg?: number | null;
  // EBITDA estimates (in millions)
  ebitda_low?: number | null;
  ebitda_high?: number | null;
  ebitda_avg?: number | null;
  // EBIT estimates (in millions)
  ebit_low?: number | null;
  ebit_high?: number | null;
  ebit_avg?: number | null;
  // Net income estimates (in millions)
  net_income_low?: number | null;
  net_income_high?: number | null;
  net_income_avg?: number | null;
  // SGA expense estimates (in millions)
  sga_expense_low?: number | null;
  sga_expense_high?: number | null;
  sga_expense_avg?: number | null;
  // EPS estimates
  eps_avg?: number | null;
  eps_high?: number | null;
  eps_low?: number | null;
  // Number of analysts
  num_analysts_revenue?: number | null;
  num_analysts_eps?: number | null;
}

export interface CompanyAnalystEstimateWrite extends CompanyAnalystEstimate {
  company_id: number;
}

export interface CompanyAnalystEstimateRead extends CompanyAnalystEstimate {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// KEY METRICS INTERFACES
// ========================

export interface CompanyKeyMetrics {
  symbol: string;
  date: Date | string;
  fiscal_year: number;
  period: string;
  reported_currency: string;
  market_cap?: number | null;
  enterprise_value?: number | null;
  ev_to_sales?: number | null;
  ev_to_operating_cash_flow?: number | null;
  ev_to_free_cash_flow?: number | null;
  ev_to_ebitda?: number | null;
  net_debt_to_ebitda?: number | null;
  current_ratio?: number | null;
  income_quality?: number | null;
  graham_number?: number | null;
  graham_net_net?: number | null;
  tax_burden?: number | null;
  interest_burden?: number | null;
  working_capital?: number | null;
  invested_capital?: number | null;
  return_on_assets?: number | null;
  operating_return_on_assets?: number | null;
  return_on_tangible_assets?: number | null;
  return_on_equity?: number | null;
  return_on_invested_capital?: number | null;
  return_on_capital_employed?: number | null;
  earnings_yield?: number | null;
  free_cash_flow_yield?: number | null;
  capex_to_operating_cash_flow?: number | null;
  capex_to_depreciation?: number | null;
  capex_to_revenue?: number | null;
  sales_general_and_administrative_to_revenue?: number | null;
  research_and_development_to_revenue?: number | null;
  stock_based_compensation_to_revenue?: number | null;
  intangibles_to_total_assets?: number | null;
  average_receivables?: number | null;
  average_payables?: number | null;
  average_inventory?: number | null;
  days_of_sales_outstanding?: number | null;
  days_of_payables_outstanding?: number | null;
  days_of_inventory_outstanding?: number | null;
  operating_cycle?: number | null;
  cash_conversion_cycle?: number | null;
  free_cash_flow_to_equity?: number | null;
  free_cash_flow_to_firm?: number | null;
  tangible_asset_value?: number | null;
  net_current_asset_value?: number | null;
}

export interface CompanyKeyMetricsWrite extends CompanyKeyMetrics {
  company_id: number;
}

export interface CompanyKeyMetricsRead extends CompanyKeyMetrics {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// DISCOUNTED CASH FLOW INTERFACES
// ========================

export interface CompanyDiscountedCashFlow {
  symbol: string;
  date: Date | string;
  dcf: number;
  stock_price?: number | null;
}

export interface CompanyDiscountedCashFlowRead extends CompanyDiscountedCashFlow {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface CompanyDiscountedCashFlowWrite extends CompanyDiscountedCashFlow {
  company_id: number;
}

// ========================
// REVENUE PRODUCT SEGMENTATION INTERFACES
// ========================

export interface CompanyRevenueProductSegmentation {
  symbol: string;
  fiscal_year: number;
  period: string;
  date: Date | string;
  segments_data: string | Record<string, number>; // JSON string or dict: Product segment names and revenue values
  reported_currency?: string | null;
}

export interface CompanyRevenueProductSegmentationWrite
  extends CompanyRevenueProductSegmentation {
  company_id: number;
}

export interface CompanyRevenueProductSegmentationRead
  extends CompanyRevenueProductSegmentation {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
