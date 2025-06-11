import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Truck, 
  Thermometer, 
  Droplets, 
  Weight, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SensorMonitoring from './components/SensorMonitoring';
import MLPredictions from './components/MLPredictions';
import RouteOptimization from './components/RouteOptimization';
import Analytics from './components/Analytics';

type TabType = 'dashboard' | 'sensors' | 'predictions' | 'routes' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection to backend
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sensors', label: 'IoT Monitoring', icon: Activity },
    { id: 'predictions', label: 'ML Predictions', icon: TrendingUp },
    { id: 'routes', label: 'Route Optimization', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: PieChart }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sensors':
        return <SensorMonitoring />;
      case 'predictions':
        return <MLPredictions />;
      case 'routes':
        return <RouteOptimization />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartCare</h1>
                <p className="text-sm text-gray-500">Food Bank Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;