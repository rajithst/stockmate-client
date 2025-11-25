import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Activity,
  AlertCircle,
  PieChart as PieChartIcon,
  Users,
  Target,
  TrendingDown,
  Zap,
  BarChart3,
  PiggyBank,
  DollarSignIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
import type { CompanyInsightsResponse } from '../../types';

interface CompanyInsightsProps {
  data: CompanyInsightsResponse | null | undefined;
  loading?: boolean;
}

const formatQuarterLabel = (year: number, quarter: string): string => {
  return `${quarter} ${year.toString().slice(-2)}`;
};

const formatValue = (value: number): string => {
  if (value === 0) return '$0';
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
};

interface ChartSwitcherProps {
  chartType: 'line' | 'bar';
  onChange: (type: 'line' | 'bar') => void;
}

const ChartSwitcher: React.FC<ChartSwitcherProps> = ({ chartType, onChange }) => (
  <div className="flex items-center gap-1.5 pl-2 border-l border-indigo-200">
    <button
      onClick={() => onChange('bar')}
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
      onClick={() => onChange('line')}
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
);

const EmptyChartMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[250px]">
    <BarChart3 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
    <p className="text-sm font-semibold text-gray-600">No data available</p>
    <p className="text-xs text-gray-500 mt-1">Data for this metric is not available</p>
  </div>
);

export const CompanyInsights: React.FC<CompanyInsightsProps> = ({ data, loading }) => {
  const [chartTypes, setChartTypes] = React.useState<Record<string, 'line' | 'bar'>>({
    revenue: 'bar',
    netIncome: 'bar',
    grossMargin: 'bar',
    operatingMargin: 'bar',
    ebitda: 'bar',
    fcf: 'bar',
    eps: 'bar',
    epsDiluted: 'bar',
    sharesOutstanding: 'bar',
    roe: 'bar',
    totalDebt: 'bar',
    operatingCashFlow: 'bar',
    marketCap: 'bar',
  });

  const handleChartTypeChange = (chartName: string, type: 'line' | 'bar') => {
    setChartTypes((prev) => ({
      ...prev,
      [chartName]: type,
    }));
  };

  React.useEffect(() => {
    console.log('CompanyInsights received data:', data);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4" />
        <span className="text-lg text-gray-600 font-medium">Loading insights...</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Find the longest array to use as the base for chart data
  const getAllArrays = () => [
    data.net_income,
    data.gross_profit_margin,
    data.operating_profit_margin,
    data.ebita,
    data.free_cash_flow,
    data.eps,
    data.eps_diluted,
    data.weighted_average_shs_out,
    data.return_on_equity,
    data.debt_to_equity_ratio,
    data.total_debt,
    data.operating_cash_flow,
    data.market_cap,
    data.dividend_yield,
  ];

  const arrays = getAllArrays();
  const maxLength = Math.max(...arrays.map((arr) => arr?.length || 0), 0);

  if (maxLength === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Insights Data Available</h3>
        <p className="text-sm text-gray-600 text-center max-w-sm">
          Financial insights metrics are not available for this company at the moment
        </p>
      </div>
    );
  }

  // Build chart data by iterating through the max length and safely accessing each array
  const createChartData = () => {
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const item = {
        label: '',
        netIncome: data.net_income?.[i]?.value || 0,
        grossMargin: data.gross_profit_margin?.[i]?.value || 0,
        operatingMargin: data.operating_profit_margin?.[i]?.value || 0,
        ebitda: data.ebita?.[i]?.value || 0,
        fcf: data.free_cash_flow?.[i]?.value || 0,
        eps: data.eps?.[i]?.value || 0,
        epsDiluted: data.eps_diluted?.[i]?.value || 0,
        sharesOutstanding: data.weighted_average_shs_out?.[i]?.value || 0,
        roe: data.return_on_equity?.[i]?.value || 0,
        debtToEquity: data.debt_to_equity_ratio?.[i]?.value || 0,
        totalDebt: data.total_debt?.[i]?.value || 0,
        operatingCashFlow: data.operating_cash_flow?.[i]?.value || 0,
        marketCap: data.market_cap?.[i]?.value || 0,
        dividendYield: data.dividend_yield?.[i]?.value || 0,
      };

      // Use the first available array item to get year and quarter for the label
      const labelSource =
        data.net_income?.[i] ||
        data.gross_profit_margin?.[i] ||
        data.operating_profit_margin?.[i] ||
        data.ebita?.[i] ||
        data.free_cash_flow?.[i] ||
        data.eps?.[i] ||
        data.eps_diluted?.[i] ||
        data.weighted_average_shs_out?.[i] ||
        data.return_on_equity?.[i] ||
        data.debt_to_equity_ratio?.[i] ||
        data.total_debt?.[i] ||
        data.operating_cash_flow?.[i] ||
        data.market_cap?.[i] ||
        data.dividend_yield?.[i];

      if (labelSource) {
        item.label = formatQuarterLabel(labelSource.year, labelSource.quarter);
      }

      result.push(item);
    }
    // Reverse so oldest data is on the left
    return result.reverse();
  };

  const chartData = createChartData();
  console.log('Chart data created:', chartData);
  console.log('Data net_income:', data.net_income);
  console.log('Data net_income length:', data.net_income?.length);

  return (
    <div className="space-y-4">
      {/* Row 1: Revenue Trend & Net Income Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-base font-bold text-gray-800">Revenue Trend</CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.revenue}
                onChange={(type) => handleChartTypeChange('revenue', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Total sales performance over time</p>
          </CardHeader>
          <CardContent>
            {data.net_income && data.net_income.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.revenue === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="marketCap" fill="#6366f1" name="Revenue" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="marketCap"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Revenue"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Net Income Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Net Income Trend
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.netIncome}
                onChange={(type) => handleChartTypeChange('netIncome', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Bottom-line profitability over time</p>
          </CardHeader>
          <CardContent>
            {data.net_income && data.net_income.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.netIncome === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="netIncome" fill="#16a34a" name="Net Income" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="netIncome"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Net Income"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Gross Profit Margin & Operating Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gross Profit Margin */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Gross Profit Margin
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.grossMargin}
                onChange={(type) => handleChartTypeChange('grossMargin', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Production efficiency after COGS</p>
          </CardHeader>
          <CardContent>
            {data.gross_profit_margin && data.gross_profit_margin.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.grossMargin === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Bar dataKey="grossMargin" fill="#f59e0b" name="Gross Margin %" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="grossMargin"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Gross Margin %"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Operating Margin */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Operating Margin
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.operatingMargin}
                onChange={(type) => handleChartTypeChange('operatingMargin', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Operational efficiency and profitability</p>
          </CardHeader>
          <CardContent>
            {data.operating_profit_margin && data.operating_profit_margin.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.operatingMargin === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Bar dataKey="operatingMargin" fill="#ec4899" name="Operating Margin %" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="operatingMargin"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Operating Margin %"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: EBITDA Trend & Free Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EBITDA Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-base font-bold text-gray-800">EBITDA Trend</CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.ebitda}
                onChange={(type) => handleChartTypeChange('ebitda', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Operating earnings before financing</p>
          </CardHeader>
          <CardContent>
            {data.ebita && data.ebita.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.ebitda === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="ebitda" fill="#a855f7" name="EBITDA" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="ebitda"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="EBITDA"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Free Cash Flow */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-600" />
                <CardTitle className="text-base font-bold text-gray-800">Free Cash Flow</CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.fcf}
                onChange={(type) => handleChartTypeChange('fcf', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Cash available for dividends and debt</p>
          </CardHeader>
          <CardContent>
            {data.free_cash_flow && data.free_cash_flow.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.fcf === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="fcf" fill="#06b6d4" name="Free Cash Flow" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="fcf"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Free Cash Flow"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: EPS & Diluted EPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings Per Share */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Earnings Per Share
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.eps}
                onChange={(type) => handleChartTypeChange('eps', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Profit allocated to each share</p>
          </CardHeader>
          <CardContent>
            {data.eps && data.eps.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.eps === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="eps" fill="#14b8a6" name="EPS" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="eps"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="EPS"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Diluted EPS */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSignIcon className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-base font-bold text-gray-800">Diluted EPS</CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.epsDiluted}
                onChange={(type) => handleChartTypeChange('epsDiluted', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">EPS including potential share dilution</p>
          </CardHeader>
          <CardContent>
            {data.eps_diluted && data.eps_diluted.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.epsDiluted === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="epsDiluted" fill="#6366f1" name="Diluted EPS" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="epsDiluted"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Diluted EPS"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Shares Outstanding & Return on Equity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shares Outstanding */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Shares Outstanding
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.sharesOutstanding}
                onChange={(type) => handleChartTypeChange('sharesOutstanding', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Total shares owned by shareholders</p>
          </CardHeader>
          <CardContent>
            {data.weighted_average_shs_out && data.weighted_average_shs_out.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.sharesOutstanding === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="sharesOutstanding" fill="#f97316" name="Shares Outstanding" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="sharesOutstanding"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Shares Outstanding"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Return on Equity */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-lime-50 via-white to-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-lime-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Return on Equity
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.roe}
                onChange={(type) => handleChartTypeChange('roe', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">How efficiently profit is generated</p>
          </CardHeader>
          <CardContent>
            {data.return_on_equity && data.return_on_equity.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.roe === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Bar dataKey="roe" fill="#22c55e" name="ROE %" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="roe"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="ROE %"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 6: Debt-to-Equity & Total Debt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Debt-to-Equity Ratio */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Debt-to-Equity Ratio
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Financial leverage and risk level</p>
          </CardHeader>
          <CardContent>
            {data.debt_to_equity_ratio && data.debt_to_equity_ratio.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => `${value.toFixed(2)}`}
                  />
                  <Bar dataKey="debtToEquity" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Total Debt Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Total Debt Trend
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.totalDebt}
                onChange={(type) => handleChartTypeChange('totalDebt', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Total liabilities and debt burden</p>
          </CardHeader>
          <CardContent>
            {data.total_debt && data.total_debt.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.totalDebt === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="totalDebt" fill="#dc2626" name="Total Debt" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalDebt"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Total Debt"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 7: Operating Cash Flow & Market Cap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Operating Cash Flow */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Operating Cash Flow
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.operatingCashFlow}
                onChange={(type) => handleChartTypeChange('operatingCashFlow', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Cash generated from operations</p>
          </CardHeader>
          <CardContent>
            {data.operating_cash_flow && data.operating_cash_flow.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.operatingCashFlow === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="operatingCashFlow" fill="#0ea5e9" name="Operating Cash Flow" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="operatingCashFlow"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Operating Cash Flow"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>

        {/* Market Cap Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-violet-600" />
                <CardTitle className="text-base font-bold text-gray-800">
                  Market Cap Trend
                </CardTitle>
              </div>
              <ChartSwitcher
                chartType={chartTypes.marketCap}
                onChange={(type) => handleChartTypeChange('marketCap', type)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Total market value of company</p>
          </CardHeader>
          <CardContent>
            {data.market_cap && data.market_cap.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartTypes.marketCap === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="marketCap" fill="#7c3aed" name="Market Cap" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="marketCap"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Market Cap"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <EmptyChartMessage />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 8: Dividend Yield */}
      <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-base font-bold text-gray-800">Dividend Yield</CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">Annual dividend return to investors</p>
        </CardHeader>
        <CardContent>
          {data.dividend_yield && data.dividend_yield.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Bar
                  dataKey="dividendYield"
                  fill="#fbbf24"
                  radius={[6, 6, 0, 0]}
                  name="Dividend Yield"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartMessage />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
