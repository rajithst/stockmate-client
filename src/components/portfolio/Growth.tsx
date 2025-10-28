import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: { date: string; value: number; invested: number; currency: string }[];
}

const PortfolioGrowthChart: React.FC<Props> = ({ data }) => {
  const lineData = data.map((d) => ({
    date: d.date,
    Portfolio: d.value,
    Invested: d.invested,
    currency: d.currency,
  }));
  const currency = lineData.length > 0 ? lineData[0].currency : '$';
  return (
    <div className="bg-white rounded-2xl shadow-xl border-none p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Portfolio Growth</h2>
        <span className="text-xs text-gray-500 bg-indigo-50 px-3 py-1 rounded-lg">
          All values in {currency}
        </span>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investedColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              width={70}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              formatter={(v: number) => `${currency}${v.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px',
                padding: '10px 12px',
              }}
              cursor={{ strokeDasharray: '3 3', stroke: '#d1d5db' }}
            />

            <Legend
              verticalAlign="top"
              height={30}
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                color: '#374151',
                paddingBottom: '10px',
              }}
            />

            <Line
              type="monotone"
              dataKey="Portfolio"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
              fill="url(#portfolioColor)"
              fillOpacity={1}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Invested"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#8b5cf6' }}
              activeDot={{ r: 6 }}
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
