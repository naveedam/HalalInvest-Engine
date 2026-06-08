import { ShariahComplianceData, ShariahBaseData } from "./types";

// Dynamic helper function to calculate status for pre-screened or live stock data based on active criteria
export function evaluateShariahCompliance(
  stock: ShariahBaseData,
  criteria: {
    maxDebtRatio: number;
    debtRatioBasis: 'equity' | 'assets' | 'marketCap';
    maxCashRatio: number;
    cashRatioBasis: 'assets' | 'marketCap';
    maxReceivablesRatio: number;
    receivablesRatioBasis: 'assets' | 'marketCap';
    maxNonCompliantRevenue: number;
  }
): ShariahComplianceData {
  const failedRules: string[] = [];
  const passedRules: string[] = [];

  // 1. Business Activity Screen
  const nonCompliantRev = stock.nonCompliantRevenuePercentage;
  if (nonCompliantRev > criteria.maxNonCompliantRevenue) {
    failedRules.push(`Business screen: Non-compliant revenue (${nonCompliantRev.toFixed(2)}%) exceeds threshold of ${criteria.maxNonCompliantRevenue}%`);
  } else {
    passedRules.push(`Business screen: Non-compliant revenue (${nonCompliantRev.toFixed(2)}%) is within standard limit of ${criteria.maxNonCompliantRevenue}%`);
  }

  // 2. Debt Ratio Screen
  let debtRatio = 0;
  let debtLabel = "";
  if (criteria.debtRatioBasis === 'equity') {
    debtRatio = stock.totalEquity > 0 ? (stock.totalDebt / stock.totalEquity) * 100 : 999;
    debtLabel = `Debt-to-Equity (${debtRatio.toFixed(2)}%)`;
  } else if (criteria.debtRatioBasis === 'assets') {
    debtRatio = stock.totalAssets > 0 ? (stock.totalDebt / stock.totalAssets) * 100 : 999;
    debtLabel = `Debt-to-Assets (${debtRatio.toFixed(2)}%)`;
  } else {
    debtRatio = stock.marketCap > 0 ? (stock.totalDebt / stock.marketCap) * 100 : 999;
    debtLabel = `Debt-to-MarketCap (${debtRatio.toFixed(2)}%)`;
  }

  if (debtRatio > criteria.maxDebtRatio) {
    failedRules.push(`Debt screen: ${debtLabel} exceeds threshold of ${criteria.maxDebtRatio}%`);
  } else {
    passedRules.push(`Debt screen: ${debtLabel} is within compliant threshold of ${criteria.maxDebtRatio}%`);
  }

  // 3. Cash Ratio Screen
  let cashRatio = 0;
  let cashLabel = "";
  if (criteria.cashRatioBasis === 'assets') {
    cashRatio = stock.totalAssets > 0 ? (stock.cashAndInterestSecurities / stock.totalAssets) * 100 : 999;
    cashLabel = `Cash-to-Assets (${cashRatio.toFixed(2)}%)`;
  } else {
    cashRatio = stock.marketCap > 0 ? (stock.cashAndInterestSecurities / stock.marketCap) * 100 : 999;
    cashLabel = `Cash-to-MarketCap (${cashRatio.toFixed(2)}%)`;
  }

  if (cashRatio > criteria.maxCashRatio) {
    failedRules.push(`Cash screen: Interest-bearing Cash ${cashLabel} exceeds threshold of ${criteria.maxCashRatio}%`);
  } else {
    passedRules.push(`Cash screen: Interest-bearing Cash ${cashLabel} is within compliant threshold of ${criteria.maxCashRatio}%`);
  }

  // 4. Accounts Receivable Screen
  let recRatio = 0;
  let recLabel = "";
  if (criteria.receivablesRatioBasis === 'assets') {
    recRatio = stock.totalAssets > 0 ? (stock.accountsReceivable / stock.totalAssets) * 100 : 999;
    recLabel = `Receivables-to-Assets (${recRatio.toFixed(2)}%)`;
  } else {
    recRatio = stock.marketCap > 0 ? (stock.accountsReceivable / stock.marketCap) * 100 : 999;
    recLabel = `Receivables-to-MarketCap (${recRatio.toFixed(2)}%)`;
  }

  if (recRatio > criteria.maxReceivablesRatio) {
    failedRules.push(`Receivables screen: Accounts Receivable ${recLabel} exceeds threshold of ${criteria.maxReceivablesRatio}%`);
  } else {
    passedRules.push(`Receivables screen: Accounts Receivable ${recLabel} is within compliant threshold of ${criteria.maxReceivablesRatio}%`);
  }

  const isCompliant = failedRules.length === 0;

  // Let's formulate a concise summary
  let complianceSummary = "";
  if (isCompliant) {
    complianceSummary = `${stock.companyName} (${stock.ticker}) passes all Shariah screening criteria. The business model is primarily halal (${(100 - nonCompliantRev).toFixed(1)}% compliant revenue), and its debt ratio of ${debtRatio.toFixed(1)}% as well as liquid cash/receivables are well below standard limits.`;
  } else {
    complianceSummary = `${stock.companyName} (${stock.ticker}) is classified as Non-Compliant. ` + failedRules.join(". ") + ".";
  }

  return {
    ...stock,
    isCompliant,
    failedRules,
    passedRules,
    complianceSummary,
    debtToEquity: stock.totalEquity > 0 ? (stock.totalDebt / stock.totalEquity) * 100 : 0,
    debtToAssets: stock.totalAssets > 0 ? (stock.totalDebt / stock.totalAssets) * 100 : 0,
    debtToMarketCap: stock.marketCap > 0 ? (stock.totalDebt / stock.marketCap) * 100 : 0,
    cashToAssetsRatio: stock.totalAssets > 0 ? (stock.cashAndInterestSecurities / stock.totalAssets) * 100 : 0,
    cashToMarketCapRatio: stock.marketCap > 0 ? (stock.cashAndInterestSecurities / stock.marketCap) * 100 : 0,
    receivablesToAssetsRatio: stock.totalAssets > 0 ? (stock.accountsReceivable / stock.totalAssets) * 100 : 0,
    receivablesToMarketCapRatio: stock.marketCap > 0 ? (stock.accountsReceivable / stock.marketCap) * 100 : 0,
  };
}

export const PRESET_STOCKS: ShariahBaseData[] = [
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    industry: "Technology",
    totalDebt: 109000000000,
    totalEquity: 74000000000,
    totalAssets: 353000000000,
    marketCap: 3200000000000,
    cashAndInterestSecurities: 61000000000,
    accountsReceivable: 48000000000,
    nonCompliantRevenuePercentage: 1.2,
    revenueSegments: [
      { name: "iPhone, Mac, iPad & Wearables Hardware", percentage: 78.5, isCompliant: true, category: "Halal Operating", description: "Sale of consumer electronic items and devices." },
      { name: "App Store Services & Halal Subscriptions", percentage: 20.3, isCompliant: true, category: "Halal Operating", description: "Revenue from digital storefront fees and software services." },
      { name: "Conventional Cash Interest Income", percentage: 1.2, isCompliant: false, category: "Interest Income", description: "Interest income earned on corporate cash holdings." }
    ],
    dataSource: "10-K FY 2025 Financial Filings",
    lastUpdated: "2026-02",
    country: "US"
  },
  {
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    industry: "Automotive & Clean Energy",
    totalDebt: 9500000000,
    totalEquity: 66000000000,
    totalAssets: 112000000000,
    marketCap: 580000000000,
    cashAndInterestSecurities: 26000000000,
    accountsReceivable: 3500000005,
    nonCompliantRevenuePercentage: 2.1,
    revenueSegments: [
      { name: "Electric Vehicles Sales & Leasing", percentage: 89.0, isCompliant: true, category: "Halal Operating", description: "Manufacturing and sales of zero-emission vehicles." },
      { name: "Energy Generation & Storage", percentage: 6.5, isCompliant: true, category: "Halal Operating", description: "Solar panels, Powerwall and battery backup systems." },
      { name: "Financing Interest & Cash Yields", percentage: 2.1, isCompliant: false, category: "Interest Income", description: "Interest yielded on vehicle leases and corporate deposits." },
      { name: "Regulatory Credits & Other services", percentage: 2.4, isCompliant: true, category: "Halal Operating", description: "Clean air regulatory credits and service center revenues." }
    ],
    dataSource: "SEC Form 10-K FY 2025",
    lastUpdated: "2026-01",
    country: "US"
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    industry: "Technology",
    totalDebt: 85000000000,
    totalEquity: 250000000000,
    totalAssets: 470000000000,
    marketCap: 3000000000000,
    cashAndInterestSecurities: 80000000000,
    accountsReceivable: 42000000000,
    nonCompliantRevenuePercentage: 1.5,
    revenueSegments: [
      { name: "Cloud Services (Azure) & Software Licensing", percentage: 56.0, isCompliant: true, category: "Halal Operating", description: "Enterprise computing platform and server software." },
      { name: "Office and Productivity Subscriptions", percentage: 32.5, isCompliant: true, category: "Halal Operating", description: "SaaS subscriptions representing Office 365 services." },
      { name: "Xbox Gaming & Content (Standard)", percentage: 10.0, isCompliant: true, category: "Halal Operating", description: "Interactive entertainment software, devices and accessories." },
      { name: "Interest on Cash Positions", percentage: 1.5, isCompliant: false, category: "Interest Income", description: "Interest earnings from short-term financial investments." }
    ],
    dataSource: "10-K FY 2025 Financial Filings",
    lastUpdated: "2026-03",
    country: "US"
  },
  {
    ticker: "JPM",
    companyName: "JPMorgan Chase & Co.",
    industry: "Financial Services",
    totalDebt: 380000000000,
    totalEquity: 340000000000,
    totalAssets: 4100000000000,
    marketCap: 560000000000,
    cashAndInterestSecurities: 752000000000,
    accountsReceivable: 120000000000,
    nonCompliantRevenuePercentage: 78.5,
    revenueSegments: [
      { name: "Conventional Net Interest Income", percentage: 54.2, isCompliant: false, category: "Riba / Interest", description: "Spread interest income generated from lending and mortgage portfolios." },
      { name: "Conventional Investment Banking & Credit Fees", percentage: 24.3, isCompliant: false, category: "Financial Fees", description: "Fees from conventional debt underwriting, advisory and credit facilitation." },
      { name: "Asset Management & Compliant Advisory Fees", percentage: 21.5, isCompliant: true, category: "Halal Operating", description: "Management fees for equity, real estate and non-interest portfolios." }
    ],
    dataSource: "Annual Report FY 2025",
    lastUpdated: "2026-02",
    country: "US"
  },
  {
    ticker: "DKNG",
    companyName: "DraftKings Inc.",
    industry: "Consumer Services / Entertainment",
    totalDebt: 1250000000,
    totalEquity: 980000000,
    totalAssets: 4200000000,
    marketCap: 18000000000,
    cashAndInterestSecurities: 1100000000,
    accountsReceivable: 450000000,
    nonCompliantRevenuePercentage: 92.5,
    revenueSegments: [
      { name: "Sportsbook & Online Casino Gaming", percentage: 92.5, isCompliant: false, category: "Gambling (Maysir)", description: "Online gambling platform bets, commissions, and igaming yields." },
      { name: "Media, Software & Marketing services", percentage: 7.5, isCompliant: true, category: "Halal Operating", description: "B2B daily fantasy athletic contests fee, licensing and advertisements." }
    ],
    dataSource: "SEC Form 10-K FY 2025",
    lastUpdated: "2026-03",
    country: "US"
  },
  {
    ticker: "BUD",
    companyName: "Anheuser-Busch InBev SA/NV",
    industry: "Beverages & Brewing",
    totalDebt: 78000000000,
    totalEquity: 84000000000,
    totalAssets: 198000000000,
    marketCap: 110000000000,
    cashAndInterestSecurities: 8900000000,
    accountsReceivable: 4800000000,
    nonCompliantRevenuePercentage: 94.0,
    revenueSegments: [
      { name: "Alcoholic Brewing & Breweries (Budweiser, Corona)", percentage: 94.0, isCompliant: false, category: "Khamr / Alcohol", description: "Global brewing, distribution, and licensing of alcoholic beers." },
      { name: "Non-Alcoholic Sodas, Energy Drinks & Waters", percentage: 6.0, isCompliant: true, category: "Halal Operating", description: "Non-alcoholic beverages, carbonated drinks, juices and distribution." }
    ],
    dataSource: "Annual Report FY 2025",
    lastUpdated: "2026-02",
    country: "US"
  },
  {
    ticker: "PFE",
    companyName: "Pfizer Inc.",
    industry: "Healthcare & Pharmaceuticals",
    totalDebt: 61500000000,
    totalEquity: 92000000000,
    totalAssets: 216000000000,
    marketCap: 165000000000,
    cashAndInterestSecurities: 22000000000,
    accountsReceivable: 11800000000,
    nonCompliantRevenuePercentage: 0.8,
    revenueSegments: [
      { name: "Pharmaceutical Discovery, Vaccines & Oncology", percentage: 99.2, isCompliant: true, category: "Halal Operating", description: "Development and manufacture of life-saving medical products." },
      { name: "Interest Income on Cash Assets", percentage: 0.8, isCompliant: false, category: "Interest Income", description: "Interest derived from short-term financial deposits and bonds." }
    ],
    dataSource: "SEC Form 10-K FY 2025",
    lastUpdated: "2026-01",
    country: "US"
  },
  {
    ticker: "XOM",
    companyName: "Exxon Mobil Corporation",
    industry: "Energy / Oil & Gas",
    totalDebt: 41500000000,
    totalEquity: 215000000000,
    totalAssets: 382000000000,
    marketCap: 440000000000,
    cashAndInterestSecurities: 31000000000,
    accountsReceivable: 36000000000,
    nonCompliantRevenuePercentage: 0.5,
    revenueSegments: [
      { name: "Upstream Exploration & Production", percentage: 55.4, isCompliant: true, category: "Halal Operating", description: "Drilling, exploration, and sales of crude oil and natural gas." },
      { name: "Downstream Refining & Marketing", percentage: 38.6, isCompliant: true, category: "Halal Operating", description: "Refining petroleum products, transport, gasoline franchise sales." },
      { name: "Chemical Products Production", percentage: 5.5, isCompliant: true, category: "Halal Operating", description: "Petrochemical resins, plastic polymers and packaging raw materials." },
      { name: "Sovereign Treasury / Cash Interests", percentage: 0.5, isCompliant: false, category: "Interest Income", description: "Interest income earned on corporate cash reserves." }
    ],
    dataSource: "SEC Form 10-K FY 2025",
    lastUpdated: "2026-02",
    country: "US"
  },
  {
    ticker: "LMT",
    companyName: "Lockheed Martin Corporation",
    industry: "Aerospace & Defense",
    totalDebt: 18500000000,
    totalEquity: 7200000000,
    totalAssets: 54000000000,
    marketCap: 118000000000,
    cashAndInterestSecurities: 2800000000,
    accountsReceivable: 8100000000,
    nonCompliantRevenuePercentage: 25.0,
    revenueSegments: [
      { name: "Aeronautics & Helicopter Systems (Halal Civil Use)", percentage: 38.0, isCompliant: true, category: "Halal Operating", description: "Transport aircraft development, civil avionics, parts, and repairs." },
      { name: "Space, Satellites & Advanced Communication Systems", percentage: 37.0, isCompliant: true, category: "Halal Operating", description: "Scientific instruments, weather satellites, and civilian space missions." },
      { name: "Tactical Missiles, Armaments & Fire Controls", percentage: 25.0, isCompliant: false, category: "weapons", description: "Manufacture of lethal defense weapons, missiles, and automated combat munitions." }
    ],
    dataSource: "SEC Form 10-K FY 2025",
    lastUpdated: "2026-02",
    country: "US"
  },
  // Indian preset blue chips (labeled under country: "IN")
  {
    ticker: "RELIANCE",
    companyName: "Reliance Industries Limited",
    industry: "Conglomerate & Energy (NSE)",
    totalDebt: 3100000000000,
    totalEquity: 7800000000000,
    totalAssets: 17000000000000,
    marketCap: 16500000000000,
    cashAndInterestSecurities: 2100000000000,
    accountsReceivable: 350000000000,
    nonCompliantRevenuePercentage: 1.8,
    revenueSegments: [
      { name: "Petroleum Refining & Petrochemicals", percentage: 44.5, isCompliant: true, category: "Halal Operating", description: "Drilling, refining, petro-manufacturing downstream supply products." },
      { name: "Reliance Retail Markets (Multi-brand Stores)", percentage: 28.5, isCompliant: true, category: "Halal Operating", description: "Supermarket chains, lifestyle apparel products, and consumer appliances sales." },
      { name: "Jio Platforms (Telecom & Digital Services Services)", percentage: 25.2, isCompliant: true, category: "Halal Operating", description: "Broadband networks, 5G wireless internet subscriptions & cloud services." },
      { name: "Conventional Banking Interventions & Interest Income", percentage: 1.8, isCompliant: false, category: "Interest Income", description: "Finance portfolio earnings and interest yielded on surplus capital reserves." }
    ],
    dataSource: "Reliance Integrated Annual Report FY 2024-25",
    lastUpdated: "2025-05",
    country: "IN"
  },
  {
    ticker: "TCS",
    companyName: "Tata Consultancy Services Ltd.",
    industry: "IT & Software Services (NSE)",
    totalDebt: 70000000000,
    totalEquity: 1100000000000,
    totalAssets: 1500000000000,
    marketCap: 13500000000000,
    cashAndInterestSecurities: 450000000000,
    accountsReceivable: 410000000000,
    nonCompliantRevenuePercentage: 1.2,
    revenueSegments: [
      { name: "Enterprise Business IT Consulting & cloud", percentage: 54.5, isCompliant: true, category: "Halal Operating", description: "Providing software development, system architecture and AI services." },
      { name: "Banking, Financial & Insurance Software solutions", percentage: 32.0, isCompliant: true, category: "Halal Operating", description: "SaaS platforms and custom code implementation for finance houses (Note: providing code is halal as it doesn't represent charging direct loan interest)." },
      { name: "Communication, Media & Energy IT Systems", percentage: 12.3, isCompliant: true, category: "Halal Operating", description: "Engineering solutions and networks support portfolios." },
      { name: "Treasury Security yields & Bond Interests", percentage: 1.2, isCompliant: false, category: "Interest Income", description: "Interest income accumulated from short term corporate treasury funds." }
    ],
    dataSource: "TCS Integrated Annual Report FY 2024-25",
    lastUpdated: "2025-06",
    country: "IN"
  },
  {
    ticker: "INFY",
    companyName: "Infosys Limited",
    industry: "IT & Software Services (NSE)",
    totalDebt: 50000000000,
    totalEquity: 850000000000,
    totalAssets: 1100000000000,
    marketCap: 7800000000000,
    cashAndInterestSecurities: 280000000000,
    accountsReceivable: 250000000000,
    nonCompliantRevenuePercentage: 1.0,
    revenueSegments: [
      { name: "Digital Suite & Enterprise Cloud Consulting", percentage: 61.2, isCompliant: true, category: "Halal Operating", description: "Web-scale architecture engineering, cybersecurity, and server administration services." },
      { name: "Financial Services Custom Code & Platforms", percentage: 27.5, isCompliant: true, category: "Halal Operating", description: "Developing core banking suites (e.g. Finacle) and software components." },
      { name: "Manufacturing & Energy Digital Systems", percentage: 10.3, isCompliant: true, category: "Halal Operating", description: "Logistics systems, telemetry modules & factory automation services." },
      { name: "Fixed Deposits & Cash Reserves Interest Yields", percentage: 1.0, isCompliant: false, category: "Interest Income", description: "Interest earnings retrieved on fixed cash deposits in commercial banking." }
    ],
    dataSource: "Infosys Annual Report FY 2024-25",
    lastUpdated: "2025-06",
    country: "IN"
  },
  {
    ticker: "HDFCBANK",
    companyName: "HDFC Bank Limited",
    industry: "Commercial Banking (NSE)",
    totalDebt: 8900000000000,
    totalEquity: 2900000000000,
    totalAssets: 34000000000000,
    marketCap: 12800000000000,
    cashAndInterestSecurities: 21000000000000,
    accountsReceivable: 1500000000000,
    nonCompliantRevenuePercentage: 84.5,
    revenueSegments: [
      { name: "Retail Loan Interest & Home mortgage Yields", percentage: 48.0, isCompliant: false, category: "Riba / Interest", description: "Direct retail credit cards, residential mortgages, vehicle financing interest." },
      { name: "Wholesale & Business Corporate Loan Interest", percentage: 36.5, isCompliant: false, category: "Riba / Interest", description: "Riba-bearing asset packages and interest spreads charged to enterprises." },
      { name: "Mutual Fund & Non-Convertible Advisory Fees", percentage: 15.5, isCompliant: true, category: "Halal Operating", description: "Management and commission fees for equity mutual funds and non-debt portfolios." }
    ],
    dataSource: "HDFC Bank Annual Report FY 2024-25",
    lastUpdated: "2025-06",
    country: "IN"
  },
  {
    ticker: "ITC",
    companyName: "ITC Limited",
    industry: "Consumer Goods Conglomerate (NSE)",
    totalDebt: 3000000000,
    totalEquity: 700000000000,
    totalAssets: 900000000000,
    marketCap: 6200000000000,
    cashAndInterestSecurities: 250000000000,
    accountsReceivable: 32000000000,
    nonCompliantRevenuePercentage: 38.0,
    revenueSegments: [
      { name: "Cigarettes, Tobaccos & Prohibited items", percentage: 38.0, isCompliant: false, category: "Khamr / Tobacco", description: "Extensive manufacturing and sales of commercial cigarette brands (Exceeds tolerated incidental limit)." },
      { name: "FMCG Food & Paperboards (Aashirvaad, Sunfeast)", percentage: 45.5, isCompliant: true, category: "Halal Operating", description: "Gold standard flours, high-quality biscuits, notebook stationeries." },
      { name: "Agri-Business & Exports (Wheat, Soya beans)", percentage: 14.5, isCompliant: true, category: "Halal Operating", description: "Harvest exports, direct wholesale supply of commodities." },
      { name: "Luxury Hotels & Hospitality Division", percentage: 2.0, isCompliant: true, category: "Halal Operating", description: "Lodging amenities, tourist resorts, general catering services." }
    ],
    dataSource: "ITC Annual Report Document FY 2024-25",
    lastUpdated: "2025-06",
    country: "IN"
  },
  {
    ticker: "TATASTEEL",
    companyName: "Tata Steel Limited",
    industry: "Materials & Metallurgy (NSE)",
    totalDebt: 850000000000,
    totalEquity: 900000000000,
    totalAssets: 2600000000000,
    marketCap: 2100000000000,
    cashAndInterestSecurities: 120000000000,
    accountsReceivable: 110000000000,
    nonCompliantRevenuePercentage: 0.4,
    revenueSegments: [
      { name: "Steel Manufacturing & Domestic sales", percentage: 82.5, isCompliant: true, category: "Halal Operating", description: "Hot rolled and cold rolled steel coils, wire rods and infrastructure plates." },
      { name: "International Alloys & Metal Exports", percentage: 17.1, isCompliant: true, category: "Halal Operating", description: "Direct trade sales of crude steel and refined Alloys worldwide." },
      { name: "Financial Treasury Interest Income", percentage: 0.4, isCompliant: false, category: "Interest Income", description: "Interest yielded on fixed bank deposits and corporate liquid funds." }
    ],
    dataSource: "Tata Steel Annual Report FY 2024-25",
    lastUpdated: "2025-05",
    country: "IN"
  }
];
