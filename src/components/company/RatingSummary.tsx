import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.tsx';
import { Info } from 'lucide-react';

export interface RatingSummary {
  symbol: string;
  rating: string;
  overallScore: number;
  discountedCashFlowScore: number;
  returnOnEquityScore: number;
  returnOnAssetsScore: number;
  debtToEquityScore: number;
  priceToEarningsScore: number;
  priceToBookScore: number;
}

export const RatingSummaryCard: React.FC<{ rating: RatingSummary }> = ({ rating }) => {
  const items = [
    {
      label: 'Overall',
      value: rating.overallScore,
      info: 'Weighted blend of all valuation and performance metrics.',
    },
    {
      label: 'Discounted Cash Flow',
      value: rating.discountedCashFlowScore,
      info: 'Measures fair value based on future cash flows. High means stock may be undervalued.',
    },
    {
      label: 'Return on Equity',
      value: rating.returnOnEquityScore,
      info: 'Shows how efficiently company generates profit from shareholders’ equity. High = strong profitability.',
    },
    {
      label: 'Return on Assets',
      value: rating.returnOnAssetsScore,
      info: 'Indicates how well assets are used to generate earnings. Higher = better efficiency.',
    },
    {
      label: 'Debt to Equity',
      value: rating.debtToEquityScore,
      info: 'Shows financial leverage. High ratio = more debt risk; low = conservative balance sheet.',
    },
    {
      label: 'P/E Ratio',
      value: rating.priceToEarningsScore,
      info: 'Compares price to earnings. Low vs peers = undervalued; high = growth expectations or overvaluation.',
    },
    {
      label: 'P/B Ratio',
      value: rating.priceToBookScore,
      info: 'Compares market value to book value. Low = undervalued assets; high = expensive or strong future prospects.',
    },
  ];

  const getBarColor = (score: number) => {
    if (score >= 5) return '#16a34a'; // strong green
    if (score >= 4) return '#22c55e';
    if (score >= 3) return '#eab308'; // yellow
    if (score >= 2) return '#f97316'; // orange
    return '#dc2626'; // red
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Rating Summary</CardTitle>
        <Badge className="text-base font-bold px-3 py-1 bg-blue-600 text-white">
          {rating.rating}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <TooltipProvider>
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center text-sm mb-1">
                <div className="flex items-center gap-1">
                  <span>{item.label}</span>
                  <ShadTooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={14}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs p-2 text-xs">
                      {item.info}
                    </TooltipContent>
                  </ShadTooltip>
                </div>
                <span className="font-semibold">{item.value}/5</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className="h-2 rounded"
                  style={{
                    width: `${(item.value / 5) * 100}%`,
                    backgroundColor: getBarColor(item.value),
                  }}
                />
              </div>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
