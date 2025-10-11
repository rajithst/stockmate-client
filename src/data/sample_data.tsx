
export const sampleCompany = {
    id: 1,
    symbol: "AAPL",
    company_name: "Apple Inc.",
    price: 178.12,
    market_cap: 2800000000000,
    currency: "USD",
    exchange_full_name: "NASDAQ",
    exchange: "NASDAQ",
    image: "https://logo.clearbit.com/apple.com",
    dailyChange: 1.5,
};

export const sampleGrading = {
    strong_buy: 20,
    buy: 30,
    hold: 10,
    sell: 5,
    strong_sell: 2,
    consensus: "Buy",
};

export const sampleNews = [
    {
        published_date: "2025-10-01T12:00:00Z",
        news_url: "https://example.com/news/1",
        news_title: "Apple Stock Upgraded to Strong Buy",
        grading_company: "Morningstar",
        new_grade: "Strong Buy",
        previous_grade: "Buy",
        price_when_posted: 175.5,
    },
    {
        published_date: "2025-09-25T08:00:00Z",
        news_url: "https://example.com/news/2",
        news_title: "Apple Reports Record Quarterly Revenue",
        grading_company: "FMP Analytics",
        new_grade: "Buy",
        previous_grade: "Hold",
        price_when_posted: 172.8,
    },
];

export const samplePriceChange = {
    "1D": 2.1,
    "5D": -1.5,
    "1M": 3.2,
    "3M": 5.5,
    "6M": 10.8,
    "YTD": 12.4,
    "1Y": 25.0,
    "3Y": 40.0,
    "5Y": 150.0,
    "10Y": 500.0,
};

export const samplePriceTarget = {
    symbol: "AAPL",
    targetHigh: 300,
    targetLow: 200,
    targetConsensus: 251.7,
    targetMedian: 258,
};

export const sampleRatingSummary = {
    symbol: "AAPL",
    rating: "A-",
    overallScore: 4,
    discountedCashFlowScore: 3,
    returnOnEquityScore: 5,
    returnOnAssetsScore: 5,
    debtToEquityScore: 4,
    priceToEarningsScore: 2,
    priceToBookScore: 1,
};

export const sampleGeneralNews = [
    {
        id: 1,
        published_date: "2025-10-05T10:00:00Z",
        publisher: "Reuters",
        title: "Apple announces new MacBook lineup with M4 chip",
        image: "https://picsum.photos/100",
        url: "https://example.com/news1",
    },
];

export const samplePriceTargetNews = [
    {
        id: 1,
        published_date: "2025-10-04T08:00:00Z",
        url: "https://example.com/target1",
        title: "Goldman Sachs raises Apple price target to $270",
        analyst_name: "John Doe",
        price_target: 270,
        adj_price_target: 265,
        price_when_posted: 245,
        analyst_company: "Goldman Sachs",
    },
];

export const sampleGradingNews = [
    {
        id: 1,
        published_date: "2025-10-03T12:00:00Z",
        url: "https://example.com/grade1",
        title: "Morgan Stanley upgrades Apple from B+ to A-",
        grading_company: "Morgan Stanley",
        new_grade: "A-",
        previous_grade: "B+",
        price_when_posted: 250,
    },
];
