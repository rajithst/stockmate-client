import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CompanyTechnicalIndicatorRead } from '../../types';

export const TechnicalIndicators: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [technical_indicators, setTechnicalIndicators] = React.useState<
    CompanyTechnicalIndicatorRead[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTechnicalIndicators = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await apiClient.getTechnicalIndicators(symbol);
        // setTechnicalIndicators(response);
        setTechnicalIndicators([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load technical indicators');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalIndicators();
  }, [symbol]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-3" />
        <span className="text-gray-600 font-medium">Loading technical indicators...</span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-800">Error loading technical indicators</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!technical_indicators || technical_indicators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">No technical indicator data available</p>
      </div>
    );
  }

  // Sort by date
  const sortedData = [...technical_indicators].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Chart data with formatted dates
  const chartData = sortedData.map((item) => ({
    ...item,
    dateShort: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const indicators = [
    {
      key: 'simple_moving_average',
      label: 'Simple Moving Average (SMA)',
      color: '#6366f1',
      description: 'Average price over a set period',
    },
    {
      key: 'exponential_moving_average',
      label: 'Exponential Moving Average (EMA)',
      color: '#8b5cf6',
      description: 'Weighted moving average giving more weight to recent prices',
    },
    {
      key: 'weighted_moving_average',
      label: 'Weighted Moving Average (WMA)',
      color: '#ec4899',
      description: 'Moving average with linearly increasing weights',
    },
    {
      key: 'double_exponential_moving_average',
      label: 'Double Exponential Moving Average (DEMA)',
      color: '#06b6d4',
      description: 'Faster and smoother moving average',
    },
    {
      key: 'triple_exponential_moving_average',
      label: 'Triple Exponential Moving Average (TEMA)',
      color: '#14b8a6',
      description: 'Even faster and smoother moving average',
    },
    {
      key: 'relative_strength_index',
      label: 'Relative Strength Index (RSI)',
      color: '#f59e0b',
      description: 'Momentum oscillator (0-100 scale)',
    },
    {
      key: 'standard_deviation',
      label: 'Standard Deviation',
      color: '#10b981',
      description: 'Measures price volatility',
    },
    {
      key: 'williams_percent_r',
      label: 'Williams %R',
      color: '#ef4444',
      description: 'Momentum indicator (-100 to 0 scale)',
    },
    {
      key: 'average_directional_index',
      label: 'Average Directional Index (ADX)',
      color: '#a855f7',
      description: 'Measures trend strength (0-100 scale)',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Analysis Card */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-bold text-gray-800">Technical Analysis Summary</p>
          </div>
        </div>
        <div className="p-3">
          {(() => {
            const latestData = chartData[chartData.length - 1];
            if (!latestData) return null;

            const rsi = latestData.relative_strength_index;
            const adx = latestData.average_directional_index;
            const sma = latestData.simple_moving_average;
            const ema = latestData.exponential_moving_average;
            const currentPrice = sma || ema; // Use SMA or EMA as proxy for current price

            // Determine RSI signal
            let rsiSignal = '';
            let rsiColor = '';
            if (rsi !== null && rsi !== undefined) {
              if (rsi > 70) {
                rsiSignal = 'Overbought - Potential pullback';
                rsiColor = 'bg-red-100 border-red-200';
              } else if (rsi < 30) {
                rsiSignal = 'Oversold - Potential bounce';
                rsiColor = 'bg-green-100 border-green-200';
              } else if (rsi > 50) {
                rsiSignal = 'Strong momentum - Bullish';
                rsiColor = 'bg-blue-100 border-blue-200';
              } else {
                rsiSignal = 'Weak momentum - Bearish';
                rsiColor = 'bg-orange-100 border-orange-200';
              }
            }

            // Determine ADX signal (trend strength)
            let adxSignal = '';
            let adxColor = '';
            if (adx !== null && adx !== undefined) {
              if (adx > 50) {
                adxSignal = 'Very Strong Trend';
                adxColor = 'bg-purple-100 border-purple-200';
              } else if (adx > 40) {
                adxSignal = 'Strong Trend';
                adxColor = 'bg-indigo-100 border-indigo-200';
              } else if (adx > 25) {
                adxSignal = 'Moderate Trend';
                adxColor = 'bg-blue-100 border-blue-200';
              } else {
                adxSignal = 'Weak/No Trend';
                adxColor = 'bg-gray-100 border-gray-200';
              }
            }

            // Determine trend direction based on moving averages
            let trendSignal = '';
            let trendColor = '';
            if (sma !== null && sma !== undefined && ema !== null && ema !== undefined) {
              if (ema > sma) {
                trendSignal = 'Uptrend - EMA above SMA';
                trendColor = 'bg-green-100 border-green-200';
              } else {
                trendSignal = 'Downtrend - EMA below SMA';
                trendColor = 'bg-red-100 border-red-200';
              }
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* RSI Analysis */}
                {rsiSignal && (
                  <div className={`p-3 rounded-lg border ${rsiColor}`}>
                    <p className="text-xs text-gray-600 font-semibold">Momentum (RSI)</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{rsiSignal}</p>
                    {rsi !== null && rsi !== undefined && (
                      <p className="text-xs text-gray-600 mt-1">RSI: {rsi.toFixed(2)}</p>
                    )}
                  </div>
                )}

                {/* Trend Strength (ADX) */}
                {adxSignal && (
                  <div className={`p-3 rounded-lg border ${adxColor}`}>
                    <p className="text-xs text-gray-600 font-semibold">Trend Strength (ADX)</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{adxSignal}</p>
                    {adx !== null && adx !== undefined && (
                      <p className="text-xs text-gray-600 mt-1">ADX: {adx.toFixed(2)}</p>
                    )}
                  </div>
                )}

                {/* Trend Direction */}
                {trendSignal && (
                  <div className={`p-3 rounded-lg border ${trendColor}`}>
                    <p className="text-xs text-gray-600 font-semibold">Price Trend</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{trendSignal}</p>
                    {currentPrice && (
                      <p className="text-xs text-gray-600 mt-1">
                        Price: ${currentPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </Card>

      {/* Grid of indicator cards with charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {indicators.map((indicator) => {
          const hasData = chartData.some(
            (item) =>
              item[indicator.key as keyof typeof item] !== null &&
              item[indicator.key as keyof typeof item] !== undefined,
          );

          if (!hasData) return null;

          const latestData = chartData[chartData.length - 1];
          const latestValue = latestData?.[indicator.key as keyof typeof latestData] as number;
          const previousValue =
            chartData.length > 1
              ? (chartData[chartData.length - 2]?.[
                  indicator.key as keyof typeof latestData
                ] as number)
              : null;
          const valueChange =
            previousValue !== null && latestValue !== null ? latestValue - previousValue : null;
          const percentChange =
            previousValue !== null && latestValue !== null && previousValue !== 0
              ? ((latestValue - previousValue) / Math.abs(previousValue)) * 100
              : null;

          // Get indicator-specific signal
          let signal = '';
          let signalColor = '';

          if (indicator.key === 'relative_strength_index' && latestValue !== null) {
            if (latestValue > 70) {
              signal = 'Overbought';
              signalColor = 'bg-red-50 border-red-200';
            } else if (latestValue < 30) {
              signal = 'Oversold';
              signalColor = 'bg-green-50 border-green-200';
            } else if (latestValue > 50) {
              signal = 'Bullish';
              signalColor = 'bg-blue-50 border-blue-200';
            } else {
              signal = 'Bearish';
              signalColor = 'bg-orange-50 border-orange-200';
            }
          } else if (indicator.key === 'average_directional_index' && latestValue !== null) {
            if (latestValue > 40) {
              signal = 'Strong Trend';
              signalColor = 'bg-purple-50 border-purple-200';
            } else if (latestValue > 25) {
              signal = 'Moderate Trend';
              signalColor = 'bg-blue-50 border-blue-200';
            } else {
              signal = 'Weak Trend';
              signalColor = 'bg-gray-50 border-gray-200';
            }
          } else if (valueChange !== null) {
            if (valueChange > 0) {
              signal = 'Increasing';
              signalColor = 'bg-green-50 border-green-200';
            } else if (valueChange < 0) {
              signal = 'Decreasing';
              signalColor = 'bg-red-50 border-red-200';
            } else {
              signal = 'Stable';
              signalColor = 'bg-gray-50 border-gray-200';
            }
          }

          return (
            <Card
              key={indicator.key}
              className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{indicator.label}</p>
                      <p className="text-xs text-gray-500">{indicator.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                    {chartData.length} days
                  </Badge>
                </div>
              </div>

              {/* Signal Summary */}
              {signal && (
                <div className={`m-3 p-2.5 rounded-lg border ${signalColor}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Signal</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{signal}</p>
                    </div>
                    {valueChange !== null && (
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-semibold">Change</p>
                        <p
                          className={`text-sm font-bold mt-0.5 ${
                            valueChange > 0
                              ? 'text-green-600'
                              : valueChange < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {valueChange > 0 ? '+' : ''}
                          {valueChange.toFixed(2)}
                          {percentChange !== null &&
                            ` (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%)`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-3">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="dateShort"
                      stroke="#9ca3af"
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(chartData.length / 5)}
                    />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: any) => {
                        if (value === null || value === undefined) return 'N/A';
                        return typeof value === 'number' ? value.toFixed(2) : value;
                      }}
                      labelFormatter={(label: any) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={indicator.key}
                      stroke={indicator.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      name={indicator.label}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Latest Value Display */}
                <div className="mt-3 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Latest Value: </span>
                    {(() => {
                      const latestItem = chartData[chartData.length - 1];
                      const value = latestItem?.[indicator.key as keyof typeof latestItem];
                      if (value === null || value === undefined) return 'N/A';
                      if (typeof value === 'number') return value.toFixed(2);
                      if (typeof value === 'string') return value;
                      if (value instanceof Date) return value.toLocaleDateString();
                      return String(value);
                    })()}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
