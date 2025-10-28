import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Performer {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  value: number;
}

interface TopPerformersProps {
  topGainers: Performer[];
  topLosers: Performer[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ topGainers, topLosers }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top Gainers */}
      <Card className="border-none shadow-xl rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <CardTitle className="text-lg font-bold text-gray-800">Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topGainers.map((stock, idx) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-white hover:from-green-100 hover:to-green-50 transition cursor-pointer"
                onClick={() => navigate(`/company/${stock.symbol}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />+{stock.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">${stock.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="border-none shadow-xl rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <CardTitle className="text-lg font-bold text-gray-800">Top Losers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLosers.map((stock, idx) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-50 to-white hover:from-red-100 hover:to-red-50 transition cursor-pointer"
                onClick={() => navigate(`/company/${stock.symbol}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    {stock.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">${stock.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
