import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface Props {
    data: { date: string; value: number; invested: number, currency: string }[];
}

const PortfolioGrowthChart: React.FC<Props> = ({data}) => {
    const lineData = data.map((d) => ({
        date: d.date,
        Portfolio: d.value,
        Invested: d.invested,
        currency: d.currency,
    }));
    const currency = lineData.length > 0 ? lineData[0].currency : "$";
    return (
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">📈 Portfolio Growth</h2>
                <span className="text-xs text-gray-500">All values in {currency}</span>
            </div>

            <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={lineData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        {/* Gradients */}
                        <defs>
                            <linearGradient id="portfolioColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="investedColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Chart Grid */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

                        {/* X/Y Axis */}
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            tickLine={false}
                            axisLine={false}
                            width={70}
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            formatter={(v: number) => `${currency}${v.toLocaleString()}`}
                            contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                fontSize: "12px",
                                padding: "8px 10px",
                            }}
                            cursor={{ strokeDasharray: "3 3", stroke: "#d1d5db" }}
                        />

                        {/* Legend */}
                        <Legend
                            verticalAlign="top"
                            height={30}
                            iconType="circle"
                            wrapperStyle={{
                                fontSize: "12px",
                                color: "#374151",
                                paddingBottom: "10px",
                            }}
                        />

                        {/* Lines */}
                        <Line
                            type="monotone"
                            dataKey="Portfolio"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            fill="url(#portfolioColor)"
                            fillOpacity={1}
                            animationDuration={800}
                        />
                        <Line
                            type="monotone"
                            dataKey="Invested"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            fill="url(#investedColor)"
                            fillOpacity={1}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioGrowthChart;
