import Papa from 'papaparse';
import { format, parse } from 'date-fns';
import type {
  ProfitabilityRecord,
  OTRRecord,
  DashboardMetrics,
  ServiceTypeMetric,
  CustomerMetric,
  MonthlyMetric,
  DriverMetric,
} from './types';

// Pass-through charges that should be excluded from profitability analysis
const PASSTHROUGH_CHARGES = ['transload', 'Unloading', 'unloading'];

export function parseCurrency(value: string): number {
  if (!value || value === '0') return 0;
  const cleaned = value.replace(/[$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function parsePercentage(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/%/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function extractLoadId(loadNumber: string): string {
  // Extract the suffix from load number (e.g., "AIM_M103161" -> "M103161")
  const match = loadNumber.match(/AIM_([A-Z]\d+)/);
  return match ? match[1] : '';
}

export async function parseOTRData(csvContent: string): Promise<Set<string>> {
  return new Promise((resolve, reject) => {
    const otrLoadIds = new Set<string>();

    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          const aimRef = row['AIM REFENCE NUMBER ']?.trim();
          if (aimRef) {
            otrLoadIds.add(aimRef);
          }
        });
        resolve(otrLoadIds);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export async function parseProfitabilityData(
  csvContent: string,
  otrLoadIds: Set<string>
): Promise<ProfitabilityRecord[]> {
  return new Promise((resolve, reject) => {
    const records: ProfitabilityRecord[] = [];

    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          const loadNumber = row['Load #']?.trim();
          if (!loadNumber) return;

          const loadId = extractLoadId(loadNumber);
          const isOTR = otrLoadIds.has(loadId);

          const chargesType = row['Charges Type']
            ?.split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c) || [];

          records.push({
            loadNumber,
            containerNumber: row['Container #']?.trim() || '',
            customer: row['Customer']?.trim() || '',
            date: row['Date']?.trim() || '',
            driver: row['Driver']?.trim() || '',
            chargesType,
            totalCharges: parseCurrency(row['Total Charges'] || '0'),
            driverPayTotal: parseCurrency(row['Driver Pay Total'] || '0'),
            expenseTotal: parseCurrency(row['Expense Total'] || '0'),
            profit: parseCurrency(row['Profit'] || '0'),
            profitMargin: parsePercentage(row['Profit Margin'] || '0'),
            isOTR,
          });
        });
        resolve(records);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function calculateDashboardMetrics(
  records: ProfitabilityRecord[]
): DashboardMetrics {
  // Filter out pass-through charges from profitability calculations
  const profitableRecords = records.filter(record => {
    // Keep the record if it has at least one non-passthrough charge
    const hasProfitableCharge = record.chargesType.some(
      charge => !PASSTHROUGH_CHARGES.includes(charge)
    );
    return hasProfitableCharge || record.chargesType.length === 0;
  });

  const totalRevenue = records.reduce((sum, r) => sum + r.totalCharges, 0);
  const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);
  const totalDriverPay = records.reduce((sum, r) => sum + r.driverPayTotal, 0);
  const totalExpenses = records.reduce((sum, r) => sum + r.expenseTotal, 0);
  const totalLoads = records.length;

  // OTR Metrics
  const otrRecords = records.filter(r => r.isOTR);
  const otrRevenue = otrRecords.reduce((sum, r) => sum + r.totalCharges, 0);
  const otrProfit = otrRecords.reduce((sum, r) => sum + r.profit, 0);

  // Local Drayage Metrics
  const localRecords = records.filter(r => !r.isOTR);
  const localRevenue = localRecords.reduce((sum, r) => sum + r.totalCharges, 0);
  const localProfit = localRecords.reduce((sum, r) => sum + r.profit, 0);

  // Service Type Breakdown
  const serviceMap = new Map<string, ServiceTypeMetric>();
  profitableRecords.forEach(record => {
    record.chargesType.forEach(service => {
      if (PASSTHROUGH_CHARGES.includes(service)) return;

      if (!serviceMap.has(service)) {
        serviceMap.set(service, {
          serviceType: service,
          revenue: 0,
          profit: 0,
          loads: 0,
          margin: 0,
        });
      }
      const metric = serviceMap.get(service)!;
      metric.revenue += record.totalCharges / record.chargesType.length;
      metric.profit += record.profit / record.chargesType.length;
      metric.loads += 1;
    });
  });

  serviceMap.forEach(metric => {
    metric.margin = metric.revenue > 0 ? (metric.profit / metric.revenue) * 100 : 0;
  });

  // Customer Breakdown
  const customerMap = new Map<string, CustomerMetric>();
  records.forEach(record => {
    if (!customerMap.has(record.customer)) {
      customerMap.set(record.customer, {
        customer: record.customer,
        revenue: 0,
        profit: 0,
        loads: 0,
        margin: 0,
      });
    }
    const metric = customerMap.get(record.customer)!;
    metric.revenue += record.totalCharges;
    metric.profit += record.profit;
    metric.loads += 1;
  });

  customerMap.forEach(metric => {
    metric.margin = metric.revenue > 0 ? (metric.profit / metric.revenue) * 100 : 0;
  });

  // Monthly Breakdown
  const monthMap = new Map<string, MonthlyMetric>();
  records.forEach(record => {
    try {
      const date = parse(record.date, 'M/d/yy', new Date());
      const monthKey = format(date, 'MMM yyyy');

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthKey,
          revenue: 0,
          profit: 0,
          loads: 0,
          margin: 0,
          driverPay: 0,
          expenses: 0,
        });
      }
      const metric = monthMap.get(monthKey)!;
      metric.revenue += record.totalCharges;
      metric.profit += record.profit;
      metric.loads += 1;
      metric.driverPay += record.driverPayTotal;
      metric.expenses += record.expenseTotal;
    } catch (e) {
      console.error('Error parsing date:', record.date, e);
    }
  });

  monthMap.forEach(metric => {
    metric.margin = metric.revenue > 0 ? (metric.profit / metric.revenue) * 100 : 0;
  });

  // Driver Performance
  const driverMap = new Map<string, DriverMetric>();
  records.forEach(record => {
    if (!record.driver) return;

    if (!driverMap.has(record.driver)) {
      driverMap.set(record.driver, {
        driver: record.driver,
        revenue: 0,
        profit: 0,
        loads: 0,
        margin: 0,
        totalPay: 0,
      });
    }
    const metric = driverMap.get(record.driver)!;
    metric.revenue += record.totalCharges;
    metric.profit += record.profit;
    metric.loads += 1;
    metric.totalPay += record.driverPayTotal;
  });

  driverMap.forEach(metric => {
    metric.margin = metric.revenue > 0 ? (metric.profit / metric.revenue) * 100 : 0;
  });

  return {
    totalRevenue,
    totalProfit,
    totalLoads,
    averageRevenuePerLoad: totalLoads > 0 ? totalRevenue / totalLoads : 0,
    averageProfitPerLoad: totalLoads > 0 ? totalProfit / totalLoads : 0,
    averageMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    totalDriverPay,
    totalExpenses,
    otrMetrics: {
      totalRevenue: otrRevenue,
      totalProfit: otrProfit,
      totalLoads: otrRecords.length,
      averageMargin: otrRevenue > 0 ? (otrProfit / otrRevenue) * 100 : 0,
    },
    localDrayageMetrics: {
      totalRevenue: localRevenue,
      totalProfit: localProfit,
      totalLoads: localRecords.length,
      averageMargin: localRevenue > 0 ? (localProfit / localRevenue) * 100 : 0,
    },
    serviceTypeBreakdown: Array.from(serviceMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    ),
    customerBreakdown: Array.from(customerMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    ),
    monthlyBreakdown: Array.from(monthMap.values()).sort((a, b) => {
      try {
        const dateA = parse(a.month, 'MMM yyyy', new Date());
        const dateB = parse(b.month, 'MMM yyyy', new Date());
        return dateA.getTime() - dateB.getTime();
      } catch {
        return 0;
      }
    }),
    driverPerformance: Array.from(driverMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    ),
  };
}
