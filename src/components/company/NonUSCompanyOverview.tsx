import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Activity, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { NonUSCompany } from '../../types/company';

interface NonUSCompanyOverviewProps {
  company: NonUSCompany;
}

function formatMarketCap(value: number | null): string {
  if (!value) return 'N/A';
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return value.toString();
}

function formatNumber(value: number | null): string {
  if (value === null) return 'N/A';
  return value.toFixed(2);
}

export const NonUSCompanyOverview: React.FC<NonUSCompanyOverviewProps> = ({ company }) => {
  return (
    <div className="space-y-4">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Market Data */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm font-bold text-blue-900">Market Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">Market Cap</span>
              <span className="text-sm font-bold text-blue-900">
                {formatMarketCap(company.market_cap)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">Volume</span>
              <span className="text-sm font-bold text-blue-900">
                {company.regular_market_volume?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">Avg Volume</span>
              <span className="text-sm font-bold text-blue-900">
                {company.average_volume?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">Open</span>
              <span className="text-sm font-bold text-blue-900">
                {formatNumber(company.regular_market_open)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">Day Range</span>
              <span className="text-sm font-bold text-blue-900">
                {formatNumber(company.regular_market_day_low)} -{' '}
                {formatNumber(company.regular_market_day_high)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-medium">52W Range</span>
              <span className="text-sm font-bold text-blue-900">
                {formatNumber(company.fifty_two_week_low)} -{' '}
                {formatNumber(company.fifty_two_week_high)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Metrics */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-sm font-bold text-purple-900">Valuation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">P/E Ratio</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.trailing_pe)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">Forward P/E</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.forward_pe)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">P/B Ratio</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.price_to_book)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">P/S Ratio</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.price_to_sales_trailing_12_months)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">EV / Revenue</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.enterprise_to_revenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-700 font-medium">PEG Ratio</span>
              <span className="text-sm font-bold text-purple-900">
                {formatNumber(company.trailing_peg_ratio)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profitability */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm font-bold text-green-900">Profitability</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Profit Margin</span>
              <span className="text-sm font-bold text-green-900">
                {company.profit_margins ? `${(company.profit_margins * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Gross Margin</span>
              <span className="text-sm font-bold text-green-900">
                {company.gross_margins ? `${(company.gross_margins * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Operating Margin</span>
              <span className="text-sm font-bold text-green-900">
                {company.operating_margins
                  ? `${(company.operating_margins * 100).toFixed(2)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">EBITDA Margin</span>
              <span className="text-sm font-bold text-green-900">
                {company.ebitda_margins ? `${(company.ebitda_margins * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">ROE</span>
              <span className="text-sm font-bold text-green-900">
                {company.return_on_equity
                  ? `${(company.return_on_equity * 100).toFixed(2)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">ROA</span>
              <span className="text-sm font-bold text-green-900">
                {company.return_on_assets
                  ? `${(company.return_on_assets * 100).toFixed(2)}%`
                  : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dividend Info */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-sm font-bold text-amber-900">Dividend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-700 font-medium">Dividend Rate</span>
              <span className="text-sm font-bold text-amber-900">
                {formatNumber(company.dividend_rate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-700 font-medium">Dividend Yield</span>
              <span className="text-sm font-bold text-amber-900">
                {company.dividend_yield ? `${(company.dividend_yield * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-700 font-medium">Payout Ratio</span>
              <span className="text-sm font-bold text-amber-900">
                {company.payout_ratio ? `${(company.payout_ratio * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-700 font-medium">Five Year Avg Yield</span>
              <span className="text-sm font-bold text-amber-900">
                {company.five_year_avg_dividend_yield
                  ? `${(company.five_year_avg_dividend_yield * 100).toFixed(2)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-700 font-medium">Ex-Dividend Date</span>
              <span className="text-sm font-bold text-amber-900">
                {company.ex_dividend_date
                  ? new Date(company.ex_dividend_date).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Growth & Financial Health */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-sm font-bold text-indigo-900">Financial Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Enterprise Value</span>
              <span className="text-sm font-bold text-indigo-900">
                {formatMarketCap(company.enterprise_value)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Total Debt</span>
              <span className="text-sm font-bold text-indigo-900">
                {formatMarketCap(company.total_debt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Total Cash</span>
              <span className="text-sm font-bold text-indigo-900">
                {formatMarketCap(company.total_cash)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Cash Per Share</span>
              <span className="text-sm font-bold text-indigo-900">
                {formatNumber(company.total_cash_per_share)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Revenue Growth</span>
              <span className="text-sm font-bold text-indigo-900">
                {company.revenue_growth ? `${(company.revenue_growth * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-700 font-medium">Earnings Growth</span>
              <span className="text-sm font-bold text-indigo-900">
                {company.earnings_growth ? `${(company.earnings_growth * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Analyst Info */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-sm font-bold text-rose-900">Analyst Estimates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Rating</span>
              <span className="text-sm font-bold text-rose-900">
                {company.average_analyst_rating || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Target Price</span>
              <span className="text-sm font-bold text-rose-900">
                {formatNumber(company.target_mean_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Target Median</span>
              <span className="text-sm font-bold text-rose-900">
                {formatNumber(company.target_median_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Target Range</span>
              <span className="text-sm font-bold text-rose-900">
                {formatNumber(company.target_low_price)} - {formatNumber(company.target_high_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Opinions</span>
              <span className="text-sm font-bold text-rose-900">
                {company.number_of_analyst_opinions || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-700 font-medium">Recommendation Mean</span>
              <span className="text-sm font-bold text-rose-900">
                {formatNumber(company.recommendation_mean)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
