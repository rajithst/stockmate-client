import React from 'react';
import { ArrowDownRight, ArrowUpRight, MinusCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { CompanyDiscountedCashFlowRead } from '../../types';

export const DcfSummaryCard: React.FC<{
  discounted_cash_flow: CompanyDiscountedCashFlowRead | null | undefined;
}> = ({ discounted_cash_flow }) => {
  // Handle null or missing data
  if (
    !discounted_cash_flow ||
    discounted_cash_flow.dcf === null ||
    discounted_cash_flow.stock_price === null
  ) {
    return (
      <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">
            Discounted Cash Flow
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Fundamental valuation snapshot
          </span>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium">DCF data not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  const { dcf, stock_price, date, updated_at } = discounted_cash_flow;

  const diff = stock_price! - dcf!;
  const percentageDiff = ((diff / dcf!) * 100).toFixed(1);

  let status: 'Undervalued' | 'Fair Value' | 'Overvalued';
  let colorClass = '';
  let Icon = MinusCircle;

  if (stock_price! < dcf! * 0.9) {
    status = 'Undervalued';
    colorClass = 'text-green-600';
    Icon = ArrowDownRight;
  } else if (stock_price! > dcf! * 1.1) {
    status = 'Overvalued';
    colorClass = 'text-red-600';
    Icon = ArrowUpRight;
  } else {
    status = 'Fair Value';
    colorClass = 'text-yellow-600';
  }

  // Format last updated date
  const formattedLastUpdated = updated_at
    ? new Date(updated_at).toLocaleString(undefined, {
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-800">
            Discounted Cash Flow
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Fundamental valuation snapshot
          </span>
        </div>
        <Button variant="outline" size="sm" className="text-xs shadow hover:bg-gray-50">
          Custom DCF
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-1 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">DCF Value:</span>
            <span className="font-semibold text-gray-800">${dcf!.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Stock Price:</span>
            <span className="font-semibold text-gray-800">${stock_price!.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">As of:</span>
            <span className="text-gray-700">
              {typeof date === 'string' ? date : date?.toString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-2">
            <Icon className={`${colorClass} w-5 h-5`} />
            <span className={`font-semibold ${colorClass} text-base`}>{status}</span>
          </div>
          <span className={`${colorClass} text-xs font-semibold`}>
            {percentageDiff}% difference
          </span>
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
