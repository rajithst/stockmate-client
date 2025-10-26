// TypeScript interfaces for Key Metrics schemas
// Generated from app/schemas/key_metrics.py

export interface CompanyKeyMetrics {
  company_id: number;
  symbol: string;
  date: string;
  fiscal_year: string;
  period: string;
  reported_currency: string;
  market_cap?: number;
  enterprise_value?: number;
  ev_to_sales?: number;
  ev_to_operating_cash_flow?: number;
  ev_to_free_cash_flow?: number;
  ev_to_ebitda?: number;
  net_debt_to_ebitda?: number;
  current_ratio?: number;
  income_quality?: number;
  graham_number?: number;
  graham_net_net?: number;
  tax_burden?: number;
  interest_burden?: number;
  working_capital?: number;
  invested_capital?: number;
  return_on_assets?: number;
  operating_return_on_assets?: number;
  return_on_tangible_assets?: number;
  return_on_equity?: number;
  return_on_invested_capital?: number;
  return_on_capital_employed?: number;
  earnings_yield?: number;
  free_cash_flow_yield?: number;
  capex_to_operating_cash_flow?: number;
  capex_to_depreciation?: number;
  capex_to_revenue?: number;
  sales_general_and_administrative_to_revenue?: number;
  research_and_development_to_revenue?: number;
  stock_based_compensation_to_revenue?: number;
  intangibles_to_total_assets?: number;
  average_receivables?: number;
  average_payables?: number;
  average_inventory?: number;
  days_of_sales_outstanding?: number;
  days_of_payables_outstanding?: number;
  days_of_inventory_outstanding?: number;
  operating_cycle?: number;
  cash_conversion_cycle?: number;
  free_cash_flow_to_equity?: number;
  free_cash_flow_to_firm?: number;
  tangible_asset_value?: number;
  net_current_asset_value?: number;
}

export interface CompanyKeyMetricsWrite extends CompanyKeyMetrics {}

export interface CompanyKeyMetricsRead extends CompanyKeyMetrics {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}