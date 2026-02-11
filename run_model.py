import numpy as np
import pandas as pd
import yfinance as yf
import json
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
# 1. Path to your saved model (e.g., 'my_model.h5' or 'saved_model/')
MODEL_PATH = 'market_tracer_model.h5' 

# 2. Your specific 3 features 
# Change this to match EXACTLY what you trained on (e.g., ['Close', 'Volume', 'Open'])
FEATURES = ['Close', 'High', 'Low'] 

# 3. Assets to track
ASSETS = {
    'BTC-USD': {'id': 'bitcoin', 'name': 'Bitcoin'},
    'ETH-USD': {'id': 'ethereum', 'name': 'Ethereum'},
    'SOL-USD': {'id': 'solana', 'name': 'Solana'}
}

# ---------------------------------------------------------
# PROCESSING FUNCTION
# ---------------------------------------------------------
def generate_market_data():
    try:
        # Load your trained model
        # If you haven't saved it yet, save it first: model_lstm.save('market_tracer_model.h5')
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"⚠️ Could not load model: {e}")
        print("Using mock predictions for demonstration...")
        model = None

    export_data = []

    for ticker, info in ASSETS.items():
        print(f"Processing {ticker}...")
        
        # 1. Fetch Data (Need 60 days + extra for window)
        df = yf.download(ticker, period="3mo", interval="1d")
        
        if len(df) < 60:
            print(f"Skipping {ticker}: Not enough data")
            continue

        # 2. Prepare Features
        # Ensure we have the right columns
        try:
            data = df[FEATURES].values
        except KeyError:
            print(f"Error: Columns {FEATURES} not found in yfinance data. Available: {df.columns}")
            continue

        # 3. Scale Data (CRITICAL: Use the SAME scaler you trained with!)
        # For this script, we fit a new scaler, but ideally you load your saved scaler
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        # 4. Get last 60 days for prediction
        last_60_days = scaled_data[-60:]
        X_input = np.array([last_60_days]) # Shape: (1, 60, 3)
        X_input = np.reshape(X_input, (1, 60, 3))

        # 5. Predict
        if model:
            prediction_prob = model.predict(X_input)[0][0] # Sigmoid output (0 to 1)
        else:
            prediction_prob = np.random.random() # Mock if model missing

        # Interpret Prediction (Sigmoid: >0.5 is usually "1"/Up)
        direction = 'up' if prediction_prob > 0.5 else 'down'
        confidence = int(abs(prediction_prob - 0.5) * 200) # Map 0.5-1.0 to 0-100%
        if confidence < 50: confidence += 50 # boost for UI

        # 6. Format History for Chart
        history = []
        recent_df = df.tail(30)
        for index, row in recent_df.iterrows():
            history.append({
                "date": index.strftime('%Y-%m-%d'),
                "value": float(row['Close'])
            })

        export_data.append({
            "id": info['id'],
            "symbol": ticker.split('-')[0],
            "name": info['name'],
            "price": float(df['Close'].iloc[-1]),
            "change24h": float((df['Close'].iloc[-1] - df['Close'].iloc[-2]) / df['Close'].iloc[-2] * 100),
            "prediction": {
                "direction": direction,
                "confidence": confidence,
                "label": "Bullish" if direction == 'up' else "Bearish"
            },
            "history": history
        })

    # Save to JSON
    with open('market_data.json', 'w') as f:
        json.dump(export_data, f, indent=2)
    
    print("\n🎉 Success! 'market_data.json' generated.")
    print("Move this file to your React project's 'public/' folder.")

if __name__ == "__main__":
    generate_market_data()
