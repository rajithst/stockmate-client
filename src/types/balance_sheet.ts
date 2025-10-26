// TypeScript interfaces for Balance Sheet schemas
// Generated from app/schemas/balance_sheet.py

export interface CompanyBalanceSheet {
  company_id: number;
  symbol: string;
  date: string;
  reported_currency: string;
  cik: string;
  filing_date: string;
  accepted_date: string;
  fiscal_year: string;
  period: string;
  cash_and_cash_equivalents: number;
  short_term_investments: number;
  cash_and_short_term_investments: number;
  net_receivables: number;
  accounts_receivables: number;
  other_receivables: number;
  inventory: number;
  prepaids: number;
  other_current_assets: number;
  total_current_assets: number;
  property_plant_equipment_net: number;
  goodwill: number;
  intangible_assets: number;
  goodwill_and_intangible_assets: number;
  long_term_investments: number;
  tax_assets: number;
  other_non_current_assets: number;
  total_non_current_assets: number;
  other_assets: number;
  total_assets: number;
  total_payables: number;
  account_payables: number;
  other_payables: number;
  accrued_expenses: number;
  short_term_debt: number;
  capital_lease_obligations_current: number;
  tax_payables: number;
  deferred_revenue: number;
  other_current_liabilities: number;
  total_current_liabilities: number;
  long_term_debt: number;
  deferred_revenue_non_current: number;
  deferred_tax_liabilities_non_current: number;
  other_non_current_liabilities: number;
  total_non_current_liabilities: number;
  other_liabilities: number;
  capital_lease_obligations: number;
  total_liabilities: number;
  treasury_stock: number;
  preferred_stock: number;
  common_stock: number;
  retained_earnings: number;
  additional_paid_in_capital: number;
  accumulated_other_comprehensive_income_loss: number;
  other_total_stockholders_equity: number;
  total_stockholders_equity: number;
  total_equity: number;
  minority_interest: number;
  total_liabilities_and_total_equity: number;
  total_investments: number;
  total_debt: number;
  net_debt: number;
}

export interface CompanyBalanceSheetWrite extends CompanyBalanceSheet {}

export interface CompanyBalanceSheetRead extends CompanyBalanceSheet {
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}