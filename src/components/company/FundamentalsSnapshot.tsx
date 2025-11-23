import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Clock, Activity } from 'lucide-react';
import type { CompanyRead } from '../../types/company';
import type { CompanyFundamentalsRead } from '../../types/company';

interface FundamentalsSnapshotProps {
  company: CompanyRead | null | undefined;
  fundamentals?: CompanyFundamentalsRead | null;
}

interface DataPoint {
  label: string;
  value: string | number;
  category: 'valuation' | 'cashflow' | 'margins' | 'balance' | 'dividends';
}

const formatValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return value.toFixed(2);
};

export const FundamentalsSnapshot: React.FC<FundamentalsSnapshotProps> = ({
  company,
  fundamentals,
}) => {
  // Use provided fundamentals or generate mock data for development
  const data = fundamentals || {
    market_cap: company?.market_cap,
    price_to_earnings_ratio: 24.5,
    price_to_sales_ratio: 3.2,
    price_to_book_ratio: 4.1,
    free_cash_flow_yield: 0.045,
    earnings_yield: 0.041,
    gross_profit_margin: 0.42,
    operating_profit_margin: 0.18,
    net_profit_margin: 0.14,
    current_ratio: 1.8,
    debt_to_equity_ratio: 0.65,
    return_on_equity: 0.18,
    return_on_assets: 0.12,
    dividend_yield: 0.032,
    dividend: 2.5,
    dividend_frequency: 'Quarterly',
  };

  // Build data points from unified data structure
  const dataPoints: DataPoint[] = [];

  // Valuation
  if (data.market_cap)
    dataPoints.push({
      label: 'Market Cap',
      value: formatValue(data.market_cap),
      category: 'valuation',
    });
  if (data.price_to_earnings_ratio)
    dataPoints.push({
      label: 'P/E',
      value: data.price_to_earnings_ratio.toFixed(2),
      category: 'valuation',
    });
  if (data.price_to_sales_ratio)
    dataPoints.push({
      label: 'P/S',
      value: data.price_to_sales_ratio.toFixed(2),
      category: 'valuation',
    });
  if (data.price_to_book_ratio)
    dataPoints.push({
      label: 'P/B',
      value: data.price_to_book_ratio.toFixed(2),
      category: 'valuation',
    });

  // Cashflow
  if (data.free_cash_flow_yield)
    dataPoints.push({
      label: 'FCF Yield',
      value: `${(data.free_cash_flow_yield * 100).toFixed(2)}%`,
      category: 'cashflow',
    });
  if (data.earnings_yield)
    dataPoints.push({
      label: 'Earnings Yield',
      value: `${(data.earnings_yield * 100).toFixed(2)}%`,
      category: 'cashflow',
    });

  // Margins
  if (data.gross_profit_margin)
    dataPoints.push({
      label: 'Gross Margin',
      value: `${(data.gross_profit_margin * 100).toFixed(2)}%`,
      category: 'margins',
    });
  if (data.operating_profit_margin)
    dataPoints.push({
      label: 'Op. Margin',
      value: `${(data.operating_profit_margin * 100).toFixed(2)}%`,
      category: 'margins',
    });
  if (data.net_profit_margin)
    dataPoints.push({
      label: 'Net Margin',
      value: `${(data.net_profit_margin * 100).toFixed(2)}%`,
      category: 'margins',
    });

  // Balance Sheet
  if (data.current_ratio)
    dataPoints.push({
      label: 'Current Ratio',
      value: data.current_ratio.toFixed(2),
      category: 'balance',
    });
  if (data.debt_to_equity_ratio)
    dataPoints.push({
      label: 'D/E',
      value: data.debt_to_equity_ratio.toFixed(2),
      category: 'balance',
    });
  if (data.return_on_equity)
    dataPoints.push({
      label: 'ROE',
      value: `${(data.return_on_equity * 100).toFixed(2)}%`,
      category: 'balance',
    });
  if (data.return_on_assets)
    dataPoints.push({
      label: 'ROA',
      value: `${(data.return_on_assets * 100).toFixed(2)}%`,
      category: 'balance',
    });

  // Dividends
  if (data.dividend_yield)
    dataPoints.push({
      label: 'Yield',
      value: `${(data.dividend_yield * 100).toFixed(2)}%`,
      category: 'dividends',
    });
  if (data.dividend)
    dataPoints.push({
      label: 'Dividend',
      value: `$${data.dividend.toFixed(2)}`,
      category: 'dividends',
    });
  if (data.dividend_frequency)
    dataPoints.push({
      label: 'Frequency',
      value: data.dividend_frequency,
      category: 'dividends',
    });

  if (dataPoints.length === 0) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl h-full">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-base font-bold text-gray-800">Fundamentals</CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">Key metrics snapshot</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 gap-2">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          <p className="text-xs text-gray-600 text-center">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Group by category
  const categories = {
    valuation: dataPoints.filter((p) => p.category === 'valuation'),
    cashflow: dataPoints.filter((p) => p.category === 'cashflow'),
    margins: dataPoints.filter((p) => p.category === 'margins'),
    balance: dataPoints.filter((p) => p.category === 'balance'),
    dividends: dataPoints.filter((p) => p.category === 'dividends'),
  };

  const categoryLabels = {
    valuation: 'Valuation',
    cashflow: 'Cashflow',
    margins: 'Margins',
    balance: 'Balance',
    dividends: 'Dividends',
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl h-full">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-base font-bold text-gray-800">Fundamentals</CardTitle>
        </div>
        <p className="text-xs text-gray-500 mt-1">Key metrics snapshot</p>
      </CardHeader>
      <CardContent className="pb-2 flex flex-col h-full relative z-10">
        <div className="space-y-1 flex-1">
          {(Object.entries(categories) as [keyof typeof categories, DataPoint[]][]).map(
            ([category, points]) =>
              points.length > 0 && (
                <div key={category}>
                  <h4 className="text-xs font-bold text-indigo-700 bg-indigo-50 rounded px-2 py-1 mb-0.5 border-l-2 border-indigo-500">
                    {categoryLabels[category]}
                  </h4>
                  <div className="grid grid-cols-2 gap-1">
                    {points.map((point, idx) => (
                      <div
                        key={idx}
                        className="bg-white bg-opacity-60 rounded-lg p-1 border border-gray-100"
                      >
                        <p className="text-xs text-gray-800 leading-none">
                          <span className="font-medium text-gray-600">{point.label}:</span>
                          <span className="font-semibold ml-1">{point.value}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Last updated - Bottom */}
        <div className="flex items-center justify-end pt-2 mt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
            <Clock className="w-3 h-3 text-gray-400" />
            Last updated:{' '}
            {new Date().toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
