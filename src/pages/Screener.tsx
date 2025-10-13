import React, {useState} from "react";
import {Button} from "../components/ui/button";
import {Input} from "../components/ui/input";
import {ArrowDown, ArrowUp} from "lucide-react";
import {Link} from "react-router-dom";

interface ScreenParams {
    market_cap_more_than?: number;
    market_cap_lower_than?: number;
    beta_more_than?: number;
    beta_lower_than?: number;
    price_more_than?: number;
    price_lower_than?: number;
    dividend_more_than?: number;
    dividend_lower_than?: number;
    volume_more_than?: number;
    volume_lower_than?: number;
    is_actively_trading?: boolean;
    exchange?: string;
    sector?: string;
    industry?: string;
    country?: string;
    limit?: number;
}

export interface FMPStockScreenResult {
    symbol: string;
    company_name: string;
    market_cap: number;
    sector: string;
    industry: string;
    beta: number;
    price: number;
    last_annual_dividend: number;
    volume: number;
    exchange: string;
    exchange_short_name: string;
    country: string;
    is_etf: boolean;
    is_fund: boolean;
    is_actively_trading: boolean;
}

// Mock API call
const fetchStockScreen = async (params: ScreenParams): Promise<FMPStockScreenResult[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    symbol: "AAPL",
                    company_name: "Apple Inc.",
                    market_cap: 2400000000000,
                    sector: "Technology",
                    industry: "Consumer Electronics",
                    beta: 1.2,
                    price: 178,
                    last_annual_dividend: 0.92,
                    volume: 65000000,
                    exchange: "NASDAQ",
                    exchange_short_name: "NAS",
                    country: "USA",
                    is_etf: false,
                    is_fund: false,
                    is_actively_trading: true,
                },
                {
                    symbol: "MSFT",
                    company_name: "Microsoft Corp.",
                    market_cap: 2200000000000,
                    sector: "Technology",
                    industry: "Software",
                    beta: 0.95,
                    price: 310,
                    last_annual_dividend: 2.48,
                    volume: 28000000,
                    exchange: "NASDAQ",
                    exchange_short_name: "NAS",
                    country: "USA",
                    is_etf: false,
                    is_fund: false,
                    is_actively_trading: true,
                },
            ]);
        }, 500);
    });
};

const StockScreener: React.FC = () => {
    const [params, setParams] = useState<ScreenParams>({limit: 20});
    const [results, setResults] = useState<FMPStockScreenResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof FMPStockScreenResult | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const handleInputChange = (key: keyof ScreenParams, value: any) => {
        setParams((prev) => ({...prev, [key]: value}));
    };

    const handleScreen = async () => {
        setLoading(true);
        const res = await fetchStockScreen(params);
        setResults(res);
        setPage(1);
        setLoading(false);
    };

    const handleSort = (key: keyof FMPStockScreenResult) => {
        if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const filtered = results.filter(
        (r) =>
            r.symbol.toLowerCase().includes(search.toLowerCase()) ||
            r.company_name.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (!sortKey) return 0;
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === "number" && typeof valB === "number") return sortOrder === "asc" ? valA - valB : valB - valA;
        return sortOrder === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    const totalPages = Math.ceil(sorted.length / rowsPerPage);
    const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Stock Screener</h1>
                    <p className="text-sm text-gray-500">Filter and explore stocks by multiple criteria</p>
                </div>
                <Button onClick={handleScreen} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-9 px-4">
                    {loading ? "Screening..." : "Run Screen"}
                </Button>
            </div>

            {/* Filters */}
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Market Cap */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Market Cap:</span>
                    <Input
                        placeholder="Min"
                        type="number"
                        value={params.market_cap_more_than || ""}
                        onChange={(e) => handleInputChange("market_cap_more_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={params.market_cap_lower_than || ""}
                        onChange={(e) => handleInputChange("market_cap_lower_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Price */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Price:</span>
                    <Input
                        placeholder="Min"
                        type="number"
                        value={params.price_more_than || ""}
                        onChange={(e) => handleInputChange("price_more_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={params.price_lower_than || ""}
                        onChange={(e) => handleInputChange("price_lower_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Dividend */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Dividend:</span>
                    <Input
                        placeholder="Min"
                        type="number"
                        step="0.01"
                        value={params.dividend_more_than || ""}
                        onChange={(e) => handleInputChange("dividend_more_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        step="0.01"
                        value={params.dividend_lower_than || ""}
                        onChange={(e) => handleInputChange("dividend_lower_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Volume */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Volume:</span>
                    <Input
                        placeholder="Min"
                        type="number"
                        value={params.volume_more_than || ""}
                        onChange={(e) => handleInputChange("volume_more_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={params.volume_lower_than || ""}
                        onChange={(e) => handleInputChange("volume_lower_than", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Exchange */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Exchange:</span>
                    <Input
                        placeholder="Exchange"
                        value={params.exchange || ""}
                        onChange={(e) => handleInputChange("exchange", e.target.value)}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Sector */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Sector:</span>
                    <Input
                        placeholder="Sector"
                        value={params.sector || ""}
                        onChange={(e) => handleInputChange("sector", e.target.value)}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Industry */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Industry:</span>
                    <Input
                        placeholder="Industry"
                        value={params.industry || ""}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Country */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Country:</span>
                    <Input
                        placeholder="Country"
                        value={params.country || ""}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="text-xs h-7 flex-1"
                    />
                </div>

                {/* Limit */}
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs w-20">Limit:</span>
                    <Input
                        placeholder="Limit"
                        type="number"
                        value={params.limit || ""}
                        onChange={(e) => handleInputChange("limit", Number(e.target.value))}
                        className="text-xs h-7 flex-1"
                    />
                </div>
            </div>

            {/* Search */}
            <Input
                placeholder="Search symbol or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 my-2"
            />

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <table className="min-w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        {[
                            {key: "symbol", label: "Symbol"},
                            {key: "company_name", label: "Company"},
                            {key: "price", label: "Price"},
                            {key: "market_cap", label: "Market Cap"},
                            {key: "volume", label: "Volume"},
                            {key: "last_annual_dividend", label: "Dividend"},
                            {key: "beta", label: "Beta"},
                            {key: "exchange_short_name", label: "Exchange"},
                            {key: "country", label: "Country"},
                        ].map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-2 text-left cursor-pointer select-none"
                                onClick={() => handleSort(col.key as keyof FMPStockScreenResult)}
                            >
                                <div className="flex items-center gap-1">
                                    {col.label}
                                    {sortKey === col.key && (
                                        <span className="inline-block w-3">
                                            {sortOrder === "asc" ? <ArrowUp className="w-3 h-3"/> :
                                                <ArrowDown className="w-3 h-3"/>}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.map((item, idx) => {
                        const gainLossColor = item.price >= item.last_annual_dividend ? "text-green-600" : "text-red-600";
                        const GainLossIcon = item.price >= item.last_annual_dividend ? ArrowUp : ArrowDown;

                        return (
                            <tr
                                key={item.symbol + idx}
                                className={`hover:bg-gray-50 transition-colors duration-200 ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } cursor-pointer`}
                            >
                                <td className="px-4 py-2 font-medium text-blue-600 hover:underline">
                                    <Link
                                        to={`/company/${item.symbol}`}
                                        className="text-blue-600 hover:underline"
                                        onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                                    >
                                        {item.symbol}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">{item.company_name}</td>
                                <td className="px-4 py-2 text-right font-semibold">${item.price.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">${item.market_cap.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{item.volume.toLocaleString()}</td>
                                <td className={`px-4 py-2 text-right font-semibold flex items-center justify-end ${gainLossColor}`}>
                                    <GainLossIcon className="w-4 h-4 mr-1"/>
                                    {item.last_annual_dividend.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 text-right">{item.beta.toFixed(2)}</td>
                                <td className="px-4 py-2">{item.exchange_short_name}</td>
                                <td className="px-4 py-2">{item.country}</td>
                            </tr>
                        );
                    })}
                    {paginated.length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center py-4 text-gray-500">
                                No results found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages || 1}
                    </span>
                    <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StockScreener;
