import React from "react";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {ArrowDownRight, ArrowUpRight} from "lucide-react";

const COLORS = [
    "#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa",
    "#f472b6", "#fcd34d", "#4ade80", "#c084fc", "#facc15",
    "#38bdf8", "#fb7185", "#2dd4bf", "#a3e635"
];

interface Props {
    allocation: {
        industry: Record<string, number>;
        sector: Record<string, number>;
        company: Record<string, number>;
    };
    currency: string;
}

interface BreakdownItem {
    name: string;
    value: number;
    percent: number;
    color: string;
    gain: number; // e.g. +3.2 or -1.5 (%)
}

interface CategoryBreakdownProps {
    data: BreakdownItem[];
}

const PortfolioAllocationCharts: React.FC<Props> = ({allocation, currency}) => {
    const renderChart = (
        title: string,
        dataObj: Record<string, number>,
        fullWidth = true
    ) => {
        const pieData = Object.entries(dataObj).map(([name, value]) => ({name, value}));

        return (
            <div
                key={title}
                className={`bg-white rounded-xl shadow-md p-6 flex flex-col justify-center ${
                    fullWidth ? "w-full" : "w-full md:w-[65%]"
                }`}
            >
                <h3 className="font-semibold mb-4 text-lg text-gray-800">
                    Allocation by {title}
                </h3>
                <div className="flex justify-center items-center flex-1">
                    <ResponsiveContainer width="95%" height={fullWidth ? 420 : 340}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={fullWidth ? 160 : 120}
                                labelLine
                                label={({name, percent}) =>
                                    `${name}: ${((percent as number) * 100).toFixed(1)}%`
                                }
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val: number, name: string) => [
                                    `${currency} ${val.toLocaleString()}`,
                                    name,
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const makeBreakdownData = (obj: Record<string, number>) => {
        const total = Object.values(obj).reduce((a, b) => a + b, 0);
        return Object.entries(obj).map(([name, value], i) => ({
            name,
            value,
            percent: (value / total) * 100,
            color: COLORS[i % COLORS.length],
            gain: (Math.random() - 0.5) * 10, // mock +/-5% change
        }));
    };

    return (
        <div className="space-y-8">
            {/* Industry */}
            <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
                <div className="flex-1 flex">
                    {renderChart("Industry", allocation.industry)}
                </div>
                <div className="flex-1 flex">
                    <CategoryBreakdown data={makeBreakdownData(allocation.industry)}/>
                </div>
            </div>

            {/* Sector */}
            <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
                <div className="flex-1 flex">
                    {renderChart("Sector", allocation.sector)}
                </div>
                <div className="flex-1 flex">
                    <CategoryBreakdown data={makeBreakdownData(allocation.sector)}/>
                </div>
            </div>

            {/* Company — chart only, full width */}
            <div className="flex">
                {renderChart("Company", allocation.company, true)}
            </div>
        </div>
    );
};


export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({data}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col w-full">
            <h3 className="font-semibold mb-4 text-lg">Breakdown</h3>

            <div className="space-y-3 overflow-y-auto max-h-[300px]">
                {data.map((item, i) => {
                    const isGain = item.gain >= 0;
                    return (
                        <div
                            key={i}
                            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none"
                        >
                            {/* Left section — Color dot + name */}
                            <div className="flex items-center gap-2 min-w-0">
                <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{backgroundColor: item.color}}
                />
                                <span className="text-gray-800 font-medium truncate">{item.name}</span>
                            </div>

                            {/* Middle section — Allocation bar */}
                            <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${item.percent}%`,
                                        backgroundColor: item.color,
                                    }}
                                ></div>
                            </div>

                            {/* Right section — Gain/loss */}
                            <div className="flex items-center gap-1 text-sm font-medium w-16 justify-end">
                                {isGain ? (
                                    <ArrowUpRight className="w-4 h-4 text-green-500"/>
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500"/>
                                )}
                                <span className={isGain ? "text-green-600" : "text-red-600"}>
                  {item.gain.toFixed(1)}%
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortfolioAllocationCharts;
