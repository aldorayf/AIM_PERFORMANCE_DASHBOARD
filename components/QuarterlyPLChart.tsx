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
import type { QuarterlyPLMetric } from '@/lib/plParser';

interface QuarterlyPLChartProps {
  data: QuarterlyPLMetric[];
}

export default function QuarterlyPLChart({ data }: QuarterlyPLChartProps) {
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
        Quarterly P&L Comparison - Total Revenue vs Total Expenses
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="period"
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
            dataKey="totalRevenue"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Total Revenue"
          />
          <Area
            type="monotone"
            dataKey="totalExpenses"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorExpenses)"
            name="Total Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
