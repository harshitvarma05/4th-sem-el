import os
import firebase_admin
from firebase_admin import credentials, firestore

# --- Initialize Firebase Admin ---
cred = credentials.Certificate('firebase_config.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# --- Configuration ---
# Replace with the actual UID you want to own these bins
ADMIN_UID = "admin123"

def migrate():
    # Read all docs from the old 'food_bins' collection
    old_bins = db.collection('food_bins').stream()
    for doc in old_bins:
        data = doc.to_dict()
        bin_id = doc.id

        # Write into users/{ADMIN_UID}/bins/{bin_id}
        db.collection('users') \
          .document(ADMIN_UID) \
          .collection('bins') \
          .document(bin_id) \
          .set(data)

        print(f"Migrated bin {bin_id}")

    print("Migration complete.")

    def migrate_donations():
        old_donations = db.collection('donations').stream()
        for doc in old_donations:
            data = doc.to_dict()
            donation_id = doc.id
            db.collection('users') \
                .document(ADMIN_UID) \
                .collection('donations') \
                .document(donation_id) \
                .set(data)
            print(f"Migrated donation {donation_id}")

        print("Donations migration complete.")

if __name__ == "__main__":
    migrate()