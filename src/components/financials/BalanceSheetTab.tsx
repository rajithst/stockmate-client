import React, {useState} from "react";
import {Card, CardContent, CardTitle} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion.tsx";
import {sampleBalanceSheets} from "../../data/sample_balance_sheet.tsx";

interface CompanyBalanceSheet {
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

    // Current Assets
    cash_and_cash_equivalents: number;
    short_term_investments: number;
    cash_and_short_term_investments: number;
    net_receivables: number;
    accounts_receivables: number;
    other_receivables: number;
    inventory: number;
    prepaids: number;
    other_current_assets: number;
    total_current_assets: number;

    // Non-Current Assets
    property_plant_equipment_net: number;
    goodwill: number;
    intangible_assets: number;
    goodwill_and_intangible_assets: number;
    long_term_investments: number;
    tax_assets: number;
    other_non_current_assets: number;
    total_non_current_assets: number;
    other_assets: number;
    total_assets: number;

    // Current Liabilities
    total_payables: number;
    account_payables: number;
    other_payables: number;
    accrued_expenses: number;
    short_term_debt: number;
    capital_lease_obligations_current: number;
    tax_payables: number;
    deferred_revenue: number;
    other_current_liabilities: number;
    total_current_liabilities: number;

    // Non-Current Liabilities
    long_term_debt: number;
    deferred_revenue_non_current: number;
    deferred_tax_liabilities_non_current: number;
    other_non_current_liabilities: number;
    total_non_current_liabilities: number;
    other_liabilities: number;
    capital_lease_obligations: number;
    total_liabilities: number;

    // Stockholders' Equity
    treasury_stock: number;
    preferred_stock: number;
    common_stock: number;
    retained_earnings: number;
    additional_paid_in_capital: number;
    accumulated_other_comprehensive_income_loss: number;
    other_total_stockholders_equity: number;
    total_stockholders_equity: number;
    total_equity: number;
    minority_interest: number;

    // Totals & Debt
    total_liabilities_and_total_equity: number;
    total_investments: number;
    total_debt: number;
    net_debt: number;
}

interface Props {
    symbol: string;
}


export const BalanceSheetTab: React.FC<Props> = ({symbol}) => {
    const [data] = useState<CompanyBalanceSheet[]>(sampleBalanceSheets);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }
    // Group by fiscal year
    const groupedByYear = data.reduce((acc, stmt) => {
        if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
        acc[stmt.fiscal_year].push(stmt);
        return acc;
    }, {} as Record<string, CompanyBalanceSheet[]>);

    const quarterOrder = ["FY", "Q1", "Q2", "Q3", "Q4"];


    // Sort quarters
    Object.keys(groupedByYear).forEach((year) => {
        groupedByYear[year].sort(
            (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period)
        );
    });

    const metricGroups: Record<string, (keyof CompanyBalanceSheet)[]> = {

        "Current Assets": [
            "date",
            "reported_currency",
            "cash_and_cash_equivalents",
            "short_term_investments",
            "cash_and_short_term_investments",
            "accounts_receivables",
            "net_receivables",
            "other_receivables",
            "inventory",
            "prepaids",
            "other_current_assets",
            "total_current_assets",
        ],
        "Non-Current Assets": [
            "date",
            "reported_currency",
            "property_plant_equipment_net",
            "goodwill",
            "intangible_assets",
            "goodwill_and_intangible_assets",
            "long_term_investments",
            "tax_assets",
            "other_non_current_assets",
            "total_non_current_assets",
            "other_assets",
            "total_assets",
        ],
        "Current Liabilities": [
            "date",
            "reported_currency",
            "total_payables",
            "account_payables",
            "other_payables",
            "accrued_expenses",
            "short_term_debt",
            "capital_lease_obligations_current",
            "tax_payables",
            "deferred_revenue",
            "other_current_liabilities",
            "total_current_liabilities",
        ],
        "Non-Current Liabilities": [
            "date",
            "reported_currency",
            "long_term_debt",
            "long_term_debt",
            "deferred_revenue_non_current",
            "deferred_tax_liabilities_non_current",
            "other_non_current_liabilities",
            "total_non_current_liabilities",
            "other_liabilities",
            "capital_lease_obligations",
            "total_liabilities",
        ],
        "Stockholders' Equity": [
            "date",
            "reported_currency",
            "treasury_stock",
            "treasury_stock",
            "preferred_stock",
            "common_stock",
            "retained_earnings",
            "additional_paid_in_capital",
            "accumulated_other_comprehensive_income_loss",
            "other_total_stockholders_equity",
            "total_stockholders_equity",
            "total_equity",
            "minority_interest",
        ],
        "Totals & Debt": [
            "date",
            "reported_currency",
            "total_liabilities_and_total_equity",
            "total_investments",
            "total_debt",
            "net_debt"
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
                                <CardTitle>{year} Balance Sheet</CardTitle>
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
