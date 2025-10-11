import React from "react";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";

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

const makePieData = (obj: Record<string, number>) =>
    Object.entries(obj).map(([name, value]) => ({name, value}));

const PortfolioAllocationCharts: React.FC<Props> = ({allocation, currency}) => {
    const renderChartCard = (title: string, dataObj: Record<string, number>) => {
        const pieData = makePieData(dataObj);
        const total = pieData.reduce((sum, d) => sum + d.value, 0);

        return (
            <div
                key={title}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-stretch"
            >
                {/* Chart Card (60%) */}
                <div className="md:col-span-3 bg-white rounded-xl shadow-md p-5 flex flex-col h-full">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2 text-gray-800">
                        Allocation by {title}
                    </h3>
                    <div className="flex-1 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    innerRadius={50}
                                    labelLine={true}
                                    label={({name, value}) => {
                                        const percent = ((value / total) * 100).toFixed(1);
                                        return `${name.length > 14 ? name.slice(0, 14) + "…" : name} (${percent}%)`;
                                    }}
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

                {/* Compact Breakdown Card (40%) */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5 flex flex-col h-full">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2 text-gray-800">
                        {title} Breakdown
                    </h3>
                    <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                        {pieData.map((item, idx) => {
                            const percent = ((item.value / total) * 100).toFixed(1);
                            const barColor = COLORS[idx % COLORS.length];
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition"
                                >
                                    {/* Left side — name + color dot */}
                                    <div className="flex items-center gap-2 truncate w-2/3">
                    <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{backgroundColor: barColor}}
                    ></span>
                                        <span className="font-medium text-gray-700 text-sm truncate">
                      {item.name}
                    </span>
                                    </div>

                                    {/* Right side — percentage bar */}
                                    <div className="flex-1 flex items-center gap-2 justify-end">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{
                                                    width: `${percent}%`,
                                                    backgroundColor: barColor,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-700 text-xs w-10 text-right">
                      {percent}%
                    </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {renderChartCard("Industry", allocation.industry)}
            {renderChartCard("Sector", allocation.sector)}
            {renderChartCard("Company", allocation.company)}
        </div>
    );
};

export default PortfolioAllocationCharts;
