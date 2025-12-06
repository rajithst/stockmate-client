import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CompanyFinancialRatioRead } from '../../types';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  gross_profit_margin: 'Gross Profit Margin',
  ebit_margin: 'EBIT Margin',
  ebitda_margin: 'EBITDA Margin',
  operating_profit_margin: 'Operating Profit Margin',
  pretax_profit_margin: 'Pre-Tax Profit Margin',
  continuous_operations_profit_margin: 'Continuous Operations Profit Margin',
  net_profit_margin: 'Net Profit Margin',
  bottom_line_profit_margin: 'Bottom Line Profit Margin',
  receivables_turnover: 'Receivables Turnover',
  payables_turnover: 'Payables Turnover',
  inventory_turnover: 'Inventory Turnover',
  fixed_asset_turnover: 'Fixed Asset Turnover',
  asset_turnover: 'Asset Turnover',
  current_ratio: 'Current Ratio',
  quick_ratio: 'Quick Ratio',
  solvency_ratio: 'Solvency Ratio',
  cash_ratio: 'Cash Ratio',
  price_to_earnings_ratio: 'Price to Earnings Ratio',
  price_to_earnings_growth_ratio: 'PEG Ratio',
  forward_price_to_earnings_growth_ratio: 'Forward PEG Ratio',
  price_to_book_ratio: 'Price to Book Ratio',
  price_to_sales_ratio: 'Price to Sales Ratio',
  price_to_free_cash_flow_ratio: 'Price to Free Cash Flow Ratio',
  price_to_operating_cash_flow_ratio: 'Price to Operating Cash Flow Ratio',
  debt_to_assets_ratio: 'Debt to Assets Ratio',
  debt_to_equity_ratio: 'Debt to Equity Ratio',
  debt_to_capital_ratio: 'Debt to Capital Ratio',
  long_term_debt_to_capital_ratio: 'Long-Term Debt to Capital Ratio',
  financial_leverage_ratio: 'Financial Leverage Ratio',
  working_capital_turnover_ratio: 'Working Capital Turnover Ratio',
  operating_cash_flow_ratio: 'Operating Cash Flow Ratio',
  operating_cash_flow_sales_ratio: 'Operating Cash Flow/Sales Ratio',
  free_cash_flow_operating_cash_flow_ratio: 'Free Cash Flow/Operating Cash Flow Ratio',
  debt_service_coverage_ratio: 'Debt Service Coverage Ratio',
  interest_coverage_ratio: 'Interest Coverage Ratio',
  short_term_operating_cash_flow_coverage_ratio: 'Short-Term Operating Cash Flow Coverage Ratio',
  operating_cash_flow_coverage_ratio: 'Operating Cash Flow Coverage Ratio',
  capital_expenditure_coverage_ratio: 'Capital Expenditure Coverage Ratio',
  dividend_paid_and_capex_coverage_ratio: 'Dividend Paid & Capex Coverage Ratio',
  dividend_payout_ratio: 'Dividend Payout Ratio',
  dividend_yield: 'Dividend Yield',
  dividend_yield_percentage: 'Dividend Yield (%)',
  revenue_per_share: 'Revenue Per Share',
  net_income_per_share: 'Net Income Per Share',
  interest_debt_per_share: 'Interest Debt Per Share',
  cash_per_share: 'Cash Per Share',
  book_value_per_share: 'Book Value Per Share',
  tangible_book_value_per_share: 'Tangible Book Value Per Share',
  shareholders_equity_per_share: 'Shareholders’ Equity Per Share',
  operating_cash_flow_per_share: 'Operating Cash Flow Per Share',
  capex_per_share: 'CapEx Per Share',
  free_cash_flow_per_share: 'Free Cash Flow Per Share',
  net_income_per_ebt: 'Net Income/EBT',
  ebt_per_ebit: 'EBT/EBIT',
  price_to_fair_value: 'Price to Fair Value',
  debt_to_market_cap: 'Debt to Market Cap',
  effective_tax_rate: 'Effective Tax Rate',
  enterprise_value_multiple: 'Enterprise Value Multiple',
};

export const RatiosTab: React.FC<{ financial_ratios: CompanyFinancialRatioRead[] }> = ({
  financial_ratios,
}) => {
  const [data] = useState<CompanyFinancialRatioRead[]>(financial_ratios || []);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const quarterOrder = ['FY', 'Q4', 'Q3', 'Q2', 'Q1'];

  const groupedByYear = data.reduce(
    (acc, stmt) => {
      if (!stmt.fiscal_year) return acc;
      const year = stmt.fiscal_year;
      if (!acc[year]) acc[year] = {};
      if (stmt.period) {
        acc[year][stmt.period] = stmt;
      }
      return acc;
    },
    {} as Record<string, Record<string, CompanyFinancialRatioRead>>,
  );
  const metricGroups: Record<string, (keyof CompanyFinancialRatioRead)[]> = {
    'Profitability Margins': [
      'gross_profit_margin',
      'ebit_margin',
      'ebitda_margin',
      'operating_profit_margin',
      'pretax_profit_margin',
      'continuous_operations_profit_margin',
      'net_profit_margin',
      'bottom_line_profit_margin',
    ],
    'Efficiency Ratios': [
      'receivables_turnover',
      'payables_turnover',
      'inventory_turnover',
      'fixed_asset_turnover',
      'asset_turnover',
    ],
    'Liquidity Ratios': ['current_ratio', 'quick_ratio', 'solvency_ratio', 'cash_ratio'],
    'Valuation Ratios': [
      'price_to_earnings_ratio',
      'price_to_earnings_growth_ratio',
      'forward_price_to_earnings_growth_ratio',
      'price_to_book_ratio',
      'price_to_sales_ratio',
      'price_to_free_cash_flow_ratio',
      'price_to_operating_cash_flow_ratio',
    ],
    'Leverage Ratios': [
      'debt_to_assets_ratio',
      'debt_to_equity_ratio',
      'debt_to_capital_ratio',
      'long_term_debt_to_capital_ratio',
      'financial_leverage_ratio',
    ],
    'Cash Flow Coverage Ratios': [
      'working_capital_turnover_ratio',
      'operating_cash_flow_ratio',
      'operating_cash_flow_sales_ratio',
      'free_cash_flow_operating_cash_flow_ratio',
      'debt_service_coverage_ratio',
      'interest_coverage_ratio',
      'short_term_operating_cash_flow_coverage_ratio',
      'operating_cash_flow_coverage_ratio',
      'capital_expenditure_coverage_ratio',
      'dividend_paid_and_capex_coverage_ratio',
    ],
    'Dividend Ratios': ['dividend_payout_ratio', 'dividend_yield', 'dividend_yield_percentage'],
    'Per Share Metrics': [
      'revenue_per_share',
      'net_income_per_share',
      'interest_debt_per_share',
      'cash_per_share',
      'book_value_per_share',
      'tangible_book_value_per_share',
      'shareholders_equity_per_share',
      'operating_cash_flow_per_share',
      'capex_per_share',
      'free_cash_flow_per_share',
    ],
    'Misc Ratios': [
      'net_income_per_ebt',
      'ebt_per_ebit',
      'price_to_fair_value',
      'debt_to_market_cap',
      'effective_tax_rate',
      'enterprise_value_multiple',
    ],
  };

  return (
    <Accordion type="multiple" className="space-y-4">
      {Object.keys(groupedByYear)
        .sort((a, b) => b.localeCompare(a))
        .map((year) => {
          const statements = groupedByYear[year];
          return (
            <AccordionItem key={year} value={year}>
              <AccordionTrigger>
                <CardTitle>{year} Financial Ratios</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                {Object.entries(metricGroups).map(([groupName, metrics]) => (
                  <Card key={groupName} className="mb-4">
                    <CardTitle className="p-2 text-sm font-semibold">{groupName}</CardTitle>
                    <CardContent className="overflow-x-auto p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="h-7">
                            <TableHead className="px-2 py-1 text-xs text-center border-r border-gray-200">
                              Metric
                            </TableHead>
                            {quarterOrder.map((quarter, idx) => (
                              <TableHead
                                key={quarter}
                                className={`px-2 py-1 text-xs text-center border-r border-gray-200 ${
                                  idx === quarterOrder.length - 1 ? 'border-r-0' : ''
                                }`}
                              >
                                {quarter}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {metrics.map((metric) => (
                            <TableRow key={metric} className="h-6 hover:bg-indigo-50">
                              <TableCell className="px-2 py-1 font-medium text-xs border-r border-gray-200 flex items-center justify-center">
                                {metricLabels[metric as string] ||
                                  String(metric).replace(/_/g, ' ')}
                              </TableCell>
                              {quarterOrder.map((quarter, idx) => {
                                const stmt = statements[quarter];
                                return (
                                  <TableCell
                                    key={`${quarter}-${metric}`}
                                    className={`px-2 py-1 text-xs text-right border-r border-gray-200 ${
                                      idx === quarterOrder.length - 1 ? 'border-r-0' : ''
                                    }`}
                                  >
                                    {stmt && stmt[metric] !== null && stmt[metric] !== undefined
                                      ? stmt[metric].toLocaleString?.()
                                      : '-'}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};
