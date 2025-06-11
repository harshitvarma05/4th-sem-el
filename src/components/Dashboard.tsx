import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Package,
  UserCheck,
  TrendingDown,
  Zap
} from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';

interface DashboardStats {
  total_donations: number;
  total_distributed: number;
  active_ngos: number;
  volunteers: number;
  waste_reduction: number;
  efficiency_improvement: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        total_donations: 1847,
        total_distributed: 1623,
        active_ngos: 28,
        volunteers: 52,
        waste_reduction: 23.7,
        efficiency_improvement: 38.4
      };
      
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const donationTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Donations (kg)',
      data: [1200, 1400, 1100, 1600, 1800, 1847],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const distributionData = {
    labels: ['Food Distributed', 'Food Wasted', 'In Storage'],
    datasets: [{
      data: [1623, 124, 100],
      backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
      borderWidth: 0
    }]
  };

  const efficiencyMetrics = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Efficiency %',
      data: [85, 88, 92, 89, 94, 91, 96],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Real-time insights into food bank operations</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Live Data</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donations"
          value={stats?.total_donations.toLocaleString() || '0'}
          unit="kg"
          icon={Heart}
          color="green"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Food Distributed"
          value={stats?.total_distributed.toLocaleString() || '0'}
          unit="kg"
          icon={Package}
          color="blue"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Active NGOs"
          value={stats?.active_ngos.toString() || '0'}
          icon={Users}
          color="purple"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Volunteers"
          value={stats?.volunteers.toString() || '0'}
          icon={UserCheck}
          color="orange"
          trend={{ value: 3.1, isPositive: true }}
        />
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Waste Reduction"
          value={stats?.waste_reduction.toString() || '0'}
          unit="%"
          icon={TrendingDown}
          color="green"
          description="Reduction in food spoilage through AI monitoring"
          trend={{ value: 4.2, isPositive: true }}
        />
        <StatCard
          title="Efficiency Improvement"
          value={stats?.efficiency_improvement.toString() || '0'}
          unit="%"
          icon={TrendingUp}
          color="blue"
          description="Improvement in delivery times and resource allocation"
          trend={{ value: 6.8, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Donation Trends"
          subtitle="Monthly donation volumes"
          data={donationTrend}
          type="line"
        />
        <ChartCard
          title="Distribution Breakdown"
          subtitle="Food allocation overview"
          data={distributionData}
          type="doughnut"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Weekly Efficiency Metrics"
          subtitle="Operational efficiency tracking"
          data={efficiencyMetrics}
          type="line"
        />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Successful delivery to NGO #12</p>
              <p className="text-xs text-green-600">150kg of fresh produce delivered - 2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Temperature alert in Storage Unit B</p>
              <p className="text-xs text-yellow-600">Temperature elevated to 6°C - requires attention</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Truck className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Route optimization completed</p>
              <p className="text-xs text-blue-600">3 delivery routes optimized, saving 45 minutes total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;