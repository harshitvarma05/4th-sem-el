# donation_model.py

import pickle
from pathlib import Path

import pandas as pd
from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Where to store your online‐learning pipeline
MODEL_DIR  = Path("models")
MODEL_PATH = MODEL_DIR / "donation_pipeline.pkl"

def _init_pipeline():
    if MODEL_PATH.exists():
        with MODEL_PATH.open("rb") as f:
            pipeline = pickle.load(f)
    else:
        # Create & train initial pipeline
        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("sgd", SGDRegressor(max_iter=1000, tol=1e-3))
        ])
        # Import your historical data (ensure _X is a DataFrame)
        from donation_predictor import _X, _y
        pipeline.fit(_X, _y)
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        with MODEL_PATH.open("wb") as f:
            pickle.dump(pipeline, f)
    return pipeline

# Global pipeline instance
_pipeline = _init_pipeline()

def predict(day: int, weather: int, event: int) -> float:
    """
    Predict donation volume. Wrap inputs in a DataFrame
    with the same feature names as training.
    """
    X_new = pd.DataFrame({
        "Day":     [day],
        "Weather": [weather],
        "Event":   [event]
    })
    return float(_pipeline.predict(X_new)[0])

def update(day: int, weather: int, event: int, donations: float):
    """
    Online‐learn: partial_fit on new (X, y) and persist.
    """
    X_new = pd.DataFrame({
        "Day":     [day],
        "Weather": [weather],
        "Event":   [event]
    })
    _pipeline.named_steps["sgd"].partial_fit(X_new, [donations])
    with MODEL_PATH.open("wb") as f:
        pickle.dump(_pipeline, f)
