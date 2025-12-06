import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
  console.log(params);
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
    <div className="container mx-auto p-4 space-y-4">
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
        <div className="p-4 space-y-4">
          {/* Filters Title */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">Filter Stocks</h2>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Market Cap */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
              <label className="text-xs font-bold text-indigo-700 block mb-2">Market Cap (B)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={params.market_cap_more_than || ''}
                  onChange={(e) =>
                    handleInputChange('market_cap_more_than', Number(e.target.value))
                  }
                  className="h-8 text-xs border-indigo-300 focus:ring-indigo-500"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={params.market_cap_lower_than || ''}
                  onChange={(e) =>
                    handleInputChange('market_cap_lower_than', Number(e.target.value))
                  }
                  className="h-8 text-xs border-indigo-300 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Price */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
              <label className="text-xs font-bold text-purple-700 block mb-2">Price ($)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={params.price_more_than || ''}
                  onChange={(e) => handleInputChange('price_more_than', Number(e.target.value))}
                  className="h-8 text-xs border-purple-300 focus:ring-purple-500"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={params.price_lower_than || ''}
                  onChange={(e) => handleInputChange('price_lower_than', Number(e.target.value))}
                  className="h-8 text-xs border-purple-300 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Dividend */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
              <label className="text-xs font-bold text-green-700 block mb-2">Dividend (%)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  step="0.01"
                  value={params.dividend_more_than || ''}
                  onChange={(e) => handleInputChange('dividend_more_than', Number(e.target.value))}
                  className="h-8 text-xs border-green-300 focus:ring-green-500"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  step="0.01"
                  value={params.dividend_lower_than || ''}
                  onChange={(e) => handleInputChange('dividend_lower_than', Number(e.target.value))}
                  className="h-8 text-xs border-green-300 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Volume */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
              <label className="text-xs font-bold text-blue-700 block mb-2">Volume (M)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={params.volume_more_than || ''}
                  onChange={(e) => handleInputChange('volume_more_than', Number(e.target.value))}
                  className="h-8 text-xs border-blue-300 focus:ring-blue-500"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={params.volume_lower_than || ''}
                  onChange={(e) => handleInputChange('volume_lower_than', Number(e.target.value))}
                  className="h-8 text-xs border-blue-300 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Beta */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200">
              <label className="text-xs font-bold text-orange-700 block mb-2">Beta</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  step="0.01"
                  value={params.beta_more_than || ''}
                  onChange={(e) => handleInputChange('beta_more_than', Number(e.target.value))}
                  className="h-8 text-xs border-orange-300 focus:ring-orange-500"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  step="0.01"
                  value={params.beta_lower_than || ''}
                  onChange={(e) => handleInputChange('beta_lower_than', Number(e.target.value))}
                  className="h-8 text-xs border-orange-300 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Exchange */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
              <label className="text-xs font-bold text-red-700 block mb-2">Exchange</label>
              <Input
                placeholder="NASDAQ, NYSE"
                value={params.exchange || ''}
                onChange={(e) => handleInputChange('exchange', e.target.value)}
                className="h-8 text-xs border-red-300 focus:ring-red-500"
              />
            </div>

            {/* Sector */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-200">
              <label className="text-xs font-bold text-cyan-700 block mb-2">Sector</label>
              <Input
                placeholder="Technology"
                value={params.sector || ''}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                className="h-8 text-xs border-cyan-300 focus:ring-cyan-500"
              />
            </div>

            {/* Industry */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200">
              <label className="text-xs font-bold text-pink-700 block mb-2">Industry</label>
              <Input
                placeholder="Software"
                value={params.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="h-8 text-xs border-pink-300 focus:ring-pink-500"
              />
            </div>

            {/* Country */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
              <label className="text-xs font-bold text-amber-700 block mb-2">Country</label>
              <Input
                placeholder="USA"
                value={params.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="h-8 text-xs border-amber-300 focus:ring-amber-500"
              />
            </div>

            {/* Results Limit */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200">
              <label className="text-xs font-bold text-violet-700 block mb-2">Results Limit</label>
              <Input
                placeholder="20"
                type="number"
                value={params.limit || ''}
                onChange={(e) => handleInputChange('limit', Number(e.target.value))}
                className="h-8 text-xs border-violet-300 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleScreen}
              className="flex-1 h-10 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-white font-semibold rounded-lg"
              disabled={loading}
            >
              {loading ? 'Screening...' : 'Run Screen'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-10 px-6 text-sm border-gray-300 hover:bg-gray-100 rounded-lg font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      {results.length > 0 ? (
        <Card className="shadow-xl rounded-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          {/* Search Bar Inside Table Card */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                placeholder="Search results by symbol or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 text-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

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
                    to={`/app/company/${item.symbol}`}
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
