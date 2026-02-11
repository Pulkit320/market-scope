// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_ASSETS = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 64231.45,
        change24h: 2.34,
        marketCap: 1200000000000,
        volume: 35000000000,
        prediction: { direction: 'up', confidence: 87, label: 'Bullish' },
        history: Array.from({ length: 30 }, (_, i) => ({
            date: `2024-03-${i + 1}`,
            value: 60000 + Math.random() * 5000
        }))
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3452.12,
        change24h: -1.2,
        marketCap: 400000000000,
        volume: 15000000000,
        prediction: { direction: 'down', confidence: 62, label: 'Bearish' },
        history: Array.from({ length: 30 }, (_, i) => ({
            date: `2024-03-${i + 1}`,
            value: 3200 + Math.random() * 400
        }))
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: 145.67,
        change24h: 5.6,
        marketCap: 65000000000,
        volume: 4000000000,
        prediction: { direction: 'up', confidence: 94, label: 'Strong Buy' },
        history: Array.from({ length: 30 }, (_, i) => ({
            date: `2024-03-${i + 1}`,
            value: 130 + Math.random() * 30
        }))
    },
    {
        id: 'nvidia',
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        price: 924.50,
        change24h: 3.1, // AI Boom relevance
        type: 'stock',
        prediction: { direction: 'up', confidence: 78, label: 'Bullish' },
        history: Array.from({ length: 30 }, (_, i) => ({
            date: `2024-03-${i + 1}`,
            value: 850 + Math.random() * 100
        }))
    }
];

const fetchData = async () => {
    try {
        const response = await fetch('/market_data.json');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (e) {
        console.warn("Using mock data (market_data.json not found)");
    }
    return MOCK_ASSETS;
};

export const MarketService = {
    getTopAssets: async () => {
        await delay(500);
        return await fetchData();
    },

    getAssetDetails: async (id) => {
        await delay(500);
        const assets = await fetchData();
        return assets.find(a => a.id === id) || null;
    },

    searchAssets: async (query) => {
        await delay(300);
        if (!query) return [];
        const assets = await fetchData();
        const lowerQuery = query.toLowerCase();
        return assets.filter(a =>
            a.name.toLowerCase().includes(lowerQuery) ||
            a.symbol.toLowerCase().includes(lowerQuery)
        );
    }
};
