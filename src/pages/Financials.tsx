import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { IncomeStatementTab } from '../components/financials/IncomeStatementTab';
import { BalanceSheetTab } from '../components/financials/BalanceSheetTab';
import { CashFlowTab } from '../components/financials/CashFlowTab';
import { RatiosTab } from '../components/financials/RatiosTab';
import { Button } from '../components/ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { ArrowLeft, TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
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
  ResponsiveContainer,
} from 'recharts';

const formatYAxis = (value: number): string => {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `${value.toFixed(0)}`;
};

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
  const [activeMetric, setActiveMetric] = React.useState<string>('');
  const [timeframe, setTimeframe] = React.useState<'yearly' | 'quarterly'>('yearly');
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('bar');

  // Extract available metrics from financial data
  const getAvailableMetrics = React.useCallback((): Record<string, string> => {
    let metrics: Record<string, string> = {};

    if (selectedTab === 'income' && financialData?.income_statements?.[0]) {
      const stmt = financialData.income_statements[0];
      Object.keys(stmt).forEach((key) => {
        if (
          key !== 'date' &&
          key !== 'symbol' &&
          key !== 'currency' &&
          key !== 'reported_currency' &&
          key !== 'id' &&
          key !== 'fiscal_year' &&
          key !== 'period' &&
          key !== 'created_at' &&
          key !== 'updated_at'
        ) {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    } else if (selectedTab === 'balance' && financialData?.balance_sheets?.[0]) {
      const stmt = financialData.balance_sheets[0];
      Object.keys(stmt).forEach((key) => {
        if (
          key !== 'date' &&
          key !== 'symbol' &&
          key !== 'currency' &&
          key !== 'reported_currency' &&
          key !== 'id' &&
          key !== 'fiscal_year' &&
          key !== 'period' &&
          key !== 'created_at' &&
          key !== 'updated_at'
        ) {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    } else if (selectedTab === 'cashflow' && financialData?.cash_flow_statements?.[0]) {
      const stmt = financialData.cash_flow_statements[0];
      Object.keys(stmt).forEach((key) => {
        if (
          key !== 'date' &&
          key !== 'symbol' &&
          key !== 'currency' &&
          key !== 'reported_currency' &&
          key !== 'id' &&
          key !== 'fiscal_year' &&
          key !== 'period' &&
          key !== 'created_at' &&
          key !== 'updated_at'
        ) {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    } else if (selectedTab === 'ratios' && financialData?.financial_ratios?.[0]) {
      const stmt = financialData.financial_ratios[0];
      Object.keys(stmt).forEach((key) => {
        if (
          key !== 'date' &&
          key !== 'symbol' &&
          key !== 'currency' &&
          key !== 'reported_currency' &&
          key !== 'id' &&
          key !== 'fiscal_year' &&
          key !== 'period' &&
          key !== 'created_at' &&
          key !== 'updated_at'
        ) {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    } else if (selectedTab === 'metrics' && financialData?.key_metrics?.[0]) {
      const stmt = financialData.key_metrics[0];
      Object.keys(stmt).forEach((key) => {
        if (
          key !== 'date' &&
          key !== 'symbol' &&
          key !== 'currency' &&
          key !== 'reported_currency' &&
          key !== 'id' &&
          key !== 'fiscal_year' &&
          key !== 'period' &&
          key !== 'created_at' &&
          key !== 'updated_at'
        ) {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    } else if (selectedTab === 'dividend' && financialData?.dividends?.[0]) {
      const stmt = financialData.dividends[0];
      Object.keys(stmt).forEach((key) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          metrics[key] =
            key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
        }
      });
    }

    return metrics;
  }, [selectedTab, financialData]);

  // Get chart data for selected metric
  const getChartDataForMetric = React.useCallback((): any[] => {
    if (!activeMetric) return [];

    let data: any[] = [];

    if (selectedTab === 'income' && financialData?.income_statements) {
      data = financialData.income_statements
        .filter((s) => (timeframe === 'yearly' ? s.period === 'FY' : s.period !== 'FY'))
        .map((stmt) => ({
          label: `${stmt.period} ${stmt.fiscal_year}`,
          value: (stmt as any)[activeMetric],
          year: stmt.fiscal_year,
        }))
        .sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (selectedTab === 'balance' && financialData?.balance_sheets) {
      data = financialData.balance_sheets
        .filter((s) => (timeframe === 'yearly' ? s.period === 'FY' : s.period !== 'FY'))
        .map((stmt) => ({
          label: `${stmt.period} ${stmt.fiscal_year}`,
          value: (stmt as any)[activeMetric],
          year: stmt.fiscal_year,
        }))
        .sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (selectedTab === 'cashflow' && financialData?.cash_flow_statements) {
      data = financialData.cash_flow_statements
        .filter((s) => (timeframe === 'yearly' ? s.period === 'FY' : s.period !== 'FY'))
        .map((stmt) => ({
          label: `${stmt.period} ${stmt.fiscal_year}`,
          value: (stmt as any)[activeMetric],
          year: stmt.fiscal_year,
        }))
        .sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (selectedTab === 'ratios' && financialData?.financial_ratios) {
      data = financialData.financial_ratios
        .filter((s) => (timeframe === 'yearly' ? s.period === 'FY' : s.period !== 'FY'))
        .map((stmt) => ({
          label: `${stmt.period} ${stmt.fiscal_year}`,
          value: (stmt as any)[activeMetric],
          year: stmt.fiscal_year,
        }))
        .sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (selectedTab === 'metrics' && financialData?.key_metrics) {
      data = financialData.key_metrics
        .filter((s) => (timeframe === 'yearly' ? s.period === 'FY' : s.period !== 'FY'))
        .map((stmt) => ({
          label: `${stmt.period} ${stmt.fiscal_year}`,
          value: (stmt as any)[activeMetric],
          year: stmt.fiscal_year,
        }))
        .sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (selectedTab === 'dividend' && financialData?.dividends) {
      data = financialData.dividends
        .map((stmt) => ({
          label: stmt.date,
          value: (stmt as any)[activeMetric],
          date: stmt.date,
        }))
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    }

    return data;
  }, [activeMetric, selectedTab, financialData, timeframe]);

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

  // Auto-select important properties based on tab
  const getDefaultMetricForTab = React.useCallback((): string => {
    const metrics = getAvailableMetrics();
    const metricKeys = Object.keys(metrics);

    if (metricKeys.length === 0) return '';

    // Define important properties for each tab
    const importantProps = {
      income: ['net_income', 'revenue', 'total_revenue', 'operating_income', 'income_before_taxes'],
      balance: [
        'total_assets',
        'total_liabilities',
        'stockholders_equity',
        'current_assets',
        'current_liabilities',
      ],
      cashflow: [
        'operating_cash_flow',
        'free_cash_flow',
        'investing_cash_flow',
        'financing_cash_flow',
      ],
      ratios: ['current_ratio', 'debt_to_equity', 'roe', 'roa', 'net_profit_margin'],
      metrics: ['market_cap', 'pe_ratio', 'price_to_book', 'enterprise_value', 'ev_revenue'],
      dividend: ['dividend_amount', 'dividend_value', 'amount', 'value'],
    };

    const tabImportant = importantProps[selectedTab as keyof typeof importantProps] || [];
    for (const prop of tabImportant) {
      if (metricKeys.includes(prop)) return prop;
    }

    // If no important property found, return first available
    return metricKeys[0];
  }, [selectedTab, getAvailableMetrics]);

  // Reset active metric when tab or available metrics change
  React.useEffect(() => {
    const defaultMetric = getDefaultMetricForTab();
    if (defaultMetric) {
      setActiveMetric(defaultMetric);
    }
  }, [selectedTab, financialData, getDefaultMetricForTab]);

  // Mock data for charts - in production, this would come from financialData
  const mockYearlyData = [
    { year: '2021', value: 365000 },
    { year: '2022', value: 394000 },
    { year: '2023', value: 383000 },
    { year: '2024', value: 420000 },
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  const availableMetrics = getAvailableMetrics();
  const filteredMetrics = React.useMemo(() => {
    if (!searchQuery) return availableMetrics;
    return Object.entries(availableMetrics)
      .filter(
        ([key, label]) =>
          key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .reduce(
        (acc, [key, label]) => {
          acc[key] = label;
          return acc;
        },
        {} as Record<string, string>,
      );
  }, [searchQuery, availableMetrics]);
  const currentChartData =
    getChartDataForMetric().length > 0 ? getChartDataForMetric() : mockYearlyData;

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
                {availableMetrics[activeMetric] || 'Metric'} Trend
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
              {/* Metric Select with Search */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600">Metric:</label>
                <Select value={activeMetric} onValueChange={setActiveMetric}>
                  <SelectTrigger className="w-72 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-72">
                    <div className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Input
                        placeholder="Search metrics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="h-9 text-sm mb-2"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {Object.entries(filteredMetrics).length > 0 ? (
                        Object.entries(filteredMetrics).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="text-sm">
                            {label}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">No metrics found</div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Type Switcher - Aligned with CompanyInsights style */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-indigo-200">
                <button
                  onClick={() => setChartType('bar')}
                  title="Bar Chart"
                  className={`p-1.5 rounded transition-all ${
                    chartType === 'bar'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  title="Line Chart"
                  className={`p-1.5 rounded transition-all ${
                    chartType === 'line'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <LineChartIcon className="w-4 h-4" />
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
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={formatYAxis} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      if (Math.abs(value) >= 1e9) {
                        return `$${(value / 1e9).toFixed(2)}B`;
                      }
                      if (Math.abs(value) >= 1e6) {
                        return `$${(value / 1e6).toFixed(2)}M`;
                      }
                      if (Math.abs(value) >= 1e3) {
                        return `$${(value / 1e3).toFixed(2)}K`;
                      }
                      return `$${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={formatYAxis} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      if (Math.abs(value) >= 1e9) {
                        return `$${(value / 1e9).toFixed(2)}B`;
                      }
                      if (Math.abs(value) >= 1e6) {
                        return `$${(value / 1e6).toFixed(2)}M`;
                      }
                      if (Math.abs(value) >= 1e3) {
                        return `$${(value / 1e3).toFixed(2)}K`;
                      }
                      return `$${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
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
