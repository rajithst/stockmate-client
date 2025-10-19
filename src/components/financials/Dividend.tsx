import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { sampleDividends } from '../../data/sample_dividends.tsx';

interface CompanyDividend {
  symbol: string;
  date: string;
  record_date?: string;
  payment_date?: string;
  declaration_date?: string;
  dividend?: number;
  adj_dividend?: number;
  yield?: number;
  frequency?: string;
}

export const DividendTab: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [data] = useState<CompanyDividend[]>(
    sampleDividends.filter((div) => div.symbol === symbol),
  );

  console.log('All sample dividends:', sampleDividends);
  console.log('Filtered data:', data);

  const grouped = data.reduce((acc: Record<string, CompanyDividend[]>, item) => {
    const year = new Date(item.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  console.log('Grouped data:', grouped);

  const metrics = [
    { key: 'dividend', label: 'Dividend (USD)' },
    { key: 'adj_dividend', label: 'Adjusted Dividend (USD)' },
    { key: 'yield', label: 'Dividend Yield (%)' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'record_date', label: 'Record Date' },
    { key: 'payment_date', label: 'Payment Date' },
    { key: 'declaration_date', label: 'Declaration Date' },
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
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {metrics.map((m) => (
                      <TableHead key={m.key}>{m.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividends
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((div) => (
                      <TableRow key={div.date}>
                        <TableCell>{div.date}</TableCell>
                        {metrics.map((m) => (
                          <TableCell key={m.key}>{(div as any)[m.key] ?? '-'}</TableCell>
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
