import React, { useState } from 'react';
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

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  date: string;
  category: string;
  symbol?: string;
  snippet: string;
  content: string;
  url: string;
  imageUrl?: string;
}

// Mock news data (replace with real API)
const mockNewsData: NewsItem[] = [
  {
    id: 1,
    title: 'Federal Reserve Holds Interest Rates Steady',
    source: 'Financial Times',
    time: '2 hours ago',
    date: '2025-11-01',
    category: 'Markets',
    snippet:
      'The Federal Reserve announced today that it will maintain current interest rates, citing stable inflation...',
    content:
      'The Federal Reserve announced today that it will maintain current interest rates at their current levels, citing stable inflation metrics and a strong labor market. Fed Chair Jerome Powell emphasized the committee\'s commitment to monitoring economic indicators closely. "We believe the current stance of monetary policy is appropriate," Powell stated during the press conference. The decision was unanimous among voting members. Market analysts had widely anticipated this move, with futures markets pricing in a high probability of no rate change. The S&P 500 rose 0.8% following the announcement, while Treasury yields remained relatively stable. Economists suggest that the Fed will likely maintain this position through the end of Q4 2025, barring any unexpected economic shocks.',
    url: 'https://example.com/news/1',
    imageUrl: 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Federal+Reserve',
  },
  {
    id: 2,
    title: 'Tech Sector Rallies on Strong Earnings Reports',
    source: 'Bloomberg',
    time: '4 hours ago',
    date: '2025-11-01',
    category: 'Technology',
    symbol: 'MSFT',
    snippet:
      'Major technology companies exceeded earnings expectations this quarter, driving a broad rally...',
    content:
      "Major technology companies exceeded earnings expectations this quarter, driving a broad rally across the sector. Microsoft reported a 15% year-over-year revenue increase, powered by strong cloud computing demand. The company's Azure platform continues to gain market share, with enterprise customers increasingly adopting AI-powered services. CEO Satya Nadella highlighted the company's leadership in artificial intelligence integration. \"We're seeing unprecedented demand for AI capabilities across all customer segments,\" Nadella noted. Apple, Google, and Amazon also posted impressive results, with each company beating analyst estimates. The tech-heavy Nasdaq Composite jumped 2.3% on the news. Analysts are raising their price targets for several tech giants, citing robust fundamentals and growing AI adoption.",
    url: 'https://example.com/news/2',
    imageUrl: 'https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=Tech+Rally',
  },
  {
    id: 3,
    title: 'Oil Prices Drop Amid Global Supply Concerns',
    source: 'Reuters',
    time: '5 hours ago',
    date: '2025-11-01',
    category: 'Energy',
    snippet:
      'Crude oil prices fell 3% today as new supply sources come online and demand forecasts are revised...',
    content:
      'Crude oil prices fell 3% today as new supply sources come online and demand forecasts are revised downward. West Texas Intermediate (WTI) crude settled at $78.45 per barrel, while Brent crude closed at $82.30. OPEC+ members are reportedly considering increasing production quotas in response to higher-than-expected output from non-member nations. Energy analysts point to several factors contributing to the price decline, including improved production from U.S. shale fields and weakening demand signals from China. "The market is rebalancing after months of tight supply," noted one commodity strategist. The drop in oil prices is providing relief to consumers at the pump, with gasoline prices expected to decline in coming weeks. Energy stocks fell broadly, with the energy sector down 2.1% for the day.',
    url: 'https://example.com/news/3',
    imageUrl: 'https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Oil+Markets',
  },
  {
    id: 4,
    title: 'US Jobs Report Exceeds Expectations',
    source: 'CNBC',
    time: '6 hours ago',
    date: '2025-11-01',
    category: 'Economy',
    snippet:
      'The U.S. economy added 275,000 jobs in October, significantly beating economist forecasts...',
    content:
      'The U.S. economy added 275,000 jobs in October, significantly beating economist forecasts of 180,000. The unemployment rate held steady at 3.8%, indicating a healthy labor market. Job gains were broad-based, with notable increases in healthcare, professional services, and manufacturing. Average hourly earnings rose 4.2% year-over-year, slightly above inflation rates. Labor economists describe the report as evidence of continued economic resilience. "This is a Goldilocks scenario – strong job growth without overheating," commented one Fed watcher. The strong employment data could influence the Federal Reserve\'s future policy decisions. However, some analysts caution that seasonal adjustments may have played a role in the better-than-expected figures. Stock markets reacted positively to the news, with major indices posting gains.',
    url: 'https://example.com/news/4',
    imageUrl: 'https://via.placeholder.com/800x400/059669/FFFFFF?text=Jobs+Report',
  },
  {
    id: 5,
    title: 'Tesla Unveils New Manufacturing Facility in Texas',
    source: 'Wall Street Journal',
    time: '8 hours ago',
    date: '2025-10-31',
    category: 'Technology',
    symbol: 'TSLA',
    snippet:
      'Tesla announced plans for a new advanced manufacturing facility that will produce next-generation...',
    content:
      'Tesla announced plans for a new advanced manufacturing facility in Austin, Texas, that will produce next-generation electric vehicles and battery systems. CEO Elon Musk unveiled the $5 billion investment during a press conference at the company\'s Gigafactory. The new facility is expected to create 10,000 jobs and begin production by late 2026. "This represents the future of automotive manufacturing," Musk stated. The plant will feature cutting-edge robotics and AI-powered quality control systems. Tesla aims to increase production capacity by 40% with the new facility. Environmental groups have praised the company\'s commitment to sustainable manufacturing practices. Tesla stock rose 5.2% on the announcement. Analysts view the expansion as a strategic move to meet growing EV demand and maintain market leadership.',
    url: 'https://example.com/news/5',
    imageUrl: 'https://via.placeholder.com/800x400/0891B2/FFFFFF?text=Tesla+Factory',
  },
  {
    id: 6,
    title: 'JPMorgan Reports Record Quarterly Profits',
    source: 'Financial Times',
    time: '10 hours ago',
    date: '2025-10-31',
    category: 'Finance',
    symbol: 'JPM',
    snippet:
      'JPMorgan Chase posted record quarterly earnings, driven by strong investment banking activity...',
    content:
      'JPMorgan Chase posted record quarterly earnings of $12.1 billion, driven by strong investment banking activity and higher interest income. The banking giant exceeded analyst expectations across all major business segments. CEO Jamie Dimon attributed the strong performance to "disciplined risk management and strategic investments in technology." Investment banking fees surged 25% year-over-year, reflecting increased M&A activity. The consumer banking division also showed robust growth, with credit card spending up 8%. JPMorgan maintained its strong credit quality metrics, with non-performing loans remaining near historic lows. The bank raised its full-year earnings guidance and announced a 10% dividend increase. Financial sector stocks rallied on the news, with regional banks also posting gains. Dimon expressed cautious optimism about the economic outlook for 2026.',
    url: 'https://example.com/news/6',
    imageUrl: 'https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=JPMorgan',
  },
  {
    id: 7,
    title: 'Semiconductor Shortage Shows Signs of Easing',
    source: 'Bloomberg',
    time: '12 hours ago',
    date: '2025-10-31',
    category: 'Technology',
    symbol: 'NVDA',
    snippet:
      'Industry data suggests the global semiconductor shortage is finally easing as production ramps up...',
    content:
      'Industry data suggests the global semiconductor shortage is finally easing as production ramps up and demand moderates. Leading chipmakers including NVIDIA, Intel, and TSMC report improved supply chain conditions. "We\'re seeing light at the end of the tunnel," noted one industry executive. New fabrication facilities coming online in the U.S., Taiwan, and Europe are adding significant capacity. Automotive manufacturers, which were heavily impacted by chip shortages, report improved parts availability. However, analysts caution that high-end AI chips remain in tight supply due to surging demand for machine learning applications. The normalization of semiconductor supplies could help ease inflationary pressures on consumer electronics. NVIDIA stock gained 3.1% as investors welcomed the improved supply dynamics. Industry observers expect balanced supply-demand conditions by mid-2026.',
    url: 'https://example.com/news/7',
    imageUrl: 'https://via.placeholder.com/800x400/EAB308/FFFFFF?text=Semiconductors',
  },
  {
    id: 8,
    title: 'Inflation Rate Drops to 2.4% in Latest CPI Report',
    source: 'Reuters',
    time: '1 day ago',
    date: '2025-10-30',
    category: 'Economy',
    snippet:
      'Consumer prices rose at a slower pace in October, marking the lowest inflation rate in three years...',
    content:
      "Consumer prices rose at a slower pace in October, with the Consumer Price Index showing a 2.4% year-over-year increase, marking the lowest inflation rate in three years. Core inflation, which excludes food and energy, came in at 2.8%. The moderation in price pressures was broad-based, with notable declines in goods prices offsetting continued strength in services. Energy costs fell 4.2% compared to last year, while food prices increased a modest 2.1%. Housing costs, which comprise a large portion of CPI, showed signs of cooling with rental price growth slowing. Economists view the data as validation of the Federal Reserve's monetary policy approach. \"We're approaching the Fed's 2% target,\" one economist noted. The inflation report boosted investor confidence, with bond yields falling and stocks rising. Consumers may see some relief in purchasing power as wage growth continues to outpace inflation.",
    url: 'https://example.com/news/8',
    imageUrl: 'https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Inflation',
  },
];

export const NewsPage: React.FC = () => {
  const navigate = useNavigate();
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

  // Filter news based on search and filters
  const filteredNews = mockNewsData.filter((news) => {
    const matchesSearch =
      searchQuery === '' ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (news.symbol && news.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;

    const matchesDate =
      selectedDate === 'all' ||
      (selectedDate === 'today' && news.date === '2025-11-01') ||
      (selectedDate === 'yesterday' && news.date === '2025-10-31') ||
      (selectedDate === 'week' && news.date >= '2025-10-25');

    const matchesSymbol = !selectedSymbol || news.symbol === selectedSymbol.toUpperCase();

    return matchesSearch && matchesCategory && matchesDate && matchesSymbol;
  });

  // Get unique categories and symbols
  const categories = ['all', ...Array.from(new Set(mockNewsData.map((n) => n.category)))];
  const symbols = Array.from(new Set(mockNewsData.filter((n) => n.symbol).map((n) => n.symbol)));

  // Simulate filtering delay for loading animation
  React.useEffect(() => {
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
          {isFiltering ? (
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

      {/* News List - Compact Grid */}
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
                {news.imageUrl && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
