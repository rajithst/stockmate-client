import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Clock } from 'lucide-react';
import type { CompanyGradingSummaryRead } from '../../types';

export const StockGradingSummaryCard: React.FC<{ summary: CompanyGradingSummaryRead }> = ({
  summary,
}) => {
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
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-base font-semibold text-gray-800">
            Stock Grading Summary
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Analyst consensus breakdown
          </span>
        </div>
        <Badge className={`${consensusColor} text-sm font-semibold px-3 py-1`}>
          {summary.consensus}
        </Badge>
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

        {/* Last updated - Bottom */}
        {formattedLastUpdated && (
          <div className="flex items-center justify-end pt-3">
            <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              Last updated: {formattedLastUpdated}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
