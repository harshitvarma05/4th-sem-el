from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
import random
from datetime import datetime, timedelta
import uvicorn
from ml_models import MLModelManager
from graph_algorithms import GraphOptimizer

app = FastAPI(title="SmartCare Food Bank API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models and graph optimizer
ml_manager = MLModelManager()
graph_optimizer = GraphOptimizer()

# Data models
class SensorData(BaseModel):
    sensor_id: str
    temperature: float
    humidity: float
    weight: float
    timestamp: datetime

class DonationData(BaseModel):
    donor_id: str
    food_type: str
    quantity: float
    expiry_date: datetime
    location: str

class NGORequest(BaseModel):
    ngo_id: str
    food_type: str
    quantity_needed: float
    urgency: str
    location: str

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Mock data storage (in production, use proper database)
sensor_readings = []
donations = []
ngo_requests = []
inventory = {}

# Generate mock sensor data
def generate_mock_sensor_data():
    return {
        "sensor_id": f"ESP32_{random.randint(1, 10)}",
        "temperature": round(random.uniform(2, 8), 2),  # Refrigerator temperature
        "humidity": round(random.uniform(40, 60), 2),
        "weight": round(random.uniform(10, 100), 2),
        "timestamp": datetime.now().isoformat(),
        "location": random.choice(["Storage A", "Storage B", "Storage C"]),
        "food_quality": random.choice(["Fresh", "Good", "Warning", "Critical"])
    }

# API endpoints
@app.get("/")
async def root():
    return {"message": "SmartCare Food Bank API is running"}

@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    # Generate real-time statistics
    total_donations = len(donations) + random.randint(150, 200)
    total_distributed = random.randint(120, 180)
    active_ngos = random.randint(25, 35)
    volunteers = random.randint(45, 65)
    
    return {
        "total_donations": total_donations,
        "total_distributed": total_distributed,
        "active_ngos": active_ngos,
        "volunteers": volunteers,
        "waste_reduction": round(random.uniform(20, 30), 1),
        "efficiency_improvement": round(random.uniform(35, 45), 1)
    }

@app.get("/api/sensor/realtime")
async def get_realtime_sensor_data():
    # Generate multiple sensor readings
    sensors = []
    for i in range(6):
        sensors.append(generate_mock_sensor_data())
    return {"sensors": sensors}

@app.get("/api/predictions/donations")
async def get_donation_predictions():
    # Use ML model for predictions
    predictions = ml_manager.predict_donations()
    return {"predictions": predictions}

@app.get("/api/predictions/demand")
async def get_demand_forecast():
    # Use ML model for demand forecasting
    forecast = ml_manager.predict_demand()
    return {"forecast": forecast}

@app.get("/api/optimization/routes")
async def get_optimized_routes():
    # Use graph algorithms for route optimization
    routes = graph_optimizer.optimize_delivery_routes()
    return {"routes": routes}

@app.get("/api/analytics/waste-reduction")
async def get_waste_analytics():
    # Generate waste reduction analytics
    dates = [(datetime.now() - timedelta(days=x)).strftime("%Y-%m-%d") for x in range(30, 0, -1)]
    waste_data = [round(random.uniform(5, 25), 1) for _ in dates]
    
    return {
        "dates": dates,
        "waste_percentage": waste_data,
        "average_reduction": round(sum(waste_data) / len(waste_data), 1)
    }

@app.get("/api/analytics/efficiency")
async def get_efficiency_metrics():
    return {
        "delivery_time_reduction": round(random.uniform(35, 45), 1),
        "resource_utilization": round(random.uniform(80, 95), 1),
        "prediction_accuracy": {
            "donations": round(random.uniform(82, 88), 1),
            "demand": round(random.uniform(78, 85), 1),
            "spoilage": round(random.uniform(75, 82), 1)
        }
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time sensor updates every 5 seconds
            sensor_data = generate_mock_sensor_data()
            await websocket.send_text(json.dumps(sensor_data))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)