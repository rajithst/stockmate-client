// TypeScript interfaces for Cash Flow Statement schemas
// Generated from app/schemas/cashflow.py

export interface CompanyCashFlowStatement {
  company_id: number;
  symbol: string;
  date: string;
  reported_currency: string;
  cik: string;
  filing_date: string;
  accepted_date: string;
  fiscal_year: string;
  period: string;
  net_income: number;
  depreciation_and_amortization: number;
  deferred_income_tax: number;
  stock_based_compensation: number;
  change_in_working_capital: number;
  accounts_receivables: number;
  inventory: number;
  accounts_payables: number;
  other_working_capital: number;
  other_non_cash_items: number;
  net_cash_provided_by_operating_activities: number;
  investments_in_property_plant_and_equipment: number;
  acquisitions_net: number;
  purchases_of_investments: number;
  sales_maturities_of_investments: number;
  other_investing_activities: number;
  net_cash_provided_by_investing_activities: number;
  net_debt_issuance: number;
  long_term_net_debt_issuance: number;
  short_term_net_debt_issuance: number;
  net_stock_issuance: number;
  net_common_stock_issuance: number;
  common_stock_issuance: number;
  common_stock_repurchased: number;
  net_preferred_stock_issuance: number;
  net_dividends_paid: number;
  common_dividends_paid: number;
  preferred_dividends_paid: number;
  other_financing_activities: number;
  net_cash_provided_by_financing_activities: number;
  effect_of_forex_changes_on_cash: number;
  net_change_in_cash: number;
  cash_at_end_of_period: number;
  cash_at_beginning_of_period: number;
  operating_cash_flow: number;
  capital_expenditure: number;
  free_cash_flow: number;
  income_taxes_paid: number;
  interest_paid: number;
}

export interface CompanyCashFlowStatementWrite extends CompanyCashFlowStatement {}

export interface CompanyCashFlowStatementRead extends CompanyCashFlowStatement {
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}