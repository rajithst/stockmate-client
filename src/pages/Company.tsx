import React from "react";

import {useParams} from "react-router-dom";
import {
    sampleCompany,
    sampleGeneralNews,
    sampleGrading,
    sampleGradingNews,
    samplePriceChange,
    samplePriceTarget,
    samplePriceTargetNews,
    sampleRatingSummary,
} from "../data/sample_data";
import {CompanyHeader} from "../components/company/CompanyHeader.tsx";
import {PriceChangeChart} from "../components/company/PriceChange.tsx";
import {CompanyNewsTabs} from "../components/company/CompanyNews.tsx";
import {StockGradingSummaryCard} from "../components/company/GradingSummary.tsx";
import {DcfSummaryCard} from "../components/company/DiscountedCashFlow.tsx";
import {PriceTargetCard} from "../components/company/PriceTarget.tsx";
import {RatingSummaryCard} from "../components/company/RatingSummary.tsx";

export const CompanyPage: React.FC = () => {
    const {symbol} = useParams<{ symbol: string }>();
    const company = sampleCompany;
    const priceChange = samplePriceChange;
    const gradingSummary = sampleGrading;
    const priceTarget = samplePriceTarget;
    const ratingSummary = sampleRatingSummary;
    const companyNews = {
        generalNews: sampleGeneralNews,
        priceTargetNews: samplePriceTargetNews,
        gradingNews: sampleGradingNews,
    }
    const dcfData = {
        symbol: "AAPL",
        date: "2025-02-04",
        dcf: 147.27,
        stockPrice: 231.80,
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Top Section: Responsive 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">
                    <CompanyHeader company={company}/>
                    <PriceChangeChart data={priceChange}/>
                    <CompanyNewsTabs news={companyNews}/>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <StockGradingSummaryCard summary={gradingSummary}/>
                    <DcfSummaryCard dcfData={dcfData}/>
                    <PriceTargetCard target={priceTarget}/>
                    <RatingSummaryCard rating={ratingSummary}/>
                </div>
            </div>
        </div>
    );
};
