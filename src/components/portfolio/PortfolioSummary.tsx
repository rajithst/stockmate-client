import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, Wallet, Gift } from 'lucide-react';

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const PortfolioSummaryCards: React.FC<{ data: any }> = ({ data }) => {
  const items = [
    {
      label: 'Total Value',
      value: data.totalValue,
      currency: 'USD',
      change: (data.totalGains / data.totalInvested) * 100,
      icon: DollarSign,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Total Invested',
      value: data.totalInvested,
      currency: 'USD',
      icon: Wallet,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Gains',
      value: data.totalGains,
      currency: 'USD',
      change: (data.totalGains / data.totalInvested) * 100,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Total Dividends',
      value: data.totalDividends,
      currency: 'USD',
      icon: Gift,
      gradient: 'from-orange-500 to-red-500',
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item) => {
        const isGain = (item.change ?? 0) >= 0;
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="border-none shadow-xl rounded-2xl bg-gradient-to-br from-white via-gray-50 to-indigo-50 hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            {/* Icon background decoration */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}
            />

            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700">{item.label}</h4>
                  </div>
                </div>
                {item.change !== undefined && item.change !== null && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                      isGain ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isGain ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {`${item.change > 0 ? '+' : ''}${item.change.toFixed(2)}%`}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-3xl font-extrabold text-gray-900">
                  {formatCurrency(item.value, item.currency)}
                </p>
                <span className="text-xs text-gray-400 font-medium">{item.currency}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
