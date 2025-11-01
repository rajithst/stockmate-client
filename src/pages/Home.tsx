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

// Example sector performance (replace with real API)
const sectorPerformance = [
  { sector: 'Technology', changePct: 1.23, value: 45.2 },
  { sector: 'Healthcare', changePct: -0.45, value: 15.8 },
  { sector: 'Financials', changePct: 0.87, value: 18.5 },
  { sector: 'Consumer Discretionary', changePct: 0.34, value: 12.3 },
  { sector: 'Energy', changePct: -1.12, value: 8.2 },
  { sector: 'Industrials', changePct: 0.56, value: 10.5 },
];

// Example industry performance (replace with real API)
const industryPerformance = [
  { industry: 'Semiconductors', changePct: 2.45, leader: 'NVDA' },
  { industry: 'Software', changePct: 1.78, leader: 'MSFT' },
  { industry: 'E-commerce', changePct: -0.89, leader: 'AMZN' },
  { industry: 'Automotive', changePct: -1.23, leader: 'TSLA' },
  { industry: 'Banking', changePct: 0.92, leader: 'JPM' },
  { industry: 'Pharmaceuticals', changePct: -0.34, leader: 'JNJ' },
];

// Example general news (replace with real API)
const generalNews = [
  {
    id: 1,
    title: 'Federal Reserve Holds Interest Rates Steady',
    source: 'Financial Times',
    time: '2 hours ago',
    category: 'Markets',
  },
  {
    id: 2,
    title: 'Tech Sector Rallies on Strong Earnings Reports',
    source: 'Bloomberg',
    time: '4 hours ago',
    category: 'Technology',
  },
  {
    id: 3,
    title: 'Oil Prices Drop Amid Global Supply Concerns',
    source: 'Reuters',
    time: '5 hours ago',
    category: 'Energy',
  },
  {
    id: 4,
    title: 'US Jobs Report Exceeds Expectations',
    source: 'CNBC',
    time: '6 hours ago',
    category: 'Economy',
  },
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
    navigate(`/app/company/${symbol}`);
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
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight text-center">
          Analyze Stocks Like a Pro
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center max-w-2xl">
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
              className="w-full h-12 pl-12 pr-10 text-base rounded-xl border border-indigo-200 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                {searchResults.map((company) => (
                  <button
                    key={company.symbol}
                    onClick={() => handleSelectCompany(company.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo}
                        alt={company.symbol}
                        className="w-10 h-10 rounded-lg flex-shrink-0 object-contain bg-gray-100 dark:bg-gray-700 p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                          {company.symbol}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">
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
            className="border-0 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full blur-3xl opacity-30"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                {idx.name}
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded px-2 py-0.5">
                  {idx.symbol}
                </span>
              </CardTitle>
              <span className="text-xs text-gray-500 dark:text-gray-400">{idx.exchange}</span>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  ${idx.price.toLocaleString()}
                </span>
                <span
                  className={`text-base font-semibold ${
                    idx.change > 0
                      ? 'text-green-600 dark:text-green-400'
                      : idx.change < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {idx.change > 0 ? '+' : ''}
                  {idx.change.toLocaleString()} ({idx.changePercentage > 0 ? '+' : ''}
                  {(idx.changePercentage * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="flex flex-wrap gap-6 mt-2 text-xs text-gray-600 dark:text-gray-400">
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
              <div className="mt-4 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span>Vol: {idx.volume.toLocaleString()}</span>
                <span>50D Avg: {idx.priceAvg50.toLocaleString()}</span>
                <span>200D Avg: {idx.priceAvg200.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sector & Industry Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Sector Performance */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-purple-100 dark:border-purple-800 py-3 px-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-base font-bold text-gray-800 dark:text-gray-100">
                Sector Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {sectorPerformance.map((sector) => (
                <div
                  key={sector.sector}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                      {sector.sector}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${(sector.value / 50) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[3rem]">
                        {sector.value}%
                      </span>
                    </div>
                  </div>
                  <span
                    className={`ml-3 text-sm font-bold px-2 py-1 rounded ${
                      sector.changePct > 0
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                        : sector.changePct < 0
                          ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                          : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
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

        {/* Industry Performance */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800 py-3 px-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-base font-bold text-gray-800 dark:text-gray-100">
                Industry Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {industryPerformance.map((industry) => (
                <div
                  key={industry.industry}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition cursor-pointer"
                  onClick={() => navigate(`/app/company/${industry.leader}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                        {industry.industry}
                      </span>
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 rounded px-2 py-0.5">
                        {industry.leader}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leader: {industry.leader}
                    </span>
                  </div>
                  <span
                    className={`ml-3 text-sm font-bold px-2 py-1 rounded ${
                      industry.changePct > 0
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                        : industry.changePct < 0
                          ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                          : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {industry.changePct > 0 ? '+' : ''}
                    {industry.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* General News */}
      <div className="mb-12">
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800 py-3 px-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <CardTitle className="text-base font-bold text-gray-800 dark:text-gray-100">
                Market News
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {generalNews.map((news) => (
                <div
                  key={news.id}
                  className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                          {news.source}
                        </span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 rounded px-2 py-1">
                      {news.category}
                    </span>
                  </div>
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
