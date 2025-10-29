import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CompanyCashFlowStatementRead } from '../../types/cashflow.ts';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  date: 'Date',
  reported_currency: 'Currency',
  net_income: 'Net Income',
  depreciation_and_amortization: 'Depreciation & Amortization',
  deferred_income_tax: 'Deferred Income Tax',
  stock_based_compensation: 'Stock-Based Compensation',
  change_in_working_capital: 'Change in Working Capital',
  accounts_receivables: 'Accounts Receivables',
  inventory: 'Inventory',
  accounts_payables: 'Accounts Payables',
  other_working_capital: 'Other Working Capital',
  other_non_cash_items: 'Other Non-Cash Items',
  net_cash_provided_by_operating_activities: 'Net Cash from Operating Activities',
  investments_in_property_plant_and_equipment: 'Investments in PP&E',
  acquisitions_net: 'Net Acquisitions',
  purchases_of_investments: 'Purchases of Investments',
  sales_maturities_of_investments: 'Sales/Maturities of Investments',
  other_investing_activities: 'Other Investing Activities',
  net_cash_provided_by_investing_activities: 'Net Cash from Investing Activities',
  net_debt_issuance: 'Net Debt Issuance',
  long_term_net_debt_issuance: 'Long-Term Net Debt Issuance',
  short_term_net_debt_issuance: 'Short-Term Net Debt Issuance',
  net_stock_issuance: 'Net Stock Issuance',
  net_common_stock_issuance: 'Net Common Stock Issuance',
  common_stock_issuance: 'Common Stock Issuance',
  common_stock_repurchased: 'Common Stock Repurchased',
  net_preferred_stock_issuance: 'Net Preferred Stock Issuance',
  net_dividends_paid: 'Net Dividends Paid',
  common_dividends_paid: 'Common Dividends Paid',
  preferred_dividends_paid: 'Preferred Dividends Paid',
  other_financing_activities: 'Other Financing Activities',
  net_cash_provided_by_financing_activities: 'Net Cash from Financing Activities',
  effect_of_forex_changes_on_cash: 'Effect of Forex Changes on Cash',
  net_change_in_cash: 'Net Change in Cash',
  cash_at_end_of_period: 'Cash at End of Period',
  cash_at_beginning_of_period: 'Cash at Beginning of Period',
  operating_cash_flow: 'Operating Cash Flow',
  capital_expenditure: 'Capital Expenditure',
  free_cash_flow: 'Free Cash Flow',
  income_taxes_paid: 'Income Taxes Paid',
  interest_paid: 'Interest Paid',
};

export const CashFlowTab: React.FC<{ cash_flow_statements: CompanyCashFlowStatementRead[] }> = ({
  cash_flow_statements,
}) => {
  const [data] = useState<CompanyCashFlowStatementRead[]>(cash_flow_statements || []);

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
    {} as Record<string, CompanyCashFlowStatementRead[]>,
  );

  Object.keys(groupedByYear).forEach((year) => {
    groupedByYear[year].sort(
      (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period),
    );
  });

  const metricGroups: Record<string, (keyof CompanyCashFlowStatementRead)[]> = {
    'Operating Activities': [
      'date',
      'reported_currency',
      'net_income',
      'depreciation_and_amortization',
      'deferred_income_tax',
      'stock_based_compensation',
      'change_in_working_capital',
      'accounts_receivables',
      'inventory',
      'accounts_payables',
      'other_working_capital',
      'other_non_cash_items',
      'net_cash_provided_by_operating_activities',
    ],
    'Investing Activities': [
      'date',
      'reported_currency',
      'investments_in_property_plant_and_equipment',
      'acquisitions_net',
      'purchases_of_investments',
      'sales_maturities_of_investments',
      'other_investing_activities',
      'net_cash_provided_by_investing_activities',
    ],
    'Financing Activities': [
      'date',
      'reported_currency',
      'net_debt_issuance',
      'long_term_net_debt_issuance',
      'short_term_net_debt_issuance',
      'net_stock_issuance',
      'net_common_stock_issuance',
      'common_stock_issuance',
      'common_stock_repurchased',
      'net_preferred_stock_issuance',
      'net_dividends_paid',
      'common_dividends_paid',
      'preferred_dividends_paid',
      'other_financing_activities',
      'net_cash_provided_by_financing_activities',
    ],
    'Other Adjustments': [
      'date',
      'reported_currency',
      'effect_of_forex_changes_on_cash',
      'net_change_in_cash',
      'cash_at_end_of_period',
      'cash_at_beginning_of_period',
      'operating_cash_flow',
      'capital_expenditure',
      'free_cash_flow',
      'income_taxes_paid',
      'interest_paid',
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
                <CardTitle>{year} Cash Flow</CardTitle>
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
