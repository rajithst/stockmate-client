import React from 'react';
import { BarChart3, Heart, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import type { CompanyRead } from '../../types/company';

interface CompanyHeaderProps {
  company: CompanyRead;
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toString();
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const navigate = useNavigate();
  const handleViewFinancials = () => {
    navigate(`/app/financials/${company.symbol}`);
  };
  const handleViewHealth = () => {
    navigate(`/app/health/${company.symbol}`);
  };
  const handleViewInsights = () => {
    navigate(`/app/insights/${company.symbol}`);
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20 pointer-events-none" />

      <CardHeader className="flex flex-col gap-2 py-2 px-4 pb-0">
        {/* Top row - Company info and Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {company.image && (
              <img
                src={company.image}
                alt={company.company_name}
                className="w-9 h-9 rounded-lg object-contain border bg-gray-50 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-gray-800 leading-tight">
                {company.company_name}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 leading-tight">
                {company.symbol} • {company.exchange_full_name}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-base font-bold text-indigo-700 leading-tight">
              {company.currency} {company.price?.toFixed(2) || 'N/A'}
            </div>
            {company.daily_price_change !== null && company.daily_price_change !== undefined && (
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  company.daily_price_change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {company.daily_price_change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {company.daily_price_change >= 0 ? '+' : ''}
                {company.daily_price_change.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {/* Bottom row - Info on left, Buttons on far right */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="whitespace-nowrap">
              <strong>Cap:</strong> {formatMarketCap(company.market_cap)}
            </span>
            {company.sector && (
              <span className="whitespace-nowrap">
                <strong>Sector:</strong> {company.sector}
              </span>
            )}
            {company.industry && (
              <span className="whitespace-nowrap hidden sm:inline">
                <strong>Industry:</strong> {company.industry}
              </span>
            )}
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 h-7"
              onClick={handleViewFinancials}
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              See Financials
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-7"
              onClick={handleViewHealth}
            >
              <Heart className="w-3 h-3 mr-1" />
              Check Health
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1 h-7"
              onClick={handleViewInsights}
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              See Insights
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
