import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";

export interface PriceTarget {
    symbol: string;
    targetHigh: number;
    targetLow: number;
    targetConsensus: number;
    targetMedian: number;
}

export const PriceTargetCard: React.FC<{ target: PriceTarget }> = ({target}) => {
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
                    <div
                        className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 opacity-70"/>

                    {/* consensus marker */}
                    <div
                        className="absolute top-0 h-full w-[2px] bg-blue-600"
                        style={{left: `${consensusPos}%`}}
                        title={`Consensus: ${target.targetConsensus}`}
                    />

                    {/* median marker */}
                    <div
                        className="absolute top-0 h-full w-[2px] bg-purple-600"
                        style={{left: `${medianPos}%`}}
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