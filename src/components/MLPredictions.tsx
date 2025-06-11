import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import ChartCard from './ChartCard';

interface PredictionData {
  date: string;
  predicted_amount?: number;
  predicted_demand?: number;
  confidence: number;
}

const MLPredictions: React.FC = () => {
  const [donationPredictions, setDonationPredictions] = useState<PredictionData[]>([]);
  const [demandPredictions, setDemandPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModel, setActiveModel] = useState<'donations' | 'demand' | 'spoilage'>('donations');

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      // Simulate ML prediction data
      const donationData: PredictionData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          predicted_amount: Math.round((Math.random() * 40 + 60) * 10) / 10,
          confidence: Math.round((Math.random() * 0.2 + 0.75) * 100) / 100
        };
      });

      const demandData: PredictionData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          predicted_demand: Math.round((Math.random() * 30 + 50) * 10) / 10,
          confidence: Math.round((Math.random() * 0.2 + 0.70) * 100) / 100
        };
      });

      setDonationPredictions(donationData);
      setDemandPredictions(demandData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setLoading(false);
    }
  };

  const donationChartData = {
    labels: donationPredictions.map(p => new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Predicted Donations (kg)',
      data: donationPredictions.map(p => p.predicted_amount),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const demandChartData = {
    labels: demandPredictions.map(p => new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Predicted Demand (kg)',
      data: demandPredictions.map(p => p.predicted_demand),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const modelAccuracy = {
    labels: ['Donation Prediction', 'Demand Forecasting', 'Spoilage Detection'],
    datasets: [{
      label: 'Accuracy %',
      data: [85.2, 82.7, 78.9],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
      borderWidth: 0
    }]
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-600 bg-green-50';
    if (confidence >= 0.75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.85) return CheckCircle;
    if (confidence >= 0.75) return AlertCircle;
    return AlertCircle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading ML predictions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Machine Learning Predictions</h2>
          <p className="text-gray-600">AI-powered forecasting for optimal food bank operations</p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
          <Brain className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">AI Models Active</span>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4">
          {[
            { id: 'donations', label: 'Donation Prediction', icon: TrendingUp },
            { id: 'demand', label: 'Demand Forecasting', icon: Target },
            { id: 'spoilage', label: 'Spoilage Detection', icon: AlertCircle }
          ].map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeModel === model.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{model.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prediction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Donation Predictions"
          subtitle="7-day donation volume forecast"
          data={donationChartData}
          type="line"
        />
        <ChartCard
          title="Demand Forecasting"
          subtitle="Predicted food distribution needs"
          data={demandChartData}
          type="line"
        />
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Model Accuracy"
          subtitle="Performance metrics for ML models"
          data={modelAccuracy}
          type="doughnut"
          height={250}
        />
        
        {/* Prediction Summary */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Predictions Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donations */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Donation Predictions</span>
              </h4>
              {donationPredictions.slice(0, 4).map((pred, index) => {
                const ConfidenceIcon = getConfidenceIcon(pred.confidence);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(pred.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{pred.predicted_amount} kg</span>
                      <ConfidenceIcon className={`h-4 w-4 ${getConfidenceColor(pred.confidence).split(' ')[0]}`} />
                      <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(pred.confidence)}`}>
                        {Math.round(pred.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Demand */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Demand Forecasts</span>
              </h4>
              {demandPredictions.slice(0, 4).map((pred, index) => {
                const ConfidenceIcon = getConfidenceIcon(pred.confidence);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(pred.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{pred.predicted_demand} kg</span>
                      <ConfidenceIcon className={`h-4 w-4 ${getConfidenceColor(pred.confidence).split(' ')[0]}`} />
                      <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(pred.confidence)}`}>
                        {Math.round(pred.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>AI Insights & Recommendations</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Donation Trend</span>
            </div>
            <p className="text-sm text-green-700">
              Donations expected to increase by 15% this week due to holiday season approaching.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Demand Pattern</span>
            </div>
            <p className="text-sm text-blue-700">
              Higher demand predicted for weekends. Consider adjusting distribution schedules.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Optimization</span>
            </div>
            <p className="text-sm text-yellow-700">
              Inventory levels may exceed capacity on Thursday. Plan additional distributions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPredictions;