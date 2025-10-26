import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FinancialSummary } from '../components/financials/FinancialSummary';
import { IncomeStatementTab } from '../components/financials/IncomeStatementTab';
import { BalanceSheetTab } from '../components/financials/BalanceSheetTab';
import { CashFlowTab } from '../components/financials/CashFlowTab';
import { RatiosTab } from '../components/financials/RatiosTab';
import { Button } from '../components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';
import { KeyMetricsTab } from '../components/financials/KeyMetrics.tsx';
import { DividendTab } from '../components/financials/Dividend.tsx';
import type { CompanyFinancialsResponse } from '../types/index.ts';
import { apiClient } from '../api/client.ts';

const FinancialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { symbol } = useParams<{ symbol: string }>();
  const [financialData, setFinancialData] = React.useState<CompanyFinancialsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFinancials = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getCompanyFinancials(symbol);
        setFinancialData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [symbol]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4" />
        <span className="text-lg text-gray-600 font-medium">Loading financial data...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100 mb-4">
          <svg
            className="w-7 h-7 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-lg text-red-600 font-semibold">Error loading financials</span>
        <span className="text-sm text-gray-500 mt-1">{error}</span>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={() => navigate(`/company/${symbol}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Company
        </Button>
        <h1 className="text-xl font-semibold">{symbol} Financials</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} — Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialSummary symbol={symbol} />
        </CardContent>
      </Card>

      <Tabs key={symbol} defaultValue="income" className="space-y-4">
        <TabsList className="grid grid-cols-6 gap-2">
          <TabsTrigger value="income">Income Statements</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheets</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow Statements</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="dividend">Dividends</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <IncomeStatementTab income_statements={financialData?.income_statements ?? []} />
        </TabsContent>
        <TabsContent value="balance">
          <BalanceSheetTab balance_sheets={financialData?.balance_sheets ?? []} />
        </TabsContent>
        <TabsContent value="cashflow">
          <CashFlowTab cash_flow_statements={financialData?.cash_flow_statements ?? []} />
        </TabsContent>
        <TabsContent value="ratios">
          <RatiosTab financial_ratios={financialData?.financial_ratios ?? []} />
        </TabsContent>
        <TabsContent value="metrics">
          <KeyMetricsTab key_metrics={financialData?.key_metrics ?? []} />
        </TabsContent>
        <TabsContent value="dividend">
          <DividendTab dividends={financialData?.dividends ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialsPage;
