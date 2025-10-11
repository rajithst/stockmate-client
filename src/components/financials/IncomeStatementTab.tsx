import React, {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Card, CardContent, CardTitle} from "../ui/card.tsx";
import {sampleIncomeStatements} from "../../data/sample_income_statement.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion.tsx";


interface IncomeStatement {
    id: number;
    symbol: string;

    // General report info
    date: string;
    reported_currency: string;
    cik: string;
    filing_date: string;
    accepted_date: string;
    fiscal_year: string;
    period: string;

    // Revenue and cost
    revenue: number;
    cost_of_revenue: number;
    gross_profit: number;

    // Operating expenses
    research_and_development_expenses: number;
    general_and_administrative_expenses: number;
    selling_and_marketing_expenses: number;
    selling_general_and_administrative_expenses: number;
    other_expenses: number;
    operating_expenses: number;
    cost_and_expenses: number;

    // Interest income/expense
    net_interest_income: number;
    interest_income: number;
    interest_expense: number;

    // Depreciation & amortization
    depreciation_and_amortization: number;

    // Profit metrics
    ebitda: number;
    ebit: number;
    non_operating_income_excluding_interest: number;
    operating_income: number;

    // Other income/expenses & taxes
    total_other_income_expenses_net: number;
    income_before_tax: number;
    income_tax_expense: number;

    // Net income details
    net_income_from_continuing_operations: number;
    net_income_from_discontinued_operations: number;
    other_adjustments_to_net_income: number;
    net_income: number;
    net_income_deductions: number;
    bottom_line_net_income: number;

    // Earnings per share
    eps: number;
    eps_diluted: number;
    weighted_average_shs_out: number;
    weighted_average_shs_out_dil: number;
}

interface Props {
    symbol: string;
}

export const IncomeStatementTab: React.FC<Props> = ({symbol}) => {
    const [data] = useState<IncomeStatement[]>(sampleIncomeStatements);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    const quarterOrder = ["FY", "Q1", "Q2", "Q3", "Q4"];

    const groupedByYear = data.reduce((acc, stmt) => {
        if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
        acc[stmt.fiscal_year].push(stmt);
        return acc;
    }, {} as Record<string, IncomeStatement[]>);

    Object.keys(groupedByYear).forEach((year) => {
        groupedByYear[year].sort(
            (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period)
        );
    });

    const metricGroups: Record<string, (keyof IncomeStatement)[]> = {
        "Revenue and Cost": [
            "date",
            "reported_currency",
            "revenue",
            "cost_of_revenue",
            "gross_profit",
        ],
        "Operating Expenses": [
            "date",
            "reported_currency",
            "research_and_development_expenses",
            "general_and_administrative_expenses",
            "selling_and_marketing_expenses",
            "selling_general_and_administrative_expenses",
            "other_expenses",
            "operating_expenses",
            "cost_and_expenses",
        ],
        "Interest Income/Expense": [
            "date",
            "reported_currency",
            "net_interest_income",
            "interest_income",
            "interest_expense",
        ],
        "Profit Metrics": [
            "date",
            "reported_currency",
            "depreciation_and_amortization",
            "ebitda",
            "ebit",
            "operating_income",
        ],
        "Other Income/Expenses & Taxes": [
            "date",
            "reported_currency",
            "total_other_income_expenses_net",
            "income_before_tax",
            "income_tax_expense",
        ],
        "Net Income Details": [
            "date",
            "reported_currency",
            "net_income_from_continuing_operations",
            "net_income_from_discontinued_operations",
            "other_adjustments_to_net_income",
            "net_income",
            "net_income_deductions",
            "bottom_line_net_income",
        ],
        "Earnings Per Share": [
            "date",
            "reported_currency",
            "eps",
            "eps_diluted",
            "weighted_average_shs_out",
            "weighted_average_shs_out_dil",
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
                                                                {metric.replace(/_/g, " ")}
                                                            </TableCell>
                                                            {statements.map((stmt) => (
                                                                <TableCell key={`${stmt.period}-${metric}`}>
                                                                    {stmt[metric] !== null && stmt[metric] !== undefined
                                                                        ? stmt[metric].toLocaleString?.()
                                                                        : "-"}
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
    )
};
