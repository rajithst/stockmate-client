import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { CompanyDividendRead } from '../../types/dividend.ts';

// Add a mapping for nice labels
const metricLabels: Record<string, string> = {
  dividend: 'Dividend (USD)',
  adj_dividend: 'Adjusted Dividend (USD)',
  yield: 'Dividend Yield (%)',
  frequency: 'Frequency',
  record_date: 'Record Date',
  payment_date: 'Payment Date',
  declaration_date: 'Declaration Date',
};

export const DividendTab: React.FC<{ dividends: CompanyDividendRead[] }> = ({ dividends }) => {
  const [data] = useState<CompanyDividendRead[]>(dividends || []);

  const grouped = data.reduce((acc: Record<string, CompanyDividendRead[]>, item) => {
    const year = new Date(item.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const metrics: (keyof CompanyDividendRead)[] = [
    'dividend',
    'adj_dividend',
    'yield',
    'frequency',
    'record_date',
    'payment_date',
    'declaration_date',
  ];

  return (
    <Accordion type="multiple" className="space-y-4">
      {Object.entries(grouped)
        .sort((a, b) => Number(b[0]) - Number(a[0])) // sort years descending
        .map(([year, dividends]) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger>{year} Dividends</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow className="h-7">
                    <TableHead className="px-2 py-1 text-xs">Date</TableHead>
                    {metrics.map((m) => (
                      <TableHead key={m} className="px-2 py-1 text-xs text-center">
                        {metricLabels[m as string] || String(m)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividends
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((div) => (
                      <TableRow key={div.date} className="h-6 hover:bg-indigo-50">
                        <TableCell className="px-2 py-1 text-xs">{div.date}</TableCell>
                        {metrics.map((m) => (
                          <TableCell key={m} className="px-2 py-1 text-xs text-right">
                            {(div as any)[m] !== null && (div as any)[m] !== undefined
                              ? (div as any)[m]
                              : '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
