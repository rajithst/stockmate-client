/**
 * Consolidated quote and technical data schemas:
 * - StockPrice/StockPriceChange: Daily price and change data
 * - CompanyStockSplit: Stock split records
 * - CompanyStockPeer: Peer company data
 * - CompanyDividend: Dividend information
 * - CompanyTechnicalIndicator: Technical analysis indicators (SMA, RSI, etc.)
 */

// ========================
// STOCK PRICE INTERFACES
// ========================

export interface StockPriceChangeBase {
  symbol: string;
  one_day?: number | null;
  five_day?: number | null;
  one_month?: number | null;
  three_month?: number | null;
  six_month?: number | null;
  ytd?: number | null;
  one_year?: number | null;
  three_year?: number | null;
  five_year?: number | null;
  ten_year?: number | null;
}

export interface StockPriceChangeWrite extends StockPriceChangeBase {
  company_id: number;
}

export interface StockPriceChangeRead extends StockPriceChangeBase {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface StockPrice {
  symbol: string;
  date: Date | string;
  open_price: number;
  close_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  change?: number | null;
  change_percent?: number | null;
}

export interface StockPriceRead extends StockPrice {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface StockPriceWrite extends StockPrice {
  company_id: number;
}

// ========================
// STOCK SPLIT INTERFACES
// ========================

export interface CompanyStockSplit {
  symbol: string;
  date: Date | string;
  numerator: number;
  denominator: number;
}

export interface CompanyStockSplitWrite extends CompanyStockSplit {
  company_id: number;
}

export interface CompanyStockSplitRead extends CompanyStockSplit {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// STOCK PEER INTERFACES
// ========================

export interface CompanyStockPeer {
  symbol: string;
  company_name: string;
  price: number;
  market_cap: number;
}

export interface CompanyStockPeerWrite extends CompanyStockPeer {
  company_id: number;
}

export interface CompanyStockPeerRead extends CompanyStockPeer {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// DIVIDEND INTERFACES
// ========================

export interface CompanyDividend {
  symbol: string;
  date: Date | string;
  record_date?: Date | string | null;
  payment_date?: Date | string | null;
  declaration_date?: Date | string | null;
  dividend?: number | null;
  adj_dividend?: number | null;
  dividend_yield?: number | null;
  frequency?: string | null;
}

export interface CompanyDividendWrite extends CompanyDividend {
  company_id?: number;
}

export interface CompanyDividendRead extends CompanyDividend {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// TECHNICAL INDICATOR INTERFACES
// ========================

export interface CompanyTechnicalIndicator {
  symbol: string;
  date: Date | string;
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

export interface CompanyTechnicalIndicatorWrite extends CompanyTechnicalIndicator {
  company_id: number;
}

export interface CompanyTechnicalIndicatorRead extends CompanyTechnicalIndicator {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// INDEX QUOTE INTERFACES
// ========================
export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  open_price: number;
  previous_close_price: number;
  day_high_price: number;
  day_low_price: number;
  year_high_price?: number | null;
  year_low_price?: number | null;
  price_average_50d?: number | null;
  price_average_200d?: number | null;
  volume?: number | null;
  vwap?: number | null;
}

export interface IndexQuoteRead extends IndexQuote {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// COMPANY EARNINGS CALENDAR INTERFACES
// ========================

export interface CompanyEarningsCalendar {
  symbol: string;
  date: Date | string;
  eps_actual: number;
  eps_estimated?: number | null;
  revenue_actual: number;
  revenue_estimated?: number | null;
  last_updated?: Date | string | null;
}

export interface CompanyEarningsCalendarRead extends CompanyEarningsCalendar {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
