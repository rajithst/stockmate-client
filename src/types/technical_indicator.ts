export interface CompanyTechnicalIndicator {
  company_id: number;
  symbol: string;
  date: string;
  simple_moving_average?: number | null;
  exponential_moving_average?: number | null;
  weighted_moving_average?: number | null;
  double_exponential_moving_average?: number | null;
  triple_exponential_moving_average?: number | null;
  relative_strength_index?: number | null;
  standard_deviation?: number | null;
  williams_percent_r?: number | null;
  average_directional_index?: number | null;
}

export interface CompanyTechnicalIndicatorWrite extends CompanyTechnicalIndicator {}

export interface CompanyTechnicalIndicatorRead extends CompanyTechnicalIndicator {
  id: number;
  created_at?: string | null; // ISO datetime string
  updated_at?: string | null; // ISO datetime string
}