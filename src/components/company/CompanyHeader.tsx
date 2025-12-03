import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Button } from '../ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog.tsx';
import type { CompanyRead } from '../../types/company';

interface CompanyHeaderProps {
  company: CompanyRead;
  isInDatabase?: boolean;
  exchange?: string | null;
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
  isInDatabase = true,
  exchange,
}) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

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

          {/* Financials Button - Only show if in database */}
          {isInDatabase && (
            <Button
              onClick={() => {
                const url = exchange
                  ? `/app/financials/${company.symbol}?exchange=${exchange}`
                  : `/app/financials/${company.symbol}`;
                navigate(url);
              }}
              className="h-7 px-3 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-lg flex items-center gap-1.5 flex-shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Financials</span>
            </Button>
          )}

          {/* Add to Database Button - Only show if not in database */}
          {!isInDatabase && (
            <Button
              onClick={() => setShowDialog(true)}
              className="h-7 px-3 text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg flex items-center gap-1.5 flex-shrink-0"
            >
              <span>+ Add to Database</span>
            </Button>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Database</DialogTitle>
              <DialogDescription>
                Add {company.company_name} ({company.symbol}) to the database?
              </DialogDescription>
            </DialogHeader>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium">⏱️ Data Synchronization</p>
              <p className="text-xs text-blue-700 mt-1">
                This will take a few minutes to sync all historical data and analytics. You'll be
                able to access full features once the sync is complete.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="h-8 px-3 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-8 px-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                onClick={() => {
                  // TODO: Implement API call to add company to database
                  console.log('Adding company to database:', company.symbol);
                  setShowDialog(false);
                }}
              >
                Add to Database
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
};
