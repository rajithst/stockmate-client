/**
 * Consolidated user and portfolio schemas:
 * - User: User account information
 * - NotificationPreference: User notification preferences
 * - Portfolio: Portfolio container and metadata
 * - PortfolioHoldingPerformance: Individual holdings and their performance
 * - PortfolioTradingHistory: Trade records and history
 * - PortfolioDividendHistory: Dividend records and history
 * - Watchlist: Watchlist container
 * - WatchlistItem: Items in watchlist
 * - Token: Authentication token
 */

// ========================
// USER & AUTH INTERFACES
// ========================

export interface User {
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  is_active: boolean;
  last_login?: Date | string | null;
  last_password_change?: Date | string | null;
  theme_preference: string;
  language_preference: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserWrite extends User {
  hashed_password: string;
}

export interface UserRead extends User {
  id: number;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface TokenData {
  username?: string | null;
}

// ========================
// NOTIFICATION PREFERENCE INTERFACES
// ========================

export interface NotificationPreference {
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  portfolio_alerts: boolean;
  price_alerts: boolean;
  daily_news_digest: boolean;
  weekly_report: boolean;
}

export interface NotificationPreferenceWrite extends NotificationPreference {}

export interface NotificationPreferenceRead extends NotificationPreference {
  id: number;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// PORTFOLIO INTERFACES
// ========================

export interface Portfolio {
  name: string;
  description?: string | null;
  currency: string;
}

export interface PortfolioUpsertRequest extends Portfolio {}

export interface PortfolioCreate extends Portfolio {
  user_id: number;
}

export interface PortfolioRead extends Portfolio {
  id: number;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface PortfolioUpdate extends Portfolio {
  id: number;
  user_id: number;
}

// ========================
// PORTFOLIO SECTOR & INDUSTRY PERFORMANCE INTERFACES
// ========================

export interface PortfolioSectorPerformance {
  sector: string;
  currency: string;
}

export interface PortfolioSectorPerformanceRead extends PortfolioSectorPerformance {
  allocation_percentage: number;
  total_invested: number;
  total_gain_loss: number;
}

export interface PortfolioIndustryPerformance {
  industry: string;
  currency: string;
}

export interface PortfolioIndustryPerformanceRead extends PortfolioIndustryPerformance {
  allocation_percentage: number;
  total_invested: number;
  total_gain_loss: number;
}

// ========================
// PORTFOLIO HOLDING PERFORMANCE INTERFACES
// ========================

export interface PortfolioHoldingPerformance {
  symbol: string;
  currency: string;
}

export interface PortfolioHoldingPerformanceWrite extends PortfolioHoldingPerformance {
  portfolio_id: number;
}

export interface PortfolioHoldingPerformanceRead extends PortfolioHoldingPerformance {
  total_shares: number;
  total_invested: number;
  current_value: number;
  realized_gain_loss: number;
  unrealized_gain_loss: number;
  total_gain_loss: number;
  gain_loss_percentage: number;
  average_cost_per_share: number;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// PORTFOLIO TRADING HISTORY INTERFACES
// ========================

export interface PortfolioTradingHistory {
  trade_type: string;
  currency: string;
  symbol: string;
  shares: number;
  price_per_share: number;
  total_value: number;
  commission: number;
  fees: number;
  tax: number;
  net_total: number;
  trade_date: Date | string;
}

export interface PortfolioTradingHistoryUpsertRequest extends PortfolioTradingHistory {}

export interface PortfolioTradingHistoryWrite extends PortfolioTradingHistory {
  portfolio_id: number;
}

export interface PortfolioTradingHistoryRead extends PortfolioTradingHistory {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// PORTFOLIO DIVIDEND HISTORY INTERFACES
// ========================

export interface PortfolioDividendHistory {
  symbol: string;
  shares: number;
  dividend_per_share: number;
  dividend_amount: number;
  currency: string;
  declaration_date: Date | string;
  payment_date: Date | string;
}

export interface PortfolioDividendHistoryRead extends PortfolioDividendHistory {
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

export interface PortfolioDividendHistoryWrite extends PortfolioDividendHistory {
  portfolio_id: number;
}

// Composite Response Interfaces
export interface PortfolioDetail {
  total_value: number;
  total_invested: number;
  total_gain_loss: number;
  dividends_received: number;
  total_return_percentage: number;
  sector_performances: PortfolioSectorPerformanceRead[];
  industry_performances: PortfolioIndustryPerformanceRead[];
  holding_performances: PortfolioHoldingPerformanceRead[];
  trading_histories: PortfolioTradingHistoryRead[];
}

// ========================
// WATCHLIST INTERFACES
// ========================

export interface Watchlist {
  name: string;
  currency: string;
  description?: string | null;
}

export interface WatchlistUpsertRequest extends Watchlist {}

export interface WatchlistCreateRequest extends Watchlist {}

export interface WatchlistUpdate extends Watchlist {
  id: number;
  user_id: number;
}

export interface WatchlistRead extends Watchlist {
  id: number;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

// ========================
// WATCHLIST ITEM INTERFACES
// ========================

export interface WatchlistItem {
  symbol: string;
}

export interface WatchlistItemWrite extends WatchlistItem {}

export interface WatchlistItemCreate extends WatchlistItem {
  watchlist_id: number;
}

export interface WatchlistCompanyItem {
  id: number;
  symbol: string;
  company_name: string;
  price: number;
  currency: string;
  price_change: number;
  price_change_percent: number;
  market_cap: number;
  price_to_earnings_ratio?: number | null;
  price_to_earnings_growth_ratio?: number | null;
  forward_price_to_earnings_growth_ratio?: number | null;
  price_to_book_ratio?: number | null;
  price_to_sales_ratio?: number | null;
  price_to_free_cash_flow_ratio?: number | null;
  price_to_operating_cash_flow_ratio?: number | null;
  image?: string | null;
}

export interface WatchlistResponse {
  watchlist: WatchlistRead;
  items: WatchlistCompanyItem[];
}
