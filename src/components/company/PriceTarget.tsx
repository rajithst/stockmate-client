import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { BarChart3, TrendingUp } from 'lucide-react';
import { LineChart } from 'recharts';

export interface PriceTarget {
  symbol: string;
  targetHigh: number;
  targetLow: number;
  targetConsensus: number;
  targetMedian: number;
}

interface PriceTargetSummary {
  symbol: string;
  last_month_count: number;
  last_month_avg_price_target: number;
  last_quarter_count: number;
  last_quarter_avg_price_target: number;
  last_year_count: number;
  last_year_avg_price_target: number;
  all_time_count: number;
  all_time_avg_price_target: number;
  publishers: string;
}

export const PriceTargetCard: React.FC<{ target: PriceTarget }> = ({ target }) => {
  const range = target.targetHigh - target.targetLow;
  const consensusPos = ((target.targetConsensus - target.targetLow) / range) * 100;
  const medianPos = ((target.targetMedian - target.targetLow) / range) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Price Target Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Range bar */}
        <div className="relative h-3 bg-gray-200 rounded-md overflow-hidden">
          {/* range gradient */}
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70" />

          {/* consensus marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-blue-600"
            style={{ left: `${consensusPos}%` }}
            title={`Consensus: ${target.targetConsensus}`}
          />

          {/* median marker */}
          <div
            className="absolute top-0 h-full w-[2px] bg-purple-600"
            style={{ left: `${medianPos}%` }}
            title={`Median: ${target.targetMedian}`}
          />
        </div>

        {/* Range endpoints */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low: ${target.targetLow}</span>
          <span>High: ${target.targetHigh}</span>
        </div>

        {/* Key stats */}
        <div className="flex justify-around text-sm font-medium mt-2">
          <div className="text-center">
            <div className="text-gray-500 text-xs">Low</div>
            <div className="font-semibold">${target.targetLow}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Median</div>
            <div className="font-semibold text-purple-600">${target.targetMedian}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Consensus</div>
            <div className="font-semibold text-blue-600">${target.targetConsensus}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">High</div>
            <div className="font-semibold text-green-600">${target.targetHigh}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PriceTargetSummaryCard: React.FC<{ data: PriceTargetSummary }> = ({ data }) => {
  const publishers = JSON.parse(data.publishers);

  const metrics = [
    {
      label: 'Last Month',
      avg: data.last_month_avg_price_target,
      count: data.last_month_count,
      icon: <BarChart3 className="w-4 h-4 text-indigo-500" />,
      gradient: 'from-indigo-50 to-indigo-100',
    },
    {
      label: 'Last Quarter',
      avg: data.last_quarter_avg_price_target,
      count: data.last_quarter_count,
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      label: 'Last Year',
      avg: data.last_year_avg_price_target,
      count: data.last_year_count,
      icon: <BarChart3 className="w-4 h-4 text-cyan-500" />,
      gradient: 'from-cyan-50 to-cyan-100',
    },
    {
      label: 'All Time',
      avg: data.all_time_avg_price_target,
      count: data.all_time_count,
      icon: <LineChart className="w-4 h-4 text-teal-500" />,
      gradient: 'from-teal-50 to-teal-100',
    },
  ];

  return (
    <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 rounded-2xl">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 tracking-tight">
            Price Target Summary
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyst consensus and target insights</p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-xl bg-gradient-to-br ${m.gradient} p-3 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{m.label}</span>
                {m.icon}
              </div>
              <div className="mt-1 text-base font-semibold text-gray-800">${m.avg.toFixed(2)}</div>
              <div className="text-xs text-gray-500">{m.count} ratings</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Publishers */}
        <div>
          <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
            Top Analyst Sources
          </div>
          <div className="flex flex-wrap gap-2">
            {publishers.slice(0, 10).map((p: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-100 shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
