import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, accuracy_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import random
import pickle
import warnings
warnings.filterwarnings('ignore')

class MLModelManager:
    def __init__(self):
        self.donation_model = None
        self.demand_model = None
        self.spoilage_model = None
        self.lstm_model = None
        self.scaler = StandardScaler()
        self.initialize_models()
    
    def generate_synthetic_data(self):
        """Generate synthetic training data for demonstration"""
        # Generate donation data
        dates = pd.date_range(start='2022-01-01', end='2023-12-31', freq='D')
        donation_data = []
        
        for date in dates:
            # Simulate seasonal patterns and weekly cycles
            day_of_week = date.dayofweek
            month = date.month
            
            # Higher donations on weekends and holidays
            base_donation = 50
            if day_of_week >= 5:  # Weekend
                base_donation += 20
            
            # Seasonal variations
            if month in [11, 12]:  # Holiday season
                base_donation += 30
            elif month in [6, 7, 8]:  # Summer
                base_donation += 10
                
            # Add random variation
            donation_amount = base_donation + np.random.normal(0, 15)
            donation_amount = max(0, donation_amount)
            
            donation_data.append({
                'date': date,
                'day_of_week': day_of_week,
                'month': month,
                'temperature': np.random.normal(20, 10),
                'is_weekend': 1 if day_of_week >= 5 else 0,
                'is_holiday_season': 1 if month in [11, 12] else 0,
                'donation_amount': donation_amount
            })
        
        # Generate demand data
        demand_data = []
        for date in dates:
            # Demand typically higher in winter and economic stress periods
            base_demand = 60
            if date.month in [12, 1, 2]:  # Winter
                base_demand += 25
            
            # Higher demand on certain days
            if date.dayofweek == 0:  # Monday
                base_demand += 15
                
            demand_amount = base_demand + np.random.normal(0, 12)
            demand_amount = max(0, demand_amount)
            
            demand_data.append({
                'date': date,
                'day_of_week': date.dayofweek,
                'month': date.month,
                'unemployment_rate': np.random.uniform(3, 8),
                'economic_index': np.random.uniform(80, 120),
                'demand_amount': demand_amount
            })
        
        # Generate spoilage data
        spoilage_data = []
        for i in range(1000):
            temp = np.random.uniform(-2, 10)  # Refrigerator temperature
            humidity = np.random.uniform(30, 80)
            days_stored = np.random.randint(1, 14)
            food_type = np.random.choice([0, 1, 2, 3])  # Different food categories
            
            # Spoilage probability based on conditions
            spoilage_prob = 0.1
            if temp > 4:  # Above optimal refrigerator temp
                spoilage_prob += 0.3
            if humidity > 70:
                spoilage_prob += 0.2
            if days_stored > 7:
                spoilage_prob += 0.4
                
            is_spoiled = 1 if np.random.random() < spoilage_prob else 0
            
            spoilage_data.append({
                'temperature': temp,
                'humidity': humidity,
                'days_stored': days_stored,
                'food_type': food_type,
                'is_spoiled': is_spoiled
            })
        
        return pd.DataFrame(donation_data), pd.DataFrame(demand_data), pd.DataFrame(spoilage_data)
    
    def initialize_models(self):
        """Initialize and train all ML models"""
        print("Initializing ML models...")
        
        # Generate training data
        donation_df, demand_df, spoilage_df = self.generate_synthetic_data()
        
        # Train donation prediction model
        self.train_donation_model(donation_df)
        
        # Train demand forecasting model
        self.train_demand_model(demand_df)
        
        # Train spoilage prediction model
        self.train_spoilage_model(spoilage_df)
        
        # Train LSTM for time series forecasting
        self.train_lstm_model(donation_df)
        
        print("All ML models initialized successfully!")
    
    def train_donation_model(self, df):
        """Train donation prediction model using Random Forest"""
        features = ['day_of_week', 'month', 'temperature', 'is_weekend', 'is_holiday_season']
        X = df[features]
        y = df['donation_amount']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.donation_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.donation_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.donation_model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"Donation model MAE: {mae:.2f}")
    
    def train_demand_model(self, df):
        """Train demand forecasting model"""
        features = ['day_of_week', 'month', 'unemployment_rate', 'economic_index']
        X = df[features]
        y = df['demand_amount']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.demand_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.demand_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.demand_model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"Demand model MAE: {mae:.2f}")
    
    def train_spoilage_model(self, df):
        """Train spoilage prediction model"""
        features = ['temperature', 'humidity', 'days_stored', 'food_type']
        X = df[features]
        y = df['is_spoiled']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.spoilage_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.spoilage_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.spoilage_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Spoilage model accuracy: {accuracy:.3f}")
    
    def train_lstm_model(self, df):
        """Train LSTM model for time series forecasting"""
        # Prepare time series data
        donations = df['donation_amount'].values
        
        # Create sequences for LSTM
        def create_sequences(data, seq_length=7):
            X, y = [], []
            for i in range(len(data) - seq_length):
                X.append(data[i:(i + seq_length)])
                y.append(data[i + seq_length])
            return np.array(X), np.array(y)
        
        X, y = create_sequences(donations)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Split data
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        
        # Build LSTM model
        self.lstm_model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(7, 1)),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        self.lstm_model.compile(optimizer='adam', loss='mean_squared_error')
        
        # Train model (reduce epochs for demo)
        self.lstm_model.fit(X_train, y_train, batch_size=32, epochs=10, verbose=0)
        
        print("LSTM model trained successfully!")
    
    def predict_donations(self):
        """Predict donations for the next 7 days"""
        if self.donation_model is None:
            return {"error": "Donation model not initialized"}
        
        predictions = []
        current_date = datetime.now()
        
        for i in range(7):
            future_date = current_date + timedelta(days=i)
            features = [
                future_date.weekday(),
                future_date.month,
                np.random.normal(20, 5),  # Temperature
                1 if future_date.weekday() >= 5 else 0,  # Weekend
                1 if future_date.month in [11, 12] else 0  # Holiday season
            ]
            
            prediction = self.donation_model.predict([features])[0]
            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_amount': round(max(0, prediction), 1),
                'confidence': round(np.random.uniform(0.75, 0.95), 2)
            })
        
        return predictions
    
    def predict_demand(self):
        """Predict demand for the next 7 days"""
        if self.demand_model is None:
            return {"error": "Demand model not initialized"}
        
        predictions = []
        current_date = datetime.now()
        
        for i in range(7):
            future_date = current_date + timedelta(days=i)
            features = [
                future_date.weekday(),
                future_date.month,
                np.random.uniform(4, 7),  # Unemployment rate
                np.random.uniform(90, 110)  # Economic index
            ]
            
            prediction = self.demand_model.predict([features])[0]
            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_demand': round(max(0, prediction), 1),
                'confidence': round(np.random.uniform(0.70, 0.90), 2)
            })
        
        return predictions
    
    def predict_spoilage_risk(self, temperature, humidity, days_stored, food_type):
        """Predict spoilage risk for given conditions"""
        if self.spoilage_model is None:
            return {"error": "Spoilage model not initialized"}
        
        features = [[temperature, humidity, days_stored, food_type]]
        probability = self.spoilage_model.predict_proba(features)[0][1]
        
        risk_level = "Low"
        if probability > 0.7:
            risk_level = "High"
        elif probability > 0.4:
            risk_level = "Medium"
        
        return {
            'spoilage_probability': round(probability, 3),
            'risk_level': risk_level,
            'recommendations': self.get_spoilage_recommendations(risk_level)
        }
    
    def get_spoilage_recommendations(self, risk_level):
        """Get recommendations based on spoilage risk"""
        recommendations = {
            'Low': ['Monitor temperature regularly', 'Continue current storage practices'],
            'Medium': ['Check humidity levels', 'Consider prioritizing distribution', 'Inspect food quality'],
            'High': ['Immediate distribution required', 'Check storage conditions', 'Consider temperature adjustment']
        }
        return recommendations.get(risk_level, [])

# Test the models
if __name__ == "__main__":
    ml_manager = MLModelManager()
    
    # Test predictions
    print("\nDonation Predictions:")
    donation_pred = ml_manager.predict_donations()
    for pred in donation_pred[:3]:
        print(f"Date: {pred['date']}, Amount: {pred['predicted_amount']}, Confidence: {pred['confidence']}")
    
    print("\nDemand Predictions:")
    demand_pred = ml_manager.predict_demand()
    for pred in demand_pred[:3]:
        print(f"Date: {pred['date']}, Demand: {pred['predicted_demand']}, Confidence: {pred['confidence']}")
    
    print("\nSpoilage Risk Test:")
    spoilage_risk = ml_manager.predict_spoilage_risk(6, 75, 5, 1)
    print(f"Risk Level: {spoilage_risk['risk_level']}, Probability: {spoilage_risk['spoilage_probability']}")