import type {
  CompanyFinancialHealthResponse,
  CompanyFinancialsResponse,
  CompanyPageResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiClient {
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
      const data = await this.request<CompanyFinancialsResponse>(`/company/${symbol}/financials/`);
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
}

export const apiClient = new ApiClient();
