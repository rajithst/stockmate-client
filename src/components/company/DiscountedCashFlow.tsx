import React from "react";
import {ArrowDownRight, ArrowUpRight, MinusCircle} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {Button} from "../ui/button.tsx";

interface DiscountedCashFlowData {
    symbol: string;
    date: string;
    dcf: number;
    stockPrice: number;
}

interface DiscountedCashFlowSummary {
    dcfData: DiscountedCashFlowData;
}

export const DcfSummaryCard: React.FC<DiscountedCashFlowSummary> = ({dcfData}) => {
    const {dcf, stockPrice, date} = dcfData;

    const diff = stockPrice - dcf;
    const percentageDiff = ((diff / dcf) * 100).toFixed(1);

    let status: "Undervalued" | "Fair Value" | "Overvalued";
    let colorClass = "";
    let Icon = MinusCircle;

    if (stockPrice < dcf * 0.9) {
        status = "Undervalued";
        colorClass = "text-green-600";
        Icon = ArrowDownRight;
    } else if (stockPrice > dcf * 1.1) {
        status = "Overvalued";
        colorClass = "text-red-600";
        Icon = ArrowUpRight;
    } else {
        status = "Fair Value";
        colorClass = "text-yellow-600";
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Discounted Cash Flow (DCF)</CardTitle>
                <Button variant="outline">
                    Run DCF Analysis
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">DCF Value:</span>
                        <span className="font-semibold">${dcf.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Stock Price:</span>
                        <span className="font-semibold">${stockPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">As of:</span>
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <Icon className={`${colorClass} w-5 h-5`}/>
                            <span className={`font-semibold ${colorClass}`}>{status}</span>
                        </div>
                        <span className={`${colorClass} font-medium`}>
              {percentageDiff}% difference
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
