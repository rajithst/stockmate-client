import React from 'react';

import { useParams } from 'react-router-dom';
import { CompanyHeader } from '../components/company/CompanyHeader.tsx';
import { PriceChangeChart } from '../components/company/PriceChange.tsx';
import { CompanyNewsTabs } from '../components/company/CompanyNews.tsx';
import { StockGradingSummaryCard } from '../components/company/GradingSummary.tsx';
import { DcfSummaryCard } from '../components/company/DiscountedCashFlow.tsx';
import { PriceTargetCard, PriceTargetSummaryCard } from '../components/company/PriceTarget.tsx';
import { RatingSummaryCard } from '../components/company/RatingSummary.tsx';
import LatestGrading from '../components/company/LatestGrading.tsx';
import { apiClient } from '../api/client';
import type { CompanyPageResponse } from '../types';
import { OverallHealthSummaryCard } from '../components/company/OverallHealth.tsx';

export const CompanyPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [data, setData] = React.useState<CompanyPageResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        setError(null);
        const companyData = await apiClient.getCompanyPage(symbol);
        setData(companyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

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

  const companyNews = {
    general_news: data.general_news,
    price_target_news: data.price_target_news,
    grading_news: data.grading_news,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Top Section: Responsive 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <CompanyHeader company={data.company} />
          <PriceChangeChart price_change={data.price_change} />
          <OverallHealthSummaryCard symbol={data.company.symbol} />
          <LatestGrading latest_gradings={data.latest_gradings} />
          <PriceTargetSummaryCard price_target_summary={data.price_target_summary} />
          <CompanyNewsTabs news={companyNews} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <StockGradingSummaryCard summary={data.grading_summary} />
          <DcfSummaryCard discounted_cash_flow={data.dcf} />
          <PriceTargetCard price_target={data.price_target} />
          <RatingSummaryCard rating_summary={data.rating_summary} />
        </div>
      </div>
    </div>
  );
};
