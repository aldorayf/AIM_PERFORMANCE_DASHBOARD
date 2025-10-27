import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  trend = 'neutral',
}: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  const formatChange = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  return (
    <div className="bg-[#1a2332] rounded-lg p-6 border border-[#2d3748] hover:border-[#3d4758] transition-colors">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
        </div>
        {(subtitle || change !== undefined) && (
          <div className="mt-2 flex flex-col gap-1">
            {subtitle && (
              <span className="text-sm text-gray-400">{subtitle}</span>
            )}
            {change !== undefined && (
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${getTrendColor()}`}>
                  {formatChange(change)}
                </span>
                {changeLabel && (
                  <span className="text-xs text-gray-500">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
