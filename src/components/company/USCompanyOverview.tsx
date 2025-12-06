import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { StockPriceChart } from './StockPriceChart';
import { FundamentalsSnapshot } from './FundamentalsSnapshot';
import { StockGradingSummaryCard } from './GradingSummary';
import { RatingSummaryCard } from './RatingSummary';
import LatestGrading from './LatestGrading';
import { DcfSummaryCard } from './DiscountedCashFlow';
import { PriceTargetCard, PriceTargetSummaryCard } from './PriceTarget';
import { AnalystEstimates } from './AnalystEstimates';
import { TechnicalIndicators } from './TechnicalIndicators';
import { CompanyNewsTabs } from './CompanyNews';
import { CompanyInsights } from './CompanyInsights';
import { apiClient } from '../../api/client';
import type { CompanyPageResponse, CompanyInsightsResponse } from '../../types/company';

interface USCompanyOverviewProps {
  data: CompanyPageResponse;
  filteredStockPrices: any[];
  isInDatabase: boolean;
}

export const USCompanyOverview: React.FC<USCompanyOverviewProps> = ({
  data,
  filteredStockPrices,
  isInDatabase,
}) => {
  const [insightsData, setInsightsData] = React.useState<CompanyInsightsResponse | null>(
    data.insights || null,
  );
  const [insightsLoading, setInsightsLoading] = React.useState(false);
  const [insightsLoadedRef, setInsightsLoaded] = React.useState(!!data.insights);

  const handleInsightsTab = React.useCallback(async () => {
    if (insightsLoadedRef || insightsLoading) return;

    try {
      setInsightsLoading(true);
      const insights = await apiClient.getCompanyInsights(data.company.symbol);
      setInsightsData(insights);
      setInsightsLoaded(true);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setInsightsLoading(false);
    }
  }, [data.company.symbol, insightsLoadedRef, insightsLoading]);

  const overviewContent = (
    <div className="space-y-4">
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
    </div>
  );

  return (
    <Tabs
      defaultValue="overview"
      className="w-full flex flex-col"
      onValueChange={(value) => {
        if (value === 'insights') {
          handleInsightsTab();
        }
      }}
    >
      {/* Horizontal Tab List */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-1 mb-4">
        <TabsList className="flex gap-1 h-auto bg-transparent p-0 w-full">
          <TabsTrigger
            value="overview"
            className="flex-1 h-9 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="flex-1 h-9 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
          >
            Insights
          </TabsTrigger>
          {isInDatabase && (
            <TabsTrigger
              value="technical"
              className="flex-1 h-9 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
            >
              Technical
            </TabsTrigger>
          )}
          {isInDatabase && (
            <TabsTrigger
              value="news"
              className="flex-1 h-9 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
            >
              News
            </TabsTrigger>
          )}
        </TabsList>
      </div>

      {/* Tab Content - Below tabs */}
      {/* Overview Tab */}
      <TabsContent value="overview" className="animate-fade-in">
        {overviewContent}
      </TabsContent>

      {/* Insights Tab */}
      <TabsContent value="insights" className="animate-fade-in">
        {insightsLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4" />
            <span className="text-lg text-gray-600 font-medium">Loading insights...</span>
          </div>
        ) : (
          <CompanyInsights data={insightsData} />
        )}
      </TabsContent>

      {/* Technical Indicators Tab - Only for database companies */}
      {isInDatabase && (
        <TabsContent value="technical" className="animate-fade-in">
          <TechnicalIndicators symbol={data.company.symbol} />
        </TabsContent>
      )}

      {/* News Tab - Only for database companies */}
      {isInDatabase && (
        <TabsContent value="news" className="animate-fade-in">
          <CompanyNewsTabs news={data.stock_news || []} />
        </TabsContent>
      )}
    </Tabs>
  );
};
