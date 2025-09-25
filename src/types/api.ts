// Types for API responses and data structures
export type Chain = "eth" | "near";

export interface ChainBalance {
  near: number;
  eth: number;
}

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Collateral Types
export interface CollateralInfo {
  txHash: string;
  chain: Chain;
  amount: number;
  valueUSD: number;
}

export interface Collateral {
  amount: number;
  txnHash: string;
  chain: Chain;
}

export interface CollateralStatus {
  txHash: string;
  chain: Chain;
  amount: number;
  isLocked: boolean;
  status: "locked" | "available";
  ownerAddress: string;
}

export interface CollateralStatusResponse {
  address: string;
  linkedAddresses: string[];
  totalCollaterals: number;
  availableCollaterals: number;
  lockedCollaterals: number;
  collaterals: CollateralStatus[];
  collateralBalances: ChainBalance;
}

// Loan Types
export interface LoanRecord {
  id: string;
  borrower: string;
  collateralTxHash: string;
  collateralChain: Chain;
  collateralAmount: number;
  collateralValueUSD: number;
  borrowChain: Chain;
  borrowAmount: number;
  borrowValueUSD: number;
  interestRate: number;
  loanTermMonths: number;
  interestAmount: number;
  totalRepaymentAmount: number;
  startTime: Date;
  dueDate: Date;
  status: "active" | "repaid" | "liquidated";
  collateralRatio: number;
}

export interface LoanSummary {
  loanId: string;
  borrower: string;
  borrowAmount: number;
  borrowChain: Chain;
  interestAmount: number;
  totalRepaymentAmount: number;
  status: "active" | "repaid" | "liquidated";
  dueDate: Date;
  isOverdue: boolean;
  daysUntilDue: number;
  collateralInfo: {
    txHash: string;
    chain: Chain;
    amount: number;
    valueUSD: number;
  };
}

export interface UserLoansResponse {
  address: string;
  linkedAddresses: string[];
  totalLoans: number;
  activeLoans: number;
  loans: LoanSummary[];
}

// Lend Types
export interface LendRecord {
  amount: number;
  chain: Chain;
  txnHash: string;
  lender: string;
  timestamp: Date;
}

export interface LendEarningsResponse {
  address: string;
  totalBalance: ChainBalance;
  availableBalance: ChainBalance;
  lockedBalance: ChainBalance;
  projectedEarnings: ChainBalance;
  annualPercentageYield: number;
  loanTermMonths: number;
  totalValueUSD: number;
}

// Account Types
export interface AccountData {
  borrowBalance: ChainBalance;
  collateralRemaining: ChainBalance;
  lendedBalance: ChainBalance;
  borrowedAmounts: ChainBalance;
  collaterals: string[];
  lends: string[];
  borrow: string[];
  locked: {
    lends: {
      ids: string[];
    };
    collateral: {
      ids: string[];
    };
  };
}

// Transaction Types
export interface DepositRequest {
  txHash: string;
  chain: Chain;
}

export interface DepositResponse {
  account: string;
  chain: Chain;
  amount: number;
  txHash: string;
}

export interface BorrowRequest {
  borrower: string;
  collateralTxHash: string;
  borrowChain: Chain;
  borrowAmount: number;
}

export interface BorrowResponse {
  loanId: string;
  borrower: string;
  borrowAmount: number;
  borrowChain: Chain;
  interestAmount: number;
  totalRepaymentAmount: number;
  dueDate: Date;
  collateralInfo: {
    txHash: string;
    chain: Chain;
    amount: number;
    valueUSD: number;
  };
  loanTermMonths: number;
  interestRate: number;
}

export interface RepayRequest {
  loanId: string;
  repaymentTxHash: string;
  repaymentChain: Chain;
}

export interface WithdrawRequest {
  address: string;
  withdrawChain: Chain;
  withdrawAmount: number;
}

export interface CollateralWithdrawRequest {
  address: string;
  collateralTxHash: string;
}

// Price Types
export interface PriceData {
  eth: number;
  near: number;
  lastUpdated: Date;
}

// User Profile Types
export interface UserProfile {
  id: string;
  primaryAddress: string;
  linkedAddresses: {
    eth?: string;
    near?: string;
  };
  verified: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

// Pool Types
export interface PoolChainData {
  total: number;
  locked: number;
  available: number;
  utilizationRate: number;
  totalUSD: number;
  lockedUSD: number;
  availableUSD: number;
}

export interface PoolStatusData {
  timestamp: string;
  prices: {
    eth: number;
    near: number;
    lastUpdated: Date;
  };
  pools: {
    eth: PoolChainData;
    near: PoolChainData;
  };
  summary: {
    totalUSD: number;
    lockedUSD: number;
    availableUSD: number;
    overallUtilizationRate: number;
  };
}

export interface PoolStatusResponse extends ApiResponse<PoolStatusData> {}

// User-specific API Response Types
export interface LendEarningsData {
  address: string;
  totalBalance: ChainBalance;
  availableBalance: ChainBalance;
  lockedBalance: ChainBalance;
  projectedEarnings: ChainBalance;
  annualPercentageYield: number;
  loanTermMonths: number;
  totalValueUSD: number;
}

export interface UserLoansData {
  address: string;
  linkedAddresses: string[];
  totalLoans: number;
  activeLoans: number;
  loans: LoanSummary[];
}

export interface CollateralStatusData {
  address: string;
  linkedAddresses: string[];
  totalCollaterals: number;
  availableCollaterals: number;
  lockedCollaterals: number;
  collaterals: CollateralStatus[];
  collateralBalances: ChainBalance;
}

export interface LendEarningsApiResponse extends ApiResponse<LendEarningsData> {}

export interface UserLoansApiResponse extends ApiResponse<UserLoansData> {}

export interface CollateralStatusApiResponse extends ApiResponse<CollateralStatusData> {}

// Dashboard-specific types
export interface LentRecord {
  asset: string;
  amount: number;
  usdValue: number;
  projectedEarnings: number;
}

export interface CollateralRecord {
  asset: string;
  amount: number;
  usdValue: number;
  projectedEarnings: number;
  locked: boolean;
}

export interface BorrowRecord {
  asset: string;
  amount: number;
  usdValue: number;
  dueDate: Date;
}

export interface DashboardSummary {
  totalLentUSD: number;
  totalCollateralUSD: number;
  totalProjectedEarningsUSD: number;
}

export interface DashboardRecords {
  lentRecords: LentRecord[];
  collateralRecords: CollateralRecord[];
  borrowRecords: BorrowRecord[];
}

export interface DashboardUserData {
  address: string;
  linkedAddresses: string[];
  summary: DashboardSummary;
  records: DashboardRecords;
  prices: {
    eth: number;
    near: number;
    lastUpdated: Date;
  };
}

export interface DashboardApiResponse extends ApiResponse<DashboardUserData> {}

// Dashboard Types (derived from the above)
export interface DashboardData {
  portfolioValue: number;
  activeLoans: number;
  availableLiquidity: number;
  totalBorrowed: number;
  totalRepaid: number;
  interestEarned: number;
  defaultRate: number;
  collateralStatus: {
    total: number;
    available: number;
    locked: number;
    byChain: ChainBalance;
  };
  lendEarnings: {
    totalLent: number;
    availableBalance: number;
    lockedInLoans: number;
    projectedEarnings: number;
    apy: number;
  };
  recentLoans: LoanSummary[];
}