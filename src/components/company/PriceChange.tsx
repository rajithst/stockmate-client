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
} from 'recharts';

export interface PriceChange {
  [key: string]: number;
}

export const PriceChangeChart: React.FC<{ data: PriceChange }> = ({ data }) => {
  const chartData = Object.entries(data)
    .filter(([period]) => period !== 'symbol') // skip symbol if present
    .map(([period, value]) => ({
      period,
      value: parseFloat(value.toFixed(2)),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Change (%)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? '#16a34a' : '#dc2626'} // green for positive, red for negative
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
