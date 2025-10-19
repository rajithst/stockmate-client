import React from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, Bell, Eye, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';

export interface Company {
  symbol: string;
  company_name: string;
  price: number;
  currency: string;
  exchange_full_name: string;
  exchange: string;
  image?: string;
  dailyChange?: number; // new field for last day change (%)
}

interface CompanyHeaderProps {
  company: Company;
  onAddToWatchlist?: () => void;
  onAddToPortfolio?: () => void;
  onSetReminder?: () => void;
  onViewFinancials?: () => void;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  onAddToWatchlist,
  onAddToPortfolio,
  onSetReminder,
}) => {
  const isPositive = (company.dailyChange ?? 0) >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const navigate = useNavigate();
  const handleViewFinancials = () => {
    navigate(`/financials/${company.symbol}`);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        {/* Left section - Company info */}
        <div className="flex items-center space-x-4">
          {company.image && (
            <img
              src={company.image}
              alt={company.company_name}
              className="w-12 h-12 rounded-md object-contain border"
            />
          )}
          <div>
            <CardTitle className="text-2xl font-semibold">{company.company_name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {company.symbol} • {company.exchange_full_name} ({company.exchange})
            </CardDescription>
          </div>
        </div>

        {/* Right section - Price + Change */}
        <div className="flex flex-col items-end space-y-1">
          <div className="text-2xl font-bold">
            {company.currency} {company.price.toFixed(2)}
          </div>
          {company.dailyChange !== undefined && (
            <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
              <ChangeIcon className="w-4 h-4 mr-1" />
              {Math.abs(company.dailyChange).toFixed(2)}%
            </div>
          )}
        </div>
      </CardHeader>

      {/* Actions */}
      <div className="flex flex-wrap justify-between items-center px-6 pb-4 gap-3 border-t pt-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onAddToWatchlist}>
            <Eye className="w-4 h-4 mr-1" /> Add to Watchlist
          </Button>
          <Button variant="outline" size="sm" onClick={onAddToPortfolio}>
            <PlusCircle className="w-4 h-4 mr-1" /> Add to Portfolio
          </Button>
          <Button variant="outline" size="sm" onClick={onSetReminder}>
            <Bell className="w-4 h-4 mr-1" /> Set Reminder
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          onClick={handleViewFinancials}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          See All Financials
        </Button>
      </div>
    </Card>
  );
};
