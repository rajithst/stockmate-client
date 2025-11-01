export interface Watchlist {
  id?: number;
  name: string;
  currency?: string;
  description?: string | null;
}

export interface WatchlistWrite extends Omit<Watchlist, 'id'> {}

export interface WatchlistRead extends Watchlist {
  id: number;
  created_at?: string | null; // ISO datetime string
  updated_at?: string | null; // ISO datetime string
}

export interface WatchlistItem {
  watchlist_id: number;
  symbol: string;
}

export interface WatchlistItemWrite extends WatchlistItem {}

export interface WatchlistItemRead extends WatchlistItem {
  id: number;
  added_at?: string | null; // ISO datetime string
}

export interface WatchlistCompanyItem {
  watchlist_id: number;
  symbol: string;
  company_name?: string;
  current_price?: number;
  change?: number;
  change_percent?: number;
  market_cap?: number;
  sector?: string;
  industry?: string;
}

export interface WatchlistResponse {
  watchlist: WatchlistRead;
  items: WatchlistCompanyItem[];
}