import React from "react";
import {Card, CardContent} from "../ui/card";
import {ArrowDownRight, ArrowUpRight} from "lucide-react";

const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);

export const PortfolioSummaryCards: React.FC<{ data: any }> = ({data}) => {
    const items = [
        {
            label: "Total Value",
            value: data.totalValue,
            currency: "USD",
            change: (data.totalGains / data.totalInvested) * 100
        },
        {label: "Total Invested", value: data.totalInvested, currency: "USD"},
        {
            label: "Total Gains",
            value: data.totalGains,
            currency: "USD",
            change: (data.totalGains / data.totalInvested) * 100
        },
        {label: "Total Dividends", value: data.totalDividends, currency: "USD",},
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {items.map((item) => {
                const isGain = (item.change ?? 0) >= 0;
                return (
                    <Card
                        key={item.label}
                        className="p-3 hover:shadow-md transition-shadow duration-200 bg-white border border-gray-100"
                    >
                        <CardContent className="p-0 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-medium text-gray-500">{item.label}</h4>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-md ${
                                        isGain ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                    }`}
                                >
                                  {item.change !== undefined && item.change !== null && (
                                      <>
                                          {isGain ? (
                                              <ArrowUpRight className="h-3 w-3 inline mr-1"/>
                                          ) : (
                                              <ArrowDownRight className="h-3 w-3 inline mr-1"/>
                                          )}
                                          {`${item.change > 0 ? "+" : ""}${item.change.toFixed(2)}%`}
                                      </>
                                  )}
                                </span>
                            </div>

                            <div className="flex items-end justify-between">
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(item.value, item.currency)}
                                </p>
                                <span className="text-xs text-gray-400">{item.currency}</span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
