import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import type { CompanyBalanceSheetRead } from '../../types/balance_sheet.ts';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  date: 'Date',
  reported_currency: 'Currency',
  cash_and_cash_equivalents: 'Cash & Cash Equivalents',
  short_term_investments: 'Short-Term Investments',
  cash_and_short_term_investments: 'Cash & Short-Term Investments',
  accounts_receivables: 'Accounts Receivables',
  net_receivables: 'Net Receivables',
  other_receivables: 'Other Receivables',
  inventory: 'Inventory',
  prepaids: 'Prepaids',
  other_current_assets: 'Other Current Assets',
  total_current_assets: 'Total Current Assets',
  property_plant_equipment_net: 'Property, Plant & Equipment (Net)',
  goodwill: 'Goodwill',
  intangible_assets: 'Intangible Assets',
  goodwill_and_intangible_assets: 'Goodwill & Intangible Assets',
  long_term_investments: 'Long-Term Investments',
  tax_assets: 'Tax Assets',
  other_non_current_assets: 'Other Non-Current Assets',
  total_non_current_assets: 'Total Non-Current Assets',
  other_assets: 'Other Assets',
  total_assets: 'Total Assets',
  total_payables: 'Total Payables',
  account_payables: 'Account Payables',
  other_payables: 'Other Payables',
  accrued_expenses: 'Accrued Expenses',
  short_term_debt: 'Short-Term Debt',
  capital_lease_obligations_current: 'Capital Lease Obligations (Current)',
  tax_payables: 'Tax Payables',
  deferred_revenue: 'Deferred Revenue',
  other_current_liabilities: 'Other Current Liabilities',
  total_current_liabilities: 'Total Current Liabilities',
  long_term_debt: 'Long-Term Debt',
  deferred_revenue_non_current: 'Deferred Revenue (Non-Current)',
  deferred_tax_liabilities_non_current: 'Deferred Tax Liabilities (Non-Current)',
  other_non_current_liabilities: 'Other Non-Current Liabilities',
  total_non_current_liabilities: 'Total Non-Current Liabilities',
  other_liabilities: 'Other Liabilities',
  capital_lease_obligations: 'Capital Lease Obligations',
  total_liabilities: 'Total Liabilities',
  treasury_stock: 'Treasury Stock',
  preferred_stock: 'Preferred Stock',
  common_stock: 'Common Stock',
  retained_earnings: 'Retained Earnings',
  additional_paid_in_capital: 'Additional Paid-In Capital',
  accumulated_other_comprehensive_income_loss: 'Accumulated Other Comprehensive Income/Loss',
  other_total_stockholders_equity: 'Other Total Stockholders’ Equity',
  total_stockholders_equity: 'Total Stockholders’ Equity',
  total_equity: 'Total Equity',
  minority_interest: 'Minority Interest',
  total_liabilities_and_total_equity: 'Total Liabilities & Total Equity',
  total_investments: 'Total Investments',
  total_debt: 'Total Debt',
  net_debt: 'Net Debt',
};

export const BalanceSheetTab: React.FC<{ balance_sheets: CompanyBalanceSheetRead[] }> = ({
  balance_sheets,
}) => {
  const [data] = useState<CompanyBalanceSheetRead[]>(balance_sheets || []);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }
  // Group by fiscal year
  const groupedByYear = data.reduce(
    (acc, stmt) => {
      if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
      acc[stmt.fiscal_year].push(stmt);
      return acc;
    },
    {} as Record<string, CompanyBalanceSheetRead[]>,
  );

  const quarterOrder = ['FY', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Sort quarters
  Object.keys(groupedByYear).forEach((year) => {
    groupedByYear[year].sort(
      (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period),
    );
  });

  const metricGroups: Record<string, (keyof CompanyBalanceSheetRead)[]> = {
    'Current Assets': [
      'date',
      'reported_currency',
      'cash_and_cash_equivalents',
      'short_term_investments',
      'cash_and_short_term_investments',
      'accounts_receivables',
      'net_receivables',
      'other_receivables',
      'inventory',
      'prepaids',
      'other_current_assets',
      'total_current_assets',
    ],
    'Non-Current Assets': [
      'date',
      'reported_currency',
      'property_plant_equipment_net',
      'goodwill',
      'intangible_assets',
      'goodwill_and_intangible_assets',
      'long_term_investments',
      'tax_assets',
      'other_non_current_assets',
      'total_non_current_assets',
      'other_assets',
      'total_assets',
    ],
    'Current Liabilities': [
      'date',
      'reported_currency',
      'total_payables',
      'account_payables',
      'other_payables',
      'accrued_expenses',
      'short_term_debt',
      'capital_lease_obligations_current',
      'tax_payables',
      'deferred_revenue',
      'other_current_liabilities',
      'total_current_liabilities',
    ],
    'Non-Current Liabilities': [
      'date',
      'reported_currency',
      'long_term_debt',
      'long_term_debt',
      'deferred_revenue_non_current',
      'deferred_tax_liabilities_non_current',
      'other_non_current_liabilities',
      'total_non_current_liabilities',
      'other_liabilities',
      'capital_lease_obligations',
      'total_liabilities',
    ],
    "Stockholders' Equity": [
      'date',
      'reported_currency',
      'treasury_stock',
      'treasury_stock',
      'preferred_stock',
      'common_stock',
      'retained_earnings',
      'additional_paid_in_capital',
      'accumulated_other_comprehensive_income_loss',
      'other_total_stockholders_equity',
      'total_stockholders_equity',
      'total_equity',
      'minority_interest',
    ],
    'Totals & Debt': [
      'date',
      'reported_currency',
      'total_liabilities_and_total_equity',
      'total_investments',
      'total_debt',
      'net_debt',
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
                <CardTitle>{year} Balance Sheet</CardTitle>
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
