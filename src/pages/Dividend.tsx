import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { TrendingUp, Calendar, DollarSign, Gift, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { apiClient } from '../api/client';
import type { PortfolioRead, PortfolioDividendHistoryRead } from '../types/user';
import { LoadingIndicator } from '../components/ui/loading-indicator';
import { NotificationToast } from '../components/ui/notification-toast';
import { useNotification } from '../lib/hooks/useNotification';

interface MonthlyDividend {
  year: number;
  month: number;
  monthName: string;
  totalAmount: number;
  payments: PortfolioDividendHistoryRead[];
}

const DividendPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<PortfolioRead[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
  const [dividendHistories, setDividendHistories] = useState<PortfolioDividendHistoryRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ name: '', currency: 'USD' });
  const hasInitializedRef = useRef(false);
  const { notifications, addNotification, removeNotification } = useNotification();

  // Fetch portfolios on mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const portfoliosData = await apiClient.getPortfolios();
        setPortfolios(portfoliosData);

        if (portfoliosData.length > 0) {
          const firstPortfolioId = portfoliosData[0].id;
          setSelectedPortfolioId(firstPortfolioId.toString());
        }
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Fetch portfolio detail when portfolio selection changes
  useEffect(() => {
    const fetchPortfolioDividends = async () => {
      if (!selectedPortfolioId) return;

      try {
        setLoading(true);
        const portfolioId = parseInt(selectedPortfolioId, 10);
        const dividends = await apiClient.getPortfolioDividends(portfolioId);
        setDividendHistories(dividends);
      } catch (err) {
        console.error('Failed to fetch portfolio dividends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDividends();
  }, [selectedPortfolioId]);

  const selectedPortfolio = portfolios.find((p) => p.id.toString() === selectedPortfolioId);

  // Get currency from dividend histories or use portfolio currency as fallback
  const portfolioCurrency = selectedPortfolio?.currency || 'USD';
  const dividendCurrency =
    dividendHistories.length > 0 ? dividendHistories[0].currency : portfolioCurrency;

  const openAddPortfolioModal = () => {
    setPortfolioForm({ name: '', currency: 'USD' });
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = async () => {
    if (!portfolioForm.name.trim()) return;

    try {
      setLoading(true);
      const newPortfolio = await apiClient.createPortfolio({
        name: portfolioForm.name,
        currency: portfolioForm.currency,
      });
      setPortfolios((prev) => [...prev, newPortfolio]);
      setSelectedPortfolioId(newPortfolio.id.toString());
      setShowPortfolioModal(false);
      addNotification('success', `Portfolio "${newPortfolio.name}" created successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create portfolio';
      addNotification('error', message);
      console.error('Error creating portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = dividendCurrency) => {
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹',
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Transform dividend data into monthly structure
  const transformDividendData = (): Record<number, MonthlyDividend[]> => {
    const byYear: Record<number, MonthlyDividend[]> = {};

    dividendHistories.forEach((dividend) => {
      const paymentDate = new Date(dividend.payment_date);
      const year = paymentDate.getFullYear();
      const month = paymentDate.getMonth() + 1;
      const monthName = paymentDate.toLocaleString('en-US', { month: 'long' });

      if (!byYear[year]) {
        byYear[year] = [];
      }

      // Check if month already exists
      let monthData = byYear[year].find((m) => m.year === year && m.month === month);
      if (!monthData) {
        monthData = {
          year,
          month,
          monthName,
          totalAmount: 0,
          payments: [],
        };
        byYear[year].push(monthData);
      }

      monthData.payments.push(dividend);
      monthData.totalAmount += dividend.dividend_amount;
    });

    // Sort months in descending order
    Object.keys(byYear).forEach((year) => {
      byYear[parseInt(year, 10)].sort((a, b) => b.month - a.month);
    });

    return byYear;
  };

  const dividendsByYear = transformDividendData();
  const availableYears = Object.keys(dividendsByYear)
    .map(Number)
    .sort((a, b) => b - a);
  const currentYearDividends = dividendsByYear[selectedYear] || [];

  // Calculate statistics
  const totalDividendIncome = dividendHistories.reduce(
    (sum, dividend) => sum + dividend.dividend_amount,
    0,
  );
  const currentYearTotal = currentYearDividends.reduce((sum, month) => sum + month.totalAmount, 0);
  const avgMonthlyDividend =
    currentYearDividends.length > 0 ? currentYearTotal / currentYearDividends.length : 0;
  const highestMonth =
    currentYearDividends.length > 0
      ? currentYearDividends.reduce((max, month) =>
          month.totalAmount > max.totalAmount ? month : max,
        )
      : { monthName: '-', totalAmount: 0 };

  // Prepare chart data (last 12 months)
  const allMonths = Object.values(dividendsByYear)
    .flat()
    .sort((a, b) => new Date(b.year, b.month).getTime() - new Date(a.year, a.month).getTime())
    .slice(0, 12)
    .reverse();

  const chartData = allMonths.map((m) => ({
    month: m.monthName.substring(0, 3),
    amount: m.totalAmount,
    year: m.year,
  }));

  if (loading) {
    return <LoadingIndicator message="Loading dividend data..." minHeight="min-h-[60vh]" />;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Loading State */}
      {loading ? (
        <LoadingIndicator message="Loading dividend data..." minHeight="min-h-[60vh]" />
      ) : (
        <>
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-5"></div>
            <Card className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
              <div className="relative p-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Gift className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Dividend Income
                      </h1>
                      <p className="text-[10px] text-gray-500">Track your dividend earnings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <label className="text-xs font-semibold text-gray-600">Portfolio:</label>
                    <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                      <SelectTrigger className="w-[180px] h-8 text-sm border-indigo-200 focus:ring-indigo-500">
                        <SelectValue placeholder="Select Portfolio" />
                      </SelectTrigger>
                      <SelectContent>
                        {portfolios.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={openAddPortfolioModal}
                      className="h-8 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      New Portfolio
                    </Button>
                  </div>
                </div>

                {/* Portfolio Details */}
                <div className="flex items-center gap-4 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Gift className="w-3 h-3 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-medium">Portfolio</p>
                      <p className="text-xs font-bold text-gray-800">
                        {selectedPortfolio?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-medium">Currency</p>
                      <p className="text-xs font-bold text-gray-800">
                        {selectedPortfolio?.currency || 'USD'}
                      </p>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-medium">Created</p>
                      <p className="text-xs font-bold text-gray-800">
                        {selectedPortfolio?.created_at
                          ? new Date(selectedPortfolio.created_at).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-4 gap-2.5">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2.5 border border-indigo-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <DollarSign className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600">Total Income</p>
                    </div>
                    <p className="text-lg font-bold text-indigo-600">
                      {formatCurrency(totalDividendIncome)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-2.5 border border-green-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600">This Year</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(currentYearTotal)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-2.5 border border-blue-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600">Avg Monthly</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(avgMonthlyDividend)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-2.5 border border-amber-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Gift className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600">Best Month</p>
                    </div>
                    <p className="text-xs font-bold text-amber-600">{highestMonth.monthName}</p>
                    <p className="text-[10px] text-gray-600">
                      {formatCurrency(highestMonth.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {portfolios.length === 0 ? (
            <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm relative z-0">
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 mx-auto">
                  <Gift className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Portfolios Yet</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Create a portfolio and dividends will automatically track for you.
                </p>
                <Button
                  onClick={openAddPortfolioModal}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Dividend Chart */}
              <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <h2 className="text-base font-bold text-gray-800">Monthly Dividend Income</h2>
                    </div>
                    <p className="text-[10px] text-gray-500">Last 12 months</p>
                  </div>
                </div>
                <div className="p-4">
                  {chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                        <TrendingUp className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        No Dividend Data Yet
                      </h3>
                      <p className="text-sm text-gray-600 text-center max-w-sm">
                        Once you receive dividends, they'll appear here in a beautiful chart showing
                        your income trends.
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: '#6b7280', fontSize: 11 }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis
                          tick={{ fill: '#6b7280', fontSize: 11 }}
                          axisLine={{ stroke: '#d1d5db' }}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), 'Amount']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="amount"
                          fill="url(#colorGradient)"
                          radius={[8, 8, 0, 0]}
                          name="Dividend"
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Year Selector and Monthly Breakdown */}
              <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border-b border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <h2 className="text-base font-bold text-gray-800">
                        Dividend Details by Month
                      </h2>
                    </div>
                    {availableYears.length > 0 && (
                      <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) => setSelectedYear(Number(value))}
                      >
                        <SelectTrigger className="w-[110px] h-8 text-sm border-purple-200 focus:ring-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  {currentYearDividends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        No Dividends in {selectedYear}
                      </h3>
                      <p className="text-sm text-gray-600 text-center max-w-sm">
                        {availableYears.length === 0
                          ? 'No dividend payments recorded yet. Start tracking your dividends!'
                          : `No dividend payments were received in ${selectedYear}. Check another year or keep tracking for future payments.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentYearDividends.map((monthData) => {
                        const monthKey = `${monthData.year}-${monthData.month}`;
                        const isExpanded = expandedMonth === monthKey;

                        return (
                          <div
                            key={monthKey}
                            className="rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/30 border border-gray-100 overflow-hidden hover:shadow-md transition"
                          >
                            <div
                              className="p-3 cursor-pointer"
                              onClick={() => setExpandedMonth(isExpanded ? null : monthKey)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-xs">
                                      {monthData.monthName.substring(0, 3)}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm text-gray-800">
                                      {monthData.monthName} {monthData.year}
                                    </h3>
                                    <p className="text-[10px] text-gray-500">
                                      {monthData.payments.length} dividend payment(s)
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-indigo-600">
                                      {formatCurrency(monthData.totalAmount)}
                                    </p>
                                  </div>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="bg-white/50 px-3 pb-3">
                                <div className="space-y-2">
                                  {monthData.payments.map((payment, index) => (
                                    <div
                                      key={index}
                                      className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-200 transition"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                            <span className="text-white font-bold text-xs">
                                              {payment.symbol.substring(0, 2)}
                                            </span>
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-sm text-gray-800">
                                              {payment.symbol}
                                            </h4>
                                            <p className="text-[10px] text-gray-500">
                                              Payment:{' '}
                                              {new Date(payment.payment_date).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-base font-bold text-green-600">
                                            {formatCurrency(
                                              payment.dividend_amount,
                                              payment.currency,
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                                        <div>
                                          <p className="text-[10px] text-gray-500 mb-0.5">
                                            Shares Owned
                                          </p>
                                          <p className="font-semibold text-sm text-gray-800">
                                            {payment.shares.toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-gray-500 mb-0.5">
                                            Per Share
                                          </p>
                                          <p className="font-semibold text-sm text-gray-800">
                                            {formatCurrency(
                                              payment.dividend_per_share,
                                              payment.currency,
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-gray-500 mb-0.5">
                                            Declaration Date
                                          </p>
                                          <p className="font-semibold text-sm text-gray-800">
                                            {new Date(
                                              payment.declaration_date,
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Create Portfolio Modal */}
          {showPortfolioModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Create Portfolio</h2>
                      <p className="text-xs text-indigo-100">
                        Add a new portfolio to track your dividends
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Portfolio Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Day Trading, Long Term, etc."
                      value={portfolioForm.name}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
                      className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Currency</label>
                    <Select
                      value={portfolioForm.currency}
                      onValueChange={(value) =>
                        setPortfolioForm({ ...portfolioForm, currency: value })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                  <Button
                    onClick={() => setShowPortfolioModal(false)}
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePortfolio}
                    disabled={!portfolioForm.name.trim()}
                    size="sm"
                    className="h-9 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Portfolio
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Toast */}
          <NotificationToast notifications={notifications} onRemove={removeNotification} />
        </>
      )}
    </div>
  );
};

export default DividendPage;
