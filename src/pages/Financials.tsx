import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { IncomeStatementTab } from '../components/financials/IncomeStatementTab';
import { BalanceSheetTab } from '../components/financials/BalanceSheetTab';
import { CashFlowTab } from '../components/financials/CashFlowTab';
import { RatiosTab } from '../components/financials/RatiosTab';
import { Button } from '../components/ui/button.tsx';
import { ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { KeyMetricsTab } from '../components/financials/KeyMetrics.tsx';
import { DividendTab } from '../components/financials/Dividend.tsx';
import type { CompanyFinancialResponse } from '../types/index.ts';
import { apiClient } from '../api/client.ts';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FinancialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol: string }>();
  const searchParams = new URLSearchParams(window.location.search);
  const exchange = searchParams.get('exchange');
  const [financialData, setFinancialData] = React.useState<CompanyFinancialResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<
    'income' | 'balance' | 'cashflow' | 'ratios' | 'metrics' | 'dividend'
  >('income');
  const [activeMetric, setActiveMetric] = React.useState<string>('revenue');
  const [timeframe, setTimeframe] = React.useState<'yearly' | 'quarterly'>('yearly');
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  React.useEffect(() => {
    const fetchFinancials = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getCompanyFinancials(symbol);
        setFinancialData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [symbol]);

  // Mock data for charts - in production, this would come from financialData
  const mockYearlyData = [
    { year: '2021', revenue: 365000, freeCashFlow: 110000, netIncome: 94000 },
    { year: '2022', revenue: 394000, freeCashFlow: 110000, netIncome: 99000 },
    { year: '2023', revenue: 383000, freeCashFlow: 114000, netIncome: 96000 },
    { year: '2024', revenue: 420000, freeCashFlow: 120000, netIncome: 115000 },
  ];

  const mockQuarterlyData = [
    { quarter: 'Q1 24', revenue: 90000, freeCashFlow: 25000, netIncome: 25000 },
    { quarter: 'Q2 24', revenue: 110000, freeCashFlow: 30000, netIncome: 28000 },
    { quarter: 'Q3 24', revenue: 105000, freeCashFlow: 32000, netIncome: 31000 },
    { quarter: 'Q4 24', revenue: 115000, freeCashFlow: 33000, netIncome: 31000 },
  ];

  const chartData = timeframe === 'yearly' ? mockYearlyData : mockQuarterlyData;
  const xAxisKey = timeframe === 'yearly' ? 'year' : 'quarter';

  // Dynamic metrics based on selected tab
  const getMetricsForTab = () => {
    const metricsMap: Record<
      string,
      Record<string, { label: string; color: string; icon: string }>
    > = {
      income: {
        revenue: { label: 'Revenue', color: '#6366f1', icon: '📊' },
        netIncome: { label: 'Net Income', color: '#f59e0b', icon: '📈' },
        operatingIncome: { label: 'Operating Income', color: '#8b5cf6', icon: '💹' },
      },
      balance: {
        totalAssets: { label: 'Total Assets', color: '#3b82f6', icon: '🏦' },
        totalLiabilities: { label: 'Total Liabilities', color: '#ef4444', icon: '📉' },
        equity: { label: 'Equity', color: '#10b981', icon: '💼' },
      },
      cashflow: {
        freeCashFlow: { label: 'Free Cash Flow', color: '#10b981', icon: '💰' },
        operatingCashFlow: { label: 'Operating Cash Flow', color: '#06b6d4', icon: '💵' },
        investingCashFlow: { label: 'Investing Cash Flow', color: '#ec4899', icon: '📊' },
      },
      ratios: {
        peRatio: { label: 'P/E Ratio', color: '#14b8a6', icon: '📊' },
        debtToEquity: { label: 'Debt to Equity', color: '#f59e0b', icon: '⚖️' },
        currentRatio: { label: 'Current Ratio', color: '#06b6d4', icon: '📈' },
      },
      metrics: {
        eps: { label: 'EPS', color: '#6366f1', icon: '💹' },
        bookValue: { label: 'Book Value', color: '#8b5cf6', icon: '📚' },
        roe: { label: 'ROE', color: '#10b981', icon: '📊' },
      },
      dividend: {
        dividendPerShare: { label: 'Dividend per Share', color: '#f59e0b', icon: '🎁' },
        dividendYield: { label: 'Dividend Yield', color: '#10b981', icon: '📈' },
        payoutRatio: { label: 'Payout Ratio', color: '#6366f1', icon: '💰' },
      },
    };
    return metricsMap[selectedTab] || metricsMap.income;
  };

  const availableMetrics = getMetricsForTab();
  const metricsConfig = availableMetrics as Record<
    string,
    { label: string; color: string; icon: string }
  >;

  // Reset active metric if it's not available in the new tab
  React.useEffect(() => {
    if (!Object.keys(availableMetrics).includes(activeMetric)) {
      setActiveMetric(Object.keys(availableMetrics)[0]);
    }
  }, [selectedTab, availableMetrics, activeMetric]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4" />
        <span className="text-lg text-gray-600 font-medium">Loading financial data...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
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
        <span className="text-lg text-red-600 font-semibold">Error loading financials</span>
        <span className="text-sm text-gray-500 mt-1">{error}</span>
      </div>
    );

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const url = exchange
              ? `/app/company/${symbol}?exchange=${exchange}`
              : `/app/company/${symbol}`;
            navigate(url);
          }}
          className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-100"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back
        </Button>
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {symbol} Financial Analysis
        </h1>
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-5"></div>
        <Card className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="relative p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Metrics
                </h2>
                <p className="text-[10px] text-gray-500">
                  Track key financial performance indicators
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <p className="text-sm font-bold text-gray-800">
                {metricsConfig[activeMetric]?.label || 'Revenue'} Trend
              </p>

              {/* Tab Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500">Tab:</span>
                <span className="text-xs font-bold text-indigo-600 capitalize">
                  {selectedTab === 'cashflow'
                    ? 'Cash Flow'
                    : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                </span>
              </div>
            </div>

            {/* Controls in Header */}
            <div className="flex items-center gap-3">
              {/* Metric Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600">Metric:</label>
                <select
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value)}
                  className="h-7 px-2 text-xs rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {Object.entries(metricsConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chart Type Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    chartType === 'line'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Line Chart"
                >
                  📈
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    chartType === 'bar'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Bar Chart"
                >
                  📊
                </button>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTimeframe('yearly')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    timeframe === 'yearly'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Y
                </button>
                <button
                  onClick={() => setTimeframe('quarterly')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    timeframe === 'quarterly'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Q
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${(value / 1000).toFixed(0)}B`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={metricsConfig[activeMetric]?.color || '#6366f1'}
                  strokeWidth={3}
                  dot={{ fill: metricsConfig[activeMetric]?.color || '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${(value / 1000).toFixed(0)}B`}
                />
                <Legend />
                <Bar
                  dataKey={activeMetric}
                  fill={metricsConfig[activeMetric]?.color || '#6366f1'}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Financial Tables - Tabs */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <Tabs
          defaultValue="income"
          className="w-full"
          onValueChange={(value) => setSelectedTab(value as any)}
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
            <TabsList className="grid grid-cols-6 gap-1 h-auto bg-transparent">
              <TabsTrigger
                value="income"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Income
              </TabsTrigger>
              <TabsTrigger
                value="balance"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Balance
              </TabsTrigger>
              <TabsTrigger
                value="cashflow"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Cash Flow
              </TabsTrigger>
              <TabsTrigger
                value="ratios"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Ratios
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Metrics
              </TabsTrigger>
              <TabsTrigger
                value="dividend"
                className="h-8 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
              >
                Dividends
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="income">
              <IncomeStatementTab income_statements={financialData?.income_statements ?? []} />
            </TabsContent>
            <TabsContent value="balance">
              <BalanceSheetTab balance_sheets={financialData?.balance_sheets ?? []} />
            </TabsContent>
            <TabsContent value="cashflow">
              <CashFlowTab cash_flow_statements={financialData?.cash_flow_statements ?? []} />
            </TabsContent>
            <TabsContent value="ratios">
              <RatiosTab financial_ratios={financialData?.financial_ratios ?? []} />
            </TabsContent>
            <TabsContent value="metrics">
              <KeyMetricsTab key_metrics={financialData?.key_metrics ?? []} />
            </TabsContent>
            <TabsContent value="dividend">
              <DividendTab dividends={financialData?.dividends ?? []} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default FinancialsPage;
