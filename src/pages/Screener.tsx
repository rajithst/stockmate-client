import React, { useState } from 'react';
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
import { ArrowDown, ArrowUp, Filter, RotateCcw, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScreenParams {
  market_cap_more_than?: number;
  market_cap_lower_than?: number;
  beta_more_than?: number;
  beta_lower_than?: number;
  price_more_than?: number;
  price_lower_than?: number;
  dividend_more_than?: number;
  dividend_lower_than?: number;
  volume_more_than?: number;
  volume_lower_than?: number;
  is_actively_trading?: boolean;
  exchange?: string;
  sector?: string;
  industry?: string;
  country?: string;
  limit?: number;
}

export interface FMPStockScreenResult {
  symbol: string;
  company_name: string;
  market_cap: number;
  sector: string;
  industry: string;
  beta: number;
  price: number;
  last_annual_dividend: number;
  volume: number;
  exchange: string;
  exchange_short_name: string;
  country: string;
  is_etf: boolean;
  is_fund: boolean;
  is_actively_trading: boolean;
}

// Mock API call
const fetchStockScreen = async (params: ScreenParams): Promise<FMPStockScreenResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          symbol: 'AAPL',
          company_name: 'Apple Inc.',
          market_cap: 2400000000000,
          sector: 'Technology',
          industry: 'Consumer Electronics',
          beta: 1.2,
          price: 178,
          last_annual_dividend: 0.92,
          volume: 65000000,
          exchange: 'NASDAQ',
          exchange_short_name: 'NAS',
          country: 'USA',
          is_etf: false,
          is_fund: false,
          is_actively_trading: true,
        },
        {
          symbol: 'MSFT',
          company_name: 'Microsoft Corp.',
          market_cap: 2200000000000,
          sector: 'Technology',
          industry: 'Software',
          beta: 0.95,
          price: 310,
          last_annual_dividend: 2.48,
          volume: 28000000,
          exchange: 'NASDAQ',
          exchange_short_name: 'NAS',
          country: 'USA',
          is_etf: false,
          is_fund: false,
          is_actively_trading: true,
        },
      ]);
    }, 500);
  });
};

const StockScreener: React.FC = () => {
  const [params, setParams] = useState<ScreenParams>({ limit: 20 });
  const [results, setResults] = useState<FMPStockScreenResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof FMPStockScreenResult | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const rowsPerPage = 10;

  const handleInputChange = (key: keyof ScreenParams, value: string | number | boolean) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleScreen = async () => {
    setLoading(true);
    const res = await fetchStockScreen(params);
    setResults(res);
    setPage(1);
    setLoading(false);
  };

  const handleReset = () => {
    setParams({ limit: 20 });
    setResults([]);
    setSearch('');
    setPage(1);
  };

  const handleSort = (key: keyof FMPStockScreenResult) => {
    if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filtered = results.filter(
    (r) =>
      r.symbol.toLowerCase().includes(search.toLowerCase()) ||
      r.company_name.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'number' && typeof valB === 'number')
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 space-y-4">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-5"></div>
        <Card className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="relative p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Filter className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Stock Screener
                  </h1>
                  <p className="text-[10px] text-gray-500">Filter and explore stocks by criteria</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div
          className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-100/50 hover:to-purple-100/50 transition-colors flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-bold text-gray-800">Filters</p>
          </div>
          <ArrowDown
            className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
        </div>

        {showFilters && (
          <div className="p-4 space-y-3 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Market Cap */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Market Cap</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={params.market_cap_more_than || ''}
                    onChange={(e) =>
                      handleInputChange('market_cap_more_than', Number(e.target.value))
                    }
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={params.market_cap_lower_than || ''}
                    onChange={(e) =>
                      handleInputChange('market_cap_lower_than', Number(e.target.value))
                    }
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Price</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={params.price_more_than || ''}
                    onChange={(e) => handleInputChange('price_more_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={params.price_lower_than || ''}
                    onChange={(e) => handleInputChange('price_lower_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Dividend */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Dividend</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Min"
                    type="number"
                    step="0.01"
                    value={params.dividend_more_than || ''}
                    onChange={(e) =>
                      handleInputChange('dividend_more_than', Number(e.target.value))
                    }
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    step="0.01"
                    value={params.dividend_lower_than || ''}
                    onChange={(e) =>
                      handleInputChange('dividend_lower_than', Number(e.target.value))
                    }
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Volume</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={params.volume_more_than || ''}
                    onChange={(e) => handleInputChange('volume_more_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={params.volume_lower_than || ''}
                    onChange={(e) => handleInputChange('volume_lower_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Beta */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Beta</label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Min"
                    type="number"
                    step="0.01"
                    value={params.beta_more_than || ''}
                    onChange={(e) => handleInputChange('beta_more_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    step="0.01"
                    value={params.beta_lower_than || ''}
                    onChange={(e) => handleInputChange('beta_lower_than', Number(e.target.value))}
                    className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Exchange */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Exchange</label>
                <Input
                  placeholder="e.g., NASDAQ, NYSE"
                  value={params.exchange || ''}
                  onChange={(e) => handleInputChange('exchange', e.target.value)}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              {/* Sector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Sector</label>
                <Input
                  placeholder="e.g., Technology"
                  value={params.sector || ''}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              {/* Industry */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Industry</label>
                <Input
                  placeholder="e.g., Software"
                  value={params.industry || ''}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Country</label>
                <Input
                  placeholder="e.g., USA"
                  value={params.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              {/* Limit */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Results Limit</label>
                <Input
                  placeholder="20"
                  type="number"
                  value={params.limit || ''}
                  onChange={(e) => handleInputChange('limit', Number(e.target.value))}
                  className="h-9 text-sm border-indigo-200 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons - Below Filters */}
            <div className="flex gap-2.5 pt-2 border-t border-gray-200 mt-4">
              <Button
                onClick={handleScreen}
                className="flex-1 h-9 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-white font-semibold"
                disabled={loading}
              >
                {loading ? 'Screening...' : 'Run Screen'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-9 px-4 text-sm border-gray-300 hover:bg-gray-100"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Search Bar */}
      <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="p-3">
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Search by symbol or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </Card>

      {/* Results Table */}
      {results.length > 0 ? (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          {/* Table Header */}
          <div className="grid grid-cols-9 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
              Symbol
            </div>
            <div className="col-span-2">Company</div>
            <div
              className="text-right cursor-pointer hover:text-indigo-600"
              onClick={() => handleSort('price')}
            >
              Price{' '}
              {sortKey === 'price' &&
                (sortOrder === 'asc' ? (
                  <ArrowUp className="w-3 h-3 inline" />
                ) : (
                  <ArrowDown className="w-3 h-3 inline" />
                ))}
            </div>
            <div
              className="text-right cursor-pointer hover:text-indigo-600"
              onClick={() => handleSort('market_cap')}
            >
              Market Cap
            </div>
            <div
              className="text-right cursor-pointer hover:text-indigo-600"
              onClick={() => handleSort('volume')}
            >
              Volume
            </div>
            <div
              className="text-right cursor-pointer hover:text-indigo-600"
              onClick={() => handleSort('last_annual_dividend')}
            >
              Dividend
            </div>
            <div
              className="text-right cursor-pointer hover:text-indigo-600"
              onClick={() => handleSort('beta')}
            >
              Beta
            </div>
            <div className="text-right">Country</div>
          </div>

          {/* Table Rows */}
          <div>
            {paginated.map((item, idx) => (
              <div
                key={item.symbol + idx}
                className="grid grid-cols-9 items-center px-4 py-3 text-xs border-b last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xs">
                      {item.symbol.substring(0, 2)}
                    </span>
                  </div>
                  <Link
                    to={`/company/${item.symbol}`}
                    className="font-semibold text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {item.symbol}
                  </Link>
                </div>
                <div className="col-span-2 text-sm text-gray-800">{item.company_name}</div>
                <div className="text-right text-sm font-semibold text-gray-900">
                  ${item.price.toLocaleString()}
                </div>
                <div className="text-right text-sm text-gray-600">
                  ${(item.market_cap / 1_000_000_000).toFixed(2)}B
                </div>
                <div className="text-right text-sm text-gray-600">
                  {(item.volume / 1_000_000).toFixed(1)}M
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-semibold ${item.last_annual_dividend > 0 ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {item.last_annual_dividend > 0 ? '+' : ''}
                    {item.last_annual_dividend.toFixed(2)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">{item.beta.toFixed(2)}</div>
                <div className="text-right text-sm text-gray-600">{item.country}</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <span className="text-xs font-semibold text-gray-600">
              Page {page} of {totalPages || 1} ({sorted.length} total)
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-8 text-center">
            <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No results yet</h3>
            <p className="text-xs text-gray-500">
              Configure filters and run a screen to see results
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockScreener;
