import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, TrendingUp, BarChart2, X } from 'lucide-react';

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

const marketIndices = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 6848.57,
    changePercentage: 0.83749,
    change: 56.88,
    volume: 977471474,
    dayLow: 6843.94,
    dayHigh: 6859.13,
    yearHigh: 6859.13,
    yearLow: 4835.04,
    marketCap: 0,
    priceAvg50: 6595.1616,
    priceAvg200: 6086.792,
    exchange: 'INDEX',
    open: 6845.46,
    previousClose: 6791.69,
    timestamp: 1761577792,
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones Industrial Average',
    price: 39131.53,
    changePercentage: 0.45,
    change: 175.34,
    volume: 350000000,
    dayLow: 39000.0,
    dayHigh: 39200.0,
    yearHigh: 39200.0,
    yearLow: 33000.0,
    marketCap: 0,
    priceAvg50: 38500.0,
    priceAvg200: 37000.0,
    exchange: 'INDEX',
    open: 39050.0,
    previousClose: 38956.19,
    timestamp: 1761577792,
  },
  {
    symbol: '^N225',
    name: 'Nikkei 225',
    price: 39098.68,
    changePercentage: 1.12,
    change: 433.1,
    volume: 120000000,
    dayLow: 38900.0,
    dayHigh: 39150.0,
    yearHigh: 39150.0,
    yearLow: 32000.0,
    marketCap: 0,
    priceAvg50: 38500.0,
    priceAvg200: 36000.0,
    exchange: 'INDEX',
    open: 39000.0,
    previousClose: 38665.58,
    timestamp: 1761577792,
  },
];

// Example trending stocks (replace with real API)
const trendingStocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 120.45, change: 2.34, changePct: 1.98 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 210.12, change: -3.12, changePct: -1.46 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.67, change: 1.01, changePct: 0.55 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 162.88, change: 4.22, changePct: 2.66 },
];

// Example sector performance (replace with real API)
const sectorPerformance = [
  { sector: 'Technology', changePct: 1.23 },
  { sector: 'Healthcare', changePct: -0.45 },
  { sector: 'Financials', changePct: 0.87 },
  { sector: 'Consumer Discretionary', changePct: 0.34 },
  { sector: 'Energy', changePct: -1.12 },
];

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockCompanies>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Handle company selection
  const handleSelectCompany = (symbol: string) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
    navigate(`/company/${symbol}`);
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

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-2 tracking-tight text-center">
          Analyze Stocks Like a Pro
        </h1>
        <p className="text-lg text-gray-500 mb-6 text-center max-w-2xl">
          Discover market trends, track your favorite companies, and explore sector performance with
          real-time insights.
        </p>
        {/* Search Bar with Company Logos */}
        <div ref={searchContainerRef} className="relative w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks by symbol or company name..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="w-full h-12 pl-12 pr-10 text-base rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Search Dropdown with Company Logos */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                {searchResults.map((company) => (
                  <button
                    key={company.symbol}
                    onClick={() => handleSelectCompany(company.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo}
                        alt={company.symbol}
                        className="w-10 h-10 rounded-lg flex-shrink-0 object-contain bg-gray-100 p-1"
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
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {marketIndices.map((idx) => (
          <Card
            key={idx.symbol}
            className="border-none shadow-xl rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 hover:shadow-2xl transition-all"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {idx.name}
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 rounded px-2 py-0.5">
                  {idx.symbol}
                </span>
              </CardTitle>
              <span className="text-xs text-gray-500">{idx.exchange}</span>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${idx.price.toLocaleString()}
                </span>
                <span
                  className={`text-base font-semibold ${
                    idx.change > 0
                      ? 'text-green-600'
                      : idx.change < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }`}
                >
                  {idx.change > 0 ? '+' : ''}
                  {idx.change.toLocaleString()} ({idx.changePercentage > 0 ? '+' : ''}
                  {(idx.changePercentage * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="flex flex-wrap gap-6 mt-2 text-xs text-gray-600">
                <span>
                  <strong>Open:</strong> {idx.open}
                </span>
                <span>
                  <strong>Prev Close:</strong> {idx.previousClose}
                </span>
                <span>
                  <strong>Day Range:</strong> {idx.dayLow} - {idx.dayHigh}
                </span>
                <span>
                  <strong>52W Range:</strong> {idx.yearLow} - {idx.yearHigh}
                </span>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>Vol: {idx.volume.toLocaleString()}</span>
                <span>50D Avg: {idx.priceAvg50.toLocaleString()}</span>
                <span>200D Avg: {idx.priceAvg200.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Stocks */}
      <div className="mb-12">
        <Card className="border-none shadow-xl rounded-2xl bg-white">
          <CardHeader className="flex items-center gap-2 pb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg font-bold text-gray-800">Trending Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-br from-gray-50 via-white to-indigo-50 hover:bg-indigo-50 transition cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/company/${stock.symbol}`)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">{stock.name}</span>
                    <span className="text-xs font-mono text-indigo-600 bg-indigo-50 rounded px-2 py-0.5">
                      {stock.symbol}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${stock.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        stock.change > 0
                          ? 'text-green-600'
                          : stock.change < 0
                            ? 'text-red-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {stock.change > 0 ? '+' : ''}
                      {stock.change.toLocaleString()} ({stock.changePct > 0 ? '+' : ''}
                      {stock.changePct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Performance */}
      <div className="mb-12">
        <Card className="border-none shadow-xl rounded-2xl bg-white">
          <CardHeader className="flex items-center gap-2 pb-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg font-bold text-gray-800">Sector Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sectorPerformance.map((sector) => (
                <div
                  key={sector.sector}
                  className="flex flex-col items-start p-3 rounded-lg bg-gradient-to-br from-gray-50 via-white to-indigo-50 border border-gray-100"
                >
                  <span className="font-semibold text-gray-700">{sector.sector}</span>
                  <span
                    className={`text-sm font-bold ${
                      sector.changePct > 0
                        ? 'text-green-600'
                        : sector.changePct < 0
                          ? 'text-red-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {sector.changePct > 0 ? '+' : ''}
                    {sector.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-6">
        © {new Date().getFullYear()}{' '}
        <span className="font-semibold text-indigo-600">StockMate</span>
      </div>
    </div>
  );
};

export default HomePage;
