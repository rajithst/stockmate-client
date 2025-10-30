import React, { useState, useRef } from 'react';
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
  Search,
} from 'lucide-react';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

// Mock company data for stock search
const mockCompanies = [
  { symbol: 'AAPL', name: 'Apple Inc.', industry: 'Consumer Electronics' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', industry: 'Software' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', industry: 'Internet Services' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', industry: 'E-commerce' },
  { symbol: 'TSLA', name: 'Tesla Inc.', industry: 'Automotive' },
  { symbol: 'META', name: 'Meta Platforms Inc.', industry: 'Social Media' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', industry: 'Semiconductors' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', industry: 'Banking' },
  { symbol: 'V', name: 'Visa Inc.', industry: 'Financial Services' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', industry: 'Healthcare' },
  { symbol: 'WMT', name: 'Walmart Inc.', industry: 'Retail' },
  { symbol: 'DIS', name: 'The Walt Disney Company', industry: 'Entertainment' },
];

// Mock Data
interface Portfolio {
  id: string;
  name: string;
  dateCreated: string;
  currency: string;
}

const initialPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Main Portfolio',
    dateCreated: '2023-01-15',
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Retirement Fund',
    dateCreated: '2022-06-20',
    currency: 'USD',
  },
  {
    id: '3',
    name: 'High Growth',
    dateCreated: '2024-03-10',
    currency: 'USD',
  },
];

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
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(initialPortfolios[0].id);
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Purchase>({ date: '', shares: 0, price: 0 });
  const [showSectorChart, setShowSectorChart] = useState(false);
  const [showIndustryChart, setShowIndustryChart] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioEditMode, setPortfolioEditMode] = useState(false);
  const [portfolioEditId, setPortfolioEditId] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({ name: '', currency: 'USD' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ symbol: string; index: number } | null>(
    null,
  );
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStockForm, setNewStockForm] = useState({
    symbol: '',
    currentPrice: 0,
    purchaseDate: '',
    shares: 0,
    purchasePrice: 0,
  });
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockSearchResults, setStockSearchResults] = useState<typeof mockCompanies>([]);
  const [showStockSearchDropdown, setShowStockSearchDropdown] = useState(false);
  const stockSearchContainerRef = useRef<HTMLDivElement>(null);

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId) || portfolios[0];
  const totalStocks = holdings.length;
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const totalInvested = holdings.reduce((acc, h) => acc + h.invested, 0);
  const totalGains = totalValue - totalInvested;
  const totalGainsPercent = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
  const totalDividend = 15420; // Mock dividend value

  // Handle click outside for stock search dropdown
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        stockSearchContainerRef.current &&
        !stockSearchContainerRef.current.contains(e.target as Node)
      ) {
        setShowStockSearchDropdown(false);
      }
    }
    if (showStockSearchDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showStockSearchDropdown]);

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
    setShowDeleteConfirm(false);
    setPendingDelete(null);
  };

  const confirmDeletePurchase = (symbol: string, index: number) => {
    setPendingDelete({ symbol, index });
    setShowDeleteConfirm(true);
  };

  const proceedWithDelete = () => {
    if (pendingDelete) {
      handleDeletePurchase(pendingDelete.symbol, pendingDelete.index);
    }
  };

  const openAddStockModal = () => {
    setNewStockForm({
      symbol: '',
      currentPrice: 0,
      purchaseDate: '',
      shares: 0,
      purchasePrice: 0,
    });
    setStockSearchQuery('');
    setStockSearchResults([]);
    setShowStockSearchDropdown(false);
    setShowAddStockModal(true);
  };

  const handleStockSearch = (query: string) => {
    setStockSearchQuery(query);

    if (query.trim()) {
      const filtered = mockCompanies.filter(
        (company) =>
          company.symbol.toLowerCase().includes(query.toLowerCase()) ||
          company.name.toLowerCase().includes(query.toLowerCase()),
      );
      setStockSearchResults(filtered);
      setShowStockSearchDropdown(true);
    } else {
      setStockSearchResults([]);
      setShowStockSearchDropdown(false);
    }
  };

  const handleSelectStock = (company: (typeof mockCompanies)[0]) => {
    setNewStockForm({ ...newStockForm, symbol: company.symbol });
    setStockSearchQuery('');
    setShowStockSearchDropdown(false);
    setStockSearchResults([]);
  };

  const handleAddNewStock = () => {
    if (
      !newStockForm.symbol.trim() ||
      newStockForm.currentPrice <= 0 ||
      newStockForm.shares <= 0 ||
      newStockForm.purchasePrice <= 0 ||
      !newStockForm.purchaseDate.trim()
    ) {
      alert('Please fill in all fields with valid values');
      return;
    }

    // Check if stock already exists
    if (holdings.some((h) => h.symbol === newStockForm.symbol.toUpperCase())) {
      alert('Stock already exists in portfolio');
      return;
    }

    const selectedCompany = mockCompanies.find(
      (c) => c.symbol === newStockForm.symbol.toUpperCase(),
    );
    const industry = selectedCompany?.industry || 'Other';

    const totalInvested = newStockForm.shares * newStockForm.purchasePrice;
    const totalValue = newStockForm.shares * newStockForm.currentPrice;
    const gainLoss = ((totalValue - totalInvested) / totalInvested) * 100;

    const newStock: Holding = {
      symbol: newStockForm.symbol.toUpperCase(),
      currency: selectedPortfolio.currency,
      gainLoss,
      shares: newStockForm.shares,
      currentPrice: newStockForm.currentPrice,
      avgPrice: newStockForm.purchasePrice,
      invested: totalInvested,
      value: totalValue,
      industry,
      history: [
        {
          date: newStockForm.purchaseDate,
          shares: newStockForm.shares,
          price: newStockForm.purchasePrice,
        },
      ],
    };

    setHoldings((prev) => [...prev, newStock]);
    setShowAddStockModal(false);
  };

  const openAddPortfolioModal = () => {
    setPortfolioEditMode(false);
    setPortfolioEditId(null);
    setPortfolioForm({ name: '', currency: 'USD' });
    setShowPortfolioModal(true);
  };

  const openEditPortfolioModal = (portfolio: Portfolio) => {
    setPortfolioEditMode(true);
    setPortfolioEditId(portfolio.id);
    setPortfolioForm({ name: portfolio.name, currency: portfolio.currency });
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = () => {
    if (!portfolioForm.name.trim()) return;

    if (portfolioEditMode && portfolioEditId) {
      // Edit portfolio
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioEditId
            ? { ...p, name: portfolioForm.name, currency: portfolioForm.currency }
            : p,
        ),
      );
    } else {
      // Add new portfolio
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        name: portfolioForm.name,
        dateCreated: new Date().toISOString().split('T')[0],
        currency: portfolioForm.currency,
      };
      setPortfolios((prev) => [...prev, newPortfolio]);
      setSelectedPortfolioId(newPortfolio.id);
    }

    setShowPortfolioModal(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (portfolios.length <= 1) {
      alert('Cannot delete the last portfolio');
      return;
    }

    setPortfolios((prev) => prev.filter((p) => p.id !== id));

    // Switch to another portfolio if the current one was deleted
    if (selectedPortfolioId === id) {
      const remainingPortfolio = portfolios.find((p) => p.id !== id);
      if (remainingPortfolio) {
        setSelectedPortfolioId(remainingPortfolio.id);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
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
                  <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                    <SelectTrigger className="w-[180px] h-8 text-sm border-indigo-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolios.map((p: Portfolio) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => openEditPortfolioModal(selectedPortfolio)}
                  className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                  title="Edit Portfolio"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  onClick={openAddPortfolioModal}
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
                  <p className="text-xs font-bold text-gray-800">{selectedPortfolio.name}</p>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-medium">Currency</p>
                  <p className="text-xs font-bold text-gray-800">{selectedPortfolio.currency}</p>
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
                  <p className="text-xs font-bold text-gray-800">{selectedPortfolio.dateCreated}</p>
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
        {/* Table Header with Heading */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">Current Holdings</h2>
                <p className="text-xs text-gray-500">Track your portfolio positions</p>
              </div>
            </div>
            <Button
              onClick={openAddStockModal}
              className="h-8 px-3 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Stock
            </Button>
          </div>
        </div>
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
                                      confirmDeletePurchase(h.symbol, i);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
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

      {/* Add/Edit Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {portfolioEditMode ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {portfolioEditMode ? 'Edit Portfolio' : 'Create Portfolio'}
                  </h2>
                  <p className="text-xs text-indigo-100">
                    {portfolioEditMode ? 'Update portfolio details' : 'Add a new portfolio'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Portfolio Name
                </label>
                <Input
                  placeholder="e.g., Day Trading, Long Term, etc."
                  value={portfolioForm.name}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Currency</label>
                <Select
                  value={portfolioForm.currency}
                  onValueChange={(value) => setPortfolioForm({ ...portfolioForm, currency: value })}
                >
                  <SelectTrigger className="h-9 text-sm border-indigo-200 focus:ring-indigo-500">
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

            {/* Modal Footer */}
            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPortfolioModal(false)}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              {portfolioEditMode && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (portfolioEditId) {
                      handleDeletePortfolio(portfolioEditId);
                      setShowPortfolioModal(false);
                    }
                  }}
                  className="flex-1 h-9 text-sm border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              )}
              <Button
                onClick={handleSavePortfolio}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
              >
                {portfolioEditMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Purchase Confirmation Modal */}
      {showDeleteConfirm && pendingDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Confirm Deletion</h2>
                  <p className="text-xs text-red-100">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this purchase record for{' '}
                <span className="font-bold text-gray-900">{pendingDelete.symbol}</span>? This will
                recalculate your average price and total gains/losses.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPendingDelete(null);
                }}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={proceedWithDelete}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md text-white"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Add New Stock</h2>
                  <p className="text-xs text-emerald-100">Add a new stock to your portfolio</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <div ref={stockSearchContainerRef} className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Stock Symbol
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search by symbol or company name"
                    value={stockSearchQuery || newStockForm.symbol}
                    onChange={(e) => handleStockSearch(e.target.value)}
                    onFocus={() =>
                      (stockSearchQuery || newStockForm.symbol) && setShowStockSearchDropdown(true)
                    }
                    className="w-full h-9 pl-9 pr-9 text-sm rounded-lg border border-emerald-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {(stockSearchQuery || newStockForm.symbol) && (
                    <button
                      onClick={() => {
                        setStockSearchQuery('');
                        setNewStockForm({ ...newStockForm, symbol: '' });
                        setShowStockSearchDropdown(false);
                        setStockSearchResults([]);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Stock Search Dropdown */}
                  {showStockSearchDropdown && stockSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {stockSearchResults.map((company) => (
                        <button
                          key={company.symbol}
                          onClick={() => handleSelectStock(company)}
                          className="w-full px-3 py-2.5 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {company.symbol.substring(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                                {company.symbol}
                              </p>
                              <p className="text-xs text-gray-500 group-hover:text-gray-700 truncate">
                                {company.name}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Current Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    placeholder="Enter current price"
                    type="number"
                    value={newStockForm.currentPrice || ''}
                    onChange={(e) =>
                      setNewStockForm({ ...newStockForm, currentPrice: Number(e.target.value) })
                    }
                    className="pl-9 h-9 text-sm border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-gray-700 mb-3">First Purchase</p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Purchase Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={newStockForm.purchaseDate}
                      onChange={(e) =>
                        setNewStockForm({ ...newStockForm, purchaseDate: e.target.value })
                      }
                      className="pl-9 h-9 text-sm border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Shares
                    </label>
                    <Input
                      placeholder="Number of shares"
                      type="number"
                      value={newStockForm.shares || ''}
                      onChange={(e) =>
                        setNewStockForm({ ...newStockForm, shares: Number(e.target.value) })
                      }
                      className="h-9 text-sm border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Price per Share
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <Input
                        placeholder="Purchase price"
                        type="number"
                        value={newStockForm.purchasePrice || ''}
                        onChange={(e) =>
                          setNewStockForm({
                            ...newStockForm,
                            purchasePrice: Number(e.target.value),
                          })
                        }
                        className="pl-9 h-9 text-sm border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {newStockForm.shares > 0 && newStockForm.purchasePrice > 0 && (
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 mt-2.5">
                    <p className="text-[10px] font-semibold text-gray-600 mb-0.5">
                      Total Investment
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      ¥{(newStockForm.shares * newStockForm.purchasePrice).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddStockModal(false)}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNewStock}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md text-white"
              >
                Add Stock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldingsPage;
