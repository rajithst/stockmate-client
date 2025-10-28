import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

interface InsightsProps {
  diversificationScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  volatility: number;
  sharpeRatio: number;
}

export const PortfolioInsights: React.FC<InsightsProps> = ({
  diversificationScore,
  riskLevel,
  volatility,
  sharpeRatio,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const insights = [
    {
      label: 'Diversification Score',
      value: `${diversificationScore}/100`,
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: diversificationScore >= 70 ? 'Well diversified' : 'Consider diversifying more',
    },
    {
      label: 'Risk Level',
      value: riskLevel,
      icon: riskLevel === 'Low' ? ShieldCheck : AlertTriangle,
      color:
        riskLevel === 'Low'
          ? 'text-green-600'
          : riskLevel === 'Medium'
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        riskLevel === 'Low' ? 'bg-green-50' : riskLevel === 'Medium' ? 'bg-yellow-50' : 'bg-red-50',
      description: `Your portfolio has ${riskLevel.toLowerCase()} risk exposure`,
    },
    {
      label: 'Volatility',
      value: `${volatility.toFixed(1)}%`,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description:
        volatility < 15
          ? 'Low volatility'
          : volatility < 25
            ? 'Moderate volatility'
            : 'High volatility',
    },
    {
      label: 'Sharpe Ratio',
      value: sharpeRatio.toFixed(2),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: sharpeRatio > 1 ? 'Good risk-adjusted return' : 'Consider improving returns',
    },
  ];

  return (
    <Card className="border-none shadow-xl rounded-2xl bg-white mb-8">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Activity className="w-5 h-5 text-indigo-600" />
        <CardTitle className="text-lg font-bold text-gray-800">Portfolio Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg ${insight.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{insight.label}</div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-1">{insight.value}</div>
                <div className="text-xs text-gray-500">{insight.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
