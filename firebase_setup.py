# firebase_setup.py
import firebase_admin
from firebase_admin import credentials, firestore
from donation_model import update as update_model
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
def on_donations_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        if change.type.name in ('ADDED', 'MODIFIED'):
            record = change.document.to_dict()
            # record must contain: 'day', 'weather', 'event', 'donations'
            update_model(
                day=record['day'],
                weather=record['weather'],
                event=record['event'],
                donations=record['donations']
            )

db.collection('donations').on_snapshot(on_donations_snapshot)