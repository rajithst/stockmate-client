import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { sampleRatio } from '../../data/sample_ratio.tsx';

export interface CompanyKeyMetrics {
  id: number;
  company_id: number;
  symbol: string;
  date: string;
  fiscal_year: string;
  period: string;
  reported_currency: string;

  // Market metrics
  market_cap: number | null;
  enterprise_value: number | null;
  ev_to_sales: number | null;
  ev_to_operating_cash_flow: number | null;
  ev_to_free_cash_flow: number | null;
  ev_to_ebitda: number | null;
  net_debt_to_ebitda: number | null;
  current_ratio: number | null;
  income_quality: number | null;
  graham_number: number | null;
  graham_net_net: number | null;
  tax_burden: number | null;
  interest_burden: number | null;

  // Capital metrics
  working_capital: number | null;
  invested_capital: number | null;
  return_on_assets: number | null;
  operating_return_on_assets: number | null;
  return_on_tangible_assets: number | null;
  return_on_equity: number | null;
  return_on_invested_capital: number | null;
  return_on_capital_employed: number | null;

  // Cash flow metrics
  earnings_yield: number | null;
  free_cash_flow_yield: number | null;
  capex_to_operating_cash_flow: number | null;
  capex_to_depreciation: number | null;
  capex_to_revenue: number | null;

  // Operational efficiency
  sales_general_and_administrative_to_revenue: number | null;
  research_and_development_to_revenue: number | null;
  stock_based_compensation_to_revenue: number | null;
  intangibles_to_total_assets: number | null;
  average_receivables: number | null;
  average_payables: number | null;
  average_inventory: number | null;
  days_of_sales_outstanding: number | null;
  days_of_payables_outstanding: number | null;
  days_of_inventory_outstanding: number | null;
  operating_cycle: number | null;
  cash_conversion_cycle: number | null;
  free_cash_flow_to_equity: number | null;
  free_cash_flow_to_firm: number | null;
  tangible_asset_value: number | null;
  net_current_asset_value: number | null;
}

interface Props {
  symbol: string;
}

export const KeyMetricsTab: React.FC<Props> = ({ symbol }) => {
  const [data] = useState<CompanyKeyMetrics[]>(sampleRatio);

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
    {} as Record<string, CompanyKeyMetrics[]>,
  );

  Object.keys(groupedByYear).forEach((year) => {
    groupedByYear[year].sort(
      (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period),
    );
  });
  const metricGroups: Record<string, (keyof CompanyKeyMetrics)[]> = {
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
                  <Card key={groupName} className="mb-6">
                    <CardTitle className="p-4 text-lg font-semibold">{groupName}</CardTitle>
                    <CardContent className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            {statements.map((stmt) => (
                              <TableHead key={stmt.period}>{stmt.period}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {metrics.map((metric) => (
                            <TableRow key={metric}>
                              <TableCell className="font-medium">
                                {metric.replace(/_/g, ' ')}
                              </TableCell>
                              {statements.map((stmt) => (
                                <TableCell key={`${stmt.period}-${metric}`}>
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
