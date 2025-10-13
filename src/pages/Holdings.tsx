import React, {useState} from "react";
import {Card} from "../components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select";
import {Link} from "react-router-dom";

const mockPortfolios = ["Main Portfolio", "Retirement Fund", "High Growth"];

const mockHoldings = [
    {
        symbol: "AAPL",
        currency: "USD",
        gainLoss: 5.2,
        shares: 25,
        currentPrice: 3450,
        avgPrice: 3280,
        invested: 82000,
        value: 86250,
        industry: "Consumer Electronics",
        history: [
            {date: "2024-05-12", shares: 10, price: 3200},
            {date: "2024-09-01", shares: 15, price: 3500},
        ],
    },
    {
        symbol: "MSFT",
        currency: "USD",
        gainLoss: 5.2,
        shares: 10,
        currentPrice: 5470,
        avgPrice: 5000,
        invested: 50000,
        value: 54700,
        industry: "Software",
        history: [{date: "2023-10-01", shares: 10, price: 5000}],
    },
];

const HoldingsPage: React.FC = () => {
    const [selectedPortfolio, setSelectedPortfolio] = useState(mockPortfolios[0]);
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Holdings</h1>
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Portfolio"/>
                    </SelectTrigger>
                    <SelectContent>
                        {mockPortfolios.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Holdings Table */}
            <Card className="shadow-md border border-gray-100">
                {/* Table Header */}
                <div className="grid grid-cols-6 px-6 py-3 bg-gray-50 border-b text-sm font-semibold text-gray-600">
                    <div>Symbol</div>
                    <div className="text-right">Current Value</div>
                    <div className="text-right">Invested</div>
                    <div className="text-right">Gain / Loss</div>
                    <div className="text-right">Avg Price</div>
                    <div className="text-right">Shares</div>
                </div>

                {/* Table Rows as Accordions */}
                <div>
                    {mockHoldings.map((h) => {
                        const gain = h.value - h.invested;
                        const gainPct = ((gain / h.invested) * 100).toFixed(2);

                        return (
                            <div
                                key={h.symbol}
                                className="border-b hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => setExpanded(expanded === h.symbol ? null : h.symbol)}
                            >
                                <div className="grid grid-cols-6 items-center px-6 py-2 text-sm">
                                    <div className="font-medium text-blue-600">
                                        <Link
                                            to={`/company/${h.symbol}`}
                                            className="text-blue-600 hover:underline"
                                            onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                                        >
                                            {h.symbol}
                                        </Link>
                                    </div>
                                    <div className="text-right">{h.currency} {h.value.toLocaleString()}</div>
                                    <div className="text-right">{h.currency} {h.invested.toLocaleString()}</div>
                                    <div
                                        className={`text-right font-medium ${
                                            h.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {h.gainLoss.toFixed(1)}%
                                    </div>
                                    <div className="text-right">{h.currency} {h.avgPrice.toLocaleString()}</div>
                                    <div className="text-right">{h.shares}</div>
                                </div>
                                {expanded === h.symbol && (
                                    <div className="bg-gray-50 px-8 py-2 text-xs text-gray-700 border-t">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="text-gray-500 border-b">
                                                <th className="text-left py-1 font-medium">Date</th>
                                                <th className="text-right py-1 font-medium">Shares</th>
                                                <th className="text-right py-1 font-medium">Price</th>
                                                <th className="text-right py-1 font-medium">Total Cost</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {h.history.map((tx, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b last:border-0 hover:bg-gray-100 transition-colors"
                                                >
                                                    <td className="py-[2px]">{tx.date}</td>
                                                    <td className="text-right py-[2px]">{tx.shares}</td>
                                                    <td className="text-right py-[2px]">¥{tx.price.toLocaleString()}</td>
                                                    <td className="text-right py-[2px]">¥{(tx.shares * tx.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default HoldingsPage;
