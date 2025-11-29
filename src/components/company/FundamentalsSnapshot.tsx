import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { CompanyRead } from '../../types/company';
import type { CompanyFinancialRatioRead } from '../../types';

interface FundamentalsSnapshotProps {
  company: CompanyRead | null | undefined;
  ratios?: CompanyFinancialRatioRead | null;
}

interface DataPoint {
  label: string;
  value: string | number;
  category: 'valuation' | 'cashflow' | 'margin_growth' | 'balance' | 'dividend';
  tooltip?: string;
}

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

const formatDecimal = (value: number | null | undefined, places: number = 2): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(places);
};

export const FundamentalsSnapshot: React.FC<FundamentalsSnapshotProps> = ({ company, ratios }) => {
  const ratioData: Partial<CompanyFinancialRatioRead> = ratios || {};

  // Build data points from CompanyFinancialRatioRead and CompanyRead
  const dataPoints: DataPoint[] = [];

  // ============ VALUATION METRICS (max 5) ============
  // Market Cap (from company object)
  if (company?.market_cap) {
    const marketCapValue = company.market_cap;
    let formattedMarketCap: string;

    if (marketCapValue >= 1_000_000_000_000) {
      formattedMarketCap = `$${(marketCapValue / 1_000_000_000_000).toFixed(2)}T`;
    } else if (marketCapValue >= 1_000_000_000) {
      formattedMarketCap = `$${(marketCapValue / 1_000_000_000).toFixed(2)}B`;
    } else if (marketCapValue >= 1_000_000) {
      formattedMarketCap = `$${(marketCapValue / 1_000_000).toFixed(2)}M`;
    } else {
      formattedMarketCap = `$${marketCapValue.toFixed(0)}`;
    }

    dataPoints.push({
      label: 'Market Cap',
      value: formattedMarketCap,
      category: 'valuation',
      tooltip: "Total market value of the company's outstanding shares. Indicates company size.",
    });
  }

  // P/E Ratio
  if (ratioData.price_to_earnings_ratio) {
    dataPoints.push({
      label: 'P/E',
      value: formatDecimal(ratioData.price_to_earnings_ratio),
      category: 'valuation',
      tooltip:
        'Price-to-Earnings ratio. Lower P/E may indicate undervaluation; higher may indicate growth expectations.',
    });
  }

  // P/S Ratio
  if (ratioData.price_to_sales_ratio) {
    dataPoints.push({
      label: 'P/S',
      value: formatDecimal(ratioData.price_to_sales_ratio),
      category: 'valuation',
      tooltip: 'Price-to-Sales ratio. Market cap divided by total revenue. Less volatile than P/E.',
    });
  }

  // EV/EBITDA (using enterprise_value_multiple)
  if (ratioData.enterprise_value_multiple) {
    dataPoints.push({
      label: 'EV/EBITDA',
      value: formatDecimal(ratioData.enterprise_value_multiple),
      category: 'valuation',
      tooltip:
        'Enterprise Value to EBITDA. Used to compare valuations across companies with different capital structures.',
    });
  }

  // P/B Ratio
  if (ratioData.price_to_book_ratio) {
    dataPoints.push({
      label: 'P/B',
      value: formatDecimal(ratioData.price_to_book_ratio),
      category: 'valuation',
      tooltip:
        'Price-to-Book ratio. Stock price divided by book value per share. Useful for asset-heavy businesses.',
    });
  }

  // ============ CASHFLOW METRICS (max 5) ============
  // Free Cashflow Yield
  if (ratioData.price_to_free_cash_flow_ratio) {
    // FCF Yield is inverse of P/FCF
    const fcfYield = (1 / ratioData.price_to_free_cash_flow_ratio) * 100;
    dataPoints.push({
      label: 'FCF Yield',
      value: formatPercentage(fcfYield / 100),
      category: 'cashflow',
      tooltip: 'Free Cash Flow yield. Shows the annual FCF generated per dollar of market cap.',
    });
  }

  // Free Cashflow Per Share
  if (ratioData.free_cash_flow_per_share) {
    dataPoints.push({
      label: 'FCF/Share',
      value: formatDecimal(ratioData.free_cash_flow_per_share, 2),
      category: 'cashflow',
      tooltip:
        'Free Cash Flow per share. Actual cash generated that can be distributed to shareholders.',
    });
  }

  // Stock Based Compensation Adjusted FCF Yield
  // We'll calculate this from operating_cash_flow_per_share if available
  if (ratioData.operating_cash_flow_per_share && ratioData.free_cash_flow_per_share) {
    const sbcAdjustedFCF =
      ratioData.operating_cash_flow_per_share - ratioData.free_cash_flow_per_share;
    dataPoints.push({
      label: 'SBC Adj FCF',
      value: formatDecimal(sbcAdjustedFCF, 2),
      category: 'cashflow',
      tooltip:
        'Stock-based compensation adjusted FCF. Difference between OCF and FCF, showing impact of stock-based compensation.',
    });
  }

  // SBC Impact (Stock Based Compensation) - calculate as percentage of revenue
  // Note: stock_based_compensation is not in financial ratios, so we skip this if not available
  // Could be calculated from cash flow statement if provided separately

  // Operating Cash Flow Ratio
  if (ratioData.operating_cash_flow_ratio) {
    dataPoints.push({
      label: 'OCF Ratio',
      value: formatDecimal(ratioData.operating_cash_flow_ratio),
      category: 'cashflow',
      tooltip:
        "Operating Cash Flow ratio. Measures the company's ability to cover short-term liabilities with operating cash.",
    });
  }

  // ============ MARGINS & GROWTH METRICS (max 5) ============
  // Net Profit Margin
  if (ratioData.net_profit_margin) {
    dataPoints.push({
      label: 'Net Margin',
      value: formatPercentage(ratioData.net_profit_margin),
      category: 'margin_growth',
      tooltip: 'Net Profit Margin. Percentage of revenue that becomes profit. Higher is better.',
    });
  }

  // Operating Profit Margin
  if (ratioData.operating_profit_margin) {
    dataPoints.push({
      label: 'Op. Margin',
      value: formatPercentage(ratioData.operating_profit_margin),
      category: 'margin_growth',
      tooltip:
        'Operating Profit Margin. Percentage of revenue left after operating expenses. Shows operational efficiency.',
    });
  }

  // Gross Profit Margin
  if (ratioData.gross_profit_margin) {
    dataPoints.push({
      label: 'Gross Margin',
      value: formatPercentage(ratioData.gross_profit_margin),
      category: 'margin_growth',
      tooltip:
        'Gross Profit Margin. Percentage of revenue remaining after cost of goods sold. Shows pricing power.',
    });
  }

  // EBITDA Margin
  if (ratioData.ebitda_margin) {
    dataPoints.push({
      label: 'EBITDA Margin',
      value: formatPercentage(ratioData.ebitda_margin),
      category: 'margin_growth',
      tooltip:
        'EBITDA Margin. Operating profit before depreciation, amortization & interest. Industry comparable.',
    });
  }

  // EBIT Margin (Operating Efficiency)
  if (ratioData.ebit_margin) {
    dataPoints.push({
      label: 'EBIT Margin',
      value: formatPercentage(ratioData.ebit_margin),
      category: 'margin_growth',
      tooltip:
        'EBIT Margin. Operating income as percentage of revenue. Core operational profitability.',
    });
  }

  // Asset Turnover (Growth/Efficiency)
  if (ratioData.asset_turnover) {
    dataPoints.push({
      label: 'Asset Turnover',
      value: formatDecimal(ratioData.asset_turnover),
      category: 'margin_growth',
      tooltip:
        'Asset Turnover. Revenue per dollar of assets. Higher indicates efficient asset utilization.',
    });
  }

  // Revenue Per Share (Growth metric)
  if (ratioData.revenue_per_share) {
    dataPoints.push({
      label: 'Revenue/Share',
      value: formatDecimal(ratioData.revenue_per_share, 2),
      category: 'margin_growth',
      tooltip:
        'Revenue per share. Total revenue divided by shares outstanding. Tracks revenue growth per share.',
    });
  }

  // ============ BALANCE SHEET METRICS (max 5) ============
  // Current Ratio
  if (ratioData.current_ratio) {
    dataPoints.push({
      label: 'Current Ratio',
      value: formatDecimal(ratioData.current_ratio),
      category: 'balance',
      tooltip:
        'Current Ratio. Current assets divided by current liabilities. Measures short-term liquidity.',
    });
  }

  // Debt to Equity Ratio
  if (ratioData.debt_to_equity_ratio) {
    dataPoints.push({
      label: 'D/E Ratio',
      value: formatDecimal(ratioData.debt_to_equity_ratio),
      category: 'balance',
      tooltip:
        'Debt-to-Equity Ratio. Leverage indicator showing financial risk. Lower is generally safer.',
    });
  }

  // Debt to Assets Ratio
  if (ratioData.debt_to_assets_ratio) {
    dataPoints.push({
      label: 'D/A Ratio',
      value: formatDecimal(ratioData.debt_to_assets_ratio),
      category: 'balance',
      tooltip:
        'Debt-to-Assets Ratio. Percentage of assets financed by debt. Indicates financial risk.',
    });
  }

  // Quick Ratio
  if (ratioData.quick_ratio) {
    dataPoints.push({
      label: 'Quick Ratio',
      value: formatDecimal(ratioData.quick_ratio),
      category: 'balance',
      tooltip:
        'Quick Ratio. Stricter liquidity measure excluding inventory. Shows ability to pay immediate liabilities.',
    });
  }

  // Solvency Ratio
  if (ratioData.solvency_ratio) {
    dataPoints.push({
      label: 'Solvency',
      value: formatDecimal(ratioData.solvency_ratio),
      category: 'balance',
      tooltip:
        'Solvency Ratio. Long-term financial stability measure. Shows ability to meet long-term obligations.',
    });
  }

  // ============ DIVIDEND METRICS (max 5) ============
  // Dividend Yield
  if (ratioData.dividend_yield) {
    dataPoints.push({
      label: 'Div. Yield',
      value: formatPercentage(ratioData.dividend_yield),
      category: 'dividend',
      tooltip:
        'Dividend Yield. Annual dividend per share as percentage of stock price. Income return to shareholders.',
    });
  }

  // Dividend Payout Ratio
  if (ratioData.dividend_payout_ratio) {
    dataPoints.push({
      label: 'Payout Ratio',
      value: formatPercentage(ratioData.dividend_payout_ratio),
      category: 'dividend',
      tooltip:
        'Dividend Payout Ratio. Percentage of earnings paid as dividends. Shows dividend sustainability.',
    });
  }

  // Effective Tax Rate
  if (ratioData.effective_tax_rate) {
    dataPoints.push({
      label: 'Tax Rate',
      value: formatPercentage(ratioData.effective_tax_rate),
      category: 'dividend',
      tooltip:
        'Effective Tax Rate. Actual tax paid as percentage of pre-tax income. Shows tax efficiency.',
    });
  }

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
    margin_growth: dataPoints.filter((p) => p.category === 'margin_growth'),
    balance: dataPoints.filter((p) => p.category === 'balance'),
    dividend: dataPoints.filter((p) => p.category === 'dividend'),
  };

  const categoryLabels = {
    valuation: 'Valuation',
    cashflow: 'Cashflow',
    margin_growth: 'Margins & Growth',
    balance: 'Balance',
    dividend: 'Dividend',
  };

  const categoryColors = {
    valuation: { bg: 'bg-blue-50', border: 'border-l-blue-500', text: 'text-blue-700' },
    cashflow: { bg: 'bg-cyan-50', border: 'border-l-cyan-500', text: 'text-cyan-700' },
    margin_growth: { bg: 'bg-green-50', border: 'border-l-green-500', text: 'text-green-700' },
    balance: { bg: 'bg-amber-50', border: 'border-l-amber-500', text: 'text-amber-700' },
    dividend: { bg: 'bg-purple-50', border: 'border-l-purple-500', text: 'text-purple-700' },
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg font-bold text-gray-900">Fundamentals</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-1">Key financial metrics</p>
          </div>
          {ratioData.fiscal_year && (
            <span className="text-sm font-semibold text-purple-700 bg-purple-100 rounded-full px-3 py-1">
              {ratioData.fiscal_year}
              {ratioData.period && ` - ${ratioData.period}`}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4 relative z-10">
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(Object.entries(categories) as [keyof typeof categories, DataPoint[]][]).map(
              ([category, points]) =>
                points.length > 0 && (
                  <div key={category} className="space-y-2">
                    <h4
                      className={`text-xs font-semibold ${categoryColors[category].text} ${categoryColors[category].bg} rounded px-2.5 py-1 border-l-2 ${categoryColors[category].border}`}
                    >
                      {categoryLabels[category]}
                    </h4>
                    <div className="space-y-1">
                      {points.slice(0, 5).map((point, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div className="bg-white bg-opacity-70 rounded px-2 py-1 border border-gray-100 hover:border-gray-200 transition-colors cursor-help">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs text-gray-600 font-medium">{point.label}:</p>
                                <p className="text-sm font-bold text-gray-900">{point.value}</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          {point.tooltip && (
                            <TooltipContent className="max-w-xs text-xs" side="top">
                              {point.tooltip}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
