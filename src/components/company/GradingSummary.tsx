import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Clock, AlertCircle, TrendingUp } from 'lucide-react';
import type { CompanyGradingSummaryRead } from '../../types';

export const StockGradingSummaryCard: React.FC<{
  summary: CompanyGradingSummaryRead | null | undefined;
}> = ({ summary }) => {
  // Handle null or missing data
  if (!summary) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-gray-800">
              Stock Grading Summary
            </CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">Analyst consensus breakdown</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium">Grading data not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  const total =
    summary.strong_buy + summary.buy + summary.hold + summary.sell + summary.strong_sell;

  const items = [
    { label: 'Strong Buy', key: 'strong_buy', count: summary.strong_buy, color: '#16a34a' },
    { label: 'Buy', key: 'buy', count: summary.buy, color: '#22c55e' },
    { label: 'Hold', key: 'hold', count: summary.hold, color: '#facc15' },
    { label: 'Sell', key: 'sell', count: summary.sell, color: '#f87171' },
    { label: 'Strong Sell', key: 'strong_sell', count: summary.strong_sell, color: '#dc2626' },
  ];

  const consensusColorMap: Record<string, string> = {
    'Strong Buy': 'bg-green-600 text-white',
    Buy: 'bg-green-500 text-white',
    Hold: 'bg-yellow-400 text-black',
    Sell: 'bg-red-500 text-white',
    'Strong Sell': 'bg-red-700 text-white',
  };

  const consensusColor = consensusColorMap[summary.consensus] || 'bg-gray-500 text-white';

  // Format last updated date from summary.updated_at
  const formattedLastUpdated = summary.updated_at
    ? new Date(summary.updated_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-gray-800">
              Stock Grading Summary
            </CardTitle>
          </div>
          <Badge className={`${consensusColor} text-sm font-semibold px-3 py-1`}>
            {summary.consensus}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyst consensus breakdown</p>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10 flex flex-col h-full">
        {/* Horizontal visual bar */}
        <div className="relative h-3 bg-gray-200 rounded-md overflow-hidden">
          {/* subtle blue gradient */}
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 opacity-60" />
          {items.map(
            (item, idx) =>
              item.count > 0 && (
                <div
                  key={idx}
                  className="h-3 absolute"
                  style={{
                    left: `${(items.slice(0, idx).reduce((acc, i) => acc + i.count, 0) / total) * 100}%`,
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: item.color,
                    opacity: 0.7,
                  }}
                  title={`${item.label}: ${item.count}`}
                />
              ),
          )}
        </div>

        {/* Clean aligned breakdown list */}
        <div className="divide-y divide-gray-200 flex-grow">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between items-center py-1.5 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <span className="text-muted-foreground font-medium">
                {item.count} ({((item.count / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
