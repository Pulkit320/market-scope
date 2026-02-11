# MarketScope - AI-Powered Financial Analytics

![MarketScope Dashboard](https://via.placeholder.com/800x400?text=MarketScope+Dashboard+Preview)

**MarketScope** is a modern, real-time financial tracking dashboard designed to visualize market trends and showcase predictive analytics. Built with **React**, **Tailwind CSS**, and **Recharts**, it features a responsive design and an integrated "AI Forecast" module that demonstrates potential future price movements based on LSTM (Long Short-Term Memory) machine learning models.

## 🚀 Key Features

*   **Real-Time Market Tracking**: Live dashboard monitoring top crypto assets and stocks.
*   **Interactive Visualization**: Dynamic, responsive area charts processing historical price data.
*   **AI-Powered Forecasts**: Dedicated module visualizing predictive outcomes from custom LSTM models.
*   **Smart Search**: Instant asset lookup with debounced search and quick navigation.
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile experiences.

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite
*   **Styling**: Tailwind CSS, Shadcn/ui principles (Radix UI)
*   **Visualization**: Recharts
*   **Icons**: Lucide React
*   **Animations**: Framer Motion, Tailwind Animate
*   **State Management**: React Hooks & Context

## 🔮 The AI Logic (Context)
This project serves as the frontend visualization layer for my background in Data Science. The "AI Forecast" section conceptually integrates with my **LSTM Stock Price Predictor** (see my other repo).
*   **Model**: LSTM (Recurrent Neural Network)
*   **Training Data**: 5-year historical OHLCV data
*   **Features**: Volume, Moving Averages (SMA/EMA), RSI

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/market-scope.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 🌐 Deployment
This project is configured for seamless deployment on **Vercel**.

## 📄 License
MIT License
