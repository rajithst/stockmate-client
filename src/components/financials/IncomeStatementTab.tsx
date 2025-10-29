import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardTitle } from '../ui/card.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import type { CompanyIncomeStatementRead } from '../../types/income_statement.ts';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  date: 'Date',
  reported_currency: 'Currency',
  revenue: 'Revenue',
  cost_of_revenue: 'Cost of Revenue',
  gross_profit: 'Gross Profit',
  research_and_development_expenses: 'R&D Expenses',
  general_and_administrative_expenses: 'General & Administrative Expenses',
  selling_and_marketing_expenses: 'Selling & Marketing Expenses',
  selling_general_and_administrative_expenses: 'Selling, General & Administrative Expenses',
  other_expenses: 'Other Expenses',
  operating_expenses: 'Operating Expenses',
  cost_and_expenses: 'Total Cost & Expenses',
  net_interest_income: 'Net Interest Income',
  interest_income: 'Interest Income',
  interest_expense: 'Interest Expense',
  depreciation_and_amortization: 'Depreciation & Amortization',
  ebitda: 'EBITDA',
  ebit: 'EBIT',
  operating_income: 'Operating Income',
  total_other_income_expenses_net: 'Other Income/Expenses (Net)',
  income_before_tax: 'Income Before Tax',
  income_tax_expense: 'Income Tax Expense',
  net_income_from_continuing_operations: 'Net Income (Continuing Ops)',
  net_income_from_discontinued_operations: 'Net Income (Discontinued Ops)',
  other_adjustments_to_net_income: 'Other Adjustments to Net Income',
  net_income: 'Net Income',
  net_income_deductions: 'Net Income Deductions',
  bottom_line_net_income: 'Bottom Line Net Income',
  eps: 'Earnings Per Share (EPS)',
  eps_diluted: 'EPS (Diluted)',
  weighted_average_shs_out: 'Weighted Avg Shares Out',
  weighted_average_shs_out_dil: 'Weighted Avg Shares Out (Diluted)',
};

export const IncomeStatementTab: React.FC<{ income_statements: CompanyIncomeStatementRead[] }> = ({
  income_statements,
}) => {
  const data = income_statements || [];

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
    {} as Record<string, CompanyIncomeStatementRead[]>,
  );

  Object.keys(groupedByYear).forEach((year) => {
    groupedByYear[year].sort(
      (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period),
    );
  });

  const metricGroups: Record<string, (keyof CompanyIncomeStatementRead)[]> = {
    'Revenue and Cost': ['date', 'reported_currency', 'revenue', 'cost_of_revenue', 'gross_profit'],
    'Operating Expenses': [
      'date',
      'reported_currency',
      'research_and_development_expenses',
      'general_and_administrative_expenses',
      'selling_and_marketing_expenses',
      'selling_general_and_administrative_expenses',
      'other_expenses',
      'operating_expenses',
      'cost_and_expenses',
    ],
    'Interest Income/Expense': [
      'date',
      'reported_currency',
      'net_interest_income',
      'interest_income',
      'interest_expense',
    ],
    'Profit Metrics': [
      'date',
      'reported_currency',
      'depreciation_and_amortization',
      'ebitda',
      'ebit',
      'operating_income',
    ],
    'Other Income/Expenses & Taxes': [
      'date',
      'reported_currency',
      'total_other_income_expenses_net',
      'income_before_tax',
      'income_tax_expense',
    ],
    'Net Income Details': [
      'date',
      'reported_currency',
      'net_income_from_continuing_operations',
      'net_income_from_discontinued_operations',
      'other_adjustments_to_net_income',
      'net_income',
      'net_income_deductions',
      'bottom_line_net_income',
    ],
    'Earnings Per Share': [
      'date',
      'reported_currency',
      'eps',
      'eps_diluted',
      'weighted_average_shs_out',
      'weighted_average_shs_out_dil',
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
                <CardTitle>{year} Income Statement</CardTitle>
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
