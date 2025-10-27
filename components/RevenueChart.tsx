'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MonthlyMetric } from '@/lib/types';

interface RevenueChartProps {
  data: MonthlyMetric[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-[#1a2332] rounded-lg p-6 border border-[#2d3748]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Monthly Revenue & Profit Trends (OTR vs Local Drayage)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOTRRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLocalRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOTRProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLocalProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDriverPay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2332',
              border: '1px solid #2d3748',
              borderRadius: '8px',
              color: '#e4e6eb',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="otrRevenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorOTRRevenue)"
            name="OTR Revenue"
          />
          <Area
            type="monotone"
            dataKey="localDrayageRevenue"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#colorLocalRevenue)"
            name="Local Drayage Revenue"
          />
          <Area
            type="monotone"
            dataKey="otrProfit"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorOTRProfit)"
            name="OTR Profit"
          />
          <Area
            type="monotone"
            dataKey="localDrayageProfit"
            stroke="#34d399"
            fillOpacity={1}
            fill="url(#colorLocalProfit)"
            name="Local Drayage Profit"
          />
          <Area
            type="monotone"
            dataKey="driverPay"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorDriverPay)"
            name="Driver Pay"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
