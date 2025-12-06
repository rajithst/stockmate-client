import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import type { NewsRead } from '../../types';
import { ExternalLink } from 'lucide-react';

export const CompanyNewsTabs: React.FC<{ news: NewsRead[] }> = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Company News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No news available for this company</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800">
          Company News ({news.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((newsItem, idx) => (
            <a
              key={`${newsItem.publisher}-${newsItem.published_date}-${idx}`}
              href={newsItem.news_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white/70 border border-gray-100 shadow-sm hover:scale-[1.01] hover:bg-white transition rounded-xl p-3 group"
            >
              {newsItem.image && (
                <img
                  src={newsItem.image}
                  alt={newsItem.news_title}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                  {newsItem.news_title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {newsItem.publisher} • {new Date(newsItem.published_date).toLocaleDateString()}
                </div>
                {newsItem.text && (
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{newsItem.text}</p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition flex-shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
