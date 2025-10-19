import React from 'react';
import { ArrowDownRight, ArrowUpRight, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface DiscountedCashFlowData {
  symbol: string;
  date: string;
  dcf: number;
  stockPrice: number;
}

interface DiscountedCashFlowSummary {
  dcfData: DiscountedCashFlowData;
}

export const DcfSummaryCard: React.FC<DiscountedCashFlowSummary> = ({ dcfData }) => {
  const { dcf, stockPrice, date } = dcfData;

  const diff = stockPrice - dcf;
  const percentageDiff = ((diff / dcf) * 100).toFixed(1);

  let status: 'Undervalued' | 'Fair Value' | 'Overvalued';
  let colorClass = '';
  let Icon = MinusCircle;

  if (stockPrice < dcf * 0.9) {
    status = 'Undervalued';
    colorClass = 'text-green-600';
    Icon = ArrowDownRight;
  } else if (stockPrice > dcf * 1.1) {
    status = 'Overvalued';
    colorClass = 'text-red-600';
    Icon = ArrowUpRight;
  } else {
    status = 'Fair Value';
    colorClass = 'text-yellow-600';
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Discounted Cash Flow
        </CardTitle>
        <Button variant="outline" size="sm" className="text-xs">
          Custom DCF
        </Button>
      </CardHeader>
      <CardContent className="text-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">DCF Value:</span>
          <span className="font-medium text-gray-800">${dcf.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Stock Price:</span>
          <span className="font-medium text-gray-800">${stockPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">As of:</span>
          <span className="text-gray-700">{date}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-2">
            <Icon className={`${colorClass} w-4 h-4`} />
            <span className={`font-medium ${colorClass}`}>{status}</span>
          </div>
          <span className={`${colorClass} text-xs font-medium`}>{percentageDiff}% difference</span>
        </div>
      </CardContent>
    </Card>
  );
};
