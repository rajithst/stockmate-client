import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import type { StockPriceChangeRead } from '../../types';

const ignore_fields = ['symbol', 'created_at', 'updated_at', 'id', 'company_id'];
const periodLabels: Record<string, string> = {
  one_day: '1 Day',
  five_day: '5 Days',
  one_month: '1 Month',
  three_month: '3 Months',
  six_month: '6 Months',
  one_year: '1 Year',
  three_year: '3 Years',
  five_year: '5 Years',
  ten_year: '10 Years',
  ytd: 'YTD',
};

export const PriceChangeChart: React.FC<{
  price_change: StockPriceChangeRead | null | undefined;
}> = ({ price_change }) => {
  // Handle null or missing data
  if (!price_change) {
    return (
      <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Price Change (%)</CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Performance over different periods
          </span>
        </CardHeader>
        <CardContent className="h-72 pb-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium">Price change data not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  const chartData = Object.entries(price_change)
    .filter(([period]) => !ignore_fields.includes(period)) // skip ignored fields
    .map(([period, value]) => ({
      period: periodLabels[period] || period,
      value: parseFloat(value.toFixed(2)),
    }));

  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800">Price Change (%)</CardTitle>
        <span className="text-xs text-gray-400 font-medium block mt-1">
          Performance over different periods
        </span>
      </CardHeader>
      <CardContent className="h-72 pb-8 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') return `${value}%`;
                return value;
              }}
            />
            <Bar dataKey="value">
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => {
                  if (typeof value === 'number') return value > 0 ? `+${value}%` : `${value}%`;
                  return value;
                }}
                style={{ fontSize: 13, fontWeight: 500, fill: '#374151' }}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? '#6366f1' : '#dc2626'} // indigo for positive, red for negative
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
