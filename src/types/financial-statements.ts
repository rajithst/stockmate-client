/**
 * Consolidated financial statement schemas:
 * - CompanyIncomeStatement: Revenue, expenses, profit metrics
 * - CompanyBalanceSheet: Assets, liabilities, equity
 * - CompanyCashFlowStatement: Operating, investing, financing cash flows
 * - CompanyFinancialRatio: 100+ calculated financial ratios
 */

// ========================
// INCOME STATEMENT INTERFACES
// ========================

export interface CompanyIncomeStatement {
  symbol: string;
  date: Date | string;
  reported_currency: string;
  cik: string;
  filing_date: Date | string;
  accepted_date: Date | string;
  fiscal_year: number;
  period: string;
  revenue?: number | null;
  cost_of_revenue?: number | null;
  gross_profit?: number | null;
  research_and_development_expenses?: number | null;
  general_and_administrative_expenses?: number | null;
  selling_and_marketing_expenses?: number | null;
  selling_general_and_administrative_expenses?: number | null;
  other_expenses?: number | null;
  operating_expenses?: number | null;
  cost_and_expenses?: number | null;
  net_interest_income?: number | null;
  interest_income?: number | null;
  interest_expense?: number | null;
  depreciation_and_amortization?: number | null;
  ebitda?: number | null;
  ebit?: number | null;
  non_operating_income_excluding_interest?: number | null;
  operating_income?: number | null;
  total_other_income_expenses_net?: number | null;
  income_before_tax?: number | null;
  income_tax_expense?: number | null;
  net_income_from_continuing_operations?: number | null;
  net_income_from_discontinued_operations?: number | null;
  other_adjustments_to_net_income?: number | null;
  net_income?: number | null;
  net_income_deductions?: number | null;
  bottom_line_net_income?: number | null;
  eps?: number | null;
  eps_diluted?: number | null;
  weighted_average_shs_out?: number | null;
  weighted_average_shs_out_dil?: number | null;
}

export interface CompanyIncomeStatementWrite extends CompanyIncomeStatement {
  company_id: number;
}

export interface CompanyIncomeStatementRead extends CompanyIncomeStatement {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// BALANCE SHEET INTERFACES
// ========================

export interface CompanyBalanceSheet {
  symbol: string;
  date: Date | string;
  reported_currency: string;
  cik: string;
  filing_date: Date | string;
  accepted_date: Date | string;
  fiscal_year: number;
  period: string;
  cash_and_cash_equivalents?: number | null;
  short_term_investments?: number | null;
  cash_and_short_term_investments?: number | null;
  net_receivables?: number | null;
  accounts_receivables?: number | null;
  other_receivables?: number | null;
  inventory?: number | null;
  prepaids?: number | null;
  other_current_assets?: number | null;
  total_current_assets?: number | null;
  property_plant_equipment_net?: number | null;
  goodwill?: number | null;
  intangible_assets?: number | null;
  goodwill_and_intangible_assets?: number | null;
  long_term_investments?: number | null;
  tax_assets?: number | null;
  other_non_current_assets?: number | null;
  total_non_current_assets?: number | null;
  other_assets?: number | null;
  total_assets?: number | null;
  total_payables?: number | null;
  account_payables?: number | null;
  other_payables?: number | null;
  accrued_expenses?: number | null;
  short_term_debt?: number | null;
  capital_lease_obligations_current?: number | null;
  tax_payables?: number | null;
  deferred_revenue?: number | null;
  other_current_liabilities?: number | null;
  total_current_liabilities?: number | null;
  long_term_debt?: number | null;
  deferred_revenue_non_current?: number | null;
  deferred_tax_liabilities_non_current?: number | null;
  other_non_current_liabilities?: number | null;
  total_non_current_liabilities?: number | null;
  other_liabilities?: number | null;
  capital_lease_obligations?: number | null;
  total_liabilities?: number | null;
  treasury_stock?: number | null;
  preferred_stock?: number | null;
  common_stock?: number | null;
  retained_earnings?: number | null;
  additional_paid_in_capital?: number | null;
  accumulated_other_comprehensive_income_loss?: number | null;
  other_total_stockholders_equity?: number | null;
  total_stockholders_equity?: number | null;
  total_equity?: number | null;
  minority_interest?: number | null;
  total_liabilities_and_total_equity?: number | null;
  total_investments?: number | null;
  total_debt?: number | null;
  net_debt?: number | null;
}

export interface CompanyBalanceSheetWrite extends CompanyBalanceSheet {
  company_id: number;
}

export interface CompanyBalanceSheetRead extends CompanyBalanceSheet {
  created_at: Date | string;
  updated_at: Date | string;
}

// ========================
// CASH FLOW STATEMENT INTERFACES
// ========================

export interface CompanyCashFlowStatement {
  symbol: string;
  date: Date | string;
  reported_currency: string;
  cik: string;
  filing_date: Date | string;
  accepted_date: Date | string;
  fiscal_year: number;
  period: string;
  net_income?: number | null;
  depreciation_and_amortization?: number | null;
  deferred_income_tax?: number | null;
  stock_based_compensation?: number | null;
  change_in_working_capital?: number | null;
  accounts_receivables?: number | null;
  inventory?: number | null;
  accounts_payables?: number | null;
  other_working_capital?: number | null;
  other_non_cash_items?: number | null;
  net_cash_provided_by_operating_activities?: number | null;
  investments_in_property_plant_and_equipment?: number | null;
  acquisitions_net?: number | null;
  purchases_of_investments?: number | null;
  sales_maturities_of_investments?: number | null;
  other_investing_activities?: number | null;
  net_cash_provided_by_investing_activities?: number | null;
  net_debt_issuance?: number | null;
  long_term_net_debt_issuance?: number | null;
  short_term_net_debt_issuance?: number | null;
  net_stock_issuance?: number | null;
  net_common_stock_issuance?: number | null;
  common_stock_issuance?: number | null;
  common_stock_repurchased?: number | null;
  net_preferred_stock_issuance?: number | null;
  net_dividends_paid?: number | null;
  common_dividends_paid?: number | null;
  preferred_dividends_paid?: number | null;
  other_financing_activities?: number | null;
  net_cash_provided_by_financing_activities?: number | null;
  effect_of_forex_changes_on_cash?: number | null;
  net_change_in_cash?: number | null;
  cash_at_end_of_period?: number | null;
  cash_at_beginning_of_period?: number | null;
  operating_cash_flow?: number | null;
  capital_expenditure?: number | null;
  free_cash_flow?: number | null;
  income_taxes_paid?: number | null;
  interest_paid?: number | null;
}

export interface CompanyCashFlowStatementWrite extends CompanyCashFlowStatement {
  company_id: number;
}

export interface CompanyCashFlowStatementRead extends CompanyCashFlowStatement {
  created_at: Date | string;
  updated_at: Date | string;
}

// ========================
// FINANCIAL RATIO INTERFACES
// ========================

export interface CompanyFinancialRatio {
  symbol: string;
  date?: Date | string | null;
  fiscal_year?: number | null;
  period?: string | null;
  reported_currency?: string | null;
  // Profitability margins
  gross_profit_margin?: number | null;
  ebit_margin?: number | null;
  ebitda_margin?: number | null;
  operating_profit_margin?: number | null;
  pretax_profit_margin?: number | null;
  continuous_operations_profit_margin?: number | null;
  net_profit_margin?: number | null;
  bottom_line_profit_margin?: number | null;
  // Efficiency ratios
  receivables_turnover?: number | null;
  payables_turnover?: number | null;
  inventory_turnover?: number | null;
  fixed_asset_turnover?: number | null;
  asset_turnover?: number | null;
  // Liquidity ratios
  current_ratio?: number | null;
  quick_ratio?: number | null;
  solvency_ratio?: number | null;
  cash_ratio?: number | null;
  // Valuation ratios
  price_to_earnings_ratio?: number | null;
  price_to_earnings_growth_ratio?: number | null;
  forward_price_to_earnings_growth_ratio?: number | null;
  price_to_book_ratio?: number | null;
  price_to_sales_ratio?: number | null;
  price_to_free_cash_flow_ratio?: number | null;
  price_to_operating_cash_flow_ratio?: number | null;
  // Leverage ratios
  debt_to_assets_ratio?: number | null;
  debt_to_equity_ratio?: number | null;
  debt_to_capital_ratio?: number | null;
  long_term_debt_to_capital_ratio?: number | null;
  financial_leverage_ratio?: number | null;
  // Cash flow coverage ratios
  working_capital_turnover_ratio?: number | null;
  operating_cash_flow_ratio?: number | null;
  operating_cash_flow_sales_ratio?: number | null;
  free_cash_flow_operating_cash_flow_ratio?: number | null;
  debt_service_coverage_ratio?: number | null;
  interest_coverage_ratio?: number | null;
  short_term_operating_cash_flow_coverage_ratio?: number | null;
  operating_cash_flow_coverage_ratio?: number | null;
  capital_expenditure_coverage_ratio?: number | null;
  dividend_paid_and_capex_coverage_ratio?: number | null;
  // Dividend ratios
  dividend_payout_ratio?: number | null;
  dividend_yield?: number | null;
  dividend_yield_percentage?: number | null;
  // Per share metrics
  revenue_per_share?: number | null;
  net_income_per_share?: number | null;
  interest_debt_per_share?: number | null;
  cash_per_share?: number | null;
  book_value_per_share?: number | null;
  tangible_book_value_per_share?: number | null;
  shareholders_equity_per_share?: number | null;
  operating_cash_flow_per_share?: number | null;
  capex_per_share?: number | null;
  free_cash_flow_per_share?: number | null;
  // Misc ratios
  net_income_per_ebt?: number | null;
  ebt_per_ebit?: number | null;
  price_to_fair_value?: number | null;
  debt_to_market_cap?: number | null;
  effective_tax_rate?: number | null;
  enterprise_value_multiple?: number | null;
}

export interface CompanyFinancialRatioWrite extends CompanyFinancialRatio {
  company_id: number;
}

export interface CompanyFinancialRatioRead extends CompanyFinancialRatio {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
