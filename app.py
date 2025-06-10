import os
import datetime
from functools import wraps

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from google.cloud.firestore_v1.base_document import DocumentSnapshot

import firebase_setup            # initializes firebase_admin and exports `db`
from firebase_admin import auth as firebase_auth
import donation_model            # your online-learning ML
import algorithms                # Dijkstra, Knapsack, etc.

# Firestore client
db = firebase_setup.db

# Flask & SocketIO setup
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret!')
socketio = SocketIO(app, cors_allowed_origins="*")


def serialize_doc(doc: DocumentSnapshot) -> dict:
    """
    Convert Firestore DocumentSnapshot to JSON-serializable dict:
    - datetime.datetime (and subclasses) → ISO strings
    - other types unchanged
    """
    data = doc.to_dict() or {}
    safe = {}
    for k, v in data.items():
        if isinstance(v, datetime.datetime):
            safe[k] = v.isoformat()
        else:
            safe[k] = v
    safe["id"] = doc.id
    return safe


def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            decoded = firebase_auth.verify_id_token(token)
            request.user = decoded
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return wrapper


@app.route("/")
def index():
    # Public entrypoint: just serve the shell
    return render_template("dashboard.html")


@app.route("/api/bins", methods=["GET"])
@authenticate
def get_bins():
    uid = request.user["uid"]
    docs = db.collection("users").document(uid).collection("bins").stream()
    bins = [doc.to_dict() for doc in docs]
    return jsonify({"bins": bins})


@app.route("/api/bins", methods=["POST"])
@authenticate
def add_bin():
    uid = request.user["uid"]
    data = request.get_json() or {}
    if not data:
        return jsonify({"error": "No data provided"}), 400
    new_ref = db.collection("users").document(uid).collection("bins").add(data)
    return jsonify({"id": new_ref[1].id}), 201


@app.route("/api/donations/history", methods=["GET"])
@authenticate
def get_donations_history():
    uid = request.user["uid"]
    docs = (
        db.collection("users")
          .document(uid)
          .collection("donations")
          .order_by("timestamp")
          .stream()
    )
    history = []
    for doc in docs:
        data = doc.to_dict() or {}
        ts = data.get("timestamp")
        history.append({
            "timestamp": ts.to_datetime().isoformat() if hasattr(ts, "to_datetime") else ts,
            "donations": data.get("donations", 0)
        })
    return jsonify({"history": history})


@app.route("/api/bins/history", methods=["GET"])
@authenticate
def get_bins_history():
    uid = request.user["uid"]
    docs = (
        db.collection("users")
          .document(uid)
          .collection("bin_history")
          .order_by("timestamp")
          .stream()
    )
    history = []
    for doc in docs:
        data = doc.to_dict() or {}
        ts = data.get("timestamp")
        history.append({
            "timestamp": ts.to_datetime().isoformat() if hasattr(ts, "to_datetime") else ts,
            "weight": data.get("weight", 0)
        })
    return jsonify({"history": history})


# Real-time listener for bins
def on_bins_snapshot(col_snapshot, changes, read_time):
    bins = [serialize_doc(doc) for doc in col_snapshot]
    socketio.emit("bins_update", {"bins": bins})


db.collection("users").on_snapshot(lambda snaps, ch, rt: None)
# Note: you'll attach per-user listeners on connect


@socketio.on("connect")
def handle_connect():
    token = request.args.get("token", "")
    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception:
        return False

    uid = decoded["uid"]
    sid = request.sid

    # send initial bins
    docs = db.collection("users").document(uid).collection("bins").stream()
    emit("bins_update", {"bins": [serialize_doc(d) for d in docs]}, room=sid)

    # attach listener
    col_ref = db.collection("users").document(uid).collection("bins")
    listener = col_ref.on_snapshot(
        lambda snaps, changes, rt: socketio.emit(
            "bins_update",
            {"bins": [serialize_doc(d) for d in snaps]},
            room=sid
        )
    )
    socketio.server.environ[sid]["listener"] = listener


@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid
    listener = socketio.server.environ.get(sid, {}).get("listener")
    if listener:
        listener.unsubscribe()
    print(f"Client {sid} disconnected")


if __name__ == "__main__":
    host = "127.0.0.1"
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀  Server running at http://{host}:{port}")
    socketio.run(
        app,
        host=host,
        port=port,
        allow_unsafe_werkzeug=True,
        use_reloader=False
    )
