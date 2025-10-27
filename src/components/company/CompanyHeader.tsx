import React from 'react';
import { BarChart3, Bell, Eye, PlusCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import type { CompanyRead } from '../../types/company';

interface CompanyHeaderProps {
  company: CompanyRead;
  onAddToWatchlist?: () => void;
  onAddToPortfolio?: () => void;
  onSetReminder?: () => void;
  onViewFinancials?: () => void;
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

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  onAddToWatchlist,
  onAddToPortfolio,
  onSetReminder,
}) => {
  const navigate = useNavigate();
  const handleViewFinancials = () => {
    navigate(`/financials/${company.symbol}`);
  };

  // Format last updated date
  const lastUpdated = company.updated_at
    ? new Date(company.updated_at).toLocaleString(undefined, {
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
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pb-2">
        {/* Left section - Company info */}
        <div className="flex items-center space-x-4">
          {company.image && (
            <img
              src={company.image}
              alt={company.company_name}
              className="w-14 h-14 rounded-lg object-contain border bg-gray-50"
            />
          )}
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {company.company_name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {company.symbol} • {company.exchange_full_name} ({company.exchange})
            </CardDescription>
          </div>
        </div>

        {/* Right section - Price */}
        <div className="flex flex-col items-end space-y-1">
          <div className="text-2xl font-bold text-indigo-700">
            {company.currency} {company.price.toFixed(2)}
          </div>
        </div>
      </CardHeader>

      {/* Actions */}
      <div className="flex flex-wrap justify-between items-center px-6 pb-1 gap-3 border-t pt-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddToWatchlist}
            className="bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700"
          >
            <Eye className="w-4 h-4 mr-1" /> Add to Watchlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddToPortfolio}
            className="bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add to Portfolio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSetReminder}
            className="bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700"
          >
            <Bell className="w-4 h-4 mr-1" /> Set Reminder
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
          onClick={handleViewFinancials}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          See All Financials
        </Button>
      </div>
      {/* Extra info and Last Updated */}
      <div className="flex flex-wrap items-center justify-between px-6 pb-2 pt-2">
        {/* Important company fields */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span>
            <strong>Market Cap:</strong> {company.currency} {formatMarketCap(company.market_cap)}
          </span>
          <span>
            <strong>Sector:</strong> {company.sector}
          </span>
          <span>
            <strong>Industry:</strong> {company.industry}
          </span>
        </div>
        {/* Last Updated */}
        {lastUpdated && (
          <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            Last updated: {lastUpdated}
          </span>
        )}
      </div>
    </Card>
  );
};
