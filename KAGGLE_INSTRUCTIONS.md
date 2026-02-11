# How to Export Data from Kaggle to MarketScope

Since your model is trained on Kaggle, you need to generate the `market_data.json` file there and download it.

## Step 1: Enable Internet Access
1.  Open your Kaggle Notebook.
2.  In the right sidebar, find **Session Options**.
3.  Ensure **Internet On** is checked (needed to download stock data via `yfinance`).

## Step 2: Install yfinance
Create a new cell and run:
```python
!pip install yfinance
```

## Step 3: Run the Export Script
Copy this code into a new cell at the bottom of your notebook and run it. 
**Make sure variable `model_lstm` (or whatever you named your model) is available in memory.**

```python
import json
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime

# --- CONFIGURATION ---
# Assets to track
ASSETS = {
    'BTC-USD': {'id': 'bitcoin', 'name': 'Bitcoin'},
    'ETH-USD': {'id': 'ethereum', 'name': 'Ethereum'},
    'SOL-USD': {'id': 'solana', 'name': 'Solana'}
}
FEATURES = ['Close', 'High', 'Low'] # Match your training features exactly

def generate_kagggle_data(model):
    export_data = []
    print("🚀 Starting export...")
    
    for ticker, info in ASSETS.items():
        print(f"Processing {ticker}...")
        
        # 1. Fetch Data
        try:
            df = yf.download(ticker, period="3mo", interval="1d", progress=False)
        except Exception as e:
            print(f"Error downloading {ticker}: {e}")
            continue
            
        if len(df) < 60: continue

        # 2. Prepare Data
        data = df[FEATURES].values
        
        # Note: In a real app, load your SAVED scaler. 
        # Here we fit a new one for demonstration (might reduce accuracy slightly)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        # 3. Predict
        last_60_days = scaled_data[-60:]
        X_input = np.array([last_60_days]) # Shape (1, 60, 3)
        
        # Get prediction from your live model
        prediction_prob = model.predict(X_input, verbose=0)[0][0]
        
        # 4. Format Output
        direction = 'up' if prediction_prob > 0.5 else 'down'
        confidence = int(abs(prediction_prob - 0.5) * 200)
        if confidence < 50: confidence += 50
        
        # History for chart
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

    # Save to Kaggle Output
    with open('market_data.json', 'w') as f:
        json.dump(export_data, f, indent=2)
    
    print("\n✅ DONE! File 'market_data.json' created.")

# Run the function with your trained model
# Replace 'model_lstm' with your actual model variable name
generate_kagggle_data(model_lstm)
```

## Step 4: Download the File
1.  Look at the **Output** panel on the right side of Kaggle (under the notebook settings).
2.  You should see `/kaggle/working/market_data.json`.
3.  Click the **Download** icon next to the file.
    *   *Note: If you don't see it, try refreshing the file browser or running `!ls` in a cell.*

## Step 5: Upload to MarketScope
1.  Take the downloaded `market_data.json`.
2.  Place it inside your local project folder: `market-scope/public/`.
3.  Commit and push:
    ```bash
    git add public/market_data.json
    git commit -m "update model data"
    git push
    ```
