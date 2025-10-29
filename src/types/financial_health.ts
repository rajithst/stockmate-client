export interface CompanyFinancialHealth {
  company_id: number;
  symbol: string;
  section: string;
  metric: string;
  benchmark: string;
  value: string;
  status: string;
  insight?: string | null;
}

export interface CompanyFinancialHealthWrite extends CompanyFinancialHealth {}

export interface CompanyFinancialHealthRead extends CompanyFinancialHealth {
  id: number;
  created_at?: string;
  updated_at?: string;
}
