import React, {useState} from "react";
import {Card, CardContent, CardTitle} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {sampleRatio} from "../../data/sample_ratio.tsx";

interface CompanyFinancialRatios {
    id: number;
    company_id: number;
    symbol: string;
    date: string;
    fiscal_year: string;
    period: string;
    reported_currency: string;

    // Profitability margins
    gross_profit_margin: number;
    ebit_margin: number;
    ebitda_margin: number;
    operating_profit_margin: number;
    pretax_profit_margin: number;
    continuous_operations_profit_margin: number;
    net_profit_margin: number;
    bottom_line_profit_margin: number;

    // Efficiency ratios
    receivables_turnover: number;
    payables_turnover: number;
    inventory_turnover: number;
    fixed_asset_turnover: number;
    asset_turnover: number;

    // Liquidity ratios
    current_ratio: number;
    quick_ratio: number;
    solvency_ratio: number;
    cash_ratio: number;

    // Valuation ratios
    price_to_earnings_ratio: number;
    price_to_earnings_growth_ratio: number;
    forward_price_to_earnings_growth_ratio: number;
    price_to_book_ratio: number;
    price_to_sales_ratio: number;
    price_to_free_cash_flow_ratio: number;
    price_to_operating_cash_flow_ratio: number;

    // Leverage ratios
    debt_to_assets_ratio: number;
    debt_to_equity_ratio: number;
    debt_to_capital_ratio: number;
    long_term_debt_to_capital_ratio: number;
    financial_leverage_ratio: number;

    // Cash flow coverage ratios
    working_capital_turnover_ratio: number;
    operating_cash_flow_ratio: number;
    operating_cash_flow_sales_ratio: number;
    free_cash_flow_operating_cash_flow_ratio: number;
    debt_service_coverage_ratio: number;
    interest_coverage_ratio: number;
    short_term_operating_cash_flow_coverage_ratio: number;
    operating_cash_flow_coverage_ratio: number;
    capital_expenditure_coverage_ratio: number;
    dividend_paid_and_capex_coverage_ratio: number;

    // Dividend ratios
    dividend_payout_ratio: number;
    dividend_yield: number;
    dividend_yield_percentage: number;

    // Per share metrics
    revenue_per_share: number;
    net_income_per_share: number;
    interest_debt_per_share: number;
    cash_per_share: number;
    book_value_per_share: number;
    tangible_book_value_per_share: number;
    shareholders_equity_per_share: number;
    operating_cash_flow_per_share: number;
    capex_per_share: number;
    free_cash_flow_per_share: number;

    // Misc ratios
    net_income_per_ebt: number;
    ebt_per_ebit: number;
    price_to_fair_value: number;
    debt_to_market_cap: number;
    effective_tax_rate: number;
    enterprise_value_multiple: number;
}

interface Props {
    symbol: string;
}


export const RatiosTab: React.FC<Props> = ({symbol}) => {
    const [data] = useState<CompanyFinancialRatios[]>(sampleRatio);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    const quarterOrder = ["FY", "Q1", "Q2", "Q3", "Q4"];

    const groupedByYear = data.reduce((acc, stmt) => {
        if (!acc[stmt.fiscal_year]) acc[stmt.fiscal_year] = [];
        acc[stmt.fiscal_year].push(stmt);
        return acc;
    }, {} as Record<string, CompanyFinancialRatios[]>);

    Object.keys(groupedByYear).forEach((year) => {
        groupedByYear[year].sort(
            (a, b) => quarterOrder.indexOf(a.period) - quarterOrder.indexOf(b.period)
        );
    });
    const metricGroups: Record<string, (keyof CompanyFinancialRatios)[]> = {
        "Profitability Margins": [
            "gross_profit_margin",
            "ebit_margin",
            "ebitda_margin",
            "operating_profit_margin",
            "pretax_profit_margin",
            "continuous_operations_profit_margin",
            "net_profit_margin",
            "bottom_line_profit_margin",
        ],
        "Efficiency Ratios": [
            "receivables_turnover",
            "payables_turnover",
            "inventory_turnover",
            "fixed_asset_turnover",
            "asset_turnover",
        ],
        "Liquidity Ratios": ["current_ratio", "quick_ratio", "solvency_ratio", "cash_ratio"],
        "Valuation Ratios": [
            "price_to_earnings_ratio",
            "price_to_earnings_growth_ratio",
            "forward_price_to_earnings_growth_ratio",
            "price_to_book_ratio",
            "price_to_sales_ratio",
            "price_to_free_cash_flow_ratio",
            "price_to_operating_cash_flow_ratio",
        ],
        "Leverage Ratios": [
            "debt_to_assets_ratio",
            "debt_to_equity_ratio",
            "debt_to_capital_ratio",
            "long_term_debt_to_capital_ratio",
            "financial_leverage_ratio",
        ],
        "Cash Flow Coverage Ratios": [
            "working_capital_turnover_ratio",
            "operating_cash_flow_ratio",
            "operating_cash_flow_sales_ratio",
            "free_cash_flow_operating_cash_flow_ratio",
            "debt_service_coverage_ratio",
            "interest_coverage_ratio",
            "short_term_operating_cash_flow_coverage_ratio",
            "operating_cash_flow_coverage_ratio",
            "capital_expenditure_coverage_ratio",
            "dividend_paid_and_capex_coverage_ratio",
        ],
        "Dividend Ratios": ["dividend_payout_ratio", "dividend_yield", "dividend_yield_percentage"],
        "Per Share Metrics": [
            "revenue_per_share",
            "net_income_per_share",
            "interest_debt_per_share",
            "cash_per_share",
            "book_value_per_share",
            "tangible_book_value_per_share",
            "shareholders_equity_per_share",
            "operating_cash_flow_per_share",
            "capex_per_share",
            "free_cash_flow_per_share",
        ],
        "Misc Ratios": [
            "net_income_per_ebt",
            "ebt_per_ebit",
            "price_to_fair_value",
            "debt_to_market_cap",
            "effective_tax_rate",
            "enterprise_value_multiple",
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
                                <CardTitle>{year} Financial Ratios</CardTitle>
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
