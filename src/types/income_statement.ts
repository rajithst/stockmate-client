// TypeScript interfaces for Income Statement schemas
// Generated from app/schemas/income_statement.py

export interface CompanyIncomeStatement {
  company_id: number;
  symbol: string;
  date: string;
  reported_currency: string;
  cik: string;
  filing_date: string;
  accepted_date: string;
  fiscal_year: string;
  period: string;
  revenue: number;
  cost_of_revenue: number;
  gross_profit: number;
  research_and_development_expenses: number;
  general_and_administrative_expenses: number;
  selling_and_marketing_expenses: number;
  selling_general_and_administrative_expenses: number;
  other_expenses: number;
  operating_expenses: number;
  cost_and_expenses: number;
  net_interest_income: number;
  interest_income: number;
  interest_expense: number;
  depreciation_and_amortization: number;
  ebitda: number;
  ebit: number;
  non_operating_income_excluding_interest: number;
  operating_income: number;
  total_other_income_expenses_net: number;
  income_before_tax: number;
  income_tax_expense: number;
  net_income_from_continuing_operations: number;
  net_income_from_discontinued_operations: number;
  other_adjustments_to_net_income: number;
  net_income: number;
  net_income_deductions: number;
  bottom_line_net_income: number;
  eps: number;
  eps_diluted: number;
  weighted_average_shs_out: number;
  weighted_average_shs_out_dil: number;
}

export interface CompanyIncomeStatementWrite extends CompanyIncomeStatement {}

export interface CompanyIncomeStatementRead extends CompanyIncomeStatement {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}