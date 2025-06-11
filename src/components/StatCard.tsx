import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  description
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      lightBg: 'bg-green-50'
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      lightBg: 'bg-red-50'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colors.lightBg}`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;