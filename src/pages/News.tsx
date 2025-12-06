import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Search,
  X,
  Calendar,
  Tag,
  TrendingUp,
  Sparkles,
  BarChart3,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { NewsRead } from '../types';

interface NewsItem extends NewsRead {
  id?: string | number;
  category?: string;
  time?: string;
  snippet?: string;
  imageUrl?: string;
  image?: string;
}

// Transform API response to display format
const transformNewsRead = (news: NewsRead, index: number): NewsItem => {
  const published = new Date(news.published_date);
  const now = new Date();
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeStr = 'just now';
  if (diffHours > 0) timeStr = `${diffHours} hours ago`;
  if (diffDays > 0) timeStr = `${diffDays} days ago`;

  // Infer category from news content or publisher
  const categoryMap: Record<string, string> = {
    technology: 'Technology',
    tech: 'Technology',
    finance: 'Finance',
    bank: 'Finance',
    markets: 'Markets',
    economy: 'Economy',
    energy: 'Energy',
    oil: 'Energy',
  };

  let category = 'General';
  const contentLower = `${news.news_title} ${news.text}`.toLowerCase();
  for (const [key, val] of Object.entries(categoryMap)) {
    if (contentLower.includes(key)) {
      category = val;
      break;
    }
  }

  return {
    id: index,
    title: news.news_title,
    source: news.publisher,
    time: timeStr,
    date: published.toISOString().split('T')[0],
    category: category,
    symbol: news.symbol,
    snippet: news.text.substring(0, 150) + '...',
    content: news.text,
    url: news.news_url,
    imageUrl: news.image,
    ...news,
  };
};

export const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getLatestNews();
        const transformed = response.map((news, idx) => transformNewsRead(news, idx));
        setNewsData(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on search and filters
  const filteredNews = newsData.filter((news) => {
    const matchesSearch =
      searchQuery === '' ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (news.snippet && news.snippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      news.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (news.symbol && news.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 604800000).toISOString().split('T')[0];

    const matchesDate =
      selectedDate === 'all' ||
      (selectedDate === 'today' && news.date === today) ||
      (selectedDate === 'yesterday' && news.date === yesterday) ||
      (selectedDate === 'week' && news.date >= weekAgo);

    const matchesSymbol = !selectedSymbol || news.symbol === selectedSymbol.toUpperCase();

    return matchesSearch && matchesCategory && matchesDate && matchesSymbol;
  });

  // Get unique categories and symbols
  const categories = [
    'all',
    ...Array.from(new Set(newsData.filter((n) => n.category).map((n) => n.category))),
  ];
  const symbols = Array.from(new Set(newsData.filter((n) => n.symbol).map((n) => n.symbol)));

  // Simulate filtering delay for loading animation
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedDate, selectedSymbol]);

  // Mock AI Summary
  const generateAISummary = () => {
    setLoadingSummary(true);
    setTimeout(() => {
      setLoadingSummary(false);
      setShowAISummary(true);
    }, 1500);
  };

  // Mock AI Analysis
  const generateAIAnalysis = () => {
    setLoadingAnalysis(true);
    setTimeout(() => {
      setLoadingAnalysis(false);
      setShowAIAnalysis(true);
    }, 2000);
  };

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setShowAISummary(false);
    setShowAIAnalysis(false);
  };

  const closeNewsDialog = () => {
    setSelectedNews(null);
    setShowAISummary(false);
    setShowAIAnalysis(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
          Market News
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Stay updated with the latest market news and analysis
        </p>
      </div>

      {/* Filters - Compact Design */}
      <div className="mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-9 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full h-9 pl-9 text-sm" size="sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full h-9 pl-9 text-sm" size="sm">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Symbol Filter */}
          <div className="relative">
            <TrendingUp className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Select
              value={selectedSymbol || 'all'}
              onValueChange={(value) => setSelectedSymbol(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-full h-9 pl-9 text-sm" size="sm">
                <SelectValue placeholder="All Symbols" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Symbols</SelectItem>
                {symbols.map((symbol) => (
                  <SelectItem key={symbol!} value={symbol!}>
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Summary - Compact */}
        {(searchQuery ||
          selectedCategory !== 'all' ||
          selectedDate !== 'all' ||
          selectedSymbol) && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400">Filters:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                {searchQuery}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {selectedCategory}
              </span>
            )}
            {selectedDate !== 'all' && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {selectedDate}
              </span>
            )}
            {selectedSymbol && (
              <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                {selectedSymbol}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDate('all');
                setSelectedSymbol('');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-auto"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results Count - Compact */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
              Loading news...
            </span>
          ) : isFiltering ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
              Filtering...
            </span>
          ) : (
            <>
              {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
            </>
          )}
        </p>
      </div>

      {/* Loading State */}
      {loading && !error && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading latest news...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-red-200 dark:border-red-800 p-6 text-center">
          <div className="text-red-500 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1">
            Failed to load news
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* News List - Compact Grid */}
      {!loading && !error && (
        <div className="space-y-2 relative">
          {/* Loading Overlay */}
          {isFiltering && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Loading news...
                </span>
              </div>
            </div>
          )}

          {filteredNews.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-gray-400 mb-3">
                <Search className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">
                No news found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredNews.map((news, index) => (
              <div
                key={news.id}
                onClick={() => handleNewsClick(news)}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  {(news.imageUrl || news.image) && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={news.imageUrl || news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="flex-1 text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {news.title}
                      </h3>
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded">
                        {news.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {news.snippet}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                      {news.symbol && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                            {news.symbol}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* News Detail Dialog - Modern & Clean */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Dialog Header - Compact */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <button
                onClick={closeNewsDialog}
                className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={closeNewsDialog}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dialog Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5">
              {selectedNews.imageUrl && (
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 rounded">
                  {selectedNews.category}
                </span>
                {selectedNews.symbol && (
                  <span className="px-2 py-1 text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 rounded">
                    {selectedNews.symbol}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {selectedNews.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="font-medium">{selectedNews.source}</span>
                <span>•</span>
                <span>{selectedNews.time}</span>
              </div>

              {/* AI Actions - Compact */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={generateAISummary}
                  disabled={loadingSummary}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {loadingSummary ? 'Generating...' : 'AI Summary'}
                </button>
                <button
                  onClick={generateAIAnalysis}
                  disabled={loadingAnalysis}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  {loadingAnalysis ? 'Analyzing...' : 'AI Analysis'}
                </button>
              </div>

              {/* AI Summary - Compact */}
              {showAISummary && (
                <div className="mb-3 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                      AI Summary
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      <li>
                        {selectedNews.category === 'Markets' &&
                          'Federal Reserve maintains current interest rate policy'}
                        {selectedNews.category === 'Technology' &&
                          'Major tech companies exceed earnings expectations'}
                        {selectedNews.category === 'Energy' &&
                          'Oil prices decline due to supply increases'}
                        {selectedNews.category === 'Economy' &&
                          'Strong job growth signals healthy economy'}
                        {selectedNews.category === 'Finance' &&
                          'Banking sector shows robust performance'}
                      </li>
                      <li>Market response positive with increased investor confidence</li>
                      <li>Long-term outlook remains cautiously optimistic</li>
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <strong>Impact:</strong> Moderate to significant impact expected on related
                      sectors.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Analysis - Compact */}
              {showAIAnalysis && (
                <div className="mb-3 p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100">
                      AI Analysis
                    </h4>
                  </div>
                  <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                        Positive 75%
                      </span>
                      <span className="text-xs text-gray-500">Market sentiment favorable</span>
                    </div>
                    <p>
                      Expected moderate volatility in affected sectors. Monitor{' '}
                      {selectedNews.symbol ? selectedNews.symbol : 'related stocks'} for
                      opportunities.
                    </p>
                    {selectedNews.symbol && (
                      <button
                        onClick={() => {
                          closeNewsDialog();
                          navigate(`/app/company/${selectedNews.symbol}`);
                        }}
                        className="mt-2 w-full px-3 py-1.5 text-xs font-medium border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                      >
                        View {selectedNews.symbol} Details
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedNews.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
