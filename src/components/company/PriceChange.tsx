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
import { Clock } from 'lucide-react';
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

export const PriceChangeChart: React.FC<{ price_change: StockPriceChangeRead }> = ({
  price_change,
}) => {
  const chartData = Object.entries(price_change)
    .filter(([period]) => !ignore_fields.includes(period)) // skip ignored fields
    .map(([period, value]) => ({
      period: periodLabels[period] || period,
      value: parseFloat(value.toFixed(2)),
    }));

  // Format last updated date
  const lastUpdated = price_change.updated_at
    ? new Date(price_change.updated_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

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
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Bar dataKey="value">
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number) => (value > 0 ? `+${value}%` : `${value}%`)}
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
        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-end pt-3 absolute bottom-2 right-4">
            <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              Last updated: {lastUpdated}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
