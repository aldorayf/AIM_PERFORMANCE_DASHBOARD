'use client';

import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import DataTable from '@/components/DataTable';
import RevenueChart from '@/components/RevenueChart';
import ServiceTypeChart from '@/components/ServiceTypeChart';
import type { DashboardMetrics } from '@/lib/types';
import {
  parseProfitabilityData,
  parseOTRData,
  calculateDashboardMetrics,
} from '@/lib/dataProcessor';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'financial' | 'operations' | 'customers'>('financial');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load CSV files
        const [profitabilityResponse, otrResponse] = await Promise.all([
          fetch('/2025-10-27T20_17_37.128Z-profitability.csv'),
          fetch('/AIM TRUCK OTR  - COMPLETED RUNS.csv'),
        ]);

        if (!profitabilityResponse.ok || !otrResponse.ok) {
          throw new Error('Failed to load data files');
        }

        const profitabilityText = await profitabilityResponse.text();
        const otrText = await otrResponse.text();

        // Parse data
        const otrLoadIds = await parseOTRData(otrText);
        const records = await parseProfitabilityData(profitabilityText, otrLoadIds);

        // Calculate metrics
        const dashboardMetrics = calculateDashboardMetrics(records);
        setMetrics(dashboardMetrics);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error Loading Data</div>
          <p className="text-gray-400">{error || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <header className="bg-[#1a2332] border-b border-[#2d3748] sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">AIM Trucking Services Performance Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Performance Overview: Nov 1, 2024 - Oct 31, 2025
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle={`${metrics.totalLoads} total loads`}
          />
          <MetricCard
            title="Gross Profit"
            value={formatCurrency(metrics.totalProfit)}
            subtitle={`${formatPercent(metrics.averageMargin)} avg margin`}
          />
          <MetricCard
            title="Average Revenue per Load"
            value={formatCurrency(metrics.averageRevenuePerLoad)}
            subtitle="Per load average"
          />
          <MetricCard
            title="Average Profit per Load"
            value={formatCurrency(metrics.averageProfitPerLoad)}
            subtitle="Per load average"
          />
        </div>

        {/* OTR vs Local Drayage Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">OTR vs Local Drayage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OTR Card */}
            <div className="bg-[#1a2332] rounded-lg p-6 border border-[#2d3748]">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Over the Road (OTR)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Loads:</span>
                  <span className="font-semibold">{metrics.otrMetrics.totalLoads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="font-semibold">{formatCurrency(metrics.otrMetrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit:</span>
                  <span className="font-semibold text-green-400">{formatCurrency(metrics.otrMetrics.totalProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Margin:</span>
                  <span className="font-semibold">{formatPercent(metrics.otrMetrics.averageMargin)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2d3748]">
                  <span className="text-gray-400">% of Total Revenue:</span>
                  <span className="font-semibold">
                    {formatPercent((metrics.otrMetrics.totalRevenue / metrics.totalRevenue) * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Local Drayage Card */}
            <div className="bg-[#1a2332] rounded-lg p-6 border border-[#2d3748]">
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                Local Drayage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Loads:</span>
                  <span className="font-semibold">{metrics.localDrayageMetrics.totalLoads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="font-semibold">{formatCurrency(metrics.localDrayageMetrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit:</span>
                  <span className="font-semibold text-green-400">{formatCurrency(metrics.localDrayageMetrics.totalProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Margin:</span>
                  <span className="font-semibold">{formatPercent(metrics.localDrayageMetrics.averageMargin)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2d3748]">
                  <span className="text-gray-400">% of Total Revenue:</span>
                  <span className="font-semibold">
                    {formatPercent((metrics.localDrayageMetrics.totalRevenue / metrics.totalRevenue) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-[#2d3748]">
            <button
              onClick={() => setActiveTab('financial')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'financial'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Financial
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'operations'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-8">
            <RevenueChart data={metrics.monthlyBreakdown} />
            <ServiceTypeChart data={metrics.serviceTypeBreakdown} />

            <DataTable
              title="Service Type Performance"
              data={metrics.serviceTypeBreakdown}
              columns={[
                { header: 'Service Type', accessor: 'serviceType' },
                {
                  header: 'Revenue',
                  accessor: (row) => formatCurrency(row.revenue),
                  className: 'font-semibold'
                },
                {
                  header: 'Profit',
                  accessor: (row) => formatCurrency(row.profit),
                  className: 'text-green-400 font-semibold'
                },
                {
                  header: 'Loads',
                  accessor: 'loads',
                  className: 'text-gray-300'
                },
                {
                  header: 'Margin',
                  accessor: (row) => formatPercent(row.margin),
                  className: 'font-semibold'
                },
              ]}
              maxRows={10}
            />

            <DataTable
              title="Monthly Performance"
              data={metrics.monthlyBreakdown}
              columns={[
                { header: 'Month', accessor: 'month' },
                {
                  header: 'Revenue',
                  accessor: (row) => formatCurrency(row.revenue),
                  className: 'font-semibold'
                },
                {
                  header: 'Profit',
                  accessor: (row) => formatCurrency(row.profit),
                  className: 'text-green-400 font-semibold'
                },
                {
                  header: 'Driver Pay',
                  accessor: (row) => formatCurrency(row.driverPay),
                  className: 'text-yellow-400'
                },
                {
                  header: 'Loads',
                  accessor: 'loads',
                  className: 'text-gray-300'
                },
                {
                  header: 'Margin',
                  accessor: (row) => formatPercent(row.margin),
                  className: 'font-semibold'
                },
              ]}
            />
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === 'operations' && (
          <div className="space-y-8">
            <DataTable
              title="Driver Performance"
              data={metrics.driverPerformance}
              columns={[
                { header: 'Driver', accessor: 'driver' },
                {
                  header: 'Revenue',
                  accessor: (row) => formatCurrency(row.revenue),
                  className: 'font-semibold'
                },
                {
                  header: 'Profit',
                  accessor: (row) => formatCurrency(row.profit),
                  className: 'text-green-400 font-semibold'
                },
                {
                  header: 'Total Pay',
                  accessor: (row) => formatCurrency(row.totalPay),
                  className: 'text-yellow-400'
                },
                {
                  header: 'Loads',
                  accessor: 'loads',
                  className: 'text-gray-300'
                },
                {
                  header: 'Margin',
                  accessor: (row) => formatPercent(row.margin),
                  className: 'font-semibold'
                },
              ]}
              maxRows={15}
            />
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
            <DataTable
              title="Customer Performance"
              data={metrics.customerBreakdown}
              columns={[
                { header: 'Customer', accessor: 'customer' },
                {
                  header: 'Revenue',
                  accessor: (row) => formatCurrency(row.revenue),
                  className: 'font-semibold'
                },
                {
                  header: 'Profit',
                  accessor: (row) => formatCurrency(row.profit),
                  className: 'text-green-400 font-semibold'
                },
                {
                  header: 'Loads',
                  accessor: 'loads',
                  className: 'text-gray-300'
                },
                {
                  header: 'Margin',
                  accessor: (row) => formatPercent(row.margin),
                  className: 'font-semibold'
                },
              ]}
              maxRows={15}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2332] border-t border-[#2d3748] mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-4 text-center text-sm text-gray-400">
          <p>© 2025 AIM Trucking Services, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
