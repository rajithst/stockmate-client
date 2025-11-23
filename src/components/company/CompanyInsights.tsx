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

interface QuarterlyDataPoint {
  quarter: string;
  revenue: number;
  netIncome: number;
  grossMargin: number;
  operatingMargin: number;
  ebitda: number;
  fcf: number;
  eps: number;
  epsDiluted: number;
  sharesOutstanding: number;
  roe: number;
  debtToEquity: number;
  totalDebt: number;
  operatingCashFlow: number;
  marketCap: number;
  dividendYield: number;
}

export const CompanyInsights: React.FC = () => {
  // Quarterly historical data (12 quarters)
  const quarterlyData: QuarterlyDataPoint[] = [
    {
      quarter: 'Q1 22',
      revenue: 98.6,
      netIncome: 24.9,
      grossMargin: 43.2,
      operatingMargin: 29.5,
      ebitda: 32.1,
      fcf: 18.0,
      eps: 6.18,
      epsDiluted: 5.98,
      sharesOutstanding: 4.03,
      roe: 33.2,
      debtToEquity: 0.42,
      totalDebt: 38.8,
      operatingCashFlow: 26.0,
      marketCap: 2980.0,
      dividendYield: 0.85,
    },
    {
      quarter: 'Q2 22',
      revenue: 98.6,
      netIncome: 24.9,
      grossMargin: 43.2,
      operatingMargin: 29.5,
      ebitda: 32.1,
      fcf: 18.0,
      eps: 6.18,
      epsDiluted: 5.98,
      sharesOutstanding: 4.03,
      roe: 33.2,
      debtToEquity: 0.42,
      totalDebt: 38.8,
      operatingCashFlow: 26.0,
      marketCap: 2980.0,
      dividendYield: 0.85,
    },
    {
      quarter: 'Q3 22',
      revenue: 98.6,
      netIncome: 24.9,
      grossMargin: 43.2,
      operatingMargin: 29.5,
      ebitda: 32.1,
      fcf: 18.0,
      eps: 6.18,
      epsDiluted: 5.98,
      sharesOutstanding: 4.03,
      roe: 33.2,
      debtToEquity: 0.42,
      totalDebt: 38.8,
      operatingCashFlow: 26.0,
      marketCap: 2980.0,
      dividendYield: 0.85,
    },
    {
      quarter: 'Q4 22',
      revenue: 98.6,
      netIncome: 24.9,
      grossMargin: 43.2,
      operatingMargin: 29.5,
      ebitda: 32.1,
      fcf: 18.0,
      eps: 6.18,
      epsDiluted: 5.98,
      sharesOutstanding: 4.03,
      roe: 33.2,
      debtToEquity: 0.42,
      totalDebt: 38.8,
      operatingCashFlow: 26.0,
      marketCap: 2980.0,
      dividendYield: 0.85,
    },
    {
      quarter: 'Q1 23',
      revenue: 95.8,
      netIncome: 24.2,
      grossMargin: 44.1,
      operatingMargin: 30.2,
      ebitda: 31.2,
      fcf: 17.2,
      eps: 6.08,
      epsDiluted: 5.88,
      sharesOutstanding: 3.99,
      roe: 32.1,
      debtToEquity: 0.4,
      totalDebt: 36.8,
      operatingCashFlow: 25.0,
      marketCap: 3150.0,
      dividendYield: 0.88,
    },
    {
      quarter: 'Q2 23',
      revenue: 95.8,
      netIncome: 24.2,
      grossMargin: 44.1,
      operatingMargin: 30.2,
      ebitda: 31.2,
      fcf: 17.2,
      eps: 6.08,
      epsDiluted: 5.88,
      sharesOutstanding: 3.99,
      roe: 32.1,
      debtToEquity: 0.4,
      totalDebt: 36.8,
      operatingCashFlow: 25.0,
      marketCap: 3150.0,
      dividendYield: 0.88,
    },
    {
      quarter: 'Q3 23',
      revenue: 95.8,
      netIncome: 24.2,
      grossMargin: 44.1,
      operatingMargin: 30.2,
      ebitda: 31.2,
      fcf: 17.2,
      eps: 6.08,
      epsDiluted: 5.88,
      sharesOutstanding: 3.99,
      roe: 32.1,
      debtToEquity: 0.4,
      totalDebt: 36.8,
      operatingCashFlow: 25.0,
      marketCap: 3150.0,
      dividendYield: 0.88,
    },
    {
      quarter: 'Q4 23',
      revenue: 95.8,
      netIncome: 24.2,
      grossMargin: 44.1,
      operatingMargin: 30.2,
      ebitda: 31.2,
      fcf: 17.2,
      eps: 6.08,
      epsDiluted: 5.88,
      sharesOutstanding: 3.99,
      roe: 32.1,
      debtToEquity: 0.4,
      totalDebt: 36.8,
      operatingCashFlow: 25.0,
      marketCap: 3150.0,
      dividendYield: 0.88,
    },
    {
      quarter: 'Q1 24',
      revenue: 105.0,
      netIncome: 28.6,
      grossMargin: 45.2,
      operatingMargin: 31.4,
      ebitda: 34.5,
      fcf: 20.6,
      eps: 7.28,
      epsDiluted: 7.08,
      sharesOutstanding: 3.96,
      roe: 36.8,
      debtToEquity: 0.35,
      totalDebt: 32.5,
      operatingCashFlow: 28.2,
      marketCap: 3400.0,
      dividendYield: 0.92,
    },
    {
      quarter: 'Q2 24',
      revenue: 105.0,
      netIncome: 28.6,
      grossMargin: 45.2,
      operatingMargin: 31.4,
      ebitda: 34.5,
      fcf: 20.6,
      eps: 7.28,
      epsDiluted: 7.08,
      sharesOutstanding: 3.96,
      roe: 36.8,
      debtToEquity: 0.35,
      totalDebt: 32.5,
      operatingCashFlow: 28.2,
      marketCap: 3400.0,
      dividendYield: 0.92,
    },
    {
      quarter: 'Q3 24',
      revenue: 105.0,
      netIncome: 28.6,
      grossMargin: 45.2,
      operatingMargin: 31.4,
      ebitda: 34.5,
      fcf: 20.6,
      eps: 7.28,
      epsDiluted: 7.08,
      sharesOutstanding: 3.96,
      roe: 36.8,
      debtToEquity: 0.35,
      totalDebt: 32.5,
      operatingCashFlow: 28.2,
      marketCap: 3400.0,
      dividendYield: 0.92,
    },
    {
      quarter: 'Q4 24',
      revenue: 105.1,
      netIncome: 28.7,
      grossMargin: 45.3,
      operatingMargin: 31.5,
      ebitda: 34.6,
      fcf: 20.7,
      eps: 7.3,
      epsDiluted: 7.1,
      sharesOutstanding: 3.95,
      roe: 37.2,
      debtToEquity: 0.35,
      totalDebt: 32.5,
      operatingCashFlow: 28.3,
      marketCap: 3650.0,
      dividendYield: 0.92,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: Revenue Trend & Net Income Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base font-bold text-gray-800">Revenue Trend</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total sales performance over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Net Income Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base font-bold text-gray-800">Net Income Trend</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Bottom-line profitability over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="netIncome"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Net Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Gross Profit Margin & Operating Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gross Profit Margin */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Gross Profit Margin
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Production efficiency after COGS</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operating Margin */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-600" />
              <CardTitle className="text-base font-bold text-gray-800">Operating Margin</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Operational efficiency and profitability</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
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
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: EBITDA Trend & Free Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EBITDA Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-base font-bold text-gray-800">EBITDA Trend</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Operating earnings before financing</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="ebitda"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="EBITDA"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Free Cash Flow */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-600" />
              <CardTitle className="text-base font-bold text-gray-800">Free Cash Flow</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Cash available for dividends and debt</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="fcf"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="FCF"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: EPS & Diluted EPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings Per Share */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Earnings Per Share
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Profit allocated to each share</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diluted EPS */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base font-bold text-gray-800">Diluted EPS</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">EPS including potential share dilution</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
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
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Shares Outstanding & Return on Equity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shares Outstanding */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Shares Outstanding
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total shares owned by shareholders</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `${value.toFixed(2)}B`}
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Return on Equity */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-lime-50 via-white to-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-lime-600" />
              <CardTitle className="text-base font-bold text-gray-800">Return on Equity</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">How efficiently profit is generated</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
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
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
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
          </CardContent>
        </Card>

        {/* Total Debt Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base font-bold text-gray-800">Total Debt Trend</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total liabilities and debt burden</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="totalDebt"
                  stroke="#e11d48"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total Debt"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 7: Operating Cash Flow & Market Cap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Operating Cash Flow */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Operating Cash Flow
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Cash generated from operations</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(1)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="operatingCashFlow"
                  stroke="#0891b2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Operating CF"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Cap Trend */}
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-violet-600" />
              <CardTitle className="text-base font-bold text-gray-800">Market Cap Trend</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total market value of company</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toFixed(0)}B`}
                />
                <Line
                  type="monotone"
                  dataKey="marketCap"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Market Cap"
                />
              </LineChart>
            </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="quarter" stroke="#9ca3af" fontSize={12} />
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
        </CardContent>
      </Card>
    </div>
  );
};
