import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import { useNavigate } from 'react-router-dom';

const summaryData = [
  {
    category: 'Profitability',
    rating: '✅ Excellent',
    comment: 'Industry-leading margins and returns.',
  },
  {
    category: 'Efficiency',
    rating: '✅ Excellent',
    comment: 'Superb asset and working capital management.',
  },
  {
    category: 'Liquidity & Solvency',
    rating: '⚠️ Moderate',
    comment: 'Lean liquidity, moderate leverage.',
  },
  {
    category: 'Cash Flow',
    rating: '✅ Excellent',
    comment: 'Massive, consistent cash generation.',
  },
  {
    category: 'Valuation',
    rating: '⚠️ Expensive',
    comment: 'High multiple — priced for perfection.',
  },
  {
    category: 'Growth Investment',
    rating: '✅ Balanced',
    comment: 'Healthy R&D and CapEx levels.',
  },
  {
    category: 'Shareholder Returns',
    rating: '✅ Healthy',
    comment: 'Sustainable dividends, aggressive buybacks.',
  },
];

export const OverallHealthSummaryCard: React.FC<{ symbol: string }> = ({ symbol }) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/app/health/${symbol}`);
  };
  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-base font-semibold text-gray-800">
            Overall Health Summary
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium block mt-1">
            Key financial and strategic health indicators
          </span>
        </div>
        <Button size="sm" variant="outline" className="mt-1" onClick={handleViewDetails}>
          See Details
        </Button>
      </CardHeader>
      <CardContent className="relative z-10 px-2 py-2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 font-medium border-b">
                <th className="py-2 px-2 text-left">Category</th>
                <th className="py-2 px-2 text-left">Rating</th>
                <th className="py-2 px-2 text-left">Comment</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row) => (
                <tr
                  key={row.category}
                  className="border-b last:border-none hover:bg-white/60 transition"
                >
                  <td className="py-2 px-2 font-semibold text-gray-700">{row.category}</td>
                  <td
                    className={`py-2 px-2 font-bold ${
                      row.rating.includes('⚠️')
                        ? 'text-yellow-600'
                        : row.rating.includes('✅')
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }`}
                  >
                    {row.rating}
                  </td>
                  <td className="py-2 px-2 text-gray-600">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
