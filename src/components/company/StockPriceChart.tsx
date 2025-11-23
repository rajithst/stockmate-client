import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Clock, BarChart3 } from 'lucide-react';
import type { StockPriceRead } from '../../types/quote';

interface StockPriceChartProps {
  stock_prices?: StockPriceRead[] | null;
}

type TimePeriod = '5d' | '1m' | '3m' | '6m' | 'ytd' | '1y' | '3y' | '5y';

const periodLabels: Record<TimePeriod, string> = {
  '5d': '5 Days',
  '1m': '1 Month',
  '3m': '3 Months',
  '6m': '6 Months',
  ytd: 'YTD',
  '1y': '1 Year',
  '3y': '3 Years',
  '5y': '5 Years',
};

export const StockPriceChart: React.FC<StockPriceChartProps> = ({ stock_prices }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('1m');

  // Use sample data if stock_prices is not provided
  let allData = stock_prices && stock_prices.length > 0 ? stock_prices : [];

  // IMPORTANT: Data comes sorted in DESCENDING order (newest first)
  // Reverse it to ASCENDING order (oldest first) for proper chart display
  allData = [...allData].reverse();

  // Calculate cutoff date based on selected period
  const getDateCutoff = (period: TimePeriod): Date => {
    const today = new Date();
    const cutoff = new Date(today);

    switch (period) {
      case '5d':
        cutoff.setDate(today.getDate() - 5);
        break;
      case '1m':
        cutoff.setMonth(today.getMonth() - 1);
        break;
      case '3m':
        cutoff.setMonth(today.getMonth() - 3);
        break;
      case '6m':
        cutoff.setMonth(today.getMonth() - 6);
        break;
      case 'ytd':
        cutoff.setFullYear(today.getFullYear(), 0, 1); // Set to January 1st of current year
        break;
      case '1y':
        cutoff.setFullYear(today.getFullYear() - 1);
        break;
      case '3y':
        cutoff.setFullYear(today.getFullYear() - 3);
        break;
      case '5y':
        cutoff.setFullYear(today.getFullYear() - 5);
        break;
    }
    return cutoff;
  };

  const cutoffDate = getDateCutoff(selectedPeriod);

  // Filter data based on date cutoff (not fixed day count)
  // This ensures 1m = last month, 3m = last 3 months, etc.
  const filteredData = allData.filter((price) => {
    let dateObj: Date;
    if (price.date instanceof Date) {
      dateObj = price.date;
    } else if (typeof price.date === 'string') {
      const dateStr = price.date.trim();
      const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const day = parseInt(dateMatch[3]);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(dateStr);
      }
    } else {
      dateObj = new Date();
    }
    return dateObj >= cutoffDate;
  });

  // Format data for chart based on selected period
  const chartData = filteredData.map((price) => {
    let dateObj: Date;

    // Handle different date formats
    if (price.date instanceof Date) {
      dateObj = price.date;
    } else if (typeof price.date === 'string') {
      // Handle ISO 8601 format: "2025-06-10T00:00:00"
      const dateStr = price.date.trim();

      // Extract just the date part (2025-06-10)
      const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const day = parseInt(dateMatch[3]);
        // Manually construct date to avoid timezone offset issues
        dateObj = new Date(year, month - 1, day);
      } else {
        // Try generic date parsing for other formats
        dateObj = new Date(dateStr);
      }
    } else {
      dateObj = new Date();
    }

    // Format dates for display
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });

    const fullDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      date: formattedDate,
      fullDate: fullDate,
      open: Math.round(price.open_price * 100) / 100,
      close: Math.round(price.close_price * 100) / 100,
      high: Math.round(price.high_price * 100) / 100,
      low: Math.round(price.low_price * 100) / 100,
    };
  }); // Data is already in correct order (oldest to newest)

  // Calculate price change for the selected period using the filtered data
  const periodStartPrice = chartData.length > 0 ? chartData[0].close : 0;
  const periodEndPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const priceChange = periodEndPrice - periodStartPrice;
  const priceChangePercent = periodStartPrice > 0 ? (priceChange / periodStartPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-sky-50 via-white to-cyan-50 rounded-xl h-full flex flex-col">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Stock Price ({periodLabels[selectedPeriod]})
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Period Change:</span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {priceChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedPeriod === period ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period)}
                className={`text-xs px-2 py-1 h-7 ${
                  selectedPeriod === period
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                {period === '5d'
                  ? '5D'
                  : period === '1m'
                    ? '1M'
                    : period === '3m'
                      ? '3M'
                      : period === '6m'
                        ? '6M'
                        : period === 'ytd'
                          ? 'YTD'
                          : period === '1y'
                            ? '1Y'
                            : period === '3y'
                              ? '3Y'
                              : '5Y'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0 flex flex-col flex-1 min-h-0 gap-0">
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              {/* Tooltip with indicators */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4f46e5',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  padding: '8px',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
                labelFormatter={(label: string) => `Date: ${label}`}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900 border border-indigo-500 rounded-lg p-3 shadow-lg">
                        <p className="text-white font-semibold text-xs mb-2">{data.fullDate}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 text-gray-200">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            <span>
                              Close:{' '}
                              <span className="text-indigo-300 font-semibold">
                                ${data.close.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span>
                              High:{' '}
                              <span className="text-green-300 font-semibold">
                                ${data.high.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            <span>
                              Low:{' '}
                              <span className="text-red-300 font-semibold">
                                ${data.low.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            <span>
                              Open:{' '}
                              <span className="text-yellow-300 font-semibold">
                                ${data.open.toFixed(2)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Close price area (main) */}
              <Area
                type="monotone"
                dataKey="close"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorClose)"
                name="Close"
                isAnimationActive={false}
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Last updated - Bottom */}
        <div className="flex items-center justify-end pt-2 mt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
            <Clock className="w-3 h-3 text-gray-400" />
            Last updated:{' '}
            {new Date().toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
