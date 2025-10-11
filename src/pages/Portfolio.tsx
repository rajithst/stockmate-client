import React, {useEffect, useState} from "react";
import {PortfolioHeader} from "../components/portfolio/PortfolioHeader.tsx";
import PortfolioGrowthChart from "../components/portfolio/Growth.tsx";
import PortfolioAllocationCharts from "../components/portfolio/Allocations.tsx";
import {PortfolioSummaryCards} from "../components/portfolio/PortfolioSummary.tsx";

// ---- Interfaces ----
interface PortfolioSummary {
    id: string;
    name: string;
    currency: string;
    created_date?: string;
    holding_count?: number;
}

interface PortfolioData {
    totalValue: number;
    totalInvested: number;
    totalGains: number;
    totalDividends: number;
    portfolioHistory: {
        date: string;
        value: number;
        invested: number;
        currency: string;
    }[];
    allocation: {
        industry: Record<string, number>;
        sector: Record<string, number>;
        company: Record<string, number>;
    };
}

// ---- Fake API ----
const fetchPortfolioList = async (): Promise<PortfolioSummary[]> => {
    return [
        {id: "1", name: "Tech Focus", currency: "USD"},
        {id: "2", name: "Dividend Portfolio", currency: "USD"},
        {id: "3", name: "Global Growth", currency: "USD"},
    ];
};

const fetchPortfolioData = async (id: string): Promise<PortfolioData> => {
    return {
        totalValue: id === "1" ? 125000 : id === "2" ? 98000 : 150000,
        totalInvested: id === "1" ? 100000 : id === "2" ? 90000 : 120000,
        totalGains: id === "1" ? 25000 : id === "2" ? 8000 : 30000,
        totalDividends: id === "1" ? 1500 : id === "2" ? 1200 : 1800,
        portfolioHistory: [
            {date: "2025-07-01", value: 95000, invested: 90000, currency: "USD"},
            {date: "2025-08-01", value: 100000, invested: 95000, currency: "USD"},
            {date: "2025-09-01", value: 110000, invested: 98000, currency: "USD"},
            {
                date: "2025-10-01",
                value: id === "3" ? 150000 : id === "2" ? 98000 : 125000,
                invested: id === "3" ? 120000 : id === "2" ? 90000 : 100000,
                currency: "USD",
            },
        ],
        allocation: {
            industry: {
                Tech: 50000,
                Finance: 30000,
                Healthcare: 45000,
                semiconductor: 20000,
                oil: 30000,
                automotive: 15000,
            },
            sector: {
                Software: 45000,
                Banking: 30000,
                Pharma: 50000,
                semiconductor: 20000,
                oil: 30000,
                automotive: 15000,
            },
            company: {
                AAPL: 40000,
                MSFT: 35000,
                JNJ: 20000,
                JPM: 30000,
                TSM: 20000,
                TSLA: 30000,
                KO: 15000,
                AMZN: 50000,
                GOOGL: 30000,
                PG: 45000,
                ABBV: 20000,
                META: 30000,
                NVDA: 15000,
                PLTR: 20000,
                GASS: 30000,
                TXRH: 15000,
            },
        },
    };
};

// ---- Main Component ----
const Portfolio: React.FC = () => {
    const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] =
        useState<PortfolioSummary | null>(null);
    const [data, setData] = useState<PortfolioData | null>(null);

    // Load portfolio list initially
    useEffect(() => {
        const init = async () => {
            const list = await fetchPortfolioList();
            setPortfolios(list);
            if (list.length > 0) {
                setSelectedPortfolio(list[0]);
            }
        };
        init();
    }, []);

    // Load portfolio data when selected changes
    useEffect(() => {
        if (!selectedPortfolio) return;
        const load = async () => {
            const res = await fetchPortfolioData(selectedPortfolio.id);
            setData(res);
        };
        load();
    }, [selectedPortfolio]);

    const handleSelectPortfolio = (id: string) => {
        const portfolio = portfolios.find((p) => p.id === id) || null;
        setSelectedPortfolio(portfolio);
    };

    const handleCreatePortfolio = () => {
        console.log("Open Create Portfolio dialog");
    };

    if (!data || !selectedPortfolio)
        return <div className="p-6 text-gray-600">Loading portfolio...</div>;

    return (
        <div className="p-6 space-y-6">
            <PortfolioHeader
                portfolios={portfolios}
                selectedPortfolioId={selectedPortfolio.id}
                onSelect={handleSelectPortfolio}
                onCreate={handleCreatePortfolio}
            />

            <PortfolioSummaryCards
                data={data}
                currency={selectedPortfolio.currency}
            />

            <PortfolioGrowthChart
                data={data.portfolioHistory}
                currency={selectedPortfolio.currency}
            />

            <PortfolioAllocationCharts
                allocation={data.allocation}
                currency={selectedPortfolio.currency}
            />
        </div>
    );
};

export default Portfolio;
