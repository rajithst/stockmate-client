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
import { NotificationToast } from '../components/ui/notification-toast';
import { useNotification } from '../lib/hooks/useNotification';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Trash2, Search, TrendingUp, TrendingDown, X } from 'lucide-react';

// Mock company data with logos (matching AppHeader)
const mockCompanies = [
  { symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com' },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    logo: 'https://logo.clearbit.com/microsoft.com',
  },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com' },
  { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' },
  { symbol: 'META', name: 'Meta Platforms Inc.', logo: 'https://logo.clearbit.com/meta.com' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', logo: 'https://logo.clearbit.com/nvidia.com' },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    logo: 'https://logo.clearbit.com/jpmorganchase.com',
  },
  { symbol: 'V', name: 'Visa Inc.', logo: 'https://logo.clearbit.com/visa.com' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', logo: 'https://logo.clearbit.com/jnj.com' },
  { symbol: 'WMT', name: 'Walmart Inc.', logo: 'https://logo.clearbit.com/walmart.com' },
  { symbol: 'DIS', name: 'The Walt Disney Company', logo: 'https://logo.clearbit.com/disney.com' },
];

interface WatchlistItem {
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
}

interface Watchlist {
  id: string;
  name: string;
  currency: string;
  items: WatchlistItem[];
}

const WatchlistPage: React.FC = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>(watchlists[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockCompanies>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistCurrency, setNewWatchlistCurrency] = useState('USD');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { notifications, addNotification, removeNotification } = useNotification();

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = mockCompanies.filter(
        (company) =>
          company.symbol.toLowerCase().includes(query.toLowerCase()) ||
          company.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    if (showSearchDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSearchDropdown]);

  // Add new watchlist
  const addWatchlist = () => {
    if (!newWatchlistName) return;
    const newList: Watchlist = {
      id: Date.now().toString(),
      name: newWatchlistName,
      currency: newWatchlistCurrency,
      items: [],
    };
    setWatchlists((prev) => [...prev, newList]);
    setActiveWatchlistId(newList.id);
    setNewWatchlistName('');
    setNewWatchlistCurrency('USD');
    setShowAddModal(false);
  };

  const deleteWatchlist = (id: string) => {
    if (watchlists.length === 1) return; // Keep at least one
    setWatchlists((prev) => prev.filter((wl) => wl.id !== id));
    if (activeWatchlistId === id) {
      setActiveWatchlistId(watchlists.find((wl) => wl.id !== id)?.id || '');
    }
  };

  // Add stock to active watchlist
  const addStockToActive = (company: (typeof mockCompanies)[0]) => {
    // If no watchlist exists, create one first
    if (watchlists.length === 0) {
      const newList: Watchlist = {
        id: Date.now().toString(),
        name: 'My Watchlist',
        currency: 'USD',
        items: [],
      };
      setWatchlists([newList]);
      setActiveWatchlistId(newList.id);

      // Add stock to the newly created watchlist
      const newItem: WatchlistItem = {
        symbol: company.symbol,
        companyName: company.name,
        price: Math.random() * 300 + 50,
        changePercent: Math.random() * 10 - 5,
        marketCap: Math.random() * 3000000000000,
        peRatio: Math.random() * 30 + 10,
      };

      setWatchlists((prev) => [{ ...prev[0], items: [newItem] }]);
      setSearchResults([]);
      setSearchQuery('');
      setShowSearchDropdown(false);
      return;
    }

    if (!activeWatchlist) return;

    // Check if already exists
    if (activeWatchlist.items.find((item) => item.symbol === company.symbol)) {
      addNotification('warning', `${company.symbol} is already in this watchlist`);
      return;
    }

    // Create watchlist item from company data
    const newItem: WatchlistItem = {
      symbol: company.symbol,
      companyName: company.name,
      price: Math.random() * 300 + 50, // Mock price
      changePercent: Math.random() * 10 - 5, // Mock change
      marketCap: Math.random() * 3000000000000, // Mock market cap
      peRatio: Math.random() * 30 + 10, // Mock P/E
    };

    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === activeWatchlist.id ? { ...wl, items: [...wl.items, newItem] } : wl,
      ),
    );
    setSearchResults([]);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const removeStock = (symbol: string) => {
    if (!activeWatchlist) return;
    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === activeWatchlist.id
          ? { ...wl, items: wl.items.filter((item) => item.symbol !== symbol) }
          : wl,
      ),
    );
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
                  <Star className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Watchlists
                  </h1>
                  <p className="text-[10px] text-gray-500">Track your favorite stocks</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-600">Watchlist:</label>
                  <Select value={activeWatchlistId} onValueChange={setActiveWatchlistId}>
                    <SelectTrigger className="w-[180px] h-8 text-sm border-indigo-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Watchlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchlists.map((wl) => (
                        <SelectItem key={wl.id} value={wl.id}>
                          {wl.name} ({wl.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => {
                    if (activeWatchlist) {
                      deleteWatchlist(activeWatchlist.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete Watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="h-8 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Watchlist
                </Button>
              </div>
            </div>

            {/* Watchlist Stats */}
            {activeWatchlist &&
              (() => {
                const gainers = activeWatchlist.items.filter((s) => s.changePercent > 0);
                const losers = activeWatchlist.items.filter((s) => s.changePercent < 0);
                const topGainers = gainers
                  .sort((a, b) => b.changePercent - a.changePercent)
                  .slice(0, 5);
                const topLosers = losers
                  .sort((a, b) => a.changePercent - b.changePercent)
                  .slice(0, 5);

                return (
                  <div className="space-y-2">
                    {/* Top Performers Row */}
                    <div className="flex gap-2">
                      {/* Top 5 Gainers */}
                      <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1">
                        {topGainers.length > 0 ? (
                          topGainers.map((stock) => (
                            <div
                              key={`gainer-${stock.symbol}`}
                              className="flex-shrink-0 px-2 py-1.5 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 border border-green-300 hover:shadow-md transition cursor-default"
                            >
                              <div className="text-[9px] font-bold text-green-700">
                                {stock.symbol}
                              </div>
                              <div className="text-[10px] font-bold text-green-600">
                                +{stock.changePercent.toFixed(1)}%
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400">No gainers</span>
                          </div>
                        )}
                      </div>

                      {/* Top 5 Losers */}
                      <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1">
                        {topLosers.length > 0 ? (
                          topLosers.map((stock) => (
                            <div
                              key={`loser-${stock.symbol}`}
                              className="flex-shrink-0 px-2 py-1.5 rounded-lg bg-gradient-to-br from-red-100 to-rose-100 border border-red-300 hover:shadow-md transition cursor-default"
                            >
                              <div className="text-[9px] font-bold text-red-700">
                                {stock.symbol}
                              </div>
                              <div className="text-[10px] font-bold text-red-600">
                                {stock.changePercent.toFixed(1)}%
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400">No losers</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Gainers Count */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-2 border border-green-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold text-gray-600">Gainers</p>
                            <p className="text-sm font-bold text-green-600">{gainers.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Losers Count */}
                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-2 border border-red-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                            <TrendingDown className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold text-gray-600">Losers</p>
                            <p className="text-sm font-bold text-red-600">{losers.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </Card>
      </div>

      {/* Search Bar with Company Logos */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-visible bg-white/80 backdrop-blur-sm relative z-40">
        <div className="p-3">
          <div ref={searchContainerRef} className="relative z-50">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks by symbol or company name..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="w-full h-10 pl-12 pr-10 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Dropdown with Company Logos */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto">
                {searchResults.map((company) => (
                  <div
                    key={company.symbol}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addStockToActive(company);
                    }}
                    className="w-full px-3 py-3 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo}
                        alt={company.symbol}
                        className="w-9 h-9 rounded-lg flex-shrink-0 object-contain bg-gray-100 p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                          {company.symbol}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-700 truncate">
                          {company.name}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stocks Table */}
      {activeWatchlist && activeWatchlist.items.length > 0 ? (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          {/* Table Header */}
          <div className="grid grid-cols-8 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-indigo-600" />
              Symbol
            </div>
            <div className="col-span-2">Company</div>
            <div className="text-right">Price</div>
            <div className="text-right flex items-center justify-end gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Change
            </div>
            <div className="text-right">Market Cap</div>
            <div className="text-right">P/E Ratio</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Rows */}
          <div>
            {activeWatchlist.items.map((stock) => (
              <div
                key={stock.symbol}
                className="grid grid-cols-8 items-center px-4 py-3 text-xs border-b last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xs">
                      {stock.symbol.substring(0, 2)}
                    </span>
                  </div>
                  <Link
                    to={`/app/company/${stock.symbol}`}
                    className="font-semibold text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {stock.symbol}
                  </Link>
                </div>
                <div className="col-span-2 text-sm text-gray-800">{stock.companyName}</div>
                <div className="text-right text-sm font-semibold text-gray-900">
                  ${stock.price.toFixed(2)}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold text-sm ${
                        stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  ${(stock.marketCap / 1_000_000_000).toFixed(2)}B
                </div>
                <div className="text-right text-sm text-gray-600">
                  {stock.peRatio?.toFixed(2) ?? '-'}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => removeStock(stock.symbol)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm relative z-0">
          <div className="p-8 text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No stocks in watchlist</h3>
            <p className="text-xs text-gray-500">Use the search bar above to add stocks</p>
          </div>
        </Card>
      )}

      {/* Add Watchlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Create Watchlist</h2>
                    <p className="text-xs text-indigo-100">Add a new watchlist</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Watchlist Name
                </label>
                <Input
                  placeholder="e.g., Tech Stocks"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Currency</label>
                <Input
                  placeholder="USD"
                  value={newWatchlistCurrency}
                  onChange={(e) => setNewWatchlistCurrency(e.target.value.toUpperCase())}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={addWatchlist}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
              >
                Create Watchlist
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Toast */}
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
    </div>
  );
};

export default WatchlistPage;
