import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';
import { Badge } from '../ui/badge.tsx';
import type {
  CompanyGeneralNewsRead,
  CompanyGradingNewsRead,
  CompanyPriceTargetNewsRead,
} from '../../types/news.ts';

export interface CompanyNews {
  general_news: CompanyGeneralNewsRead[];
  price_target_news: CompanyPriceTargetNewsRead[];
  grading_news: CompanyGradingNewsRead[];
}

export const CompanyNewsTabs: React.FC<{ news: CompanyNews }> = ({ news }) => {
  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800">Company News</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="target">Price Target</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
          </TabsList>

          {/* General News */}
          <TabsContent value="general">
            <div className="space-y-3 mt-3">
              {news.general_news.map((news) => (
                <a
                  key={news.id}
                  href={news.news_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 bg-white/70 border border-gray-100 shadow-sm hover:scale-[1.01] hover:bg-white transition rounded-xl p-3"
                >
                  {news.image && (
                    <img
                      src={news.image}
                      alt={news.news_title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{news.news_title}</div>
                    <div className="text-xs text-gray-500">
                      {news.publisher} • {new Date(news.published_date).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* Price Target News */}
          <TabsContent value="target">
            <div className="space-y-3 mt-3">
              {news.price_target_news.map((news) => (
                <a
                  key={news.id}
                  href={news.news_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/70 border border-gray-100 shadow-sm hover:scale-[1.01] hover:bg-white transition rounded-xl p-3"
                >
                  <div className="font-medium text-sm text-gray-800">{news.news_title}</div>
                  <div className="text-xs text-gray-500">
                    {news.analyst_name} ({news.analyst_company}) • Target: ${news.price_target} •{' '}
                    {new Date(news.published_date).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* Grading News */}
          <TabsContent value="grading">
            <div className="space-y-3 mt-3">
              {news.grading_news.map((news) => (
                <a
                  key={news.id}
                  href={news.news_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/70 border border-gray-100 shadow-sm hover:scale-[1.01] hover:bg-white transition rounded-xl p-3"
                >
                  <div className="font-medium text-sm text-gray-800">{news.news_title}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>{news.grading_company}</span>•
                    <span>
                      {news.previous_grade && <>{news.previous_grade} → </>}
                      <Badge variant="secondary">{news.new_grade}</Badge>
                    </span>
                    <span>({new Date(news.published_date).toLocaleDateString()})</span>
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
