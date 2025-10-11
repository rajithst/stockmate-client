import React from "react";
import {Card} from "../ui/card";

interface FinancialSummaryProps {
    symbol: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({symbol}) => {
    // Sample static data — replace later with API call
    const summary = {
        pe: 28.5,
        forwardPE: 24.1,
        roe: 45.6,
        roa: 18.2,
        marketCap: "3.4T",
        dividendYield: "0.55%",
        eps: 6.3,
    };

    const items = [
        {label: "P/E Ratio", value: summary.pe},
        {label: "Forward P/E", value: summary.forwardPE},
        {label: "ROE (%)", value: summary.roe},
        {label: "ROA (%)", value: summary.roa},
        {label: "EPS", value: summary.eps},
        {label: "Market Cap", value: summary.marketCap},
        {label: "Dividend Yield", value: summary.dividendYield},
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {items.map((item) => (
                <Card
                    key={item.label}
                    className="p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition"
                >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-lg font-semibold mt-1">{item.value}</span>
                </Card>
            ))}
        </div>
    );
};
