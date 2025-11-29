import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gift,
  LineChart,
  Plus,
  BarChart3,
  Newspaper,
  Calendar,
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { DashboardResponse } from '../types/user';
import { LoadingIndicator } from '../components/ui/loading-indicator';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitializedRef = useRef(false);

  // Fetch dashboard data
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const fetchData = async () => {
      try {
        // Fetch dashboard data
        const dashboard = await apiClient.getDashboard();
        setDashboardData(dashboard);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
  };

  const getCurrencySymbol = (currency: string) => {
    return currencySymbols[currency] || currency;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  // Calculate aggregated stats from dashboard data
  const aggregatedStats = useMemo(
    () => ({
      totalPortfolios: dashboardData?.total_portfolios || 0,
      totalInvested: dashboardData?.total_invested || 0,
      totalValue: dashboardData?.total_current_value || 0,
      totalGainLoss: dashboardData?.total_profit_loss || 0,
      totalDividends: dashboardData?.total_dividends || 0,
      totalStocks: 0, // This info isn't in dashboard response
    }),
    [dashboardData],
  );

  const gainLossPercent = useMemo(
    () =>
      aggregatedStats.totalInvested > 0
        ? ((aggregatedStats.totalGainLoss / aggregatedStats.totalInvested) * 100).toFixed(2)
        : '0.00',
    [aggregatedStats.totalInvested, aggregatedStats.totalGainLoss],
  );

  const isPositive = useMemo(
    () => aggregatedStats.totalGainLoss >= 0,
    [aggregatedStats.totalGainLoss],
  );

  if (loading) {
    return <LoadingIndicator message="Loading your portfolio data..." minHeight="min-h-screen" />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Title and Quick Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back to StockMate</h1>
          <p className="text-sm text-gray-600">
            {aggregatedStats.totalPortfolios === 0
              ? 'Start building your investment portfolio today'
              : `${aggregatedStats.totalPortfolios} portfolio${aggregatedStats.totalPortfolios !== 1 ? 's' : ''}`}
          </p>
        </div>
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={() => navigate('/app/holdings')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg text-sm"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Holdings
          </Button>
          <Button
            onClick={() => navigate('/app/dividend')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg text-sm"
          >
            <Gift className="w-3 h-3 mr-1" />
            Dividends
          </Button>
          <Button
            onClick={() => navigate('/app/watchlist')}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Watchlist
          </Button>
        </div>
      </div>

      {aggregatedStats.totalPortfolios === 0 ? (
        // Empty State
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 mx-auto">
              <BarChart3 className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Portfolios Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first portfolio to start tracking your investments, monitor performance,
              and achieve your financial goals.
            </p>
            <Button
              onClick={() => navigate('/holdings')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Portfolio
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Invested */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Total Invested</p>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregatedStats.totalInvested)}
                </p>
                <p className="text-[10px] text-gray-500">
                  Across {aggregatedStats.totalPortfolios} portfolio
                  {aggregatedStats.totalPortfolios !== 1 ? 's' : ''}
                </p>
              </div>
            </Card>

            {/* Current Value */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Current Value</p>
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <LineChart className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregatedStats.totalValue)}
                </p>
                <p className="text-[10px] text-gray-500">Real-time value</p>
              </div>
            </Card>

            {/* Total Gain/Loss */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Total Gain/Loss</p>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isPositive ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp
                        className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                      />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                <p
                  className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(aggregatedStats.totalGainLoss)}
                </p>
                <p className={`text-[10px] ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}
                  {gainLossPercent}%
                </p>
              </div>
            </Card>

            {/* Dividend Income */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">Dividend Income</p>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregatedStats.totalDividends)}
                </p>
                <p className="text-[10px] text-gray-500">All time</p>
              </div>
            </Card>
          </div>

          {/* Portfolio Summary Cards - Market Indices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData?.index_quotes && dashboardData.index_quotes.length > 0 ? (
              dashboardData.index_quotes.map((quote, idx) => {
                const isPositive = quote.change >= 0;
                const colorScheme =
                  idx === 0
                    ? {
                        bg: 'from-blue-50/40 to-blue-100/40',
                        border: 'border-blue-200/50',
                        text: 'text-blue-600',
                        dark: 'text-blue-900',
                        icon: 'bg-blue-600/10',
                        headerBg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
                        headerBorder: 'border-blue-100',
                      }
                    : idx === 1
                      ? {
                          bg: 'from-green-50/40 to-green-100/40',
                          border: 'border-green-200/50',
                          text: 'text-green-600',
                          dark: 'text-green-900',
                          icon: 'bg-green-600/10',
                          headerBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                          headerBorder: 'border-green-100',
                        }
                      : {
                          bg: 'from-purple-50/40 to-purple-100/40',
                          border: 'border-purple-200/50',
                          text: 'text-purple-600',
                          dark: 'text-purple-900',
                          icon: 'bg-purple-600/10',
                          headerBg: 'bg-gradient-to-r from-purple-50 to-pink-50',
                          headerBorder: 'border-purple-100',
                        };

                return (
                  <Card
                    key={idx}
                    className={`bg-gradient-to-br ${colorScheme.bg} shadow-lg rounded-2xl border ${colorScheme.border} overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                  >
                    {/* Header */}
                    <div
                      className={`${colorScheme.headerBg} px-4 py-3 border-b ${colorScheme.headerBorder}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className={`text-[10px] font-semibold ${colorScheme.text} uppercase tracking-wider`}
                          >
                            Index
                          </p>
                          <h3 className={`text-base font-bold ${colorScheme.dark} truncate`}>
                            {quote.symbol}
                          </h3>
                          <p className={`text-xs ${colorScheme.text} truncate`}>{quote.name}</p>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-lg ${colorScheme.icon} flex items-center justify-center flex-shrink-0`}
                        >
                          {isPositive ? (
                            <TrendingUp className={`w-5 h-5 ${colorScheme.text}`} />
                          ) : (
                            <TrendingDown className={`w-5 h-5 ${colorScheme.text}`} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-3 space-y-3">
                      {/* Price & Change Row */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p
                            className={`text-[10px] font-semibold ${colorScheme.text} uppercase tracking-wide`}
                          >
                            Price
                          </p>
                          <p className={`text-2xl font-bold ${colorScheme.dark}`}>
                            {quote.price.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {isPositive ? '↑' : '↓'} {Math.abs(quote.change_percent).toFixed(2)}%
                          </p>
                          <p
                            className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {isPositive ? '+' : ''}
                            {quote.change.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Day Range */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current border-opacity-10">
                        <div>
                          <p
                            className={`text-[9px] font-semibold ${colorScheme.text} uppercase tracking-wide mb-0.5`}
                          >
                            Low
                          </p>
                          <p className={`text-xs font-bold ${colorScheme.dark}`}>
                            {quote.day_low_price.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-[9px] font-semibold ${colorScheme.text} uppercase tracking-wide mb-0.5`}
                          >
                            High
                          </p>
                          <p className={`text-xs font-bold ${colorScheme.dark}`}>
                            {quote.day_high_price.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* 52-Week Range */}
                      {(quote.year_low_price || quote.year_high_price) && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current border-opacity-10">
                          {quote.year_low_price && (
                            <div>
                              <p
                                className={`text-[9px] font-semibold ${colorScheme.text} uppercase tracking-wide mb-0.5`}
                              >
                                52W Low
                              </p>
                              <p className={`text-xs font-bold ${colorScheme.dark}`}>
                                {quote.year_low_price.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                          {quote.year_high_price && (
                            <div>
                              <p
                                className={`text-[9px] font-semibold ${colorScheme.text} uppercase tracking-wide mb-0.5`}
                              >
                                52W High
                              </p>
                              <p className={`text-xs font-bold ${colorScheme.dark}`}>
                                {quote.year_high_price.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <>
                {/* Placeholder cards when no data */}
                <Card className="bg-gradient-to-br from-blue-50/40 to-blue-100/40 shadow-lg rounded-2xl border border-blue-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-blue-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                          Index
                        </p>
                        <h3 className="text-base font-bold text-blue-900 truncate">^GSPC</h3>
                        <p className="text-xs text-blue-600 truncate">S&P 500</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="text-xs text-blue-600 text-center py-2">Loading data...</div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-green-50/40 to-green-100/40 shadow-lg rounded-2xl border border-green-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">
                          Index
                        </p>
                        <h3 className="text-base font-bold text-green-900 truncate">^DJI</h3>
                        <p className="text-xs text-green-600 truncate">Dow Jones</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="text-xs text-green-600 text-center py-2">Loading data...</div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50/40 to-purple-100/40 shadow-lg rounded-2xl border border-purple-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-purple-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                          Index
                        </p>
                        <h3 className="text-base font-bold text-purple-900 truncate">^N225</h3>
                        <p className="text-xs text-purple-600 truncate">Nikkei 225</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="text-xs text-purple-600 text-center py-2">Loading data...</div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Latest News and Upcoming Events - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Latest News Section */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Latest News</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {dashboardData?.latest_news && dashboardData.latest_news.length > 0 ? (
                  dashboardData.latest_news.slice(0, 3).map((news: any, idx: number) => (
                    <div
                      key={idx}
                      className="pb-4 border-b border-gray-100 last:pb-0 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800 leading-snug flex-1 pr-2">
                          {news.title || 'Market Update'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{news.source || 'Financial News'}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No news available</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Upcoming Events Section - Combined Earnings & Dividends */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {dashboardData &&
                (dashboardData.earnings_calendar || dashboardData.dividends_calendar) ? (
                  (() => {
                    // Combine and sort earnings and dividends calendars
                    const events: Array<{
                      symbol: string;
                      title: string;
                      date: string;
                      type: 'Earnings' | 'Dividend';
                      isEarnings?: boolean;
                      isDividend?: boolean;
                    }> = [];

                    // Add earnings calendar events
                    if (dashboardData.earnings_calendar) {
                      dashboardData.earnings_calendar.forEach((earning: any) => {
                        events.push({
                          symbol: earning.symbol,
                          title: `${earning.symbol} Q Earnings`,
                          date: new Date(earning.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }),
                          type: 'Earnings',
                          isEarnings: true,
                        });
                      });
                    }

                    // Add dividends calendar events
                    if (dashboardData.dividends_calendar) {
                      dashboardData.dividends_calendar.forEach((dividend: any) => {
                        events.push({
                          symbol: dividend.symbol,
                          title: `${dividend.symbol} Dividend`,
                          date: new Date(dividend.payment_date || dividend.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          ),
                          type: 'Dividend',
                          isDividend: true,
                        });
                      });
                    }

                    // Sort by date
                    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    return events.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className="pb-4 border-b border-gray-100 last:pb-0 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-800 leading-snug flex-1 pr-2">
                            {event.title}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                              event.type === 'Earnings'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {event.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
