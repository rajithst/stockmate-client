import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import {sampleCashFlow} from "../../data/sample_cashflow_sheet.tsx";

export interface CompanyCashFlowStatement {
    id: number;
    company_id: number;
    symbol: string;

    // General report info
    date: string;
    reported_currency: string;
    cik: string;
    filing_date: string;
    accepted_date: string;
    fiscal_year: string;
    period: string;

    // Operating Activities
    net_income: number;
    depreciation_and_amortization: number;
    deferred_income_tax: number;
    stock_based_compensation: number;
    change_in_working_capital: number;
    accounts_receivables: number;
    inventory: number;
    accounts_payables: number;
    other_working_capital: number;
    other_non_cash_items: number;
    net_cash_provided_by_operating_activities: number;

    // Investing Activities
    investments_in_property_plant_and_equipment: number;
    acquisitions_net: number;
    purchases_of_investments: number;
    sales_maturities_of_investments: number;
    other_investing_activities: number;
    net_cash_provided_by_investing_activities: number;

    // Financing Activities
    net_debt_issuance: number;
    long_term_net_debt_issuance: number;
    short_term_net_debt_issuance: number;
    net_stock_issuance: number;
    net_common_stock_issuance: number;
    common_stock_issuance: number;
    common_stock_repurchased: number;
    net_preferred_stock_issuance: number;
    net_dividends_paid: number;
    common_dividends_paid: number;
    preferred_dividends_paid: number;
    other_financing_activities: number;
    net_cash_provided_by_financing_activities: number;

    // Other Adjustments
    effect_of_forex_changes_on_cash: number;
    net_change_in_cash: number;
    cash_at_end_of_period: number;
    cash_at_beginning_of_period: number;
    operating_cash_flow: number;
    capital_expenditure: number;
    free_cash_flow: number;
    income_taxes_paid: number;
    interest_paid: number;
}

interface Props {
    symbol: string;
}


export const CashFlowTab: React.FC<Props> = ({ symbol }) => {
    const [data, setData] = useState<CompanyCashFlowStatement[]>(sampleCashFlow);
    const [period, setPeriod] = useState<"annual" | "quarter">("annual");
    const [loading, setLoading] = useState(true);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    const quarterOrder = ["FY", "Q1", "Q2", "Q3", "Q4"];

    const groupedByYear = data.reduce((acc, stmt) => {
        if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
        acc[stmt.fiscal_year].push(stmt);
        return acc;
    }, {} as Record<string, CompanyCashFlowStatement[]>);

    Object.keys(groupedByYear).forEach((year) => {
        groupedByYear[year].sort(
            (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period)
        );
    });

    const metricGroups: Record<string, (keyof CompanyCashFlowStatement)[]> = {
        "Operating Activities": [
            "date",
            "reported_currency",
            "net_income",
            "depreciation_and_amortization",
            "deferred_income_tax",
            "stock_based_compensation",
            "change_in_working_capital",
            "accounts_receivables",
            "inventory",
            "accounts_payables",
            "other_working_capital",
            "other_non_cash_items",
            "net_cash_provided_by_operating_activities",
        ],
        "Investing Activities": [
            "date",
            "reported_currency",
            "investments_in_property_plant_and_equipment",
            "acquisitions_net",
            "purchases_of_investments",
            "sales_maturities_of_investments",
            "other_investing_activities",
            "net_cash_provided_by_investing_activities",
        ],
        "Financing Activities": [
            "date",
            "reported_currency",
            "net_debt_issuance",
            "long_term_net_debt_issuance",
            "short_term_net_debt_issuance",
            "net_stock_issuance",
            "net_common_stock_issuance",
            "common_stock_issuance",
            "common_stock_repurchased",
            "net_preferred_stock_issuance",
            "net_dividends_paid",
            "common_dividends_paid",
            "preferred_dividends_paid",
            "other_financing_activities",
            "net_cash_provided_by_financing_activities",
        ],
        "Other Adjustments": [
            "date",
            "reported_currency",
            "effect_of_forex_changes_on_cash",
            "net_change_in_cash",
            "cash_at_end_of_period",
            "cash_at_beginning_of_period",
            "operating_cash_flow",
            "capital_expenditure",
            "free_cash_flow",
            "income_taxes_paid",
            "interest_paid",
        ]
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
    );
};
