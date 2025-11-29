import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { AlertCircle, Clock, Target } from 'lucide-react';
import type { CompanyPriceTargetRead, CompanyPriceTargetSummaryRead } from '../../types';

export const PriceTargetCard: React.FC<{
  price_target: CompanyPriceTargetRead | null | undefined;
}> = ({ price_target }) => {
  // Handle null or missing data
  if (
    !price_target ||
    price_target.target_high === null ||
    price_target.target_low === null ||
    price_target.target_consensus === null ||
    price_target.target_median === null
  ) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-bold text-gray-800">Price Target</CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">Analyst price target distribution</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium">Price target data not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const range = price_target.target_high! - price_target.target_low!;
  const consensusPos = ((price_target.target_consensus! - price_target.target_low!) / range) * 100;
  const medianPos = ((price_target.target_median! - price_target.target_low!) / range) * 100;

  // Format last updated date
  const formattedLastUpdated = price_target.updated_at
    ? new Date(price_target.updated_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl h-full flex flex-col">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-base font-bold text-gray-800">Price Target</CardTitle>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyst price target distribution</p>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10 flex flex-col flex-1">
        {/* Range bar with original red-yellow-green gradient */}
        <div className="relative h-3 bg-gray-200 rounded-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70" />
          {/* consensus marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-blue-600"
            style={{ left: `${consensusPos}%` }}
            title={`Consensus: ${price_target.target_consensus!}`}
          />
          {/* median marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-purple-600"
            style={{ left: `${medianPos}%` }}
            title={`Median: ${price_target.target_median!}`}
          />
        </div>

        {/* Range endpoints */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low: ${price_target.target_low!}</span>
          <span>High: ${price_target.target_high!}</span>
        </div>

        {/* Key stats */}
        <div className="flex justify-around text-sm font-medium mt-2 flex-1">
          <div className="text-center">
            <div className="text-gray-500 text-xs">Low</div>
            <div className="font-semibold">${price_target.target_low!}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Median</div>
            <div className="font-semibold text-purple-600">${price_target.target_median!}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Consensus</div>
            <div className="font-semibold text-blue-600">${price_target.target_consensus!}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">High</div>
            <div className="font-semibold text-green-600">${price_target.target_high!}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PriceTargetSummaryCard: React.FC<{
  price_target_summary: CompanyPriceTargetSummaryRead | null | undefined;
}> = ({ price_target_summary }) => {
  // Handle null or missing data
  if (!price_target_summary) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl p-4">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-gray-800">
                Price Target Summary
              </CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">Average price targets by period</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <AlertCircle className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium">No data available</span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  const metrics = [
    {
      label: '1M',
      avg: price_target_summary.last_month_average_price_target,
      count: price_target_summary.last_month_count,
    },
    {
      label: '1Q',
      avg: price_target_summary.last_quarter_average_price_target,
      count: price_target_summary.last_quarter_count,
    },
    {
      label: '1Y',
      avg: price_target_summary.last_year_average_price_target,
      count: price_target_summary.last_year_count,
    },
    {
      label: 'All',
      avg: price_target_summary.all_time_average_price_target,
      count: price_target_summary.all_time_count,
    },
  ];

  // Format last updated date
  const formattedLastUpdated = price_target_summary.updated_at
    ? new Date(price_target_summary.updated_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl h-full flex flex-col">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-base font-bold text-gray-800">Price Target Summary</CardTitle>
        </div>
        <p className="text-xs text-gray-500 mt-1">Average price targets by period</p>
      </CardHeader>
      <CardContent className="pb-0 flex flex-col flex-1 relative z-10">
        <div className="space-y-1.5 flex-1">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-2 border border-gray-100 rounded-lg text-sm bg-white/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-gray-700 min-w-[35px]">{m.label}:</span>
                <span className="text-gray-600">${m.avg.toFixed(2)}</span>
              </div>
              <span className="text-gray-500 text-sm flex-shrink-0">({m.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
