import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";

// Mock Data
const mockPortfolios = ["Main Portfolio", "Retirement Fund", "High Growth"];

interface Purchase {
    date: string;
    shares: number;
    price: number;
}

interface Holding {
    symbol: string;
    currency: string;
    gainLoss: number;
    shares: number;
    currentPrice: number;
    avgPrice: number;
    invested: number;
    value: number;
    industry: string;
    history: Purchase[];
}

const initialHoldings: Holding[] = [
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
            { date: "2024-05-12", shares: 10, price: 3200 },
            { date: "2024-09-01", shares: 15, price: 3500 },
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
        history: [{ date: "2023-10-01", shares: 10, price: 5000 }],
    },
];

const HoldingsPage: React.FC = () => {
    const [selectedPortfolio, setSelectedPortfolio] = useState(mockPortfolios[0]);
    const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [form, setForm] = useState<Purchase>({ date: "", shares: 0, price: 0 });

    const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);

    const openAddModal = (symbol: string) => {
        setEditMode(false);
        setSelectedSymbol(symbol);
        setForm({ date: "", shares: 0, price: 0 });
        setShowModal(true);
    };

    const openEditModal = (symbol: string, purchase: Purchase, index: number) => {
        setEditMode(true);
        setSelectedSymbol(symbol);
        setForm(purchase);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!selectedSymbol) return;

        setHoldings((prev) =>
            prev.map((h) => {
                if (h.symbol !== selectedSymbol) return h;

                const newHistory = editMode
                    ? h.history.map((p, i) => (i === editIndex ? form : p))
                    : [...h.history, form];

                const totalShares = newHistory.reduce((acc, p) => acc + p.shares, 0);
                const totalCost = newHistory.reduce((acc, p) => acc + p.shares * p.price, 0);
                const newAvgPrice = totalCost / totalShares;
                const newInvested = totalCost;
                const newValue = totalShares * h.currentPrice;

                return {
                    ...h,
                    history: newHistory,
                    shares: totalShares,
                    avgPrice: newAvgPrice,
                    invested: newInvested,
                    value: newValue,
                    gainLoss: ((newValue - newInvested) / newInvested) * 100,
                };
            })
        );

        setShowModal(false);
    };

    const handleDeletePurchase = (symbol: string, index: number) => {
        setHoldings((prev) =>
            prev.map((h) => {
                if (h.symbol !== symbol) return h;
                const newHistory = h.history.filter((_, i) => i !== index);
                const totalShares = newHistory.reduce((acc, p) => acc + p.shares, 0);
                const totalCost = newHistory.reduce((acc, p) => acc + p.shares * p.price, 0);
                const newAvgPrice = totalShares ? totalCost / totalShares : 0;
                const newInvested = totalCost;
                const newValue = totalShares * h.currentPrice;

                return {
                    ...h,
                    history: newHistory,
                    shares: totalShares,
                    avgPrice: newAvgPrice,
                    invested: newInvested,
                    value: newValue,
                    gainLoss: newInvested ? ((newValue - newInvested) / newInvested) * 100 : 0,
                };
            })
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Holdings</h1>
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Portfolio" />
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
                <div className="grid grid-cols-7 px-6 py-3 bg-gray-50 border-b text-sm font-semibold text-gray-600">
                    <div>Symbol</div>
                    <div className="text-right">Value</div>
                    <div className="text-right">Invested</div>
                    <div className="text-right">% Gain/Loss</div>
                    <div className="text-right">% of Portfolio</div>
                    <div className="text-right">Avg Price</div>
                    <div className="text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div>
                    {holdings.map((h) => {
                        const isExpanded = expanded === h.symbol;
                        const portfolioPct = ((h.value / totalValue) * 100).toFixed(2);

                        return (
                            <div
                                key={h.symbol}
                                className="border-b hover:bg-gray-50 transition"
                                onClick={() => setExpanded(isExpanded ? null : h.symbol)}
                            >
                                <div className="grid grid-cols-7 items-center px-6 py-2 text-sm">
                                    <div className="font-medium text-blue-600">
                                        <Link
                                            to={`/company/${h.symbol}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="hover:underline"
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
                                        {h.gainLoss.toFixed(2)}%
                                    </div>
                                    <div className="text-right">{portfolioPct}%</div>
                                    <div className="text-right">{h.currency} {h.avgPrice.toLocaleString()}</div>
                                    <div className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAddModal(h.symbol);
                                            }}
                                        >
                                            + Add
                                        </Button>
                                    </div>
                                </div>

                                {/* Expanded Purchase History */}
                                {isExpanded && (
                                    <div className="bg-gray-50 px-8 py-2 text-xs text-gray-700 border-t">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="text-gray-500 border-b">
                                                <th className="text-left py-1 font-medium">Date</th>
                                                <th className="text-right py-1 font-medium">Shares</th>
                                                <th className="text-right py-1 font-medium">Price</th>
                                                <th className="text-right py-1 font-medium">Total</th>
                                                <th className="text-right py-1 font-medium">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {h.history.map((tx, i) => (
                                                <tr key={i} className="border-b last:border-0 hover:bg-gray-100 transition">
                                                    <td>{tx.date}</td>
                                                    <td className="text-right">{tx.shares}</td>
                                                    <td className="text-right">¥{tx.price.toLocaleString()}</td>
                                                    <td className="text-right">¥{(tx.shares * tx.price).toLocaleString()}</td>
                                                    <td className="text-right space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-5 text-[11px] px-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(h.symbol, tx, i);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-5 text-[11px] px-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePurchase(h.symbol, i);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl space-y-3">
                        <h2 className="text-lg font-semibold">
                            {editMode ? "Edit Purchase" : "Add Purchase"} ({selectedSymbol})
                        </h2>
                        <div className="space-y-2">
                            <Input
                                placeholder="Date (YYYY-MM-DD)"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                            <Input
                                placeholder="Shares"
                                type="number"
                                value={form.shares}
                                onChange={(e) => setForm({ ...form, shares: Number(e.target.value) })}
                            />
                            <Input
                                placeholder="Price"
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="outline" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>{editMode ? "Update" : "Add"}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HoldingsPage;
