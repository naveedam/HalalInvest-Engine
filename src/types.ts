export interface RevenueSegment {
  name: string;
  percentage: number; // e.g. 5 for 5%
  isCompliant: boolean;
  category: string; // e.g. 'Halal Operating', 'Interest Income', 'Alcohol', etc.
  description: string;
}

export interface ShariahComplianceData {
  ticker: string;
  companyName: string;
  industry: string;
  
  // Financial Ratios
  totalDebt: number; // USD
  totalEquity: number; // Shareholder Equity USD
  marketCap: number; // USD
  totalAssets: number; // USD
  debtToEquity: number; // Ratio in % (totalDebt / totalEquity) * 100
  debtToAssets: number; // Ratio in % (totalDebt / totalAssets) * 100
  debtToMarketCap: number; // Ratio in % (totalDebt / marketCap) * 100
  
  // Liquid / Cash Assets
  cashAndInterestSecurities: number; // USD
  cashToAssetsRatio: number; // % of Total Assets
  cashToMarketCapRatio: number; // % of Market Cap
  
  // Accounts Receivable
  accountsReceivable: number; // USD
  receivablesToAssetsRatio: number; // % of Total Assets
  receivablesToMarketCapRatio: number; // % of Market Cap
  
  // Revenue Screener
  nonCompliantRevenuePercentage: number; // % of non-compliant of total revenue
  revenueSegments: RevenueSegment[];
  
  // Shariah Compliance status
  isCompliant: boolean;
  failedRules: string[];
  passedRules: string[];
  complianceSummary: string;
  
  // Source metadata
  dataSource: string;
  lastUpdated: string;
  country?: "US" | "IN";
}

export type ShariahBaseData = Omit<
  ShariahComplianceData,
  | "isCompliant"
  | "failedRules"
  | "passedRules"
  | "complianceSummary"
  | "debtToEquity"
  | "debtToAssets"
  | "debtToMarketCap"
  | "cashToAssetsRatio"
  | "cashToMarketCapRatio"
  | "receivablesToAssetsRatio"
  | "receivablesToMarketCapRatio"
>;

export interface ScreeningCriteria {
  // Financial Screen Thresholds in %
  maxDebtRatio: number; // Default 33% (or user-defined)
  debtRatioBasis: 'equity' | 'assets' | 'marketCap'; // basis for calculation
  
  maxCashRatio: number; // Default 33%
  cashRatioBasis: 'assets' | 'marketCap'; // basis
  
  maxReceivablesRatio: number; // Default 33% (or 49% depending on standard)
  receivablesRatioBasis: 'assets' | 'marketCap'; // basis
  
  // Business Screening Thresholds
  maxNonCompliantRevenue: number; // Default 5%
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StockScreenerResponse {
  success: boolean;
  data?: ShariahComplianceData;
  sources?: GroundingSource[];
  error?: string;
  isCached?: boolean;
  fallbackUsed?: boolean;
}
