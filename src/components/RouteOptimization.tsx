import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Route,
  Navigation,
  Zap,
  CheckCircle,
  ArrowRight,
  Package,
  Target
} from 'lucide-react';

interface OptimizedRoute {
  type: string;
  from?: string;
  to?: string;
  route?: string[];
  distance: number;
  estimated_time: number;
  priority: string;
  vehicle_type: string;
  efficiency_gain?: number;
  stops?: number;
}

const RouteOptimization: React.FC = () => {
  const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizationStats, setOptimizationStats] = useState({
    totalRoutes: 0,
    totalDistance: 0,
    totalTime: 0,
    fuelSaved: 0,
    efficiencyGain: 0
  });

  useEffect(() => {
    fetchOptimizedRoutes();
    const interval = setInterval(fetchOptimizedRoutes, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchOptimizedRoutes = async () => {
    try {
      // Simulate optimized route data
      const mockRoutes: OptimizedRoute[] = [
        {
          type: 'collection',
          from: 'Donor A - Supermarket Chain',
          to: 'Central Hub',
          distance: 12.5,
          estimated_time: 35,
          priority: 'high',
          vehicle_type: 'collection_van'
        },
        {
          type: 'distribution',
          from: 'Central Hub',
          to: 'NGO #12 - Community Center',
          distance: 8.3,
          estimated_time: 25,
          priority: 'high',
          vehicle_type: 'delivery_truck'
        },
        {
          type: 'distribution',
          from: 'Central Hub',
          to: 'NGO #8 - Food Pantry',
          distance: 15.2,
          estimated_time: 42,
          priority: 'medium',
          vehicle_type: 'delivery_truck'
        },
        {
          type: 'multi_delivery',
          route: ['Central Hub', 'NGO #15', 'NGO #22', 'NGO #7', 'Central Hub'],
          distance: 28.7,
          estimated_time: 85,
          priority: 'medium',
          vehicle_type: 'large_truck',
          efficiency_gain: 18.5,
          stops: 3
        },
        {
          type: 'collection',
          from: 'Donor B - Restaurant Chain',
          to: 'Storage Unit A',
          distance: 6.8,
          estimated_time: 20,
          priority: 'medium',
          vehicle_type: 'collection_van'
        }
      ];

      setRoutes(mockRoutes);
      
      // Calculate optimization stats
      const totalDistance = mockRoutes.reduce((sum, route) => sum + route.distance, 0);
      const totalTime = mockRoutes.reduce((sum, route) => sum + route.estimated_time, 0);
      
      setOptimizationStats({
        totalRoutes: mockRoutes.length,
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: Math.round(totalTime),
        fuelSaved: Math.round(totalDistance * 0.15 * 10) / 10, // Estimated fuel savings
        efficiencyGain: 32.4
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch optimized routes:', error);
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'large_truck': return '🚛';
      case 'delivery_truck': return '🚚';
      case 'collection_van': return '🚐';
      default: return '🚗';
    }
  };

  const getRouteTypeColor = (type: string) => {
    switch (type) {
      case 'collection': return 'bg-blue-500';
      case 'distribution': return 'bg-green-500';
      case 'multi_delivery': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Optimizing routes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Route Optimization</h2>
          <p className="text-gray-600">AI-powered logistics optimization using graph algorithms</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Route className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Dijkstra's Algorithm</span>
        </div>
      </div>

      {/* Optimization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Route className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Routes</p>
              <p className="text-lg font-semibold text-gray-900">{optimizationStats.totalRoutes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-lg font-semibold text-gray-900">{optimizationStats.totalDistance} km</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-lg font-semibold text-gray-900">{Math.floor(optimizationStats.totalTime / 60)}h {optimizationStats.totalTime % 60}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Fuel Saved</p>
              <p className="text-lg font-semibold text-gray-900">{optimizationStats.fuelSaved}L</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Efficiency Gain</p>
              <p className="text-lg font-semibold text-gray-900">{optimizationStats.efficiencyGain}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Routes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Optimized Delivery Routes</h3>
          <p className="text-sm text-gray-600 mt-1">Routes calculated using shortest path algorithms</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {routes.map((route, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Route Type Badge */}
                <div className={`flex-shrink-0 w-3 h-3 rounded-full ${getRouteTypeColor(route.type)} mt-2`}></div>
                
                <div className="flex-1">
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {route.type.replace('_', ' ')} Route #{index + 1}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(route.priority)}`}>
                        {route.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>{getVehicleIcon(route.vehicle_type)}</span>
                        <span className="capitalize">{route.vehicle_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  {route.type === 'multi_delivery' ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>Multi-stop delivery with {route.stops} destinations</span>
                      </div>
                      <div className="flex flex-wrap items-center space-x-2">
                        {route.route?.map((stop, i) => (
                          <React.Fragment key={i}>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                              {stop}
                            </span>
                            {i < route.route!.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      {route.efficiency_gain && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Efficiency gain: {route.efficiency_gain}% vs individual routes</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{route.from}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{route.to}</span>
                      </div>
                    </div>
                  )}

                  {/* Route Metrics */}
                  <div className="flex items-center space-x-6 mt-3 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Navigation className="h-4 w-4" />
                      <span>{route.distance} km</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{route.estimated_time} min</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <Navigation className="h-4 w-4" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Algorithms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Dijkstra's Algorithm</span>
            </div>
            <p className="text-sm text-blue-700">
              Finds shortest paths between all locations, minimizing travel distance and time.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">TSP Approximation</span>
            </div>
            <p className="text-sm text-green-700">
              Traveling Salesman Problem heuristics for multi-stop delivery optimization.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Knapsack Optimization</span>
            </div>
            <p className="text-sm text-purple-700">
              Optimizes vehicle loading to maximize value within capacity constraints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;