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
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { StockPriceRead } from '../../types/quote';

interface StockPriceChartProps {
  stock_prices?: StockPriceRead[] | null;
}

type TimePeriod = '5d' | '1m' | '3m' | '6m' | '1y' | '3y' | '5y';

const periodDays: Record<TimePeriod, number> = {
  '5d': 5,
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
  '3y': 1095,
  '5y': 1825,
};

const periodLabels: Record<TimePeriod, string> = {
  '5d': '5 Days',
  '1m': '1 Month',
  '3m': '3 Months',
  '6m': '6 Months',
  '1y': '1 Year',
  '3y': '3 Years',
  '5y': '5 Years',
};

// Sample data for demonstration with more realistic variability
const generateSampleData = (days: number) => {
  const data = [];
  const basePrice = 150;
  const today = new Date();

  // Generate realistic stock price with volatility
  let currentPrice = basePrice;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Multiple waves for more realistic trends
    const longTrend = Math.sin(i / 100) * 15; // Long term trend
    const mediumTrend = Math.sin(i / 30) * 8; // Medium term fluctuation
    const shortTrend = Math.sin(i / 10) * 4; // Short term volatility

    // Random walk for daily variation (more realistic)
    const randomWalk = (Math.random() - 0.5) * 6;

    // Combine all components
    const priceChange = longTrend + mediumTrend + shortTrend + randomWalk;
    currentPrice += priceChange * 0.1; // Smoothing factor

    // Add some volatility spikes occasionally
    if (Math.random() < 0.05) {
      currentPrice += (Math.random() - 0.5) * 8;
    }

    // Ensure realistic price range
    currentPrice = Math.max(basePrice * 0.7, Math.min(basePrice * 1.5, currentPrice));

    const dayHigh = currentPrice + Math.random() * 3;
    const dayLow = currentPrice - Math.random() * 3;
    const dayOpen = currentPrice - (Math.random() - 0.5) * 2;

    data.push({
      date,
      close_price: currentPrice,
      open_price: dayOpen,
      high_price: dayHigh,
      low_price: dayLow,
    });
  }

  return data;
};

export const StockPriceChart: React.FC<StockPriceChartProps> = ({ stock_prices }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('1m');

  // Use sample data if stock_prices is not provided
  const allData =
    stock_prices && stock_prices.length > 0 ? stock_prices : generateSampleData(periodDays['5y']);

  // Get the number of days for the selected period
  const daysToShow = periodDays[selectedPeriod];

  // Format data for chart based on selected period
  const chartData = allData.slice(-daysToShow).map((price) => ({
    date: new Date(price.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    open: Math.round(price.open_price * 100) / 100,
    close: Math.round(price.close_price * 100) / 100,
    high: Math.round(price.high_price * 100) / 100,
    low: Math.round(price.low_price * 100) / 100,
  }));

  // Calculate price change for the selected period
  const periodStartPrice = chartData.length > 0 ? chartData[0].open : 0;
  const periodEndPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const priceChange = periodEndPrice - periodStartPrice;
  const priceChangePercent = periodStartPrice > 0 ? (priceChange / periodStartPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-base font-semibold text-gray-800">
              Stock Price ({periodLabels[selectedPeriod]})
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 font-medium">Period Change:</span>
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
            {(Object.keys(periodDays) as TimePeriod[]).map((period) => (
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
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
                labelFormatter={(label: string) => `Date: ${label}`}
              />
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
