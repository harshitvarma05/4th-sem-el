# seed_sample_data.py

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta

# 1) Initialize
cred = credentials.Certificate('firebase_config.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2) Replace this with your actual logged-in user’s UID
UID = 'dPS1lgONkfUuBDDRp5YCaFN78oB3'

# 3) Seed Bins
bins = [
    {"location": "Kengeri", "weight": 28.3},
    {"location": "RR Nagar",       "weight": 12.7},
    {"location": "Majestic",      "weight": 7.4},
]
for b in bins:
    db.collection('users').document(UID).collection('bins').add(b)
print("Bins seeded.")

# 4) Seed Donations (past week)
today = datetime.utcnow()
for i in range(7):
    day_of_week = (today - timedelta(days=6 - i)).isoweekday()  # 1–7
    doc = {
        "day": day_of_week,
        "weather": 1 if i % 3 == 0 else 0,
        "event":   1 if i % 4 == 0 else 0,
        "donations": 50 + i * 5,
        "timestamp": firestore.SERVER_TIMESTAMP
    }
    db.collection('users').document(UID).collection('donations').add(doc)
print("Donations history seeded.")

# 5) Seed Bin‐weight history (6 hourly readings)
base = today - timedelta(hours=5)
for i in range(6):
    ts = base + timedelta(hours=i)
    doc = {
        "timestamp": ts,
        "weight": 22.5 + i * 1.4
    }
    db.collection('users').document(UID).collection('bin_history').add(doc)
print("Bin history seeded.")
