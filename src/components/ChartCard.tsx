import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: any;
  type: 'line' | 'doughnut' | 'bar';
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  type,
  height = 300
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        beginAtZero: true,
      },
    } : undefined,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartCard;