import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CompanyKeyMetricsRead } from '../../types';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  market_cap: 'Market Cap',
  enterprise_value: 'Enterprise Value',
  ev_to_sales: 'EV to Sales',
  ev_to_operating_cash_flow: 'EV to Operating Cash Flow',
  ev_to_free_cash_flow: 'EV to Free Cash Flow',
  ev_to_ebitda: 'EV to EBITDA',
  net_debt_to_ebitda: 'Net Debt to EBITDA',
  current_ratio: 'Current Ratio',
  income_quality: 'Income Quality',
  graham_number: 'Graham Number',
  graham_net_net: 'Graham Net-Net',
  tax_burden: 'Tax Burden',
  interest_burden: 'Interest Burden',
  working_capital: 'Working Capital',
  invested_capital: 'Invested Capital',
  return_on_assets: 'Return on Assets',
  operating_return_on_assets: 'Operating Return on Assets',
  return_on_tangible_assets: 'Return on Tangible Assets',
  return_on_equity: 'Return on Equity',
  return_on_invested_capital: 'Return on Invested Capital',
  return_on_capital_employed: 'Return on Capital Employed',
  earnings_yield: 'Earnings Yield',
  free_cash_flow_yield: 'Free Cash Flow Yield',
  capex_to_operating_cash_flow: 'CapEx to Operating Cash Flow',
  capex_to_depreciation: 'CapEx to Depreciation',
  capex_to_revenue: 'CapEx to Revenue',
  sales_general_and_administrative_to_revenue: 'SG&A to Revenue',
  research_and_development_to_revenue: 'R&D to Revenue',
  stock_based_compensation_to_revenue: 'Stock-Based Compensation to Revenue',
  intangibles_to_total_assets: 'Intangibles to Total Assets',
  average_receivables: 'Average Receivables',
  average_payables: 'Average Payables',
  average_inventory: 'Average Inventory',
  days_of_sales_outstanding: 'Days of Sales Outstanding',
  days_of_payables_outstanding: 'Days of Payables Outstanding',
  days_of_inventory_outstanding: 'Days of Inventory Outstanding',
  operating_cycle: 'Operating Cycle',
  cash_conversion_cycle: 'Cash Conversion Cycle',
  free_cash_flow_to_equity: 'Free Cash Flow to Equity',
  free_cash_flow_to_firm: 'Free Cash Flow to Firm',
  tangible_asset_value: 'Tangible Asset Value',
  net_current_asset_value: 'Net Current Asset Value',
};

export const KeyMetricsTab: React.FC<{ key_metrics: CompanyKeyMetricsRead[] }> = ({
  key_metrics,
}) => {
  const [data] = useState<CompanyKeyMetricsRead[]>(key_metrics);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const quarterOrder = ['FY', 'Q1', 'Q2', 'Q3', 'Q4'];

  const groupedByYear = data.reduce(
    (acc, stmt) => {
      if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
      acc[stmt.fiscal_year].push(stmt);
      return acc;
    },
    {} as Record<string, CompanyKeyMetricsRead[]>,
  );

  Object.keys(groupedByYear).forEach((year) => {
    groupedByYear[year].sort(
      (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period),
    );
  });
  const metricGroups: Record<string, (keyof CompanyKeyMetricsRead)[]> = {
    'Market Metrics': [
      'market_cap',
      'enterprise_value',
      'ev_to_sales',
      'ev_to_operating_cash_flow',
      'ev_to_free_cash_flow',
      'ev_to_ebitda',
      'net_debt_to_ebitda',
      'current_ratio',
      'income_quality',
      'graham_number',
      'graham_net_net',
      'tax_burden',
      'interest_burden',
    ],
    'Capital Metrics': [
      'working_capital',
      'invested_capital',
      'return_on_assets',
      'operating_return_on_assets',
      'return_on_tangible_assets',
      'return_on_equity',
      'return_on_invested_capital',
      'return_on_capital_employed',
    ],
    'Cash Flow Metrics': [
      'earnings_yield',
      'free_cash_flow_yield',
      'capex_to_operating_cash_flow',
      'capex_to_depreciation',
      'capex_to_revenue',
    ],
    'Operational Efficiency': [
      'sales_general_and_administrative_to_revenue',
      'research_and_development_to_revenue',
      'stock_based_compensation_to_revenue',
      'intangibles_to_total_assets',
      'average_receivables',
      'average_payables',
      'average_inventory',
      'days_of_sales_outstanding',
      'days_of_payables_outstanding',
      'days_of_inventory_outstanding',
      'operating_cycle',
      'cash_conversion_cycle',
      'free_cash_flow_to_equity',
      'free_cash_flow_to_firm',
      'tangible_asset_value',
      'net_current_asset_value',
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
                <CardTitle>{year} Key Metrics</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                {Object.entries(metricGroups).map(([groupName, metrics]) => (
                  <Card key={groupName} className="mb-4">
                    <CardTitle className="p-2 text-sm font-semibold">{groupName}</CardTitle>
                    <CardContent className="overflow-x-auto p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="h-7">
                            <TableHead className="px-2 py-1 text-xs">Metric</TableHead>
                            {statements.map((stmt) => (
                              <TableHead
                                key={stmt.period}
                                className="px-2 py-1 text-xs text-center"
                              >
                                {stmt.period}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {metrics.map((metric) => (
                            <TableRow key={metric} className="h-6 hover:bg-indigo-50">
                              <TableCell className="px-2 py-1 font-medium text-xs">
                                {metricLabels[metric as string] ||
                                  String(metric).replace(/_/g, ' ')}
                              </TableCell>
                              {statements.map((stmt) => (
                                <TableCell
                                  key={`${stmt.period}-${metric}`}
                                  className="px-2 py-1 text-xs text-right"
                                >
                                  {stmt[metric] !== null && stmt[metric] !== undefined
                                    ? stmt[metric].toLocaleString?.()
                                    : '-'}
                                </TableCell>
                              ))}
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
