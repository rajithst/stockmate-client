import React, { useRef } from 'react';

import { useParams } from 'react-router-dom';
import { CompanyHeader } from '../components/company/CompanyHeader.tsx';
import { StockPriceChart } from '../components/company/StockPriceChart.tsx';
import { FundamentalsSnapshot } from '../components/company/FundamentalsSnapshot.tsx';
import { CompanyNewsTabs } from '../components/company/CompanyNews.tsx';
import { StockGradingSummaryCard } from '../components/company/GradingSummary.tsx';
import { DcfSummaryCard } from '../components/company/DiscountedCashFlow.tsx';
import { PriceTargetCard, PriceTargetSummaryCard } from '../components/company/PriceTarget.tsx';
import { RatingSummaryCard } from '../components/company/RatingSummary.tsx';
import LatestGrading from '../components/company/LatestGrading.tsx';
import { TechnicalIndicators } from '../components/company/TechnicalIndicators.tsx';
import { CompanyHealth } from '../components/company/CompanyHealth.tsx';
import { CompanyInsights } from '../components/company/CompanyInsights.tsx';
import { AnalystEstimates } from '../components/company/AnalystEstimates.tsx';
import { apiClient } from '../api/client';
import type { CompanyPageResponse, CompanyFinancialHealthResponse } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export const CompanyPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [data, setData] = React.useState<CompanyPageResponse | null>(null);
  const [healthData, setHealthData] = React.useState<CompanyFinancialHealthResponse | null>(null);
  const [insightsData, setInsightsData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [healthLoading, setHealthLoading] = React.useState(false);
  const [insightsLoading, setInsightsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const hasInitializedRef = useRef<string | undefined>(undefined);
  const healthLoadedRef = useRef<boolean>(false);
  const insightsLoadedRef = useRef<boolean>(false);

  React.useEffect(() => {
    // Skip if we've already fetched this exact symbol
    if (hasInitializedRef.current === symbol) return;

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
    hasInitializedRef.current = symbol;
    // Reset loaded flags when symbol changes
    healthLoadedRef.current = false;
    insightsLoadedRef.current = false;
  }, [symbol]);

  // Load health data when switching to health tab
  const handleHealthTabChange = async () => {
    if (healthLoadedRef.current || !symbol) return;

    try {
      setHealthLoading(true);
      const response = await apiClient.getCompanyFinancialHealth(symbol);
      setHealthData(response);
      healthLoadedRef.current = true;
    } catch (err) {
      console.error('Failed to load health data:', err);
    } finally {
      setHealthLoading(false);
    }
  };

  // Load insights data when switching to insights tab
  const handleInsightsTabChange = async () => {
    if (insightsLoadedRef.current || !symbol) return;

    try {
      setInsightsLoading(true);
      const response = await apiClient.getCompanyInsights(symbol);
      console.log('Insights data loaded:', response);
      setInsightsData(response);
      insightsLoadedRef.current = true;
    } catch (err) {
      console.error('Failed to load insights data:', err);
    } finally {
      setInsightsLoading(false);
    }
  };

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

  // Check if company is in database
  const isInDatabase = data.company?.is_in_db !== false;

  // Filter stock prices to 1 month if not in database
  const filteredStockPrices = isInDatabase
    ? data.stock_prices
    : data.stock_prices?.filter((price) => {
        const priceDate = new Date(price.date);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return priceDate >= oneMonthAgo;
      });

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Main Header - Always Visible */}
      <CompanyHeader company={data.company} isInDatabase={isInDatabase} />

      {!isInDatabase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-medium">📡 Data loaded on demand</p>
          <p className="text-xs text-blue-700 mt-1">
            This company data is loaded in real-time. Add it to the database to enable full features
            and tracking.
          </p>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={(value) => {
          if (value === 'health') handleHealthTabChange();
          if (value === 'insights') handleInsightsTabChange();
        }}
      >
        <TabsList
          className={`grid w-full bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-xl border border-indigo-100 ${
            isInDatabase ? 'grid-cols-5' : 'grid-cols-2'
          }`}
        >
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
          >
            Insights
          </TabsTrigger>
          {isInDatabase && (
            <>
              <TabsTrigger
                value="health"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
              >
                Health
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
              >
                Technical
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
              >
                News
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stock Price Chart */}
          <div>
            <StockPriceChart stock_prices={filteredStockPrices} />
          </div>

          {/* Fundamentals Snapshot - Full Width */}
          <div>
            <FundamentalsSnapshot company={data.company} ratios={data.ratios} />
          </div>

          {/* Row 1: Grading, Rating, Analyst Gradings (3 cards) */}
          <div
            className={`grid gap-4 ${isInDatabase ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            <StockGradingSummaryCard summary={data.grading_summary} />
            <RatingSummaryCard rating_summary={data.rating_summary} />
            {isInDatabase && <LatestGrading latest_gradings={data.latest_gradings} />}
          </div>

          {/* Row 2: DCF, Price Target, Price Target Summary (3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DcfSummaryCard discounted_cash_flow={data.dcf} />
            <PriceTargetCard price_target={data.price_target} />
            <PriceTargetSummaryCard price_target_summary={data.price_target_summary} />
          </div>

          {/* Row 3: Analyst Estimates */}
          {data.analyst_estimates && data.analyst_estimates.length > 0 && (
            <div>
              <AnalystEstimates analyst_estimates={data.analyst_estimates} />
            </div>
          )}
        </TabsContent>

        {/* Insights Tab - Available for both on-demand and database data */}
        <TabsContent value="insights">
          <CompanyInsights data={insightsData} loading={insightsLoading} />
        </TabsContent>

        {/* Health Tab */}
        {isInDatabase && (
          <TabsContent value="health">
            <CompanyHealth healthData={healthData} healthLoading={healthLoading} />
          </TabsContent>
        )}

        {/* Technical Tab */}
        {isInDatabase && (
          <TabsContent value="technical">
            <TechnicalIndicators symbol={symbol || ''} />
          </TabsContent>
        )}

        {/* News Tab */}
        {isInDatabase && (
          <TabsContent value="news">
            <CompanyNewsTabs news={companyNews} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
