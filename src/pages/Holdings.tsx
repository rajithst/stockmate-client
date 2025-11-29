import React, { useState, useEffect, useRef } from 'react';
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
import { NotificationToast } from '../components/ui/notification-toast';
import { LoadingIndicator } from '../components/ui/loading-indicator';
import { useNotification } from '../lib/hooks/useNotification';
import { useAuth } from '../context/AuthContext';
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
  LineChart,
  LineChart as LineChartIcon,
  Search,
} from 'lucide-react';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import type { PortfolioRead, PortfolioDetail } from '../types/user';
import { apiClient } from '../api/client';

const HoldingsPage: React.FC = () => {
  const { companies } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioRead[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
  const [portfolioDetail, setPortfolioDetail] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chartTimePeriod, setChartTimePeriod] = useState<'3m' | '6m' | '1y' | '3y' | '5y'>('1y');
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');
  const [showSectorChart, setShowSectorChart] = useState(false);
  const [showIndustryChart, setShowIndustryChart] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioEditMode, setPortfolioEditMode] = useState(false);
  const [portfolioEditId, setPortfolioEditId] = useState<number | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({ name: '', currency: 'USD' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<number | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showTradingHistoryModal, setShowTradingHistoryModal] = useState(false);
  const [selectedSymbolForHistory, setSelectedSymbolForHistory] = useState<string | null>(null);
  const [showTradeDeleteConfirm, setShowTradeDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<{
    index: number;
    symbol: string;
    shares: number;
  } | null>(null);
  const [companySearchFilter, setCompanySearchFilter] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const companySearchRef = useRef<HTMLDivElement>(null);
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    shares: '',
    price_per_share: '',
    commission: '0',
    fees: '0',
    tax: '0',
    trade_date: new Date().toISOString().split('T')[0],
    trade_type: 'BUY' as 'BUY' | 'SELL',
  });

  const { notifications, addNotification, removeNotification } = useNotification();
  const hasInitializedRef = useRef(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (
      showTradeModal ||
      showPortfolioModal ||
      showDeleteConfirm ||
      showTradeDeleteConfirm ||
      showTradingHistoryModal
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    showTradeModal,
    showPortfolioModal,
    showDeleteConfirm,
    showTradeDeleteConfirm,
    showTradingHistoryModal,
  ]);

  // Close company dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (companySearchRef.current && !companySearchRef.current.contains(e.target as Node)) {
        setShowCompanyDropdown(false);
      }
    }
    if (showCompanyDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCompanyDropdown]);

  // Fetch portfolios on mount
  useEffect(() => {
    if (hasInitializedRef.current) return; // Skip if already initialized
    hasInitializedRef.current = true;

    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all portfolios
        const portfoliosData = await apiClient.getPortfolios();
        setPortfolios(portfoliosData);

        // If portfolios exist, set the first one as selected
        if (portfoliosData.length > 0) {
          const firstPortfolioId = portfoliosData[0].id;
          setSelectedPortfolioId(firstPortfolioId.toString());
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(message);
        console.error('Failed to fetch portfolios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Fetch portfolio detail when portfolio selection changes
  useEffect(() => {
    const fetchPortfolioDetail = async () => {
      if (!selectedPortfolioId) return;

      try {
        setLoading(true);
        setError(null);
        const portfolioId = parseInt(selectedPortfolioId, 10);

        // Fetch portfolio detail for the selected portfolio
        const detail = await apiClient.getPortfolioDetail(portfolioId);
        setPortfolioDetail(detail);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch portfolio detail';
        setError(message);
        console.error('Failed to fetch portfolio detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDetail();
  }, [selectedPortfolioId]);

  // Currency formatting helper
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

  const formatCurrency = (
    amount: number,
    currency: string = selectedPortfolio?.currency || 'USD',
  ) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Filter monthly performance data by time period
  const getFilteredMonthlyData = () => {
    if (
      !portfolioDetail?.monthly_performances ||
      portfolioDetail.monthly_performances.length === 0
    ) {
      return [];
    }

    const monthsMap: Record<string, number> = {
      '3m': 3,
      '6m': 6,
      '1y': 12,
      '3y': 36,
      '5y': 60,
    };

    const monthsToShow = monthsMap[chartTimePeriod];
    return portfolioDetail.monthly_performances.slice(-monthsToShow);
  };

  const filteredMonthlyData = getFilteredMonthlyData();

  const selectedPortfolio = portfolios.find((p) => p.id.toString() === selectedPortfolioId);
  const totalStocks = portfolioDetail?.holding_performances.length || 0;
  const totalValue = portfolioDetail?.total_value || 0;
  const totalInvested = portfolioDetail?.total_invested || 0;
  const totalGains = portfolioDetail?.total_gain_loss || 0;
  const totalGainsPercent = portfolioDetail?.total_return_percentage || 0;
  const totalDividends = portfolioDetail?.dividends_received || 0;

  // Use portfolio detail data directly
  const sectorPerformance =
    portfolioDetail?.sector_performances.map((sp) => ({
      name: sp.sector,
      invested: sp.total_invested,
      value: sp.allocation_percentage * (totalValue / 100),
      gain: sp.total_gain_loss,
      gainPercent: totalInvested > 0 ? (sp.total_gain_loss / sp.total_invested) * 100 : 0,
      portfolioPercent: sp.allocation_percentage,
    })) || [];

  const industryPerformance =
    portfolioDetail?.industry_performances.map((ip) => ({
      name: ip.industry,
      invested: ip.total_invested,
      value: ip.allocation_percentage * (totalValue / 100),
      gain: ip.total_gain_loss,
      gainPercent: totalInvested > 0 ? (ip.total_gain_loss / ip.total_invested) * 100 : 0,
      portfolioPercent: ip.allocation_percentage,
    })) || [];

  const holdings = portfolioDetail?.holding_performances || [];

  // Handle click outside for stock search dropdown - removed since not using modals
  // (functionality will be in API-driven modal or separate page)

  // NOTE: With real API data (PortfolioHoldingPerformanceRead), manual editing functions below
  // are simplified/commented out. Portfolio management should be handled through API endpoints.

  const openAddPortfolioModal = () => {
    setPortfolioEditMode(false);
    setPortfolioEditId(null);
    setPortfolioForm({ name: '', currency: 'USD' });
    setShowPortfolioModal(true);
  };

  const openEditPortfolioModal = (portfolio: PortfolioRead) => {
    setPortfolioEditMode(true);
    setPortfolioEditId(portfolio.id);
    setPortfolioForm({ name: portfolio.name, currency: portfolio.currency });
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = async () => {
    if (!portfolioForm.name.trim()) return;

    try {
      setLoading(true);

      if (portfolioEditMode && portfolioEditId) {
        // Update existing portfolio via API
        const updatedPortfolio = await apiClient.updatePortfolio(portfolioEditId, {
          name: portfolioForm.name,
          currency: portfolioForm.currency,
        });
        setPortfolios((prev) => prev.map((p) => (p.id === portfolioEditId ? updatedPortfolio : p)));
        addNotification('success', `Portfolio "${updatedPortfolio.name}" updated successfully`);
      } else {
        // Create new portfolio via API
        const newPortfolio = await apiClient.createPortfolio({
          name: portfolioForm.name,
          currency: portfolioForm.currency,
        });
        setPortfolios((prev) => [...prev, newPortfolio]);
        setSelectedPortfolioId(newPortfolio.id.toString());
        addNotification('success', `Portfolio "${newPortfolio.name}" created successfully`);
      }

      setShowPortfolioModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save portfolio';
      addNotification('error', message);
      console.error('Error saving portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = (id: number) => {
    setPortfolioToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    try {
      setLoading(true);

      // Call API to delete portfolio (returns 204 No Content on success)
      await apiClient.deletePortfolio(portfolioToDelete);

      // Remove from local state
      const deletedPortfolio = portfolios.find((p) => p.id === portfolioToDelete);
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioToDelete));

      // Switch to another portfolio if the current one was deleted
      if (selectedPortfolioId === portfolioToDelete.toString()) {
        const remainingPortfolio = portfolios.find((p) => p.id !== portfolioToDelete);
        if (remainingPortfolio) {
          setSelectedPortfolioId(remainingPortfolio.id.toString());
        }
      }

      // Show success notification
      addNotification('success', `Portfolio "${deletedPortfolio?.name}" deleted successfully`);

      // Close all modals
      setShowDeleteConfirm(false);
      setPortfolioToDelete(null);
      setShowPortfolioModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete portfolio';
      addNotification('error', message);
      console.error('Error deleting portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const openTradeModal = () => {
    setTradeForm({
      symbol: '',
      shares: '',
      price_per_share: '',
      commission: '0',
      fees: '0',
      tax: '0',
      trade_date: new Date().toISOString().split('T')[0],
      trade_type: 'BUY',
    });
    setShowTradeModal(true);
  };

  const handleSaveTrade = async () => {
    if (
      !selectedPortfolioId ||
      !tradeForm.symbol.trim() ||
      !tradeForm.shares ||
      !tradeForm.price_per_share
    ) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const shares = parseFloat(tradeForm.shares);
      const price_per_share = parseFloat(tradeForm.price_per_share);
      const commission = parseFloat(tradeForm.commission) || 0;
      const fees = parseFloat(tradeForm.fees) || 0;
      const tax = parseFloat(tradeForm.tax) || 0;

      const total_value = shares * price_per_share;
      const net_total = total_value + commission + fees + tax;

      const tradeData = {
        symbol: tradeForm.symbol.toUpperCase(),
        shares,
        price_per_share,
        commission,
        fees,
        tax,
        total_value,
        net_total,
        currency: selectedPortfolio?.currency || 'USD',
        trade_date: `${tradeForm.trade_date}T00:00:00`,
        trade_type: tradeForm.trade_type,
      };

      const portfolioId = parseInt(selectedPortfolioId, 10);

      if (tradeForm.trade_type === 'BUY') {
        await apiClient.buyStock(portfolioId, tradeData);
        addNotification('success', `Successfully bought ${shares} shares of ${tradeForm.symbol}`);
      } else {
        await apiClient.sellStock(portfolioId, tradeData);
        addNotification('success', `Successfully sold ${shares} shares of ${tradeForm.symbol}`);
      }

      // Refresh portfolio detail
      const updatedDetail = await apiClient.getPortfolioDetail(portfolioId);
      setPortfolioDetail(updatedDetail);

      setShowTradeModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process trade';
      addNotification('error', message);
      console.error('Error processing trade:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Loading State */}
      {loading ? (
        <LoadingIndicator message="Loading portfolios..." minHeight="min-h-[60vh]" />
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
                      <DollarSign className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Holdings
                      </h1>
                      <p className="text-[10px] text-gray-500">Manage your portfolio holdings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Portfolio:</label>
                      <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                        <SelectTrigger className="w-[180px] h-8 text-sm border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select Portfolio">
                            {selectedPortfolio ? selectedPortfolio.name : 'Select Portfolio'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {portfolios.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name} ({p.currency})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      onClick={() => selectedPortfolio && openEditPortfolioModal(selectedPortfolio)}
                      className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Edit Portfolio"
                      disabled={!selectedPortfolio}
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
                      <p className="text-xs font-bold text-gray-800">
                        {getCurrencySymbol(selectedPortfolio?.name || 'N/A')}
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
                        {getCurrencySymbol(selectedPortfolio?.currency || 'N/A')}
                      </p>
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
                      <p className="text-[10px] font-semibold text-gray-600">Total Value</p>
                    </div>
                    <p className="text-lg font-bold text-indigo-600">
                      {formatCurrency(totalValue, selectedPortfolio?.currency || 'USD')}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-2.5 border border-blue-100">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <TrendingDown className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600">Total Invested</p>
                    </div>
                    <p className="text-lg font-bold text-gray-700">
                      {formatCurrency(totalInvested, selectedPortfolio?.currency || 'USD')}
                    </p>
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
                      {totalGains >= 0 ? '+' : ''}
                      {formatCurrency(totalGains, selectedPortfolio?.currency || 'USD')}
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
                      {formatCurrency(totalDividends, selectedPortfolio?.currency || 'USD')}
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
                  <DollarSign className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Portfolios Yet</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first portfolio to start tracking your investments and monitor your
                  holdings.
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
              {/* Portfolio Performance Chart */}
              {selectedPortfolioId && (
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-800">Portfolio Performance</h2>
                      </div>

                      {/* Time Period & Chart Type Switchers */}
                      <div className="flex items-center gap-3">
                        {/* Time Period Switcher */}
                        <div className="flex items-center gap-1.5">
                          {(['3m', '6m', '1y', '3y', '5y'] as const).map((period) => (
                            <button
                              key={period}
                              onClick={() => setChartTimePeriod(period)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                chartTimePeriod === period
                                  ? 'bg-indigo-500 text-white shadow-md'
                                  : 'bg-white/50 text-gray-600 hover:bg-white/80 border border-indigo-100'
                              }`}
                            >
                              {period.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {/* Chart Type Switcher */}
                        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-indigo-200">
                          <button
                            onClick={() => setChartType('bar')}
                            title="Bar Chart"
                            className={`p-1.5 rounded transition-all ${
                              chartType === 'bar'
                                ? 'bg-indigo-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-indigo-600'
                            }`}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setChartType('line')}
                            title="Line Chart"
                            className={`p-1.5 rounded transition-all ${
                              chartType === 'line'
                                ? 'bg-indigo-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-indigo-600'
                            }`}
                          >
                            <LineChartIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {filteredMonthlyData.length > 0 ? (
                      <div className="space-y-6">
                        {/* Chart */}
                        <div>
                          <ResponsiveContainer width="100%" height={350}>
                            {chartType === 'bar' ? (
                              <BarChart
                                data={filteredMonthlyData.map((perf) => ({
                                  date: perf.date,
                                  month: new Date(perf.date).toLocaleString('default', {
                                    month: 'short',
                                    year: 'numeric',
                                  }),
                                  total_value: perf.total_value,
                                  total_invested: perf.total_invested,
                                  gain_loss: perf.total_gain_loss,
                                  gain_loss_percentage: perf.gain_loss_percentage,
                                  dividends_received: perf.dividends_received,
                                }))}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                  }}
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      const isPositive = data.gain_loss >= 0;
                                      return (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg space-y-2">
                                          <p className="text-sm font-semibold text-gray-800">
                                            {data.month}
                                          </p>
                                          <div className="space-y-1 text-xs">
                                            <p className="text-gray-600">
                                              <span className="font-semibold">
                                                Portfolio Value:
                                              </span>{' '}
                                              {formatCurrency(
                                                data.total_value,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                            <p className="text-gray-600">
                                              <span className="font-semibold">Invested:</span>{' '}
                                              {formatCurrency(
                                                data.total_invested,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                            <p
                                              className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                              <span className="font-semibold">Gain/Loss:</span>{' '}
                                              {formatCurrency(
                                                data.gain_loss,
                                                selectedPortfolio?.currency || 'USD',
                                              )}{' '}
                                              ({isPositive ? '+' : ''}
                                              {data.gain_loss_percentage.toFixed(2)}%)
                                            </p>
                                            <p className="text-amber-600">
                                              <span className="font-semibold">Dividends:</span>{' '}
                                              {formatCurrency(
                                                data.dividends_received,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Legend />
                                <Bar
                                  dataKey="total_value"
                                  fill="#6366f1"
                                  radius={[8, 8, 0, 0]}
                                  name="Portfolio Value"
                                  isAnimationActive={true}
                                />
                                <Bar
                                  dataKey="total_invested"
                                  fill="#10b981"
                                  radius={[8, 8, 0, 0]}
                                  name="Total Invested"
                                  isAnimationActive={true}
                                />
                                <defs>
                                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                  </linearGradient>
                                </defs>
                              </BarChart>
                            ) : (
                              <RechartsLineChart
                                data={filteredMonthlyData.map((perf) => ({
                                  date: perf.date,
                                  month: new Date(perf.date).toLocaleString('default', {
                                    month: 'short',
                                    year: 'numeric',
                                  }),
                                  total_value: perf.total_value,
                                  total_invested: perf.total_invested,
                                  gain_loss: perf.total_gain_loss,
                                  gain_loss_percentage: perf.gain_loss_percentage,
                                  dividends_received: perf.dividends_received,
                                }))}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                  }}
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      const isPositive = data.gain_loss >= 0;
                                      return (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg space-y-2">
                                          <p className="text-sm font-semibold text-gray-800">
                                            {data.month}
                                          </p>
                                          <div className="space-y-1 text-xs">
                                            <p className="text-gray-600">
                                              <span className="font-semibold">
                                                Portfolio Value:
                                              </span>{' '}
                                              {formatCurrency(
                                                data.total_value,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                            <p className="text-gray-600">
                                              <span className="font-semibold">Invested:</span>{' '}
                                              {formatCurrency(
                                                data.total_invested,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                            <p
                                              className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                              <span className="font-semibold">Gain/Loss:</span>{' '}
                                              {formatCurrency(
                                                data.gain_loss,
                                                selectedPortfolio?.currency || 'USD',
                                              )}{' '}
                                              ({isPositive ? '+' : ''}
                                              {data.gain_loss_percentage.toFixed(2)}%)
                                            </p>
                                            <p className="text-amber-600">
                                              <span className="font-semibold">Dividends:</span>{' '}
                                              {formatCurrency(
                                                data.dividends_received,
                                                selectedPortfolio?.currency || 'USD',
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="total_value"
                                  stroke="#6366f1"
                                  dot={{ fill: '#6366f1', r: 5 }}
                                  activeDot={{ r: 7 }}
                                  strokeWidth={3}
                                  name="Portfolio Value"
                                  isAnimationActive={true}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="total_invested"
                                  stroke="#10b981"
                                  dot={{ fill: '#10b981', r: 4 }}
                                  activeDot={{ r: 6 }}
                                  strokeWidth={2}
                                  name="Total Invested"
                                  isAnimationActive={true}
                                  strokeDasharray="5 5"
                                />
                                <defs>
                                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                  </linearGradient>
                                </defs>
                              </RechartsLineChart>
                            )}
                          </ResponsiveContainer>
                        </div>

                        {/* Monthly Summary Grid */}
                        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                          {filteredMonthlyData.slice(-3).map((perf, idx) => {
                            const isPositive = perf.total_gain_loss >= 0;
                            return (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                  {new Date(perf.date).toLocaleString('default', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                                <p className="text-base font-bold text-indigo-600 mb-1">
                                  {formatCurrency(
                                    perf.total_value,
                                    selectedPortfolio?.currency || 'USD',
                                  )}
                                </p>
                                <p
                                  className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                                >
                                  {isPositive ? '+' : ''}
                                  {perf.gain_loss_percentage.toFixed(2)}%
                                </p>
                              </div>
                            );
                          })}
                          <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-center">
                            <p className="text-xs font-semibold text-indigo-600 text-center">
                              Displayed Months: {filteredMonthlyData.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No Performance Data
                        </h3>
                        <p className="text-sm text-gray-500">
                          Performance data will appear as you make trades
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

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
                    {sectorPerformance.length === 0 ? (
                      <div className="text-center py-8">
                        <PieChart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                          No Holdings Yet
                        </h3>
                        <p className="text-xs text-gray-500">
                          Add stocks to your portfolio to see sector breakdown
                        </p>
                      </div>
                    ) : (
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
                                  {sector.gain >= 0 ? '+' : ''}
                                  {formatCurrency(
                                    sector.gain,
                                    selectedPortfolio?.currency || 'USD',
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                              <span>
                                Invested:{' '}
                                {formatCurrency(
                                  sector.invested,
                                  selectedPortfolio?.currency || 'USD',
                                )}
                              </span>
                              <span className="font-semibold">
                                Value:{' '}
                                {formatCurrency(sector.value, selectedPortfolio?.currency || 'USD')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Industry Performance */}
                <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border-b border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <h2 className="text-base font-bold text-gray-800">
                          Performance by Industry
                        </h2>
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
                    {industryPerformance.length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                          No Holdings Yet
                        </h3>
                        <p className="text-xs text-gray-500">
                          Add stocks to your portfolio to see industry breakdown
                        </p>
                      </div>
                    ) : (
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
                                  {industry.gain >= 0 ? '+' : ''}
                                  {getCurrencySymbol(selectedPortfolio?.currency || 'USD')}
                                  {industry.gain.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                              <span>
                                Invested: {getCurrencySymbol(selectedPortfolio?.currency || 'USD')}
                                {industry.invested.toLocaleString()}
                              </span>
                              <span className="font-semibold">
                                Value: {getCurrencySymbol(selectedPortfolio?.currency || 'USD')}
                                {industry.value.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      onClick={openTradeModal}
                      className="h-8 px-3 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                      title="Add a new stock to this portfolio"
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
                  {holdings.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">No Stocks Yet</h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Add your first stock to start tracking your portfolio performance
                      </p>
                      <Button
                        onClick={openTradeModal}
                        className="h-8 px-4 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Stock
                      </Button>
                    </div>
                  ) : (
                    <>
                      {holdings.map((h) => {
                        const isExpanded = expanded === h.symbol;
                        const portfolioPct =
                          totalValue > 0 ? ((h.current_value / totalValue) * 100).toFixed(2) : '0';

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
                                    to={`/app/company/${h.symbol}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-semibold text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                                  >
                                    {h.symbol}
                                  </Link>
                                  <p className="text-[10px] text-gray-500">
                                    {h.total_shares} shares
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm text-gray-900">
                                  {getCurrencySymbol(h.currency)} {h.current_value.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right text-gray-600 text-sm">
                                {getCurrencySymbol(h.currency)} {h.total_invested.toLocaleString()}
                              </div>
                              <div className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {h.gain_loss_percentage >= 0 ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                  )}
                                  <span
                                    className={`font-semibold text-sm ${
                                      h.gain_loss_percentage >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {h.gain_loss_percentage.toFixed(2)}%
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  {h.total_gain_loss >= 0 ? '+' : ''}
                                  {getCurrencySymbol(h.currency)}{' '}
                                  {h.total_gain_loss.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                      style={{
                                        width: `${Math.min(parseFloat(portfolioPct), 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-xs text-gray-700">
                                    {portfolioPct}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-right text-gray-600 font-medium text-sm">
                                {getCurrencySymbol(h.currency)}{' '}
                                {h.average_cost_per_share.toLocaleString()}
                              </div>
                              <div className="text-right flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/app/company/${h.symbol}`}
                                  className="h-7 px-2.5 text-[10px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md rounded text-white flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <TrendingUp className="w-3 h-3" />
                                  View
                                </Link>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Holding Details */}
                            {isExpanded && (
                              <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 px-4 py-3 border-t border-indigo-100 space-y-3">
                                {/* Gain/Loss Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                      UNREALIZED GAIN/LOSS
                                    </p>
                                    <p
                                      className={`text-sm font-bold ${h.unrealized_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                      {h.unrealized_gain_loss >= 0 ? '+' : ''}
                                      {getCurrencySymbol(h.currency)}{' '}
                                      {h.unrealized_gain_loss.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                      REALIZED GAIN/LOSS
                                    </p>
                                    <p
                                      className={`text-sm font-bold ${h.realized_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                      {h.realized_gain_loss >= 0 ? '+' : ''}
                                      {getCurrencySymbol(h.currency)}{' '}
                                      {h.realized_gain_loss.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Trading History */}
                                <div className="border-t border-indigo-100 pt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-semibold text-gray-600">
                                      TRADING HISTORY
                                    </p>
                                    <button
                                      onClick={() => {
                                        setSelectedSymbolForHistory(h.symbol);
                                        setShowTradingHistoryModal(true);
                                      }}
                                      className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                      View All
                                    </button>
                                  </div>
                                  {portfolioDetail?.trading_histories.filter(
                                    (t) => t.symbol === h.symbol,
                                  ).length === 0 ? (
                                    <p className="text-[10px] text-gray-500">No trades recorded</p>
                                  ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                      {portfolioDetail?.trading_histories
                                        .filter((t) => t.symbol === h.symbol)
                                        .slice(-3)
                                        .map((trade, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start justify-between text-[10px] bg-gradient-to-r from-gray-50 to-white rounded-lg px-2.5 py-2 border border-gray-150"
                                          >
                                            <div className="flex items-start gap-2 flex-1">
                                              <div
                                                className={`w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs mt-0.5 flex-shrink-0 ${
                                                  trade.trade_type === 'BUY'
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                                                }`}
                                              >
                                                {trade.trade_type === 'BUY' ? 'B' : 'S'}
                                              </div>
                                              <div className="flex-1">
                                                <p className="font-semibold text-gray-900 leading-tight">
                                                  {trade.trade_type === 'BUY' ? 'Bought' : 'Sold'}{' '}
                                                  {trade.shares.toLocaleString('en-US', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                  })}{' '}
                                                  {trade.trade_type === 'BUY' ? 'shares' : 'shares'}
                                                </p>
                                                <p className="text-gray-600 leading-tight">
                                                  {getCurrencySymbol(h.currency)}{' '}
                                                  {trade.price_per_share.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  })}
                                                  /share
                                                </p>
                                                <p className="text-gray-500 text-[9px] leading-tight">
                                                  {new Date(trade.trade_date).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                    },
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                              <div className="text-right">
                                                <p className="font-bold text-gray-900 leading-tight">
                                                  {getCurrencySymbol(h.currency)}{' '}
                                                  {trade.total_value.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  })}
                                                </p>
                                                {(trade.commission > 0 ||
                                                  trade.fees > 0 ||
                                                  trade.tax > 0) && (
                                                  <p className="text-gray-500 text-[9px] leading-tight">
                                                    +{h.currency}{' '}
                                                    {(
                                                      trade.commission +
                                                      trade.fees +
                                                      trade.tax
                                                    ).toLocaleString('en-US', {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 2,
                                                    })}
                                                  </p>
                                                )}
                                              </div>
                                              <div className="flex gap-0.5">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    addNotification(
                                                      'info',
                                                      'Edit functionality coming soon',
                                                    );
                                                  }}
                                                  className="p-1 rounded hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                  title="Edit trade"
                                                >
                                                  <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTradeToDelete({
                                                      index: idx,
                                                      symbol: trade.symbol,
                                                      shares: trade.shares,
                                                    });
                                                    setShowTradeDeleteConfirm(true);
                                                  }}
                                                  className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                                                  title="Delete trade"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </Card>

              {/* Add/Edit Modal - Disabled (using API data) */}

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
                            <p className="text-xs text-indigo-100">
                              Portfolio allocation by sector
                            </p>
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
                              const colors = [
                                '#6366f1',
                                '#8b5cf6',
                                '#06b6d4',
                                '#10b981',
                                '#f59e0b',
                              ];
                              return (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              );
                            })}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
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
                                <span className="font-semibold text-sm text-gray-800">
                                  {sector.name}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">
                                  {getCurrencySymbol(selectedPortfolio?.currency || 'USD')}{' '}
                                  {sector.value.toLocaleString()}
                                </span>{' '}
                                •{' '}
                                <span
                                  className={sector.gain >= 0 ? 'text-green-600' : 'text-red-600'}
                                >
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
                            <p className="text-xs text-purple-100">
                              Portfolio allocation by industry
                            </p>
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
                              const colors = [
                                '#a855f7',
                                '#6366f1',
                                '#ec4899',
                                '#06b6d4',
                                '#14b8a6',
                              ];
                              return (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              );
                            })}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
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
                                <span className="font-semibold text-xs text-gray-800">
                                  {industry.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-600">
                                <span className="font-medium">
                                  {getCurrencySymbol(selectedPortfolio?.currency || 'USD')}{' '}
                                  {industry.value.toLocaleString()}
                                </span>{' '}
                                •{' '}
                                <span
                                  className={industry.gain >= 0 ? 'text-green-600' : 'text-red-600'}
                                >
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
                          {portfolioEditMode ? (
                            <Edit2 className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
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
                          onChange={(e) =>
                            setPortfolioForm({ ...portfolioForm, name: e.target.value })
                          }
                          className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Currency
                        </label>
                        <Select
                          value={portfolioForm.currency}
                          onValueChange={(value) =>
                            setPortfolioForm({ ...portfolioForm, currency: value })
                          }
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

              {/* Delete Purchase Confirmation Modal - Disabled (using API data) */}
              {/* Add New Stock Modal - Disabled (using API data) */}

              {/* Notifications Toast */}
              <NotificationToast notifications={notifications} onRemove={removeNotification} />
            </>
          )}
        </>
      )}

      {/* Buy/Sell Stock Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Add Stock to Portfolio</h2>
                    <p className="text-xs text-green-100">Record a buy or sell transaction</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Transaction Type & Trade Date - Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <Select
                    value={tradeForm.trade_type}
                    onValueChange={(value) =>
                      setTradeForm({ ...tradeForm, trade_type: value as 'BUY' | 'SELL' })
                    }
                  >
                    <SelectTrigger className="h-10 text-sm border-green-200 focus:ring-green-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">Buy</SelectItem>
                      <SelectItem value="SELL">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Trade Date *
                  </label>
                  <Input
                    type="date"
                    value={tradeForm.trade_date}
                    onChange={(e) => setTradeForm({ ...tradeForm, trade_date: e.target.value })}
                    className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Symbol & Shares - Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Stock Symbol *
                  </label>
                  <div ref={companySearchRef} className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      {tradeForm.symbol ? (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {companies.find((c) => c.symbol === tradeForm.symbol)?.image && (
                            <img
                              src={
                                companies.find((c) => c.symbol === tradeForm.symbol)?.image || ''
                              }
                              alt={tradeForm.symbol}
                              className="w-5 h-5 rounded object-contain bg-gray-100 p-0.5"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      ) : null}
                      <input
                        type="text"
                        placeholder="Search or select stock..."
                        value={tradeForm.symbol || companySearchFilter}
                        onChange={(e) => {
                          setCompanySearchFilter(e.target.value);
                          setTradeForm({ ...tradeForm, symbol: '' });
                          setShowCompanyDropdown(true);
                        }}
                        onFocus={() => {
                          if (!tradeForm.symbol) {
                            setShowCompanyDropdown(true);
                          }
                        }}
                        className={`w-full h-10 pr-8 text-sm rounded-lg border border-green-200 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                          tradeForm.symbol ? 'pl-10' : 'pl-9'
                        }`}
                      />
                      {(companySearchFilter || tradeForm.symbol) && (
                        <button
                          onClick={() => {
                            setCompanySearchFilter('');
                            setShowCompanyDropdown(false);
                            setTradeForm({ ...tradeForm, symbol: '' });
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Company Dropdown with Logos */}
                    {showCompanyDropdown && !tradeForm.symbol && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[100] max-h-80 overflow-y-auto">
                        {companies
                          .filter(
                            (company) =>
                              company.symbol
                                .toLowerCase()
                                .includes(companySearchFilter.toLowerCase()) ||
                              company.name
                                .toLowerCase()
                                .includes(companySearchFilter.toLowerCase()),
                          )
                          .map((company) => (
                            <div
                              key={company.symbol}
                              onClick={() => {
                                setTradeForm({ ...tradeForm, symbol: company.symbol });
                                setCompanySearchFilter('');
                                setShowCompanyDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 group cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                {company.image && (
                                  <img
                                    src={company.image}
                                    alt={company.symbol}
                                    className="w-6 h-6 rounded-lg flex-shrink-0 object-contain bg-gray-100 p-0.5"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-green-600 group-hover:text-green-700">
                                    {company.symbol}
                                  </p>
                                  <p className="text-xs text-gray-500 group-hover:text-gray-700 truncate">
                                    {company.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        {companies.filter(
                          (company) =>
                            company.symbol
                              .toLowerCase()
                              .includes(companySearchFilter.toLowerCase()) ||
                            company.name.toLowerCase().includes(companySearchFilter.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-3 py-4 text-center text-xs text-gray-500">
                            No stocks found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Number of Shares *
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    step="0.01"
                    value={tradeForm.shares}
                    onChange={(e) => setTradeForm({ ...tradeForm, shares: e.target.value })}
                    className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Price Per Share - Row 3 (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Price Per Share *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 150.50"
                  step="0.01"
                  value={tradeForm.price_per_share}
                  onChange={(e) => setTradeForm({ ...tradeForm, price_per_share: e.target.value })}
                  className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Additional Costs - Row 4 */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3">
                  Additional Costs (optional)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Commission
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={tradeForm.commission}
                      onChange={(e) => setTradeForm({ ...tradeForm, commission: e.target.value })}
                      className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Fees</label>
                    <Input
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={tradeForm.fees}
                      onChange={(e) => setTradeForm({ ...tradeForm, fees: e.target.value })}
                      className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Tax</label>
                    <Input
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={tradeForm.tax}
                      onChange={(e) => setTradeForm({ ...tradeForm, tax: e.target.value })}
                      className="h-10 text-sm border-green-200 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div
                className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 transition-opacity duration-200 ${
                  tradeForm.shares && tradeForm.price_per_share
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Value:</span>
                    <span className="font-semibold text-gray-900">
                      {(
                        parseFloat(tradeForm.shares) * parseFloat(tradeForm.price_per_share)
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {(parseFloat(tradeForm.commission) || 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Commission:</span>
                      <span className="font-semibold">
                        +
                        {parseFloat(tradeForm.commission).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {(parseFloat(tradeForm.fees) || 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Fees:</span>
                      <span className="font-semibold">
                        +
                        {parseFloat(tradeForm.fees).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {(parseFloat(tradeForm.tax) || 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span className="font-semibold">
                        +
                        {parseFloat(tradeForm.tax).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-green-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-green-600">
                      {(
                        parseFloat(tradeForm.shares) * parseFloat(tradeForm.price_per_share) +
                        (parseFloat(tradeForm.commission) || 0) +
                        (parseFloat(tradeForm.fees) || 0) +
                        (parseFloat(tradeForm.tax) || 0)
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 bg-gray-50 border-t sticky bottom-0">
              <Button
                variant="outline"
                onClick={() => setShowTradeModal(false)}
                className="flex-1 h-10 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTrade}
                disabled={loading}
                className="flex-1 h-10 text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
              >
                {loading ? 'Processing...' : `${tradeForm.trade_type === 'BUY' ? 'Buy' : 'Sell'}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Portfolio Modal - Rendered outside conditional so it works in empty state */}
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

      {/* Trading History Modal */}
      {showTradingHistoryModal && selectedSymbolForHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    Trading History - {selectedSymbolForHistory}
                  </h2>
                  <p className="text-xs text-indigo-100">Complete transaction records</p>
                </div>
              </div>
              <button
                onClick={() => setShowTradingHistoryModal(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {portfolioDetail?.trading_histories.filter(
                (t) => t.symbol === selectedSymbolForHistory,
              ).length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">
                    No trading history found for {selectedSymbolForHistory}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {portfolioDetail?.trading_histories
                    .filter((t) => t.symbol === selectedSymbolForHistory)
                    .sort(
                      (a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime(),
                    )
                    .map((trade, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                                trade.trade_type === 'BUY'
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                  : 'bg-gradient-to-br from-red-500 to-rose-600'
                              }`}
                            >
                              {trade.trade_type === 'BUY' ? 'B' : 'S'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {trade.trade_type === 'BUY' ? 'Buy' : 'Sell'} {trade.shares} shares
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(trade.trade_date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">
                              {getCurrencySymbol(trade.currency)}{' '}
                              {trade.total_value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <button
                              onClick={() => {
                                // Edit functionality - for future implementation
                                addNotification('info', 'Edit functionality coming soon');
                              }}
                              className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                              title="Edit trade"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setTradeToDelete({
                                  index: idx,
                                  symbol: trade.symbol,
                                  shares: trade.shares,
                                });
                                setShowTradeDeleteConfirm(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete trade"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-gray-600 font-medium">Price Per Share</p>
                            <p className="font-semibold text-gray-900">
                              {getCurrencySymbol(trade.currency)}{' '}
                              {trade.price_per_share.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-gray-600 font-medium">Total Value</p>
                            <p className="font-semibold text-gray-900">
                              {getCurrencySymbol(trade.currency)}{' '}
                              {trade.total_value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          {trade.commission > 0 && (
                            <div className="bg-orange-50 rounded p-2 border border-orange-200">
                              <p className="text-orange-700 font-medium">Commission</p>
                              <p className="font-semibold text-orange-900">
                                {getCurrencySymbol(trade.currency)}{' '}
                                {trade.commission.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                          {trade.fees > 0 && (
                            <div className="bg-blue-50 rounded p-2 border border-blue-200">
                              <p className="text-blue-700 font-medium">Fees</p>
                              <p className="font-semibold text-blue-900">
                                {getCurrencySymbol(trade.currency)}{' '}
                                {trade.fees.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                          {trade.tax > 0 && (
                            <div className="bg-red-50 rounded p-2 border border-red-200">
                              <p className="text-red-700 font-medium">Tax</p>
                              <p className="font-semibold text-red-900">
                                {getCurrencySymbol(trade.currency)}{' '}
                                {trade.tax.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                          <div className="col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded p-2 border border-indigo-200">
                            <p className="text-indigo-700 font-medium">Net Total</p>
                            <p className="font-bold text-indigo-900">
                              {getCurrencySymbol(trade.currency)}{' '}
                              {trade.net_total.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 bg-gray-50 flex gap-2.5">
              <Button
                onClick={() => setShowTradingHistoryModal(false)}
                className="w-full h-9 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Trade Confirmation Modal */}
      {showTradeDeleteConfirm && tradeToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white rounded-2xl shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Delete Trade</h3>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Are you sure you want to delete this trade?
                  <br />
                  <span className="font-semibold">
                    {tradeToDelete.shares} shares of {tradeToDelete.symbol}
                  </span>
                  <br />
                  This will be permanently removed from your trading history.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTradeDeleteConfirm(false);
                    setTradeToDelete(null);
                  }}
                  className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement trade deletion via API
                    addNotification('info', 'Trade deletion coming soon');
                    setShowTradeDeleteConfirm(false);
                    setTradeToDelete(null);
                  }}
                  className="flex-1 h-9 text-sm bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  Delete Trade
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Portfolio Confirmation Modal */}
      {showDeleteConfirm && portfolioToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white rounded-2xl shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Delete Portfolio</h3>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Are you sure you want to delete the portfolio "
                  <span className="font-semibold">
                    {portfolios.find((p) => p.id === portfolioToDelete)?.name}
                  </span>
                  "? All holdings and trading history associated with this portfolio will be
                  permanently deleted.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPortfolioToDelete(null);
                  }}
                  className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeletePortfolio}
                  disabled={loading}
                  className="flex-1 h-9 text-sm bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  {loading ? 'Deleting...' : 'Delete Portfolio'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HoldingsPage;
