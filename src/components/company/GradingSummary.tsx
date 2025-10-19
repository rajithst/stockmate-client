import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';

export interface CompanyGradingSummary {
  strong_buy: number;
  buy: number;
  hold: number;
  sell: number;
  strong_sell: number;
  consensus: string;
}

export const StockGradingSummaryCard: React.FC<{ summary: CompanyGradingSummary }> = ({
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

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Stock Grading Summary</CardTitle>
        <Badge className={`${consensusColor} text-sm font-semibold px-3 py-1`}>
          {summary.consensus}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Horizontal visual bar */}
        <div className="flex h-4 rounded overflow-hidden">
          {items.map(
            (item, idx) =>
              item.count > 0 && (
                <div
                  key={idx}
                  className="h-4"
                  style={{
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${item.count}`}
                />
              ),
          )}
        </div>

        {/* Clean aligned breakdown list */}
        <div className="divide-y divide-gray-200">
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
