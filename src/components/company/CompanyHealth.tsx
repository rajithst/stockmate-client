import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LoadingIndicator } from '../ui/loading-indicator';

interface HealthItem {
  metric: string;
  value: string;
  benchmark?: string | null;
  status?: string;
  insight?: string | null;
}

interface HealthData {
  profitability_analysis: HealthItem[];
  efficiency_analysis: HealthItem[];
  valuation_and_market_multiples: HealthItem[];
  cashflow_strength: HealthItem[];
  per_share_performance: HealthItem[];
  dividend_and_shareholder_returns: HealthItem[];
  asset_quality_and_capital_efficiency: HealthItem[];
  liquidity_and_short_term_solvency: HealthItem[];
  tax_and_cost_structure: HealthItem[];
}

interface CompanyHealthProps {
  healthData: HealthData | null;
  healthLoading: boolean;
}

export const CompanyHealth: React.FC<CompanyHealthProps> = ({ healthData, healthLoading }) => {
  if (healthLoading) {
    return <LoadingIndicator message="Loading health data..." minHeight="min-h-[40vh]" />;
  }

  if (!healthData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="text-lg text-gray-500 font-medium">No health data available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health Details */}
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Stock Health Details</CardTitle>
          <p className="text-xs text-gray-400 font-medium block mt-1">
            In-depth financial health indicators and benchmarks
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: 'Profitability Analysis', data: healthData.profitability_analysis },
            { title: 'Efficiency Analysis', data: healthData.efficiency_analysis },
            {
              title: 'Valuation and Market Multiples',
              data: healthData.valuation_and_market_multiples,
            },
            { title: 'Cash Flow Strength', data: healthData.cashflow_strength },
            { title: 'Per Share Performance', data: healthData.per_share_performance },
            {
              title: 'Dividend and Shareholder Returns',
              data: healthData.dividend_and_shareholder_returns,
            },
            {
              title: 'Asset Quality and Capital Efficiency',
              data: healthData.asset_quality_and_capital_efficiency,
            },
            {
              title: 'Liquidity and Short-Term Solvency',
              data: healthData.liquidity_and_short_term_solvency,
            },
            {
              title: 'Tax and Cost Structure Analysis',
              data: healthData.tax_and_cost_structure,
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">{section.title}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-700 font-medium">
                      <th className="py-2 px-2 text-left">Metric</th>
                      <th className="py-2 px-2 text-left">Value</th>
                      <th className="py-2 px-2 text-left">Benchmark</th>
                      <th className="py-2 px-2 text-left">Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.data.map((item: HealthItem) => {
                      const formatBenchmark = (
                        benchmark?: string | null,
                        status?: string,
                      ): string => {
                        if (!benchmark || benchmark.trim() === '') return '-';
                        const emoji = status === 'healthy' ? '✅' : '⚠️';
                        return `${benchmark} ${emoji}`;
                      };
                      const formatInsight = (insight?: string | null): string => {
                        return insight && insight.trim() !== '' ? insight : '-';
                      };
                      return (
                        <tr
                          key={item.metric}
                          className="border-b last:border-none hover:bg-white/60 transition"
                        >
                          <td className="py-2 px-2 font-semibold text-gray-700">{item.metric}</td>
                          <td className="py-2 px-2 font-bold text-indigo-700">{item.value}</td>
                          <td
                            className={`py-2 px-2 font-bold ${String(formatBenchmark(item.benchmark, item.status)).includes('⚠️') ? 'text-yellow-600' : 'text-green-600'}`}
                          >
                            {formatBenchmark(item.benchmark, item.status)}
                          </td>
                          <td className="py-2 px-2 text-gray-600">{formatInsight(item.insight)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
