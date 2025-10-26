import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { BarChart3, Clock } from 'lucide-react';
import { LineChart } from 'recharts';
import type { CompanyPriceTargetRead, CompanyPriceTargetSummaryRead } from '../../types';

export const PriceTargetCard: React.FC<{ price_target: CompanyPriceTargetRead }> = ({
  price_target,
}) => {
  const range = price_target.target_high - price_target.target_low;
  const consensusPos = ((price_target.target_consensus - price_target.target_low) / range) * 100;
  const medianPos = ((price_target.target_median - price_target.target_low) / range) * 100;

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
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader>
        <div>
          <CardTitle className="text-base font-semibold text-gray-800">Price Target</CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Analyst price target distribution
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Range bar with original red-yellow-green gradient */}
        <div className="relative h-3 bg-gray-200 rounded-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70" />
          {/* consensus marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-blue-600"
            style={{ left: `${consensusPos}%` }}
            title={`Consensus: ${price_target.target_consensus}`}
          />
          {/* median marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-purple-600"
            style={{ left: `${medianPos}%` }}
            title={`Median: ${price_target.target_median}`}
          />
        </div>

        {/* Range endpoints */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low: ${price_target.target_low}</span>
          <span>High: ${price_target.target_high}</span>
        </div>

        {/* Key stats */}
        <div className="flex justify-around text-sm font-medium mt-2">
          <div className="text-center">
            <div className="text-gray-500 text-xs">Low</div>
            <div className="font-semibold">${price_target.target_low}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Median</div>
            <div className="font-semibold text-purple-600">${price_target.target_median}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Consensus</div>
            <div className="font-semibold text-blue-600">${price_target.target_consensus}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">High</div>
            <div className="font-semibold text-green-600">${price_target.target_high}</div>
          </div>
        </div>

        {/* Last updated */}
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

export const PriceTargetSummaryCard: React.FC<{
  price_target_summary: CompanyPriceTargetSummaryRead;
}> = ({ price_target_summary }) => {
  const publishers = price_target_summary.publishers?.split(', ') || [];

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

  const metrics = [
    {
      label: 'Last Month',
      avg: price_target_summary.last_month_average_price_target,
      count: price_target_summary.last_month_count,
      icon: <BarChart3 className="w-4 h-4 text-indigo-500" />,
    },
    {
      label: 'Last Quarter',
      avg: price_target_summary.last_quarter_average_price_target,
      count: price_target_summary.last_quarter_count,
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
    },
    {
      label: 'Last Year',
      avg: price_target_summary.last_year_average_price_target,
      count: price_target_summary.last_year_count,
      icon: <BarChart3 className="w-4 h-4 text-cyan-500" />,
    },
    {
      label: 'All Time',
      avg: price_target_summary.all_time_average_price_target,
      count: price_target_summary.all_time_count,
      icon: <LineChart className="w-4 h-4 text-teal-500" />,
    },
  ];

  // Find min/max for bar width scaling
  const maxCount = Math.max(...metrics.map((m) => m.count), 1);

  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl p-6">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />
      <div className="relative z-10">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-base font-semibold text-gray-800">
            Price Target Summary
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Analyst price target trends and sources
          </span>
        </CardHeader>
        {/* Metrics: compact horizontal layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/70 p-3 flex flex-col items-center border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                {m.icon}
                {m.label}
              </div>
              <div className="font-semibold text-lg text-gray-800">${m.avg.toFixed(2)}</div>
              <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-1">
                <div
                  className="h-2 rounded bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-400"
                  style={{
                    width: `${Math.max(10, (m.count / maxCount) * 100)}%`,
                    opacity: 0.7,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">{m.count} ratings</div>
            </div>
          ))}
        </div>
        {/* Publishers */}
        {publishers.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
              Top Analyst Sources
            </div>
            <div className="flex flex-wrap gap-2">
              {publishers.slice(0, 10).map((p: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/70 text-blue-700 text-xs font-medium rounded-full border border-blue-100 shadow-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Last Updated */}
        {formattedLastUpdated && (
          <div className="flex items-center justify-end pt-4">
            <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              Last updated: {formattedLastUpdated}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
