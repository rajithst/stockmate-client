import type {
  CompanyFinancialHealthResponse,
  CompanyFinancialResponse,
  CompanyPageResponse,
  CompanyInsightsResponse,
  NonUSCompany,
} from '../types';
import type {
  PortfolioRead,
  PortfolioDetail,
  PortfolioTradingHistoryWrite,
  PortfolioDividendHistoryRead,
  WatchlistRead,
  WatchlistCreateRequest,
  WatchlistCompanyItem,
  DashboardResponse,
  StockSymbol,
} from '../types/user';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const TOKEN_STORAGE_KEY = 'stockmate_access_token';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface ApiError {
  detail: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...((options?.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If token is expired or invalid, clear it and redirect to login
    if (response.status === 401) {
      this.clearToken();
      // Dispatch custom event that AuthContext can listen to
      window.dispatchEvent(new Event('auth-token-expired'));
      throw new Error('Unauthorized: Token expired or invalid');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (empty body)
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.clearToken();
  }

  async getCompanyPage(
    symbol: string,
    exchange?: string,
  ): Promise<CompanyPageResponse | NonUSCompany> {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    // Use non-US endpoint for TSE (Tokyo Stock Exchange)
    const isNonUS = exchange?.toUpperCase() === 'TSE';

    if (isNonUS) {
      return this.getNonUSCompanyPage(symbol);
    } else {
      return this.getUSCompanyPage(symbol);
    }
  }

  async getUSCompanyPage(symbol: string): Promise<CompanyPageResponse> {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<CompanyPageResponse>(`/company/${symbol}`);
      return data;
    } catch (error) {
      console.error(`Error fetching US company data for ${symbol}:`, error);
      throw error;
    }
  }

  async getNonUSCompanyPage(symbol: string): Promise<NonUSCompany> {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<NonUSCompany>(`/company/non-us/${symbol}`);
      return data;
    } catch (error) {
      console.error(`Error fetching non-US company data for ${symbol}:`, error);
      throw error;
    }
  }

  async getCompanyFinancials(symbol: string) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<CompanyFinancialResponse>(`/company/${symbol}/financials/`);
      return data;
    } catch (error) {
      console.error(`Error fetching financial data for ${symbol}:`, error);
      throw error;
    }
  }

  async getCompanyFinancialHealth(symbol: string) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<CompanyFinancialHealthResponse>(
        `/company/${symbol}/financial-health/`,
      );
      return data;
    } catch (error) {
      console.error(`Error fetching financial health data for ${symbol}:`, error);
      throw error;
    }
  }

  async getCompanyInsights(symbol: string) {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<CompanyInsightsResponse>(`/company/${symbol}/insights`);
      return data;
    } catch (error) {
      console.error(`Error fetching insights data for ${symbol}:`, error);
      throw error;
    }
  }

  async getPortfolios(): Promise<PortfolioRead[]> {
    try {
      const data = await this.request<PortfolioRead[]>('/portfolio/');
      return data;
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      throw error;
    }
  }

  async getPortfolioDetail(portfolioId: number): Promise<PortfolioDetail> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await this.request<PortfolioDetail>(`/portfolio/${portfolioId}`);
      return data;
    } catch (error) {
      console.error(`Error fetching portfolio detail for ID ${portfolioId}:`, error);
      throw error;
    }
  }

  async createPortfolio(portfolio: {
    name: string;
    currency: string;
    description?: string;
  }): Promise<PortfolioRead> {
    try {
      const data = await this.request<PortfolioRead>('/portfolio/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolio),
      });
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  }

  async updatePortfolio(
    portfolioId: number,
    portfolio: { name: string; currency: string; description?: string },
  ): Promise<PortfolioRead> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await this.request<PortfolioRead>(`/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolio),
      });
      return data;
    } catch (error) {
      console.error(`Error updating portfolio ${portfolioId}:`, error);
      throw error;
    }
  }

  async deletePortfolio(portfolioId: number): Promise<void> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      await this.request<void>(`/portfolio/${portfolioId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting portfolio ${portfolioId}:`, error);
      throw error;
    }
  }

  async buyStock(
    portfolioId: number,
    trade: Omit<PortfolioTradingHistoryWrite, 'trade_type' | 'portfolio_id'> & {
      trade_type?: string;
    },
  ): Promise<PortfolioTradingHistoryWrite> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await this.request<PortfolioTradingHistoryWrite>(
        `/portfolio/${portfolioId}/buy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trade),
        },
      );
      return data;
    } catch (error) {
      console.error(`Error buying stock for portfolio ${portfolioId}:`, error);
      throw error;
    }
  }

  async sellStock(
    portfolioId: number,
    trade: Omit<PortfolioTradingHistoryWrite, 'trade_type' | 'portfolio_id'> & {
      trade_type?: string;
    },
  ): Promise<PortfolioTradingHistoryWrite> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await this.request<PortfolioTradingHistoryWrite>(
        `/portfolio/${portfolioId}/sell`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trade),
        },
      );
      return data;
    } catch (error) {
      console.error(`Error selling stock for portfolio ${portfolioId}:`, error);
      throw error;
    }
  }

  async getPortfolioDividends(portfolioId: number): Promise<PortfolioDividendHistoryRead[]> {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await this.request<PortfolioDividendHistoryRead[]>(
        `/portfolio/${portfolioId}/dividends`,
      );
      return data;
    } catch (error) {
      console.error(`Error fetching dividends for portfolio ${portfolioId}:`, error);
      throw error;
    }
  }

  async createWatchlist(watchlist: WatchlistCreateRequest): Promise<WatchlistRead> {
    try {
      const data = await this.request<WatchlistRead>('/watchlist/', {
        method: 'POST',
        body: JSON.stringify(watchlist),
      });
      return data;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  }

  async getWatchlists(): Promise<WatchlistRead[]> {
    try {
      const data = await this.request<WatchlistRead[]>('/watchlist/');
      return data;
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      throw error;
    }
  }

  async getWatchlistItems(watchlistId: number): Promise<WatchlistCompanyItem[]> {
    try {
      const data = await this.request<WatchlistCompanyItem[]>(`/watchlist/${watchlistId}`);
      return data;
    } catch (error) {
      console.error(`Error fetching watchlist items for ${watchlistId}:`, error);
      throw error;
    }
  }

  async addWatchlistItem(watchlistId: number, symbol: string): Promise<WatchlistCompanyItem> {
    try {
      const data = await this.request<WatchlistCompanyItem>(`/watchlist/${watchlistId}/items`, {
        method: 'POST',
        body: JSON.stringify({ symbol }),
      });
      return data;
    } catch (error) {
      console.error(`Error adding item to watchlist ${watchlistId}:`, error);
      throw error;
    }
  }

  async deleteWatchlistItem(watchlistId: number, itemId: string): Promise<void> {
    try {
      await this.request(`/watchlist/${watchlistId}/items/${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting item from watchlist ${watchlistId}:`, error);
      throw error;
    }
  }

  async deleteWatchlist(watchlistId: number): Promise<void> {
    try {
      await this.request(`/watchlist/${watchlistId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting watchlist ${watchlistId}:`, error);
      throw error;
    }
  }

  async getDashboard(): Promise<DashboardResponse> {
    try {
      const data = await this.request<DashboardResponse>('/dashboard');
      return data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  async getCompanies(): Promise<StockSymbol[]> {
    try {
      const data = await this.request<StockSymbol[]>('/dashboard/symbols');
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
