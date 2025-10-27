export interface FinancialHealth {
  company_id: number;
  symbol: string;
  section: string;
  metric: string;
  benchmark: string;
  value: string;
  status: string;
  insight?: string | null;
}

export interface FinancialHealthWrite extends FinancialHealth {}

export interface FinancialHealthRead extends FinancialHealth {
  id: number;
  created_at?: string;
  updated_at?: string;
}
