import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Calendar,
  Users,
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import ChartCard from './ChartCard';

const Analytics: React.FC = () => {
  const [wasteData, setWasteData] = useState<any>(null);
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Simulate analytics data
      const wasteReductionData = {
        dates: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        }),
        waste_percentage: Array.from({ length: 30 }, () => Math.round(Math.random() * 20 + 5))
      };

      const efficiencyData = {
        delivery_time_reduction: 38.4,
        resource_utilization: 87.2,
        prediction_accuracy: {
          donations: 85.2,
          demand: 82.7,
          spoilage: 78.9
        }
      };

      setWasteData(wasteReductionData);
      setEfficiencyMetrics(efficiencyData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setLoading(false);
    }
  };

  const wasteReductionChart = wasteData ? {
    labels: wasteData.dates.map((date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Food Waste %',
      data: wasteData.waste_percentage,
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true
    }]
  } : null;

  const predictionAccuracyChart = efficiencyMetrics ? {
    labels: ['Donation Prediction', 'Demand Forecasting', 'Spoilage Detection'],
    datasets: [{
      label: 'Accuracy %',
      data: [
        efficiencyMetrics.prediction_accuracy.donations,
        efficiencyMetrics.prediction_accuracy.demand,
        efficiencyMetrics.prediction_accuracy.spoilage
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
      borderWidth: 0
    }]
  } : null;

  const monthlyImpactChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Food Saved (kg)',
        data: [1200, 1400, 1350, 1600, 1750, 1850],
        backgroundColor: '#10B981',
      },
      {
        label: 'Food Distributed (kg)',
        data: [2800, 3200, 3100, 3600, 3900, 4100],
        backgroundColor: '#3B82F6',
      }
    ]
  };

  const costSavingsChart = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Cost Savings ($)',
      data: [15000, 22000, 28000, 35000],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Comprehensive performance metrics and impact analysis</p>
        </div>
        <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg">
          <BarChart3 className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">Advanced Analytics</span>
        </div>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Food Waste Reduction</p>
              <p className="text-3xl font-bold text-green-600">23.7%</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">vs last quarter</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivery Efficiency</p>
              <p className="text-3xl font-bold text-blue-600">{efficiencyMetrics?.delivery_time_reduction}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600 ml-1">improvement</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resource Utilization</p>
              <p className="text-3xl font-bold text-purple-600">{efficiencyMetrics?.resource_utilization}%</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600 ml-1">optimization</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-3xl font-bold text-orange-600">$47K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600 ml-1">this quarter</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {wasteReductionChart && (
          <ChartCard
            title="Food Waste Reduction Trend"
            subtitle="Daily waste percentage over the last 30 days"
            data={wasteReductionChart}
            type="line"
          />
        )}
        
        {predictionAccuracyChart && (
          <ChartCard
            title="ML Model Performance"
            subtitle="Prediction accuracy by model type"
            data={predictionAccuracyChart}
            type="doughnut"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Impact Analysis"
          subtitle="Food saved vs distributed over time"
          data={monthlyImpactChart}
          type="bar"
        />
        
        <ChartCard
          title="Quarterly Cost Savings"
          subtitle="Financial impact of optimization"
          data={costSavingsChart}
          type="line"
        />
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Food Distribution Efficiency</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Inventory Turnover</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Route Optimization</span>
                <span className="font-medium">91%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Volunteer Utilization</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Optimal Performance</p>
                  <p className="text-xs text-green-700">Food distribution efficiency exceeds target by 14%</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Route Optimization Success</p>
                  <p className="text-xs text-blue-700">Average delivery time reduced by 38 minutes per route</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Improvement Opportunity</p>
                  <p className="text-xs text-yellow-700">Volunteer scheduling can be optimized during peak hours</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Users className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Community Impact</p>
                  <p className="text-xs text-purple-700">Serving 15% more families with same resource allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return on Investment Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$125K</div>
            <div className="text-sm text-gray-600">Annual Savings</div>
            <div className="text-xs text-green-600 mt-1">↑ 34% from last year</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">8.5x</div>
            <div className="text-sm text-gray-600">ROI Multiplier</div>
            <div className="text-xs text-blue-600 mt-1">Exceeded projections</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">18 mo</div>
            <div className="text-sm text-gray-600">Payback Period</div>
            <div className="text-xs text-purple-600 mt-1">6 months ahead of plan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;