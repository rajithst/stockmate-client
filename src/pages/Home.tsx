import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search, TrendingUp, BarChart2, PieChart } from 'lucide-react';

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

const dummyCompanies = [
  { symbol: 'AAPL', company_name: 'Apple Inc.' },
  { symbol: 'MSFT', company_name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', company_name: 'Alphabet Inc.' },
  { symbol: 'AMZN', company_name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', company_name: 'Tesla, Inc.' },
  // ...more
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
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState(dummyCompanies);
  const [filtered, setFiltered] = useState(dummyCompanies);
  const navigate = useNavigate();

  useEffect(() => {
    if (!search) {
      setFiltered(companies);
    } else {
      setFiltered(
        companies.filter(
          (c) =>
            c.company_name.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, companies]);

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
        <div className="relative w-full max-w-2xl">
          <Input
            className="w-full text-lg px-5 py-4 rounded-2xl border border-gray-200 shadow focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            placeholder="Search for a company by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 w-6 h-6 pointer-events-none" />
        </div>
        {search && (
          <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-lg mt-2 max-h-80 overflow-y-auto animate-fade-in">
            {filtered.length === 0 && (
              <div className="p-6 text-gray-500 text-center">No companies found.</div>
            )}
            {filtered.map((c) => (
              <div
                key={c.symbol}
                className="px-6 py-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition"
                onClick={() => navigate(`/company/${c.symbol}`)}
              >
                <span className="font-medium text-gray-800">{c.company_name}</span>
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 rounded px-2 py-0.5">
                  {c.symbol}
                </span>
              </div>
            ))}
          </div>
        )}
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
