import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Wifi,
  Battery
} from 'lucide-react';

interface SensorReading {
  sensor_id: string;
  temperature: number;
  humidity: number;
  weight: number;
  timestamp: string;
  location: string;
  food_quality: string;
}

const SensorMonitoring: React.FC = () => {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSensorData = async () => {
    try {
      // Simulate real-time sensor data
      const mockSensors: SensorReading[] = Array.from({ length: 6 }, (_, i) => ({
        sensor_id: `ESP32_${i + 1}`,
        temperature: Math.round((Math.random() * 6 + 2) * 10) / 10,
        humidity: Math.round((Math.random() * 20 + 40) * 10) / 10,
        weight: Math.round((Math.random() * 90 + 10) * 10) / 10,
        timestamp: new Date().toISOString(),
        location: ['Storage A', 'Storage B', 'Storage C', 'Refrigerator 1', 'Refrigerator 2', 'Freezer 1'][i],
        food_quality: ['Fresh', 'Good', 'Warning', 'Critical'][Math.floor(Math.random() * 4)]
      }));
      
      setSensors(mockSensors);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setLoading(false);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'fresh': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp <= 4) return { status: 'optimal', color: 'text-green-600', icon: CheckCircle };
    if (temp <= 7) return { status: 'acceptable', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600', icon: AlertTriangle };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 45 && humidity <= 65) return { status: 'optimal', color: 'text-green-600' };
    if (humidity >= 35 && humidity <= 75) return { status: 'acceptable', color: 'text-yellow-600' };
    return { status: 'critical', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading sensor data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IoT Sensor Monitoring</h2>
          <p className="text-gray-600">Real-time environmental and inventory monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg">
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">All sensors online</span>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => {
          const tempStatus = getTemperatureStatus(sensor.temperature);
          const humidityStatus = getHumidityStatus(sensor.humidity);
          const TempIcon = tempStatus.icon;
          
          return (
            <div key={sensor.sensor_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Sensor Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-900">{sensor.sensor_id}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <Battery className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">98%</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{sensor.location}</span>
              </div>

              {/* Sensor Readings */}
              <div className="space-y-4">
                {/* Temperature */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {sensor.temperature}°C
                    </span>
                    <TempIcon className={`h-4 w-4 ${tempStatus.color}`} />
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-600">Humidity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {sensor.humidity}%
                    </span>
                    <div className={`h-2 w-2 rounded-full ${humidityStatus.color.replace('text-', 'bg-')}`}></div>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Weight</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {sensor.weight} kg
                  </span>
                </div>
              </div>

              {/* Food Quality Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Food Quality</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(sensor.food_quality)}`}>
                    {sensor.food_quality}
                  </span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Storage Capacity</span>
                    <span>{Math.round((sensor.weight / 100) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((sensor.weight / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Optimal Conditions</p>
              <p className="text-lg font-semibold text-gray-900">
                {sensors.filter(s => getTemperatureStatus(s.temperature).status === 'optimal').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Needs Attention</p>
              <p className="text-lg font-semibold text-gray-900">
                {sensors.filter(s => getTemperatureStatus(s.temperature).status === 'acceptable').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-lg font-semibold text-gray-900">
                {sensors.filter(s => getTemperatureStatus(s.temperature).status === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Weight className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Inventory</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(sensors.reduce((sum, s) => sum + s.weight, 0))} kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorMonitoring;