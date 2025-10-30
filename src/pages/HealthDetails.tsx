import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { CompanyFinancialHealthResponse } from '../types';
import { apiClient } from '../api/client';

export const HealthDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol: string }>();
  const [financialHealthData, setData] = React.useState<CompanyFinancialHealthResponse | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        setError(null);
        const financialHealthData = await apiClient.getCompanyFinancialHealth(symbol);
        setData(financialHealthData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const sections = financialHealthData
    ? [
        {
          title: 'Profitability',
          columns: ['Metric', 'Value', 'Healthy Range', 'Insight'],
          metrics: financialHealthData.profitability.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Efficiency',
          columns: ['Metric', 'Value', 'Benchmark', 'Insight'],
          metrics: financialHealthData.efficiency.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Liquidity and Solvency',
          columns: ['Metric', 'Value', 'Healthy Range', 'Insight'],
          metrics: financialHealthData.liquidity_and_solvency.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Cash Flow Strength',
          columns: ['Metric', 'Value', 'Benchmark', 'Insight'],
          metrics: financialHealthData.cashflow_strength.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Valuation',
          columns: ['Metric', 'Value', 'Typical Range', 'Insight'],
          metrics: financialHealthData.valuation.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Growth & Investment',
          columns: ['Metric', 'Value', 'Benchmark', 'Insight'],
          metrics: financialHealthData.growth_and_investment.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
        {
          title: 'Dividend & Shareholder Returns',
          columns: ['Metric', 'Value', 'Benchmark', 'Insight'],
          metrics: financialHealthData.cashflow_strength.map((item) => [
            item.metric,
            item.value,
            item.status === 'healthy' ? `${item.benchmark} ✅ ` : `${item.benchmark} ⚠️`,
            item.insight,
          ]),
        },
      ]
    : [];

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

  if (!financialHealthData)
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

  // Helper to format market cap in readable format (e.g., 2.3T, 150B, 12.5M)
  function formatMarketCap(value?: number) {
    if (!value || isNaN(value)) return '-';
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toLocaleString();
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Company Header */}
      {financialHealthData && (
        <Card className="mb-4 border-none shadow-lg bg-gradient-to-br from-blue-100 via-white to-indigo-50 rounded-2xl">
          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-6 py-4">
            {financialHealthData.company.image && (
              <img
                src={financialHealthData.company.image}
                alt={financialHealthData.company.company_name}
                className="w-20 h-20 rounded-full border border-gray-200 bg-white object-contain"
              />
            )}
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
              <div>
                <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {financialHealthData.company.company_name}
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 rounded px-2 py-0.5 ml-2">
                    {financialHealthData.company.symbol}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {financialHealthData.company.sector} &middot;{' '}
                  {financialHealthData.company.industry}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Exchange:{' '}
                  <span className="font-medium text-gray-700">
                    {financialHealthData.company.exchange}
                  </span>
                  {financialHealthData.company.country && (
                    <>
                      {' '}
                      | Country:{' '}
                      <span className="font-medium text-gray-700">
                        {financialHealthData.company.country}
                      </span>
                    </>
                  )}
                </div>
                {financialHealthData.company.website && (
                  <div className="mt-1">
                    <a
                      href={financialHealthData.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 hover:underline"
                    >
                      {financialHealthData.company.website}
                    </a>
                  </div>
                )}
              </div>
              {/* Financial summary section - right side */}
              <div className="flex flex-wrap gap-6 md:justify-end min-w-[180px]">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">Current Price</span>
                  <span className="font-semibold text-gray-800 text-lg">
                    {financialHealthData.company.price
                      ? `$${Number(financialHealthData.company.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '-'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">Market Cap</span>
                  <span className="font-semibold text-gray-800 text-lg">
                    {formatMarketCap(financialHealthData.company.market_cap)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Stock Health Details</CardTitle>
            <span className="text-xs text-gray-400 font-medium block mt-1">
              In-depth financial health indicators and benchmarks
            </span>
          </div>
          <Button size="sm" variant="outline" className="mt-1" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">{section.title}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-700 font-medium">
                      {section.columns.map((col) => (
                        <th key={col} className="py-2 px-2 text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.metrics.map((row) => (
                      <tr
                        key={row[0]}
                        className="border-b last:border-none hover:bg-white/60 transition"
                      >
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={`py-2 px-2 ${
                              i === 0
                                ? 'font-semibold text-gray-700'
                                : i === 1
                                  ? 'font-bold text-indigo-700'
                                  : i === 2
                                    ? String(cell).includes('⚠️')
                                      ? 'text-yellow-600 font-bold'
                                      : 'text-green-600 font-bold'
                                    : 'text-gray-600'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDetailsPage;
