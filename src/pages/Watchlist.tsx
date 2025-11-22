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
import { apiClient } from '../api/client';
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
  id: number;
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
  priceChange: number;
  marketCap: number;
  currency: string;
  peRatio?: number;
  pegRatio?: number;
  forwardPegRatio?: number;
  pbRatio?: number;
  psRatio?: number;
  pfcfRatio?: number;
  pocfRatio?: number;
  image?: string;
}

interface Watchlist {
  id: string;
  name: string;
  currency: string;
  items: WatchlistItem[];
}

const WatchlistPage: React.FC = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockCompanies>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [watchlistToDelete, setWatchlistToDelete] = useState<string | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistCurrency, setNewWatchlistCurrency] = useState('USD');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const loadedWatchlistItemsRef = useRef<Set<string>>(new Set());

  const { notifications, addNotification, removeNotification } = useNotification();

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId);

  // Load watchlists on mount
  React.useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const loadWatchlists = async () => {
      try {
        const fetchedWatchlists = await apiClient.getWatchlists();
        const localWatchlists: Watchlist[] = fetchedWatchlists.map((wl) => ({
          id: wl.id.toString(),
          name: wl.name,
          currency: wl.currency,
          items: [],
        }));
        setWatchlists(localWatchlists);
        if (localWatchlists.length > 0) {
          setActiveWatchlistId(localWatchlists[0].id);
        }
      } catch (error) {
        console.error('Error loading watchlists:', error);
      }
    };

    loadWatchlists();
  }, []);

  // Load watchlist items when active watchlist changes
  React.useEffect(() => {
    if (!activeWatchlistId) return;

    // Skip if we've already successfully loaded items for this watchlist
    if (loadedWatchlistItemsRef.current.has(activeWatchlistId)) return;

    // Mark as loading immediately to prevent duplicate requests
    loadedWatchlistItemsRef.current.add(activeWatchlistId);

    let isMounted = true;

    const loadWatchlistItems = async () => {
      try {
        const watchlistIdNum = parseInt(activeWatchlistId);
        const items = await apiClient.getWatchlistItems(watchlistIdNum);

        if (!isMounted) return;

        // Convert WatchlistCompanyItem to WatchlistItem
        const convertedItems: WatchlistItem[] = items.map((item) => ({
          id: item.id,
          symbol: item.symbol,
          companyName: item.company_name,
          price: item.price,
          changePercent: item.price_change_percent,
          priceChange: item.price_change,
          marketCap: item.market_cap,
          currency: item.currency,
          peRatio: item.price_to_earnings_ratio ?? undefined,
          pegRatio: item.price_to_earnings_growth_ratio ?? undefined,
          forwardPegRatio: item.forward_price_to_earnings_growth_ratio ?? undefined,
          pbRatio: item.price_to_book_ratio ?? undefined,
          psRatio: item.price_to_sales_ratio ?? undefined,
          pfcfRatio: item.price_to_free_cash_flow_ratio ?? undefined,
          pocfRatio: item.price_to_operating_cash_flow_ratio ?? undefined,
          image: item.image ?? undefined,
        }));

        // Update the active watchlist with fetched items
        setWatchlists((prev) =>
          prev.map((wl) => (wl.id === activeWatchlistId ? { ...wl, items: convertedItems } : wl)),
        );
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading watchlist items:', error);
        // Remove from loaded set on error so it can retry
        loadedWatchlistItemsRef.current.delete(activeWatchlistId);
      }
    };

    loadWatchlistItems();

    return () => {
      isMounted = false;
    };
  }, [activeWatchlistId]);

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
  const addWatchlist = async () => {
    if (!newWatchlistName) return;

    try {
      const newWatchlist = await apiClient.createWatchlist({
        name: newWatchlistName,
        currency: newWatchlistCurrency,
      });

      // Convert WatchlistRead to Watchlist interface for local state
      const localWatchlist: Watchlist = {
        id: newWatchlist.id.toString(),
        name: newWatchlist.name,
        currency: newWatchlist.currency,
        items: [],
      };

      setWatchlists((prev) => [...prev, localWatchlist]);
      setActiveWatchlistId(localWatchlist.id);
      // Mark as needing to load items (not pre-loaded)
      loadedWatchlistItemsRef.current.delete(localWatchlist.id);

      setNewWatchlistName('');
      setNewWatchlistCurrency('USD');
      setShowAddModal(false);
      addNotification('success', `Watchlist "${newWatchlistName}" created successfully`);
    } catch (error) {
      console.error('Error creating watchlist:', error);
      addNotification('error', 'Failed to create watchlist');
    }
  };

  const deleteWatchlist = (id: string) => {
    setWatchlistToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteWatchlist = async () => {
    if (!watchlistToDelete) return;

    try {
      const watchlistIdNum = parseInt(watchlistToDelete);
      await apiClient.deleteWatchlist(watchlistIdNum);

      setWatchlists((prev) => prev.filter((wl) => wl.id !== watchlistToDelete));
      // Remove from loaded items tracking
      loadedWatchlistItemsRef.current.delete(watchlistToDelete);

      if (activeWatchlistId === watchlistToDelete) {
        const nextWatchlist = watchlists.find((wl) => wl.id !== watchlistToDelete);
        if (nextWatchlist) {
          setActiveWatchlistId(nextWatchlist.id);
        } else {
          setActiveWatchlistId('');
        }
      }

      addNotification('success', 'Watchlist deleted successfully');
      setShowDeleteConfirmation(false);
      setWatchlistToDelete(null);
    } catch (error) {
      console.error('Error deleting watchlist:', error);
      addNotification('error', 'Failed to delete watchlist');
      setShowDeleteConfirmation(false);
      setWatchlistToDelete(null);
    }
  };

  // Add stock to active watchlist
  const addStockToActive = async (company: (typeof mockCompanies)[0]) => {
    if (!activeWatchlist) return;

    // Check if already exists
    if (activeWatchlist.items.find((item) => item.symbol === company.symbol)) {
      addNotification('warning', `${company.symbol} is already in this watchlist`);
      return;
    }

    try {
      // Call API to add item to watchlist
      const watchlistIdNum = parseInt(activeWatchlist.id);
      const addedItem = await apiClient.addWatchlistItem(watchlistIdNum, company.symbol);

      // Convert WatchlistCompanyItem to WatchlistItem and add to state
      const newItem: WatchlistItem = {
        id: addedItem.id,
        symbol: addedItem.symbol,
        companyName: addedItem.company_name,
        price: addedItem.price,
        changePercent: addedItem.price_change_percent,
        priceChange: addedItem.price_change,
        marketCap: addedItem.market_cap,
        currency: addedItem.currency,
        peRatio: addedItem.price_to_earnings_ratio ?? undefined,
        pegRatio: addedItem.price_to_earnings_growth_ratio ?? undefined,
        forwardPegRatio: addedItem.forward_price_to_earnings_growth_ratio ?? undefined,
        pbRatio: addedItem.price_to_book_ratio ?? undefined,
        psRatio: addedItem.price_to_sales_ratio ?? undefined,
        pfcfRatio: addedItem.price_to_free_cash_flow_ratio ?? undefined,
        pocfRatio: addedItem.price_to_operating_cash_flow_ratio ?? undefined,
        image: addedItem.image ?? undefined,
      };

      setWatchlists((prev) =>
        prev.map((wl) =>
          wl.id === activeWatchlist.id ? { ...wl, items: [...wl.items, newItem] } : wl,
        ),
      );

      addNotification('success', `${company.symbol} added to watchlist`);
      setSearchResults([]);
      setSearchQuery('');
      setShowSearchDropdown(false);
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      addNotification('error', `Failed to add ${company.symbol} to watchlist`);
    }
  };

  const removeStock = async (id: number, symbol: string) => {
    if (!activeWatchlist) return;

    try {
      const watchlistIdNum = parseInt(activeWatchlist.id);
      await apiClient.deleteWatchlistItem(watchlistIdNum, id.toString());

      setWatchlists((prev) =>
        prev.map((wl) =>
          wl.id === activeWatchlist.id
            ? { ...wl, items: wl.items.filter((item) => item.id !== id) }
            : wl,
        ),
      );

      addNotification('success', `${symbol} removed from watchlist`);
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      addNotification('error', `Failed to remove ${symbol} from watchlist`);
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

            {/* Watchlist Stats - REMOVED */}
          </div>
        </Card>
      </div>

      {/* Stocks Table */}
      {activeWatchlist ? (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          {/* Table Header with Search */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between gap-4">
            <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-indigo-600" />
              <span>Watchlist Items</span>
            </div>

            {/* Search Bar in Top Right */}
            <div ref={searchContainerRef} className="relative z-50 w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                className="w-full h-8 pl-9 pr-8 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                    setSearchResults([]);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Search Dropdown with Company Logos */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto">
                  {searchResults.map((company) => (
                    <div
                      key={company.symbol}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addStockToActive(company);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={company.logo}
                          alt={company.symbol}
                          className="w-7 h-7 rounded-lg flex-shrink-0 object-contain bg-gray-100 p-0.5"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                            {company.symbol}
                          </p>
                          <p className="text-[10px] text-gray-500 group-hover:text-gray-700 truncate">
                            {company.name}
                          </p>
                        </div>
                        <Plus className="w-3 h-3 text-green-600 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Column Headers */}
          <div className="grid grid-cols-12 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs font-semibold text-gray-700 border-t border-gray-100">
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
            <div className="text-right">P/E</div>
            <div className="text-right">P/B</div>
            <div className="text-right">P/S</div>
            <div className="text-right">PEG</div>
            <div className="text-right">P/FCF</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Rows or Empty State */}
          {activeWatchlist.items.length > 0 ? (
            <div>
              {activeWatchlist.items.map((stock) => (
                <div
                  key={stock.symbol}
                  className="grid grid-cols-12 items-center px-4 py-3 text-xs border-b last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    {stock.image ? (
                      <img
                        src={stock.image}
                        alt={stock.symbol}
                        className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xs">
                          {stock.symbol.substring(0, 2)}
                        </span>
                      </div>
                    )}
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
                  <div className="text-right text-sm text-gray-600">
                    {stock.pbRatio?.toFixed(2) ?? '-'}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {stock.psRatio?.toFixed(2) ?? '-'}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {stock.pegRatio?.toFixed(2) ?? '-'}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {stock.pfcfRatio?.toFixed(2) ?? '-'}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => removeStock(stock.id, stock.symbol)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-base font-semibold text-gray-700 mb-1">No stocks in watchlist</h3>
              <p className="text-xs text-gray-500">Use the search bar above to add stocks</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm relative z-0">
          <div className="p-8 text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No watchlist selected</h3>
            <p className="text-xs text-gray-500">Create a new watchlist to get started</p>
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

      {/* Delete Watchlist Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Delete Watchlist?</h2>
                  <p className="text-xs text-red-100">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this watchlist? All items in it will be permanently
                removed.
              </p>
            </div>

            <div className="flex gap-2.5 p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setWatchlistToDelete(null);
                }}
                className="flex-1 h-9 text-sm border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteWatchlist}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-md text-white"
              >
                Delete Watchlist
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
