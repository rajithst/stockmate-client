import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PieChart,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  X,
} from 'lucide-react';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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

interface Purchase {
  date: string;
  shares: number;
  price: number;
}

interface Holding {
  symbol: string;
  currency: string;
  gainLoss: number;
  shares: number;
  currentPrice: number;
  avgPrice: number;
  invested: number;
  value: number;
  industry: string;
  history: Purchase[];
}

const initialHoldings: Holding[] = [
  {
    symbol: 'AAPL',
    currency: 'USD',
    gainLoss: 5.2,
    shares: 25,
    currentPrice: 3450,
    avgPrice: 3280,
    invested: 82000,
    value: 86250,
    industry: 'Consumer Electronics',
    history: [
      { date: '2024-05-12', shares: 10, price: 3200 },
      { date: '2024-09-01', shares: 15, price: 3500 },
    ],
  },
  {
    symbol: 'MSFT',
    currency: 'USD',
    gainLoss: 5.2,
    shares: 10,
    currentPrice: 5470,
    avgPrice: 5000,
    invested: 50000,
    value: 54700,
    industry: 'Software',
    history: [{ date: '2023-10-01', shares: 10, price: 5000 }],
  },
];

const HoldingsPage: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(mockPortfolios[0]);
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Purchase>({ date: '', shares: 0, price: 0 });
  const [showSectorChart, setShowSectorChart] = useState(false);
  const [showIndustryChart, setShowIndustryChart] = useState(false);

  const portfolioDetails = portfolioDetailsMap[selectedPortfolio];
  const totalStocks = holdings.length;
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const totalInvested = holdings.reduce((acc, h) => acc + h.invested, 0);
  const totalGains = totalValue - totalInvested;
  const totalGainsPercent = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
  const totalDividend = 15420; // Mock dividend value

  // Calculate sector performance
  const sectorMap = new Map<string, { invested: number; value: number }>();
  holdings.forEach((h) => {
    const sector =
      h.industry.includes('Electronics') || h.industry.includes('Software')
        ? 'Technology'
        : h.industry;
    const existing = sectorMap.get(sector) || { invested: 0, value: 0 };
    sectorMap.set(sector, {
      invested: existing.invested + h.invested,
      value: existing.value + h.value,
    });
  });

  const sectorPerformance = Array.from(sectorMap.entries())
    .map(([sector, data]) => ({
      name: sector,
      invested: data.invested,
      value: data.value,
      gain: data.value - data.invested,
      gainPercent: ((data.value - data.invested) / data.invested) * 100,
      portfolioPercent: (data.value / totalValue) * 100,
    }))
    .sort((a, b) => b.gainPercent - a.gainPercent);

  // Calculate industry performance
  const industryMap = new Map<string, { invested: number; value: number }>();
  holdings.forEach((h) => {
    const existing = industryMap.get(h.industry) || { invested: 0, value: 0 };
    industryMap.set(h.industry, {
      invested: existing.invested + h.invested,
      value: existing.value + h.value,
    });
  });

  const industryPerformance = Array.from(industryMap.entries())
    .map(([industry, data]) => ({
      name: industry,
      invested: data.invested,
      value: data.value,
      gain: data.value - data.invested,
      gainPercent: ((data.value - data.invested) / data.invested) * 100,
      portfolioPercent: (data.value / totalValue) * 100,
    }))
    .sort((a, b) => b.gainPercent - a.gainPercent);

  const openAddModal = (symbol: string) => {
    setEditMode(false);
    setSelectedSymbol(symbol);
    setForm({ date: '', shares: 0, price: 0 });
    setShowModal(true);
  };

  const openEditModal = (symbol: string, purchase: Purchase, index: number) => {
    setEditMode(true);
    setSelectedSymbol(symbol);
    setForm(purchase);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!selectedSymbol) return;

    setHoldings((prev) =>
      prev.map((h) => {
        if (h.symbol !== selectedSymbol) return h;

        const newHistory = editMode
          ? h.history.map((p, i) => (i === editIndex ? form : p))
          : [...h.history, form];

        const totalShares = newHistory.reduce((acc, p) => acc + p.shares, 0);
        const totalCost = newHistory.reduce((acc, p) => acc + p.shares * p.price, 0);
        const newAvgPrice = totalCost / totalShares;
        const newInvested = totalCost;
        const newValue = totalShares * h.currentPrice;

        return {
          ...h,
          history: newHistory,
          shares: totalShares,
          avgPrice: newAvgPrice,
          invested: newInvested,
          value: newValue,
          gainLoss: ((newValue - newInvested) / newInvested) * 100,
        };
      }),
    );

    setShowModal(false);
  };

  const handleDeletePurchase = (symbol: string, index: number) => {
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.symbol !== symbol) return h;
        const newHistory = h.history.filter((_, i) => i !== index);
        const totalShares = newHistory.reduce((acc, p) => acc + p.shares, 0);
        const totalCost = newHistory.reduce((acc, p) => acc + p.shares * p.price, 0);
        const newAvgPrice = totalShares ? totalCost / totalShares : 0;
        const newInvested = totalCost;
        const newValue = totalShares * h.currentPrice;

        return {
          ...h,
          history: newHistory,
          shares: totalShares,
          avgPrice: newAvgPrice,
          invested: newInvested,
          value: newValue,
          gainLoss: newInvested ? ((newValue - newInvested) / newInvested) * 100 : 0,
        };
      }),
    );
  };

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
                  <PieChart className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Portfolio & Holdings
                  </h1>
                  <p className="text-[10px] text-gray-500">Manage your portfolio holdings</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
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
                <button
                  className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                  title="Edit Portfolio"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Portfolio
                </Button>
              </div>
            </div>

            {/* Portfolio Details */}
            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <PieChart className="w-3 h-3 text-indigo-600" />
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
                <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-medium">Total Stocks</p>
                  <p className="text-xs font-bold text-gray-800">{totalStocks}</p>
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
                  <p className="text-[10px] font-semibold text-gray-600">Total Value</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">¥{totalValue.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-2.5 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <TrendingDown className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-600">Total Invested</p>
                </div>
                <p className="text-lg font-bold text-gray-700">¥{totalInvested.toLocaleString()}</p>
              </div>

              <div
                className={`rounded-xl p-2.5 border ${
                  totalGains >= 0
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      totalGains >= 0
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}
                  >
                    {totalGains >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-white" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-gray-600">Total Gains</p>
                </div>
                <p
                  className={`text-lg font-bold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {totalGains >= 0 ? '+' : ''}¥{totalGains.toLocaleString()}
                </p>
                <p
                  className={`text-[9px] font-medium mt-0.5 ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {totalGainsPercent >= 0 ? '+' : ''}
                  {totalGainsPercent.toFixed(2)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-2.5 border border-amber-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-600">Total Dividends</p>
                </div>
                <p className="text-lg font-bold text-amber-600">
                  ¥{totalDividend.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance by Sector and Industry */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sector Performance */}
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-gray-800">Performance by Sector</h2>
              </div>
              <button
                onClick={() => setShowSectorChart(true)}
                className="p-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                title="View pie chart"
              >
                <BarChart3 className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-2.5">
              {sectorPerformance.map((sector) => (
                <div
                  key={sector.name}
                  className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50/30 border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{sector.name}</h3>
                      <p className="text-xs text-gray-500">
                        {sector.portfolioPercent.toFixed(1)}% of portfolio
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {sector.gain >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`font-bold ${
                            sector.gain >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {sector.gainPercent >= 0 ? '+' : ''}
                          {sector.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          sector.gain >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {sector.gain >= 0 ? '+' : ''}¥{sector.gain.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span>Invested: ¥{sector.invested.toLocaleString()}</span>
                    <span className="font-semibold">Value: ¥{sector.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Industry Performance */}
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <h2 className="text-base font-bold text-gray-800">Performance by Industry</h2>
              </div>
              <button
                onClick={() => setShowIndustryChart(true)}
                className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                title="View pie chart"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-2.5">
              {industryPerformance.map((industry) => (
                <div
                  key={industry.name}
                  className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/30 border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{industry.name}</h3>
                      <p className="text-xs text-gray-500">
                        {industry.portfolioPercent.toFixed(1)}% of portfolio
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {industry.gain >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`font-bold ${
                            industry.gain >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {industry.gainPercent >= 0 ? '+' : ''}
                          {industry.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          industry.gain >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {industry.gain >= 0 ? '+' : ''}¥{industry.gain.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span>Invested: ¥{industry.invested.toLocaleString()}</span>
                    <span className="font-semibold">Value: ¥{industry.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
        {/* Table Header */}
        <div className="grid grid-cols-7 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            Symbol
          </div>
          <div className="text-right">Current Value</div>
          <div className="text-right">Total Invested</div>
          <div className="text-right flex items-center justify-end gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Gain/Loss
          </div>
          <div className="text-right">Portfolio %</div>
          <div className="text-right">Avg Price</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div>
          {holdings.map((h) => {
            const isExpanded = expanded === h.symbol;
            const portfolioPct = ((h.value / totalValue) * 100).toFixed(2);

            return (
              <div
                key={h.symbol}
                className="border-b last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : h.symbol)}
              >
                <div className="grid grid-cols-7 items-center px-4 py-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">
                        {h.symbol.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <Link
                        to={`/company/${h.symbol}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {h.symbol}
                      </Link>
                      <p className="text-[10px] text-gray-500">{h.shares} shares</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">
                      {h.currency} {h.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-gray-600 text-sm">
                    {h.currency} {h.invested.toLocaleString()}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {h.gainLoss >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                      )}
                      <span
                        className={`font-semibold text-sm ${
                          h.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {h.gainLoss.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {h.gainLoss >= 0 ? '+' : ''}
                      {h.currency} {(h.value - h.invested).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${Math.min(parseFloat(portfolioPct), 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-xs text-gray-700">{portfolioPct}%</span>
                    </div>
                  </div>
                  <div className="text-right text-gray-600 font-medium text-sm">
                    {h.currency} {h.avgPrice.toLocaleString()}
                  </div>
                  <div className="text-right flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      className="h-7 px-2.5 text-[10px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddModal(h.symbol);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
                      Add
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Purchase History */}
                {isExpanded && (
                  <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 px-4 py-3 border-t border-indigo-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <h3 className="text-xs font-bold text-gray-800">Purchase History</h3>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 text-xs">
                            <th className="text-left py-3 px-4 font-semibold">Date</th>
                            <th className="text-right py-3 px-4 font-semibold">Shares</th>
                            <th className="text-right py-3 px-4 font-semibold">Price</th>
                            <th className="text-right py-3 px-4 font-semibold">Total Cost</th>
                            <th className="text-right py-3 px-4 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.history.map((tx, i) => (
                            <tr
                              key={i}
                              className="border-t hover:bg-indigo-50/50 transition text-sm"
                            >
                              <td className="py-3 px-4 text-gray-700">{tx.date}</td>
                              <td className="text-right py-3 px-4 font-medium text-gray-900">
                                {tx.shares}
                              </td>
                              <td className="text-right py-3 px-4 text-gray-700">
                                ¥{tx.price.toLocaleString()}
                              </td>
                              <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                ¥{(tx.shares * tx.price).toLocaleString()}
                              </td>
                              <td className="text-right py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-3 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(h.symbol, tx, i);
                                    }}
                                  >
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePurchase(h.symbol, i);
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {editMode ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {editMode ? 'Edit Purchase' : 'Add Purchase'}
                  </h2>
                  <p className="text-xs text-indigo-100">{selectedSymbol}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Purchase Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="pl-9 h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Number of Shares
                </label>
                <Input
                  placeholder="Enter shares"
                  type="number"
                  value={form.shares || ''}
                  onChange={(e) => setForm({ ...form, shares: Number(e.target.value) })}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Price per Share
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    placeholder="Enter price"
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="pl-9 h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {form.shares > 0 && form.price > 0 && (
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                  <p className="text-[10px] font-semibold text-gray-600 mb-0.5">Total Investment</p>
                  <p className="text-xl font-bold text-indigo-600">
                    ¥{(form.shares * form.price).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
              >
                {editMode ? 'Update' : 'Add Purchase'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sector Pie Chart Modal */}
      {showSectorChart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Sector Distribution</h2>
                    <p className="text-xs text-indigo-100">Portfolio allocation by sector</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSectorChart(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={350}>
                <RechartsChart>
                  <Pie
                    data={sectorPerformance.map((s) => ({
                      name: s.name,
                      value: s.value,
                      percent: s.portfolioPercent,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percent.toFixed(1)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectorPerformance.map((_, index) => {
                      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `¥${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {sectorPerformance.map((sector, index) => {
                  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                  return (
                    <div
                      key={sector.name}
                      className="p-2.5 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="font-semibold text-sm text-gray-800">{sector.name}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">¥{sector.value.toLocaleString()}</span> •{' '}
                        <span className={sector.gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {sector.gainPercent >= 0 ? '+' : ''}
                          {sector.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Pie Chart Modal */}
      {showIndustryChart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Industry Distribution</h2>
                    <p className="text-xs text-purple-100">Portfolio allocation by industry</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIndustryChart(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={350}>
                <RechartsChart>
                  <Pie
                    data={industryPerformance.map((i) => ({
                      name: i.name,
                      value: i.value,
                      percent: i.portfolioPercent,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percent.toFixed(1)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {industryPerformance.map((_, index) => {
                      const colors = ['#a855f7', '#6366f1', '#ec4899', '#06b6d4', '#14b8a6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `¥${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {industryPerformance.map((industry, index) => {
                  const colors = ['#a855f7', '#6366f1', '#ec4899', '#06b6d4', '#14b8a6'];
                  return (
                    <div
                      key={industry.name}
                      className="p-2.5 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="font-semibold text-xs text-gray-800">{industry.name}</span>
                      </div>
                      <div className="text-[10px] text-gray-600">
                        <span className="font-medium">¥{industry.value.toLocaleString()}</span> •{' '}
                        <span className={industry.gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {industry.gainPercent >= 0 ? '+' : ''}
                          {industry.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldingsPage;
