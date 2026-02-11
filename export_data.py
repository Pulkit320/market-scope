import json
import random
from datetime import datetime, timedelta

# ---------------------------------------------------------
# COPY THIS SCRIPT INTO YOUR LSTM PROJECT FOLDER
# ---------------------------------------------------------

# This simulates what your data frame might look like
# Replace this with your ACTUAL yfinance + model code
def get_model_prediction(ticker):
    # logic to run your model.predict()
    # return: 'up' or 'down', confidence (0-100), and history
    
    # Mocking your model's output:
    direction = random.choice(['up', 'down'])
    confidence = random.randint(60, 95)
    
    # Mock history (replace with your DF ['Date', 'Close'])
    history = []
    base_price = 60000 if ticker == 'BTC' else 3000
    for i in range(30):
        date = (datetime.now() - timedelta(days=30-i)).strftime('%Y-%m-%d')
        history.append({
            "date": date,
            "value": base_price + random.uniform(-100, 100)
        })
        
    return {
        "id": ticker.lower(),
        "symbol": ticker,
        "name": "Bitcoin" if ticker == 'BTC' else ticker,
        "price": history[-1]['value'],
        "change24h": random.uniform(-2, 2),
        "prediction": {
            "direction": direction,
            "confidence": confidence,
            "label": "Bullish" if direction == "up" else "Bearish"
        },
        "history": history
    }

# Generate data for the assets you track
assets = [
    get_model_prediction('BTC'),
    get_model_prediction('ETH'),
    get_model_prediction('SOL'),
]

# Save to the file that the React App reads
with open('market_data.json', 'w') as f:
    json.dump(assets, f, indent=2)

print("✅ generated 'market_data.json'")
print("👉 Move this file to your React project's 'public/' folder")
