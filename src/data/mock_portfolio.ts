
export const fetchPortfolioSummary = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalInvested: 50000,
                totalGain: 6200,
                allocationByIndustry: [
                    { name: "Tech", value: 25000 },
                    { name: "Healthcare", value: 15000 },
                    { name: "Finance", value: 10000 },
                ],
                allocationBySector: [
                    { name: "Software", value: 20000 },
                    { name: "Biotech", value: 15000 },
                    { name: "Banking", value: 15000 },
                ],
                allocationByCompany: [
                    { name: "AAPL", value: 15000 },
                    { name: "MSFT", value: 10000 },
                    { name: "JNJ", value: 12000 },
                    { name: "JPM", value: 13000 },
                ],
            });
        }, 500);
    });
};

export const fetchHoldings = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    symbol: "AAPL",
                    quantity: 50,
                    currentPrice: 180,
                    marketValue: 9000,
                    gainLoss: 1200,
                    sparkline: [170, 172, 175, 180, 178, 182, 180],
                },
                {
                    symbol: "MSFT",
                    quantity: 30,
                    currentPrice: 300,
                    marketValue: 9000,
                    gainLoss: 1000,
                    sparkline: [290, 295, 300, 305, 300, 298, 300],
                },
                {
                    symbol: "JNJ",
                    quantity: 40,
                    currentPrice: 150,
                    marketValue: 6000,
                    gainLoss: -200,
                    sparkline: [155, 152, 150, 148, 150, 150, 150],
                },
                {
                    symbol: "JPM",
                    quantity: 20,
                    currentPrice: 160,
                    marketValue: 3200,
                    gainLoss: 600,
                    sparkline: [150, 155, 158, 160, 162, 160, 160],
                },
            ]);
        }, 500);
    });
};
