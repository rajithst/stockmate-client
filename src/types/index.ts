/**
 * Index file for all TypeScript schema interfaces
 * Import all interfaces from this single file for convenient access
 *
 * Usage example:
 * ```typescript
 * import type {
 *   CompanyRead,
 *   CompanyIncomeStatementRead,
 *   UserRead,
 *   PortfolioRead,
 * } from '@/schemas/types';
 * ```
 */

// Financial Statements
export type {
  CompanyIncomeStatement,
  CompanyIncomeStatementWrite,
  CompanyIncomeStatementRead,
  CompanyBalanceSheet,
  CompanyBalanceSheetWrite,
  CompanyBalanceSheetRead,
  CompanyCashFlowStatement,
  CompanyCashFlowStatementWrite,
  CompanyCashFlowStatementRead,
  CompanyFinancialRatio,
  CompanyFinancialRatioWrite,
  CompanyFinancialRatioRead,
} from './financial-statements';

// Company Metrics
export type {
  CompanyAnalystEstimate,
  CompanyAnalystEstimateWrite,
  CompanyAnalystEstimateRead,
  CompanyKeyMetrics,
  CompanyKeyMetricsWrite,
  CompanyKeyMetricsRead,
  CompanyDiscountedCashFlow,
  CompanyDiscountedCashFlowRead,
  CompanyDiscountedCashFlowWrite,
  CompanyRevenueProductSegmentation,
  CompanyRevenueProductSegmentationWrite,
  CompanyRevenueProductSegmentationRead,
} from './company-metrics';

// Market Data
export type {
  CompanyGrading,
  CompanyGradingWrite,
  CompanyGradingRead,
  CompanyGradingSummary,
  CompanyGradingSummaryRead,
  CompanyGradingSummaryWrite,
  CompanyRatingSummary,
  CompanyRatingSummaryRead,
  CompanyRatingSummaryWrite,
  CompanyPriceTarget,
  CompanyPriceTargetRead,
  CompanyPriceTargetWrite,
  CompanyPriceTargetSummary,
  CompanyPriceTargetSummaryRead,
  CompanyPriceTargetSummaryWrite,
  CompanyStockNews,
  CompanyStockNewsRead,
  CompanyStockNewsWrite,
  CompanyGeneralNews,
  CompanyGeneralNewsRead,
  CompanyGeneralNewsWrite,
  CompanyPriceTargetNews,
  CompanyPriceTargetNewsWrite,
  CompanyPriceTargetNewsRead,
  CompanyGradingNews,
  CompanyGradingNewsWrite,
  CompanyGradingNewsRead,
} from './market-data';

// Quote & Technical Data
export type {
  StockPriceChangeBase,
  StockPriceChangeWrite,
  StockPriceChangeRead,
  StockPrice,
  StockPriceRead,
  StockPriceWrite,
  CompanyStockSplit,
  CompanyStockSplitWrite,
  CompanyStockSplitRead,
  CompanyStockPeer,
  CompanyStockPeerWrite,
  CompanyStockPeerRead,
  CompanyDividend,
  CompanyDividendWrite,
  CompanyDividendRead,
  CompanyTechnicalIndicator,
  CompanyTechnicalIndicatorWrite,
  CompanyTechnicalIndicatorRead,
} from './quote';

// Financial Health
export type {
  CompanyFinancialHealth,
  CompanyFinancialHealthWrite,
  CompanyFinancialHealthRead,
  CompanyFinancialScore,
  CompanyFinancialScoresWrite,
  CompanyFinancialScoresRead,
  CompanyFinancialHealthResponse,
} from './financial-health';

// User & Portfolio
export type {
  User,
  UserCreate,
  UserWrite,
  UserRead,
  Token,
  TokenData,
  NotificationPreference,
  NotificationPreferenceWrite,
  NotificationPreferenceRead,
  Portfolio,
  PortfolioUpsertRequest,
  PortfolioCreate,
  PortfolioRead,
  PortfolioUpdate,
  PortfolioSectorPerformance,
  PortfolioSectorPerformanceRead,
  PortfolioIndustryPerformance,
  PortfolioIndustryPerformanceRead,
  PortfolioHoldingPerformance,
  PortfolioHoldingPerformanceWrite,
  PortfolioHoldingPerformanceRead,
  PortfolioTradingHistory,
  PortfolioTradingHistoryUpsertRequest,
  PortfolioTradingHistoryWrite,
  PortfolioTradingHistoryRead,
  PortfolioDividendHistory,
  PortfolioDividendHistoryRead,
  PortfolioDividendHistoryWrite,
  PortfolioDetail,
  Watchlist,
  WatchlistUpsertRequest,
  WatchlistUpdate,
  WatchlistRead,
  WatchlistItem,
  WatchlistItemWrite,
  WatchlistItemCreate,
  WatchlistCompanyItem,
  WatchlistResponse,
} from './user';

// Company
export type {
  Company,
  CompanyRead,
  CompanyWrite,
  CompanyPageResponse,
  CompanyFinancialResponse,
  CompanyInsight,
  CompanyInsightsResponse,
} from './company';
