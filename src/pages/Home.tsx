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

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'now';
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo}d ago`;
};

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

        // Add dummy data for latest news if not present
        if (
          !dashboard.latest_news ||
          (Array.isArray(dashboard.latest_news) && dashboard.latest_news.length === 0)
        ) {
          dashboard.latest_news = [
            {
              news_title: 'S&P 500 Reaches New High as Tech Stocks Rally',
              publisher: 'Bloomberg',
              published_date: new Date(Date.now() - 3600000).toISOString(),
              news_url: 'https://bloomberg.com',
              text: 'Major indices climb higher on optimistic earnings reports',
              sentiment: 'positive',
            },
            {
              news_title: 'Federal Reserve Signals Potential Rate Cuts in 2025',
              publisher: 'Reuters',
              published_date: new Date(Date.now() - 7200000).toISOString(),
              news_url: 'https://reuters.com',
              text: 'Fed officials hint at monetary policy adjustments ahead',
              sentiment: 'positive',
            },
            {
              news_title: 'Apple Reports Record Q4 Revenue, Beats Expectations',
              publisher: 'CNBC',
              published_date: new Date(Date.now() - 10800000).toISOString(),
              news_url: 'https://cnbc.com',
              text: 'Tech giant surpasses analyst estimates for quarterly earnings',
              sentiment: 'positive',
            },
            {
              news_title: 'Microsoft Cloud Revenue Growth Accelerates YoY',
              publisher: 'Financial Times',
              published_date: new Date(Date.now() - 14400000).toISOString(),
              news_url: 'https://ft.com',
              text: 'Azure services drive profitability gains',
              sentiment: 'positive',
            },
            {
              news_title: 'Tesla Stock Rallies on Strong Delivery Numbers',
              publisher: 'MarketWatch',
              published_date: new Date(Date.now() - 18000000).toISOString(),
              news_url: 'https://marketwatch.com',
              text: 'Electric vehicle manufacturer exceeds quarterly delivery targets',
              sentiment: 'positive',
            },
            {
              news_title: 'Tech Sector Volatility Increases Amid Profit Taking',
              publisher: 'WSJ',
              published_date: new Date(Date.now() - 21600000).toISOString(),
              news_url: 'https://wsj.com',
              text: 'Investors reassess valuations after recent gains',
              sentiment: 'neutral',
            },
            {
              news_title: 'Amazon Expands AI Capabilities in Cloud Services',
              publisher: 'TechCrunch',
              published_date: new Date(Date.now() - 25200000).toISOString(),
              news_url: 'https://techcrunch.com',
              text: 'AWS launches new machine learning features',
              sentiment: 'positive',
            },
            {
              news_title: 'Nvidia GPU Chip Demand Remains Strong',
              publisher: 'Seeking Alpha',
              published_date: new Date(Date.now() - 28800000).toISOString(),
              news_url: 'https://seekingalpha.com',
              text: 'AI boom continues to support semiconductor sector',
              sentiment: 'positive',
            },
            {
              news_title: 'Market Correction Expected as Bond Yields Rise',
              publisher: 'Benzinga',
              published_date: new Date(Date.now() - 32400000).toISOString(),
              news_url: 'https://benzinga.com',
              text: 'Rising rates put pressure on growth-heavy portfolios',
              sentiment: 'negative',
            },
            {
              news_title: 'Google Implements New Privacy Features',
              publisher: 'VentureBeat',
              published_date: new Date(Date.now() - 36000000).toISOString(),
              news_url: 'https://venturebeat.com',
              text: 'Major tech firm enhances data protection measures',
              sentiment: 'positive',
            },
            {
              news_title: 'JPMorgan Raises Bank Sector Outlook',
              publisher: "Investor's Business Daily",
              published_date: new Date(Date.now() - 39600000).toISOString(),
              news_url: 'https://ibd.com',
              text: 'Financial services expected to benefit from higher rates',
              sentiment: 'positive',
            },
            {
              news_title: 'Oil Prices Decline on Demand Concerns',
              publisher: 'Energy News',
              published_date: new Date(Date.now() - 43200000).toISOString(),
              news_url: 'https://energynews.com',
              text: 'Crude futures fall amid economic uncertainty',
              sentiment: 'negative',
            },
            {
              news_title: 'Berkshire Hathaway Increases Cash Holdings',
              publisher: 'Morningstar',
              published_date: new Date(Date.now() - 46800000).toISOString(),
              news_url: 'https://morningstar.com',
              text: 'Buffett signals cautious outlook on valuations',
              sentiment: 'neutral',
            },
            {
              news_title: 'Renewable Energy Stocks Hit Record Highs',
              publisher: 'CleanTechnica',
              published_date: new Date(Date.now() - 50400000).toISOString(),
              news_url: 'https://cleantechnica.com',
              text: 'Green energy sector rallies on policy support',
              sentiment: 'positive',
            },
            {
              news_title: 'Cryptocurrency Market Stabilizes After Volatility',
              publisher: 'CoinDesk',
              published_date: new Date(Date.now() - 54000000).toISOString(),
              news_url: 'https://coindesk.com',
              text: 'Digital assets find equilibrium after recent swings',
              sentiment: 'neutral',
            },
          ] as any;
        }

        // Add dummy data for earnings calendar if not present
        if (!dashboard.earnings_calendar || dashboard.earnings_calendar.length === 0) {
          dashboard.earnings_calendar = [
            {
              symbol: 'AAPL',
              date: new Date(Date.now() + 604800000).toISOString(),
              eps_actual: 6.05,
              eps_estimated: 5.85,
              revenue_actual: 119600000000,
              revenue_estimated: 117000000000,
            },
            {
              symbol: 'MSFT',
              date: new Date(Date.now() + 1209600000).toISOString(),
              eps_actual: 3.3,
              eps_estimated: 3.15,
              revenue_actual: 56400000000,
              revenue_estimated: 54000000000,
            },
            {
              symbol: 'GOOGL',
              date: new Date(Date.now() + 1814400000).toISOString(),
              eps_actual: 1.95,
              eps_estimated: 1.85,
              revenue_actual: 84300000000,
              revenue_estimated: 82000000000,
            },
          ] as any;
        }

        // Add dummy data for dividends calendar if not present
        if (!dashboard.dividends_calendar || dashboard.dividends_calendar.length === 0) {
          dashboard.dividends_calendar = [
            {
              symbol: 'KO',
              ex_dividend_date: new Date(Date.now() + 259200000).toISOString(),
              payment_date: new Date(Date.now() + 432000000).toISOString(),
              dividend: 0.42,
              dividend_yield: 2.85,
              frequency: 'quarterly',
            },
            {
              symbol: 'JNJ',
              ex_dividend_date: new Date(Date.now() + 604800000).toISOString(),
              payment_date: new Date(Date.now() + 864000000).toISOString(),
              dividend: 1.03,
              dividend_yield: 2.95,
              frequency: 'quarterly',
            },
            {
              symbol: 'PG',
              ex_dividend_date: new Date(Date.now() + 950400000).toISOString(),
              payment_date: new Date(Date.now() + 1296000000).toISOString(),
              dividend: 0.91,
              dividend_yield: 2.5,
              frequency: 'quarterly',
            },
          ] as any;
        }

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

      {aggregatedStats.totalPortfolios === 0 && (
        // Empty State Banner
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md rounded-xl border border-indigo-200 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">No Portfolios Yet</h3>
                <p className="text-xs text-gray-600">
                  Create your first portfolio to start tracking your investments
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/app/holdings')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs py-1 px-3 flex-shrink-0 ml-4"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create Portfolio
            </Button>
          </div>
        </Card>
      )}

      {aggregatedStats.totalPortfolios > 0 && (
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
        </>
      )}

      {/* Portfolio Summary Cards - Market Indices */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Market Indices</h2>
          </div>
        </div>
        <div className="p-6">
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
              <div className="col-span-full">
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 mx-auto">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Market Indices Available
                    </h3>
                    <p className="text-sm text-gray-500">
                      Market data will appear here when available
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Latest News and Upcoming Events - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest News Section - Expanded with more items */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Latest News</h2>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                {dashboardData?.latest_news?.length || 0} articles
              </span>
            </div>
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {dashboardData?.latest_news && dashboardData.latest_news.length > 0 ? (
                dashboardData.latest_news.slice(0, 15).map((news: any, idx: number) => {
                  const sentimentColors: Record<
                    string,
                    { bg: string; text: string; badge: string }
                  > = {
                    positive: {
                      bg: 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200/50 hover:border-green-300/70',
                      text: 'text-green-900',
                      badge: 'bg-green-100 text-green-700',
                    },
                    negative: {
                      bg: 'from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-red-200/50 hover:border-red-300/70',
                      text: 'text-red-900',
                      badge: 'bg-red-100 text-red-700',
                    },
                    neutral: {
                      bg: 'from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200/50 hover:border-gray-300/70',
                      text: 'text-gray-900',
                      badge: 'bg-gray-100 text-gray-700',
                    },
                  };

                  const sentiment = news.sentiment || 'neutral';
                  const colors = sentimentColors[sentiment] || sentimentColors.neutral;
                  const publishedTime = new Date(news.published_date);
                  const timeAgo = getTimeAgo(publishedTime);

                  return (
                    <div
                      key={idx}
                      className={`group p-3 rounded-lg bg-gradient-to-r ${colors.bg} border transition-all duration-300 cursor-pointer hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-800 group-hover:${colors.text} transition-colors line-clamp-2 flex-1">
                              {news.news_title || news.title || 'Market Update'}
                            </h3>
                            <span
                              className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-full whitespace-nowrap flex-shrink-0 ${colors.badge}`}
                            >
                              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                            {news.text || 'Financial market update'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full">
                              {news.publisher || news.source || 'Financial News'}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">{timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Newspaper className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">No News Available</h3>
                  <p className="text-xs text-gray-500">Latest market news will appear here</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Upcoming Events Section - Enhanced with more data */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
                {(() => {
                  let count = 0;
                  if (dashboardData?.earnings_calendar)
                    count += dashboardData.earnings_calendar.length;
                  if (dashboardData?.dividends_calendar)
                    count += dashboardData.dividends_calendar.length;
                  return count;
                })()}
              </span>
            </div>
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {(() => {
                // Combine and sort earnings and dividends calendars
                const events: Array<{
                  symbol: string;
                  title: string;
                  date: string;
                  type: 'Earnings' | 'Dividend';
                  eps_actual?: number;
                  eps_estimated?: number;
                  revenue_actual?: number;
                  revenue_estimated?: number;
                  dividend?: number;
                  dividend_yield?: number;
                }> = [];

                // Add earnings calendar events
                if (
                  dashboardData?.earnings_calendar &&
                  dashboardData.earnings_calendar.length > 0
                ) {
                  dashboardData.earnings_calendar.forEach((earning: any) => {
                    events.push({
                      symbol: earning.symbol,
                      title: `${earning.symbol} Q Earnings`,
                      date: new Date(earning.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      }),
                      type: 'Earnings',
                      eps_actual: earning.eps_actual,
                      eps_estimated: earning.eps_estimated,
                      revenue_actual: earning.revenue_actual,
                      revenue_estimated: earning.revenue_estimated,
                    });
                  });
                }

                // Add dividends calendar events
                if (
                  dashboardData?.dividends_calendar &&
                  dashboardData.dividends_calendar.length > 0
                ) {
                  dashboardData.dividends_calendar.forEach((dividend: any) => {
                    events.push({
                      symbol: dividend.symbol,
                      title: `${dividend.symbol} Dividend`,
                      date: new Date(dividend.payment_date || dividend.date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                        },
                      ),
                      type: 'Dividend',
                      dividend: dividend.dividend,
                      dividend_yield: dividend.dividend_yield,
                    });
                  });
                }

                // Sort by date
                events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // Show events or empty state
                if (events.length > 0) {
                  return events.slice(0, 10).map((event, idx) => {
                    const isEarnings = event.type === 'Earnings';
                    const epsMatch =
                      isEarnings &&
                      event.eps_actual !== undefined &&
                      event.eps_estimated !== undefined
                        ? event.eps_actual >= event.eps_estimated
                        : null;

                    return (
                      <div
                        key={idx}
                        className={`group p-3 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${
                          isEarnings
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200/50 hover:border-purple-300/70'
                            : 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200/50 hover:border-green-300/70'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Top Row: Symbol, Type Badge, Date */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {event.symbol}
                              </span>
                              <span
                                className={`inline-block px-2 py-0.5 text-[9px] font-semibold rounded-full whitespace-nowrap ${
                                  isEarnings
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {event.type}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                              {event.date}
                            </span>
                          </div>

                          {/* Bottom Row: Data Points */}
                          {isEarnings ? (
                            <div className="flex items-center justify-between gap-2 text-[10px]">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">EPS:</span>
                                <span
                                  className={`font-bold ${epsMatch ? 'text-green-700' : 'text-orange-700'}`}
                                >
                                  {event.eps_actual?.toFixed(2) || 'N/A'}
                                </span>
                                <span className="text-gray-500">
                                  vs {event.eps_estimated?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                              {epsMatch && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 font-semibold rounded">
                                  Beat
                                </span>
                              )}
                              {epsMatch === false && (
                                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 font-semibold rounded">
                                  Miss
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 text-[10px]">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Dividend:</span>
                                <span className="font-bold text-gray-900">
                                  ${event.dividend?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Yield:</span>
                                <span className="font-bold text-green-700">
                                  {event.dividend_yield?.toFixed(2) || 'N/A'}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">
                        No Upcoming Events
                      </h3>
                      <p className="text-xs text-gray-500">
                        Earnings and dividends will appear here
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
