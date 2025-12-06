import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.tsx';
import { Info, AlertCircle, BarChart3 } from 'lucide-react';
import type { CompanyRatingSummaryRead } from '../../types';

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

export const RatingSummaryCard: React.FC<{
  rating_summary: CompanyRatingSummaryRead | null | undefined;
}> = ({ rating_summary }) => {
  if (!rating_summary) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <CardTitle className="text-base font-bold text-gray-800">Rating Summary</CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">Fundamental & performance metrics</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium">Rating data not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      label: 'Overall',
      value: rating_summary.overall_score,
      info: 'Weighted blend of all valuation and performance metrics.',
    },
    {
      label: 'Discounted Cash Flow',
      value: rating_summary.discounted_cash_flow_score,
      info: 'Measures fair value based on future cash flows. High means stock may be undervalued.',
    },
    {
      label: 'Return on Equity',
      value: rating_summary.return_on_equity_score,
      info: 'Shows how efficiently company generates profit from shareholders’ equity. High = strong profitability.',
    },
    {
      label: 'Return on Assets',
      value: rating_summary.return_on_assets_score,
      info: 'Indicates how well assets are used to generate earnings. Higher = better efficiency.',
    },
    {
      label: 'Debt to Equity',
      value: rating_summary.debt_to_equity_score,
      info: 'Shows financial leverage. High ratio = more debt risk; low = conservative balance sheet.',
    },
    {
      label: 'P/E Ratio',
      value: rating_summary.price_to_earnings_score,
      info: 'Compares price to earnings. Low vs peers = undervalued; high = growth expectations or overvaluation.',
    },
    {
      label: 'P/B Ratio',
      value: rating_summary.price_to_book_score,
      info: 'Compares market value to book value. Low = undervalued assets; high = expensive or strong future prospects.',
    },
  ];

  const getBarColor = (score: number | null | undefined) => {
    if (!score) return '#d1d5db'; // gray for no data
    if (score >= 5) return '#16a34a'; // strong green
    if (score >= 4) return '#22c55e';
    if (score >= 3) return '#eab308'; // yellow
    if (score >= 2) return '#f97316'; // orange
    return '#dc2626'; // red
  };

  // Format last updated date
  // const formattedLastUpdated = rating_summary.updated_at
  //   ? new Date(rating_summary.updated_at).toLocaleString(undefined, {
  //       year: 'numeric',
  //       month: 'short',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     })
  //   : null;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <CardTitle className="text-base font-bold text-gray-800">Rating Summary</CardTitle>
          </div>
          <Badge className="text-base font-bold px-3 py-1 bg-blue-600 text-white">
            {rating_summary.rating}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">Fundamental & performance metrics</p>
      </CardHeader>

      <CardContent className="space-y-3 relative z-10">
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
                <span className="font-semibold">{item.value ?? '-'}/5</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-md overflow-hidden relative">
                {/* Gradient bar background */}
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70" />
                {item.value ? (
                  <div
                    className="h-3 rounded relative"
                    style={{
                      width: `${(item.value / 5) * 100}%`,
                      backgroundColor: getBarColor(item.value),
                      opacity: 0.85,
                    }}
                  />
                ) : (
                  <div className="h-3 w-0" />
                )}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
