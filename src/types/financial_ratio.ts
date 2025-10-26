// TypeScript interfaces for Financial Ratio schemas
// Generated from app/schemas/financial_ratio.py

export interface CompanyFinancialRatio {
  company_id: number;
  symbol: string;
  date: string;
  fiscal_year: string;
  period: string;
  reported_currency: string;

  // Profitability margins
  gross_profit_margin?: number;
  ebit_margin?: number;
  ebitda_margin?: number;
  operating_profit_margin?: number;
  pretax_profit_margin?: number;
  continuous_operations_profit_margin?: number;
  net_profit_margin?: number;
  bottom_line_profit_margin?: number;

  // Efficiency ratios
  receivables_turnover?: number;
  payables_turnover?: number;
  inventory_turnover?: number;
  fixed_asset_turnover?: number;
  asset_turnover?: number;

  // Liquidity ratios
  current_ratio?: number;
  quick_ratio?: number;
  solvency_ratio?: number;
  cash_ratio?: number;

  // Valuation ratios
  price_to_earnings_ratio?: number;
  price_to_earnings_growth_ratio?: number;
  forward_price_to_earnings_growth_ratio?: number;
  price_to_book_ratio?: number;
  price_to_sales_ratio?: number;
  price_to_free_cash_flow_ratio?: number;
  price_to_operating_cash_flow_ratio?: number;

  // Leverage ratios
  debt_to_assets_ratio?: number;
  debt_to_equity_ratio?: number;
  debt_to_capital_ratio?: number;
  long_term_debt_to_capital_ratio?: number;
  financial_leverage_ratio?: number;

  // Cash flow coverage ratios
  working_capital_turnover_ratio?: number;
  operating_cash_flow_ratio?: number;
  operating_cash_flow_sales_ratio?: number;
  free_cash_flow_operating_cash_flow_ratio?: number;
  debt_service_coverage_ratio?: number;
  interest_coverage_ratio?: number;
  short_term_operating_cash_flow_coverage_ratio?: number;
  operating_cash_flow_coverage_ratio?: number;
  capital_expenditure_coverage_ratio?: number;
  dividend_paid_and_capex_coverage_ratio?: number;

  // Dividend ratios
  dividend_payout_ratio?: number;
  dividend_yield?: number;
  dividend_yield_percentage?: number;

  // Per share metrics
  revenue_per_share?: number;
  net_income_per_share?: number;
  interest_debt_per_share?: number;
  cash_per_share?: number;
  book_value_per_share?: number;
  tangible_book_value_per_share?: number;
  shareholders_equity_per_share?: number;
  operating_cash_flow_per_share?: number;
  capex_per_share?: number;
  free_cash_flow_per_share?: number;

  // Misc ratios
  net_income_per_ebt?: number;
  ebt_per_ebit?: number;
  price_to_fair_value?: number;
  debt_to_market_cap?: number;
  effective_tax_rate?: number;
  enterprise_value_multiple?: number;
}

export interface CompanyFinancialRatioWrite extends CompanyFinancialRatio {}

export interface CompanyFinancialRatioRead extends CompanyFinancialRatio {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}
