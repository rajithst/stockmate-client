import React, { useRef } from 'react';

import { useParams } from 'react-router-dom';
import { CompanyHeader } from '../components/company/CompanyHeader.tsx';
import { USCompanyOverview } from '../components/company/USCompanyOverview.tsx';
import { NonUSCompanyOverview } from '../components/company/NonUSCompanyOverview.tsx';
import { apiClient } from '../api/client';
import type { CompanyPageResponse, NonUSCompany } from '../types';

// Type guard to check if data is CompanyPageResponse
function isCompanyPageResponse(
  data: CompanyPageResponse | NonUSCompany,
): data is CompanyPageResponse {
  return 'company' in data;
}

export const CompanyPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const searchParams = new URLSearchParams(window.location.search);
  const exchange = searchParams.get('exchange');
  const [data, setData] = React.useState<CompanyPageResponse | NonUSCompany | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasInitializedRef = useRef<string | undefined>(undefined);

  React.useEffect(() => {
    // Skip if we've already fetched this exact symbol
    if (hasInitializedRef.current === symbol) return;

    const fetchData = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        setError(null);
        const companyData = await apiClient.getCompanyPage(symbol, exchange || undefined);
        setData(companyData);
        hasInitializedRef.current = symbol;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, exchange]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4" />
        <span className="text-lg text-gray-600 font-medium">Loading company data...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100 mb-4">
          <svg
            className="w-7 h-7 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-lg text-red-600 font-semibold">Error loading data</span>
        <span className="text-sm text-gray-500 mt-1">{error}</span>
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-gray-100 mb-4">
          <svg
            className="w-7 h-7 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-lg text-gray-500 font-medium">No company data available</span>
      </div>
    );

  // Check if company is in database (only for CompanyPageResponse)
  const isInDatabase = isCompanyPageResponse(data) && data.company?.is_in_db !== false;

  // Filter stock prices to 1 month if not in database (only for CompanyPageResponse)
  const filteredStockPrices = isCompanyPageResponse(data)
    ? isInDatabase
      ? data.stock_prices
      : data.stock_prices?.filter((price) => {
          const priceDate = new Date(price.date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return priceDate >= oneMonthAgo;
        })
    : [];

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Main Header - Only for US Companies */}
      {isCompanyPageResponse(data) && (
        <CompanyHeader company={data.company} isInDatabase={isInDatabase} exchange={exchange} />
      )}

      {isCompanyPageResponse(data) && !isInDatabase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-medium">📡 Data loaded on demand</p>
          <p className="text-xs text-blue-700 mt-1">
            This company data is loaded in real-time. Add it to the database to enable full features
            and tracking.
          </p>
        </div>
      )}

      {/* Content Section */}
      {isCompanyPageResponse(data) ? (
        <USCompanyOverview
          data={data}
          filteredStockPrices={filteredStockPrices as any[]}
          isInDatabase={isInDatabase}
        />
      ) : (
        <>
          {/* Non-US Company Header - Matching US Company Header Style */}
          <div className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl p-4">
            {/* Decorative Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />

            <div className="flex flex-col gap-2">
              {/* Top row - Company info and Price */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {data.image && (
                    <img
                      src={data.image}
                      alt={data.short_name}
                      className="w-9 h-9 rounded-lg object-contain border bg-gray-50 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h1 className="text-base font-semibold text-gray-800 leading-tight">
                      {data.short_name}
                    </h1>
                    <p className="text-xs text-gray-500 leading-tight">
                      {data.symbol} • {data.full_exchange_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-base font-bold text-indigo-700 leading-tight">
                    {data.currency} {data.current_price?.toFixed(2)}
                  </div>
                  {data.regular_market_change !== null && (
                    <div
                      className={`text-xs font-semibold ${
                        data.regular_market_change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {data.regular_market_change >= 0 ? '+' : ''}
                      {data.regular_market_change?.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom row - Info on left */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <span className="whitespace-nowrap">
                  <strong>Exchange:</strong> {data.country}
                </span>
                {data.sector && (
                  <span className="whitespace-nowrap">
                    <strong>Sector:</strong> {data.sector}
                  </span>
                )}
                {data.industry && (
                  <span className="whitespace-nowrap hidden sm:inline">
                    <strong>Industry:</strong> {data.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Non-US Company On-Demand Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium">📡 Data loaded on demand</p>
            <p className="text-xs text-blue-700 mt-1">
              This company data is loaded in real-time from external sources.
            </p>
          </div>

          <NonUSCompanyOverview company={data} />
        </>
      )}
    </div>
  );
};
