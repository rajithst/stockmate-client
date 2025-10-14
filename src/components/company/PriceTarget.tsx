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
                <CardTitle className="text-base font-semibold">Price Target Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Range bar */}
                <div className="relative h-3 bg-gray-200 rounded-md overflow-hidden">
                    {/* range gradient */}
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

                {/* Range endpoints */}
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Low: ${target.targetLow}</span>
                    <span>High: ${target.targetHigh}</span>
                </div>

                {/* Key stats */}
                <div className="flex justify-around text-sm font-medium mt-2">
                    <div className="text-center">
                        <div className="text-gray-500 text-xs">Low</div>
                        <div className="font-semibold">${target.targetLow}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 text-xs">Median</div>
                        <div className="font-semibold text-purple-600">${target.targetMedian}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 text-xs">Consensus</div>
                        <div className="font-semibold text-blue-600">${target.targetConsensus}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 text-xs">High</div>
                        <div className="font-semibold text-green-600">${target.targetHigh}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
