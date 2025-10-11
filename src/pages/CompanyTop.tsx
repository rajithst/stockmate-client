import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

import {ArrowUpRight, ArrowDownRight, Eye, PlusCircle, Bell, BarChart3, MinusCircle, Info} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {Badge} from "../components/ui/badge";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";
import {
    Tooltip as ShadTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";

export interface Company {
    id: number;
    symbol: string;
    company_name: string;
    price: number;
    market_cap: number;
    currency: string;
    exchange_full_name: string;
    exchange: string;
    image?: string;
}

export interface CompanyGradingSummary {
    strong_buy: number;
    buy: number;
    hold: number;
    sell: number;
    strong_sell: number;
    consensus: string;
}

export interface PriceTarget {
    symbol: string;
    targetHigh: number;
    targetLow: number;
    targetConsensus: number;
    targetMedian: number;
}

export interface PriceChange {
    [key: string]: number;
}

export interface RatingSummary {
    symbol: string;
    rating: string;
    overallScore: number;
    discountedCashFlowScore: number;
    returnOnEquityScore: number;
    returnOnAssetsScore: number;
    debtToEquityScore: number;
    priceToEarningsScore: number;
    priceToBookScore: number;
}

export interface Company {
    symbol: string;
    company_name: string;
    price: number;
    currency: string;
    exchange_full_name: string;
    exchange: string;
    image?: string;
    dailyChange?: number; // new field for last day change (%)
}

interface CompanyHeaderProps {
    company: Company;
    onAddToWatchlist?: () => void;
    onAddToPortfolio?: () => void;
    onSetReminder?: () => void;
    onViewFinancials?: () => void;
}

interface BaseNews {
    id: number;
    published_date: string;
    publisher?: string;
    title: string;
    text?: string;
    image?: string;
    url?: string;
}

interface CompanyGeneralNews extends BaseNews {
    site?: string;
}

interface CompanyPriceTargetNews extends BaseNews {
    analyst_name: string;
    price_target: number;
    adj_price_target?: number;
    price_when_posted: number;
    analyst_company?: string;
}

interface CompanyGradingNews extends BaseNews {
    new_grade: string;
    previous_grade?: string;
    grading_company?: string;
    action?: string;
    price_when_posted: number;
}

export interface CompanyNews {
    generalNews: CompanyGeneralNews[];
    priceTargetNews: CompanyPriceTargetNews[];
    gradingNews: CompanyGradingNews[];
}

interface DCFata {
    symbol: string;
    date: string;
    dcf: number;
    stockPrice: number;
}

interface DCFSummary {
    dcfData: DCFata;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
                                                                company,
                                                                onAddToWatchlist,
                                                                onAddToPortfolio,
                                                                onSetReminder,
                                                            }) => {
    const isPositive = (company.dailyChange ?? 0) >= 0;
    const changeColor = isPositive ? "text-green-600" : "text-red-600";
    const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    const navigate = useNavigate();
    const handleViewFinancials = () => {
        navigate(`/financials/${company.symbol}`);
    };

    return (
        <Card className="mb-6">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                {/* Left section - Company info */}
                <div className="flex items-center space-x-4">
                    {company.image && (
                        <img
                            src={company.image}
                            alt={company.company_name}
                            className="w-12 h-12 rounded-md object-contain border"
                        />
                    )}
                    <div>
                        <CardTitle className="text-2xl font-semibold">
                            {company.company_name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                            {company.symbol} • {company.exchange_full_name} ({company.exchange})
                        </CardDescription>
                    </div>
                </div>

                {/* Right section - Price + Change */}
                <div className="flex flex-col items-end space-y-1">
                    <div className="text-2xl font-bold">
                        {company.currency} {company.price.toFixed(2)}
                    </div>
                    {company.dailyChange !== undefined && (
                        <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
                            <ChangeIcon className="w-4 h-4 mr-1" />
                            {Math.abs(company.dailyChange).toFixed(2)}%
                        </div>
                    )}
                </div>
            </CardHeader>

            {/* Actions */}
            <div className="flex flex-wrap justify-between items-center px-6 pb-4 gap-3 border-t pt-3">
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={onAddToWatchlist}>
                        <Eye className="w-4 h-4 mr-1" /> Add to Watchlist
                    </Button>
                    <Button variant="outline" size="sm" onClick={onAddToPortfolio}>
                        <PlusCircle className="w-4 h-4 mr-1" /> Add to Portfolio
                    </Button>
                    <Button variant="outline" size="sm" onClick={onSetReminder}>
                        <Bell className="w-4 h-4 mr-1" /> Set Reminder
                    </Button>
                </div>

                <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                    onClick={handleViewFinancials}
                >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    See All Financials
                </Button>
            </div>
        </Card>
    );
};

export const PriceChangeChart: React.FC<{ data: PriceChange }> = ({ data }) => {
    const chartData = Object.entries(data)
        .filter(([period]) => period !== "symbol") // skip symbol if present
        .map(([period, value]) => ({
            period,
            value: parseFloat(value.toFixed(2)),
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price Change (%)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="period"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Bar dataKey="value">
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.value >= 0 ? "#16a34a" : "#dc2626"} // green for positive, red for negative
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const PriceTargetCard: React.FC<{ target: PriceTarget }> = ({ target }) => {
    const range = target.targetHigh - target.targetLow;
    const consensusPos = ((target.targetConsensus - target.targetLow) / range) * 100;
    const medianPos = ((target.targetMedian - target.targetLow) / range) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price Target Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Range bar */}
                <div className="relative h-4 bg-gray-200 rounded-md overflow-hidden">
                    {/* range fill */}
                    <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70" />

                    {/* consensus marker */}
                    <div
                        className="absolute top-0 h-full w-[2px] bg-blue-600"
                        style={{ left: `${consensusPos}%` }}
                        title={`Consensus: ${target.targetConsensus}`}
                    />

                    {/* median marker */}
                    <div
                        className="absolute top-0 h-full w-[2px] bg-purple-600"
                        style={{ left: `${medianPos}%` }}
                        title={`Median: ${target.targetMedian}`}
                    />
                </div>

                {/* Labels row */}
                <div className="flex justify-between text-sm font-medium text-gray-700">
                    <div>Low: ${target.targetLow}</div>
                    <div>High: ${target.targetHigh}</div>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                        <div className="text-gray-500">Low</div>
                        <div className="font-semibold">${target.targetLow}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">Median</div>
                        <div className="font-semibold text-purple-600">${target.targetMedian}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">Consensus</div>
                        <div className="font-semibold text-blue-600">${target.targetConsensus}</div>
                    </div>
                    <div>
                        <div className="text-gray-500">High</div>
                        <div className="font-semibold text-green-600">${target.targetHigh}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const RatingSummaryCard: React.FC<{ rating: RatingSummary }> = ({ rating }) => {
    const items = [
        {
            label: "Overall",
            value: rating.overallScore,
            info: "Weighted blend of all valuation and performance metrics.",
        },
        {
            label: "Discounted Cash Flow",
            value: rating.discountedCashFlowScore,
            info: "Measures fair value based on future cash flows. High means stock may be undervalued.",
        },
        {
            label: "Return on Equity",
            value: rating.returnOnEquityScore,
            info: "Shows how efficiently company generates profit from shareholders’ equity. High = strong profitability.",
        },
        {
            label: "Return on Assets",
            value: rating.returnOnAssetsScore,
            info: "Indicates how well assets are used to generate earnings. Higher = better efficiency.",
        },
        {
            label: "Debt to Equity",
            value: rating.debtToEquityScore,
            info: "Shows financial leverage. High ratio = more debt risk; low = conservative balance sheet.",
        },
        {
            label: "P/E Ratio",
            value: rating.priceToEarningsScore,
            info: "Compares price to earnings. Low vs peers = undervalued; high = growth expectations or overvaluation.",
        },
        {
            label: "P/B Ratio",
            value: rating.priceToBookScore,
            info: "Compares market value to book value. Low = undervalued assets; high = expensive or strong future prospects.",
        },
    ];

    const getBarColor = (score: number) => {
        if (score >= 5) return "#16a34a"; // strong green
        if (score >= 4) return "#22c55e";
        if (score >= 3) return "#eab308"; // yellow
        if (score >= 2) return "#f97316"; // orange
        return "#dc2626"; // red
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Rating Summary</CardTitle>
                <Badge className="text-base font-bold px-3 py-1 bg-blue-600 text-white">
                    {rating.rating}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <TooltipProvider>
                    {items.map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <div className="flex items-center gap-1">
                                    <span>{item.label}</span>
                                    <ShadTooltip>
                                        <TooltipTrigger asChild>
                                            <Info
                                                size={14}
                                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs p-2 text-xs">
                                            {item.info}
                                        </TooltipContent>
                                    </ShadTooltip>
                                </div>
                                <span className="font-semibold">{item.value}/5</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                    className="h-2 rounded"
                                    style={{
                                        width: `${(item.value / 5) * 100}%`,
                                        backgroundColor: getBarColor(item.value),
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};

export const DcfSummaryCard: React.FC<DCFSummary> = ({dcfData}) => {
    const { dcf, stockPrice, date } = dcfData;

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
                            <Icon className={`${colorClass} w-5 h-5`} />
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

export const StockGradingSummaryCard: React.FC<{ summary: CompanyGradingSummary }> = ({ summary }) => {
    const total =
        summary.strong_buy + summary.buy + summary.hold + summary.sell + summary.strong_sell;

    const items = [
        { label: "Strong Buy", key: "strong_buy", count: summary.strong_buy, color: "#16a34a" },
        { label: "Buy", key: "buy", count: summary.buy, color: "#22c55e" },
        { label: "Hold", key: "hold", count: summary.hold, color: "#facc15" },
        { label: "Sell", key: "sell", count: summary.sell, color: "#f87171" },
        { label: "Strong Sell", key: "strong_sell", count: summary.strong_sell, color: "#dc2626" },
    ];

    const consensusColorMap: Record<string, string> = {
        "Strong Buy": "bg-green-600 text-white",
        "Buy": "bg-green-500 text-white",
        "Hold": "bg-yellow-400 text-black",
        "Sell": "bg-red-500 text-white",
        "Strong Sell": "bg-red-700 text-white",
    };

    const consensusColor =
        consensusColorMap[summary.consensus] || "bg-gray-500 text-white";

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Stock Grading Summary</CardTitle>
                <Badge className={`${consensusColor} text-sm font-semibold px-3 py-1`}>
                    {summary.consensus}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Horizontal visual bar */}
                <div className="flex h-4 rounded overflow-hidden">
                    {items.map(
                        (item, idx) =>
                            item.count > 0 && (
                                <div
                                    key={idx}
                                    className="h-4"
                                    style={{
                                        width: `${(item.count / total) * 100}%`,
                                        backgroundColor: item.color,
                                    }}
                                    title={`${item.label}: ${item.count}`}
                                />
                            )
                    )}
                </div>

                {/* Clean aligned breakdown list */}
                <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex justify-between items-center py-1.5 text-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span>{item.label}</span>
                            </div>
                            <span className="text-muted-foreground font-medium">
                {item.count} ({((item.count / total) * 100).toFixed(1)}%)
              </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const CompanyNewsTabs: React.FC<{ news: CompanyNews}> = ({ news }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Company News</CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="target">Price Target</TabsTrigger>
                        <TabsTrigger value="grading">Grading</TabsTrigger>
                    </TabsList>

                    {/* General News */}
                    <TabsContent value="general">
                        <div className="space-y-3 mt-3">
                            {news.generalNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start space-x-3 hover:bg-muted p-2 rounded-md transition"
                                >
                                    {news.image && (
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{news.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {news.publisher} •{" "}
                                            {new Date(news.published_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Price Target News */}
                    <TabsContent value="target">
                        <div className="space-y-3 mt-3">
                            {news.priceTargetNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:bg-muted p-2 rounded-md transition"
                                >
                                    <div className="font-medium text-sm">{news.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {news.analyst_name} ({news.analyst_company}) •{" "}
                                        Target: ${news.price_target} •{" "}
                                        {new Date(news.published_date).toLocaleDateString()}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Grading News */}
                    <TabsContent value="grading">
                        <div className="space-y-3 mt-3">
                            {news.gradingNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:bg-muted p-2 rounded-md transition"
                                >
                                    <div className="font-medium text-sm">{news.title}</div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                        <span>{news.grading_company}</span>•
                                        <span>
                      {news.previous_grade && (
                          <>
                              {news.previous_grade} →{" "}
                          </>
                      )}
                                            <Badge variant="secondary">{news.new_grade}</Badge>
                    </span>
                                        <span>
                      ({new Date(news.published_date).toLocaleDateString()})
                    </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};