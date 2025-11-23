import React from 'react';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CompanyAnalystEstimateRead } from '../../types';

interface AnalystEstimatesProps {
  analyst_estimates: CompanyAnalystEstimateRead[];
}

const formatValue = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  } else if (value >= 1) {
    return `$${value.toFixed(0)}M`;
  }
  return `$${value.toFixed(2)}M`;
};

export const AnalystEstimates: React.FC<AnalystEstimatesProps> = ({ analyst_estimates }) => {
  if (!analyst_estimates || analyst_estimates.length === 0) {
    return null;
  }

  // Process estimates to prepare chart data - use average estimates
  const chartData = analyst_estimates
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((estimate) => {
      const date = new Date(estimate.date);
      const year = date.getFullYear();

      return {
        year: year.toString(),
        date: estimate.date,
        revenue: estimate.revenue_avg ? estimate.revenue_avg / 1_000_000 : null, // Convert to millions
        netIncome: estimate.net_income_avg ? estimate.net_income_avg / 1_000_000 : null,
        eps: estimate.eps_avg ? parseFloat(estimate.eps_avg.toFixed(2)) : null,
      };
    })
    .filter((item) => item.revenue !== null || item.netIncome !== null || item.eps !== null);

  if (chartData.length === 0) {
    return null;
  }

  const revenueData = chartData.filter((d) => d.revenue !== null);
  const incomeData = chartData.filter((d) => d.netIncome !== null);
  const epsData = chartData.filter((d) => d.eps !== null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Revenue Estimates */}
      {revenueData.length > 0 && (
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base font-bold text-gray-800">Revenue Estimates</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Analyst consensus revenue forecast</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => {
                    if (value === null) return 'N/A';
                    return formatValue(value);
                  }}
                  labelFormatter={(label: any) => `Year: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Revenue"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Net Income Estimates */}
      {incomeData.length > 0 && (
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base font-bold text-gray-800">Income Estimates</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Analyst consensus net income forecast</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => {
                    if (value === null) return 'N/A';
                    return formatValue(value);
                  }}
                  labelFormatter={(label: any) => `Year: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="netIncome"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Net Income"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* EPS Estimates */}
      {epsData.length > 0 && (
        <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              <CardTitle className="text-base font-bold text-gray-800">EPS Estimates</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Analyst consensus earnings per share forecast
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={epsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => {
                    if (value === null) return 'N/A';
                    return `$${value.toFixed(2)}`;
                  }}
                  labelFormatter={(label: any) => `Year: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="eps"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="EPS"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
