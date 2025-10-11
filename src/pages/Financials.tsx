import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs";
import {FinancialSummary} from "../components/financials/FinancialSummary";
import {IncomeStatementTab} from "../components/financials/IncomeStatementTab";
import {BalanceSheetTab} from "../components/financials/BalanceSheetTab";
import {CashFlowTab} from "../components/financials/CashFlowTab";
import {RatiosTab} from "../components/financials/RatiosTab";
import {Button} from "../components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {KeyMetricsTab} from "../components/financials/KeyMetrics.tsx";

const FinancialsPage: React.FC = () => {
    const navigate = useNavigate();
    const {symbol} = useParams<{ symbol: string }>();

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
                    <ArrowLeft className="w-4 h-4 mr-1"/>
                    Back to Company
                </Button>
                <h1 className="text-xl font-semibold">{symbol} Financials</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{symbol} — Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <FinancialSummary symbol={symbol}/>
                </CardContent>
            </Card>

            <Tabs defaultValue="income" className="space-y-4">
                <TabsList className="grid grid-cols-5 gap-2">
                    <TabsTrigger value="income">Income Statements</TabsTrigger>
                    <TabsTrigger value="balance">Balance Sheets</TabsTrigger>
                    <TabsTrigger value="cashflow">Cash Flow Statements</TabsTrigger>
                    <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
                    <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="income"><IncomeStatementTab symbol={symbol!}/></TabsContent>
                <TabsContent value="balance"><BalanceSheetTab symbol={symbol!}/></TabsContent>
                <TabsContent value="cashflow"><CashFlowTab symbol={symbol!}/></TabsContent>
                <TabsContent value="ratios"><RatiosTab symbol={symbol!}/></TabsContent>
                <TabsContent value="metrics"><KeyMetricsTab symbol={symbol!}/></TabsContent>
            </Tabs>
        </div>
    );
};

export default FinancialsPage;
