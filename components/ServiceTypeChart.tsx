'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import type { ServiceTypeMetric } from '@/lib/types';

interface ServiceTypeChartProps {
  data: ServiceTypeMetric[];
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export default function ServiceTypeChart({ data }: ServiceTypeChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Take top 8 services
  const topServices = data.slice(0, 8);

  return (
    <div className="bg-[#1a2332] rounded-lg p-6 border border-[#2d3748]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Revenue by Service Type
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topServices}
          margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="serviceType"
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={100}
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
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <Bar dataKey="revenue" name="Revenue" radius={[8, 8, 0, 0]}>
            {topServices.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
