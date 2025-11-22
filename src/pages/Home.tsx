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
import type { PortfolioRead, PortfolioDetail } from '../types/user';
import { LoadingIndicator } from '../components/ui/loading-indicator';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioRead[]>([]);
  const [portfolioDetails, setPortfolioDetails] = useState<Map<number, PortfolioDetail>>(new Map());
  const [loading, setLoading] = useState(true);
  const hasInitializedRef = useRef(false);

  // Fetch portfolios and their details
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const fetchPortfoliosAndDetails = async () => {
      try {
        const portfoliosData = await apiClient.getPortfolios();
        setPortfolios(portfoliosData);

        // Fetch details for each portfolio
        const detailsMap = new Map<number, PortfolioDetail>();
        for (const portfolio of portfoliosData) {
          try {
            const detail = await apiClient.getPortfolioDetail(portfolio.id);
            detailsMap.set(portfolio.id, detail);
          } catch (err) {
            console.error(`Failed to fetch details for portfolio ${portfolio.id}:`, err);
          }
        }
        setPortfolioDetails(detailsMap);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
        setLoading(false);
      }
    };

    fetchPortfoliosAndDetails();
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

  // Calculate aggregated stats
  const aggregatedStats = useMemo(
    () => ({
      totalPortfolios: portfolios.length,
      totalInvested: portfolios.reduce((sum, p) => {
        const detail = portfolioDetails.get(p.id);
        return sum + (detail?.total_invested || 0);
      }, 0),
      totalValue: portfolios.reduce((sum, p) => {
        const detail = portfolioDetails.get(p.id);
        return sum + (detail?.total_value || 0);
      }, 0),
      totalGainLoss: portfolios.reduce((sum, p) => {
        const detail = portfolioDetails.get(p.id);
        return sum + (detail?.total_gain_loss || 0);
      }, 0),
      totalDividends: portfolios.reduce((sum, p) => {
        const detail = portfolioDetails.get(p.id);
        return sum + (detail?.dividends_received || 0);
      }, 0),
      totalStocks: portfolios.reduce((sum, p) => {
        const detail = portfolioDetails.get(p.id);
        return sum + (detail?.holding_performances.length || 0);
      }, 0),
    }),
    [portfolios, portfolioDetails],
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
            {portfolios.length === 0
              ? 'Start building your investment portfolio today'
              : `${aggregatedStats.totalPortfolios} portfolio${aggregatedStats.totalPortfolios !== 1 ? 's' : ''} • ${aggregatedStats.totalStocks} holdings`}
          </p>
        </div>
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={() => navigate('/holdings')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg text-sm"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Holdings
          </Button>
          <Button
            onClick={() => navigate('/dividend')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg text-sm"
          >
            <Gift className="w-3 h-3 mr-1" />
            Dividends
          </Button>
          <Button
            onClick={() => navigate('/watchlist')}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Watchlist
          </Button>
        </div>
      </div>

      {portfolios.length === 0 ? (
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

          {/* Portfolio Summary Cards - Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* S&P 500 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-2xl border border-blue-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    S&P 500
                  </h3>
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-900">4,783.45</p>
                  <p className="text-xs text-blue-600 mt-1">↑ +2.45% today</p>
                </div>
              </div>
            </Card>

            {/* Dow Jones */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-2xl border border-green-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                    Dow Jones
                  </h3>
                  <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-900">37,291.82</p>
                  <p className="text-xs text-green-600 mt-1">↑ +1.82% today</p>
                </div>
              </div>
            </Card>

            {/* Nikkei 225 */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-2xl border border-purple-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    Nikkei 225
                  </h3>
                  <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-900">32,654.31</p>
                  <p className="text-xs text-purple-600 mt-1">↑ +0.95% today</p>
                </div>
              </div>
            </Card>
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
                {[
                  {
                    title: 'Market Update: Tech Sector Rally',
                    source: 'Market News',
                    time: '2 hours ago',
                    category: 'Market',
                  },
                  {
                    title: 'Fed Signals Pause in Rate Hikes',
                    source: 'Financial Times',
                    time: '4 hours ago',
                    category: 'Economy',
                  },
                  {
                    title: 'Your Dividend Stock Up 3.2%',
                    source: 'Portfolio Alert',
                    time: '1 hour ago',
                    category: 'Portfolio',
                  },
                ].map((news, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-100 last:pb-0 last:border-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 leading-snug flex-1 pr-2">
                        {news.title}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          news.category === 'Market'
                            ? 'bg-blue-100 text-blue-700'
                            : news.category === 'Economy'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {news.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {news.source} • {news.time}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Events Section */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    title: 'Apple Q4 Earnings',
                    date: 'Jan 25, 2025',
                    time: '4:30 PM EST',
                    type: 'Earnings',
                  },
                  {
                    title: 'Federal Reserve Meeting',
                    date: 'Jan 29, 2025',
                    time: '2:00 PM EST',
                    type: 'Economic',
                  },
                  {
                    title: 'Microsoft Dividend Payment',
                    date: 'Feb 13, 2025',
                    time: 'Ex-Dividend',
                    type: 'Dividend',
                  },
                ].map((event, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-100 last:pb-0 last:border-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 leading-snug flex-1 pr-2">
                        {event.title}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          event.type === 'Earnings'
                            ? 'bg-purple-100 text-purple-700'
                            : event.type === 'Economic'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {event.date} • {event.time}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
