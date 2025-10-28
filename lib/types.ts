export interface ProfitabilityRecord {
  loadNumber: string;
  containerNumber: string;
  customer: string;
  date: string;
  dateObj: Date; // Add parsed date object for filtering
  driver: string;
  chargesType: string[];
  totalCharges: number;
  driverPayTotal: number;
  expenseTotal: number;
  profit: number;
  profitMargin: number;
  isOTR: boolean;
}

export interface DateRange {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface OTRRecord {
  aimReferenceNumber: string;
  deliveryLocation: string;
  container: string;
  eta: string;
  vessel: string;
  deliveryDate: string;
  customer: string;
  driver: string;
  margin: number;
}

export interface YardStorageMetrics {
  totalIncome: number;
  totalExpenses: number;
  startupCosts: number;
  netProfit: number;
  startDate: string;
}

export interface ManagerMetrics {
  name: string;
  businessLine: string;
  annualOverhead: number;
  bonusThreshold: number;
  bonusPercentage: number;
  businessProfit: number;
  bonusEligible: boolean;
  bonusAmount: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalProfit: number;
  totalLoads: number;
  averageRevenuePerLoad: number;
  averageProfitPerLoad: number;
  averageMargin: number;
  totalDriverPay: number;
  totalExpenses: number;

  otrMetrics: {
    totalRevenue: number;
    totalProfit: number;
    totalLoads: number;
    averageMargin: number;
  };

  localDrayageMetrics: {
    totalRevenue: number;
    totalProfit: number;
    totalLoads: number;
    averageMargin: number;
  };

  yardStorageMetrics: YardStorageMetrics;

  managerMetrics: ManagerMetrics[];

  serviceTypeBreakdown: ServiceTypeMetric[];
  customerBreakdown: CustomerMetric[];
  monthlyBreakdown: MonthlyMetric[];
  driverPerformance: DriverMetric[];
}

export interface ServiceTypeMetric {
  serviceType: string;
  revenue: number;
  profit: number;
  loads: number;
  margin: number;
}

export interface CustomerMetric {
  customer: string;
  revenue: number;
  profit: number;
  loads: number;
  margin: number;
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  otrRevenue: number;
  localDrayageRevenue: number;
  profit: number;
  otrProfit: number;
  localDrayageProfit: number;
  loads: number;
  margin: number;
  driverPay: number;
  expenses: number;
}

export interface DriverMetric {
  driver: string;
  revenue: number;
  profit: number;
  loads: number;
  margin: number;
  totalPay: number;
}
