import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { TrendingUp, Calendar, DollarSign, Gift, ChevronDown, ChevronUp } from 'lucide-react';
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

// Mock Data
const mockPortfolios = ['Main Portfolio', 'Retirement Fund', 'High Growth'];

interface PortfolioDetails {
  name: string;
  dateCreated: string;
  currency: string;
}

const portfolioDetailsMap: Record<string, PortfolioDetails> = {
  'Main Portfolio': {
    name: 'Main Portfolio',
    dateCreated: '2023-01-15',
    currency: 'USD',
  },
  'Retirement Fund': {
    name: 'Retirement Fund',
    dateCreated: '2022-06-20',
    currency: 'USD',
  },
  'High Growth': {
    name: 'High Growth',
    dateCreated: '2024-03-10',
    currency: 'USD',
  },
};

interface DividendPayment {
  symbol: string;
  shares: number;
  dividendPerShare: number;
  totalAmount: number;
  paymentDate: string;
  exDividendDate: string;
}

interface MonthlyDividend {
  year: number;
  month: number;
  monthName: string;
  totalAmount: number;
  payments: DividendPayment[];
}

// Mock dividend data
const mockDividendData: MonthlyDividend[] = [
  {
    year: 2024,
    month: 11,
    monthName: 'November',
    totalAmount: 2850,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-10-15',
        exDividendDate: '2024-10-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-10-20',
        exDividendDate: '2024-10-15',
      },
      {
        symbol: 'JNJ',
        shares: 15,
        dividendPerShare: 100,
        totalAmount: 1500,
        paymentDate: '2024-10-25',
        exDividendDate: '2024-10-18',
      },
    ],
  },
  {
    year: 2024,
    month: 10,
    monthName: 'October',
    totalAmount: 2850,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-10-15',
        exDividendDate: '2024-10-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-10-20',
        exDividendDate: '2024-10-15',
      },
      {
        symbol: 'JNJ',
        shares: 15,
        dividendPerShare: 100,
        totalAmount: 1500,
        paymentDate: '2024-10-25',
        exDividendDate: '2024-10-18',
      },
    ],
  },
  {
    year: 2024,
    month: 9,
    monthName: 'September',
    totalAmount: 3200,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-09-15',
        exDividendDate: '2024-09-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-09-20',
        exDividendDate: '2024-09-15',
      },
      {
        symbol: 'KO',
        shares: 20,
        dividendPerShare: 42.5,
        totalAmount: 850,
        paymentDate: '2024-09-25',
        exDividendDate: '2024-09-18',
      },
      {
        symbol: 'PEP',
        shares: 10,
        dividendPerShare: 100,
        totalAmount: 1000,
        paymentDate: '2024-09-28',
        exDividendDate: '2024-09-20',
      },
    ],
  },
  {
    year: 2024,
    month: 8,
    monthName: 'August',
    totalAmount: 2450,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-08-15',
        exDividendDate: '2024-08-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-08-20',
        exDividendDate: '2024-08-15',
      },
      {
        symbol: 'JNJ',
        shares: 15,
        dividendPerShare: 73.33,
        totalAmount: 1100,
        paymentDate: '2024-08-25',
        exDividendDate: '2024-08-18',
      },
    ],
  },
  {
    year: 2024,
    month: 7,
    monthName: 'July',
    totalAmount: 2850,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-07-15',
        exDividendDate: '2024-07-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-07-20',
        exDividendDate: '2024-07-15',
      },
      {
        symbol: 'JNJ',
        shares: 15,
        dividendPerShare: 100,
        totalAmount: 1500,
        paymentDate: '2024-07-25',
        exDividendDate: '2024-07-18',
      },
    ],
  },
  {
    year: 2024,
    month: 6,
    monthName: 'June',
    totalAmount: 1900,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-06-15',
        exDividendDate: '2024-06-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-06-20',
        exDividendDate: '2024-06-15',
      },
      {
        symbol: 'KO',
        shares: 13,
        dividendPerShare: 42.3,
        totalAmount: 550,
        paymentDate: '2024-06-25',
        exDividendDate: '2024-06-18',
      },
    ],
  },
  {
    year: 2024,
    month: 5,
    monthName: 'May',
    totalAmount: 3100,
    payments: [
      {
        symbol: 'AAPL',
        shares: 25,
        dividendPerShare: 24,
        totalAmount: 600,
        paymentDate: '2024-05-15',
        exDividendDate: '2024-05-10',
      },
      {
        symbol: 'MSFT',
        shares: 10,
        dividendPerShare: 75,
        totalAmount: 750,
        paymentDate: '2024-05-20',
        exDividendDate: '2024-05-15',
      },
      {
        symbol: 'JNJ',
        shares: 15,
        dividendPerShare: 113.33,
        totalAmount: 1700,
        paymentDate: '2024-05-25',
        exDividendDate: '2024-05-18',
      },
      {
        symbol: 'PEP',
        shares: 5,
        dividendPerShare: 10,
        totalAmount: 50,
        paymentDate: '2024-05-28',
        exDividendDate: '2024-05-20',
      },
    ],
  },
];

const DividendPage: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(mockPortfolios[0]);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const portfolioDetails = portfolioDetailsMap[selectedPortfolio];

  // Group dividends by year
  const dividendsByYear = mockDividendData.reduce(
    (acc, dividend) => {
      if (!acc[dividend.year]) {
        acc[dividend.year] = [];
      }
      acc[dividend.year].push(dividend);
      return acc;
    },
    {} as Record<number, MonthlyDividend[]>,
  );

  const availableYears = Object.keys(dividendsByYear)
    .map(Number)
    .sort((a, b) => b - a);
  const currentYearDividends = dividendsByYear[selectedYear] || [];

  // Calculate statistics
  const totalDividendIncome = mockDividendData.reduce((sum, month) => sum + month.totalAmount, 0);
  const currentYearTotal = currentYearDividends.reduce((sum, month) => sum + month.totalAmount, 0);
  const avgMonthlyDividend = currentYearTotal / currentYearDividends.length;
  const highestMonth = currentYearDividends.reduce(
    (max, month) => (month.totalAmount > max.totalAmount ? month : max),
    currentYearDividends[0] || { monthName: '-', totalAmount: 0 },
  );

  // Prepare chart data (last 12 months)
  const chartData = mockDividendData
    .slice(0, 12)
    .reverse()
    .map((m) => ({
      month: m.monthName.substring(0, 3),
      amount: m.totalAmount,
      year: m.year,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 space-y-4">
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
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                  <SelectTrigger className="w-[180px] h-8 text-sm border-indigo-200 focus:ring-indigo-500">
                    <SelectValue placeholder="Select Portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPortfolios.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <p className="text-xs font-bold text-gray-800">{portfolioDetails.name}</p>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-medium">Currency</p>
                  <p className="text-xs font-bold text-gray-800">{portfolioDetails.currency}</p>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-medium">Created</p>
                  <p className="text-xs font-bold text-gray-800">{portfolioDetails.dateCreated}</p>
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
                  ¥{totalDividendIncome.toLocaleString()}
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
                  ¥{currentYearTotal.toLocaleString()}
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
                  ¥{avgMonthlyDividend.toLocaleString()}
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
                  ¥{highestMonth.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

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
                tickFormatter={(value) => `¥${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`¥${value.toLocaleString()}`, 'Amount']}
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
        </div>
      </Card>

      {/* Year Selector and Monthly Breakdown */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border-b border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <h2 className="text-base font-bold text-gray-800">Dividend Details by Month</h2>
            </div>
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
          </div>
        </div>
        <div className="p-3">
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
                            ¥{monthData.totalAmount.toLocaleString()}
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
                                    Payment: {payment.paymentDate}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-bold text-green-600">
                                  ¥{payment.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                              <div>
                                <p className="text-[10px] text-gray-500 mb-0.5">Shares Owned</p>
                                <p className="font-semibold text-sm text-gray-800">
                                  {payment.shares.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 mb-0.5">Per Share</p>
                                <p className="font-semibold text-sm text-gray-800">
                                  ¥{payment.dividendPerShare.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 mb-0.5">Ex-Dividend Date</p>
                                <p className="font-semibold text-sm text-gray-800">
                                  {payment.exDividendDate}
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
        </div>
      </Card>
    </div>
  );
};

export default DividendPage;
