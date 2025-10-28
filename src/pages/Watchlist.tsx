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
import React, { useState } from 'react';
import { sampleWatchLists } from '../data/sample_watch_list.tsx';
import { Link } from 'react-router-dom';
import { Star, Plus, Edit2, Trash2, Search, TrendingUp, TrendingDown, X } from 'lucide-react';

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
  const [watchlists, setWatchlists] = useState<Watchlist[]>(sampleWatchLists);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>(watchlists[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<WatchlistItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistCurrency, setNewWatchlistCurrency] = useState('USD');

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId);

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

  const handleSearch = () => {
    const allStocks: WatchlistItem[] = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        price: 180,
        changePercent: 1.2,
        marketCap: 3000000000000,
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corp.',
        price: 350,
        changePercent: -0.5,
        marketCap: 2800000000000,
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 140,
        changePercent: 0.3,
        marketCap: 1800000000000,
      },
    ];

    setSearchResults(
      allStocks.filter(
        (stock) =>
          stock.symbol.includes(searchTerm.toUpperCase()) ||
          stock.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const addStockToActive = (stock: WatchlistItem) => {
    if (!activeWatchlist) return;
    if (activeWatchlist.items.find((item) => item.symbol === stock.symbol)) return;

    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === activeWatchlist.id ? { ...wl, items: [...wl.items, stock] } : wl,
      ),
    );
    setSearchResults([]);
    setSearchTerm('');
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
                          topGainers.map((stock, idx) => (
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
                          topLosers.map((stock, idx) => (
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

      {/* Search Bar */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                placeholder="Search by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-9 pl-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button
              size="sm"
              onClick={handleSearch}
              className="h-9 px-4 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
            >
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => {
                    setSearchResults([]);
                    setSearchTerm('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50/30 hover:from-indigo-50 hover:to-purple-50 transition border border-gray-200 hover:border-indigo-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">
                        {stock.symbol.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{stock.symbol}</p>
                      <p className="text-xs text-gray-500">{stock.companyName}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addStockToActive(stock)}
                    className="h-7 px-3 text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchTerm && searchResults.length === 0 && (
            <div className="mt-3 text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No stocks found matching "{searchTerm}"</p>
            </div>
          )}
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
                    to={`/company/${stock.symbol}`}
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
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
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
    </div>
  );
};

export default WatchlistPage;
