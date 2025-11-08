import type {
  CompanyFinancialHealthResponse,
  CompanyFinancialResponse,
  CompanyPageResponse,
} from '../types';
import type {
  PortfolioRead,
  PortfolioDetail,
  PortfolioTradingHistoryWrite,
  PortfolioDividendHistoryRead,
} from '../types/user';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWppdGgiLCJleHAiOjE3NjI2MjMzOTV9.R1idSfkAkIBIgKadJ8lHo4tUiBIUxHKHx6oS_V4s8Lo';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      ...((options?.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (empty body)
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json();
  }

  async getCompanyPage(symbol: string): Promise<CompanyPageResponse> {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    try {
      const data = await this.request<CompanyPageResponse>(`/company/${symbol}`);
      return data;
    } catch (error) {
      console.error(`Error fetching company data for ${symbol}:`, error);
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
}

export const apiClient = new ApiClient();
