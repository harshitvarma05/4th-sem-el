# donation_predictor.py
import pandas as pd
from sklearn.linear_model import LinearRegression

# Train once at import
_data = {
    'Day':     [1, 2, 3, 4, 5, 6, 7],
    'Weather': [0, 1, 0, 1, 1, 0, 0],
    'Event':   [0, 0, 1, 0, 1, 1, 0],
    'Donations':[50,40,80,60,90,70,55]
}
_df = pd.DataFrame(_data)
_X  = _df[['Day', 'Weather', 'Event']]
_y  = _df['Donations']

_model = LinearRegression()
_model.fit(_X, _y)

def predict_donations(day: int, weather: int, event: int) -> float:
    """
    Predict donation volume given:
      day:     1–7 (Mon–Sun),
      weather: 0=Clear, 1=Rainy,
      event:   0=No event, 1=Local event.
    Returns predicted food units as a float.
    """
    # Create a DataFrame with matching column names
    X_new = pd.DataFrame(
        {'Day': [day], 'Weather': [weather], 'Event': [event]}
    )
    pred = _model.predict(X_new)
    return float(pred[0])
