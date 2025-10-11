import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Example interfaces (simplified)
interface CompanyTabsProps {
    balanceSheet: any; // Replace with proper type
    incomeStatement: any;
    cashflow: any;
    dividends: any;
    ratios: any;
    scores: any;
    latestNews: any[];
    keyMetrics: any;
}

export const CompanyTabs: React.FC<CompanyTabsProps> = ({
                                                            balanceSheet,
                                                            incomeStatement,
                                                            cashflow,
                                                            dividends,
                                                            ratios,
                                                            scores,
                                                            latestNews,
                                                            keyMetrics,
                                                        }) => {
    return (
        <Tabs defaultValue="balanceSheet" className="space-y-4">
            <TabsList>
                <TabsTrigger value="balanceSheet">Balance Sheet</TabsTrigger>
                <TabsTrigger value="incomeStatement">Income Statement</TabsTrigger>
                <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
                <TabsTrigger value="dividends">Dividends</TabsTrigger>
                <TabsTrigger value="keyMetrics">Key Metrics</TabsTrigger>
                <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
                <TabsTrigger value="scores">Financial Scores</TabsTrigger>
                <TabsTrigger value="latestNews">Latest News</TabsTrigger>

            </TabsList>

            <TabsContent value="balanceSheet">
                <Card>
                    <CardHeader>
                        <CardTitle>Balance Sheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Replace with your table/chart component */}
                        <pre>{JSON.stringify(balanceSheet, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="incomeStatement">
                <Card>
                    <CardHeader>
                        <CardTitle>Income Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(incomeStatement, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="cashflow">
                <Card>
                    <CardHeader>
                        <CardTitle>Cashflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(cashflow, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="dividends">
                <Card>
                    <CardHeader>
                        <CardTitle>Dividends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(dividends, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="ratios">
                <Card>
                    <CardHeader>
                        <CardTitle>Financial Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(ratios, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="scores">
                <Card>
                    <CardHeader>
                        <CardTitle>Financial Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(scores, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="latestNews">
                <Card>
                    <CardHeader>
                        <CardTitle>Latest News</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                        {latestNews.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.news_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <p className="text-sm font-medium">{item.news_title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {item.grading_company} | {new Date(item.published_date).toLocaleDateString()}
                                </p>
                            </a>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="keyMetrics">
                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(keyMetrics, null, 2)}</pre>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};
