import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketService } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PriceChart from '@/components/charts/PriceChart';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await MarketService.getTopAssets();
                setAssets(data);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Live Market Simulation
    useEffect(() => {
        if (loading) return;

        const interval = setInterval(() => {
            setAssets(currentAssets =>
                currentAssets.map(asset => {
                    // Random small fluctuation
                    const volatility = 0.002; // 0.2% variance
                    const change = 1 + (Math.random() * volatility * 2 - volatility);
                    const newPrice = asset.price * change;

                    return {
                        ...asset,
                        price: newPrice,
                        flash: newPrice > asset.price ? 'green' : 'red'
                    };
                })
            );

            // Clear flash after animation
            setTimeout(() => {
                setAssets(prev => prev.map(a => ({ ...a, flash: null })));
            }, 300);

        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [loading]);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-green-500 uppercase tracking-widest border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded">Live</span>
                    </div>
                    <p className="text-muted-foreground">
                        Real-time insights and AI-powered predictions.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        Add Asset
                    </button>
                </div>
            </div>

            {/* Top Stats - Highlights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {assets.map((asset) => (
                    <Card
                        key={asset.id}
                        className="hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/asset/${asset.id}`)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {asset.name}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground font-mono">{asset.symbol}</span>
                        </CardHeader>
                        <CardContent>
                            <div className={cn(
                                "text-2xl font-bold transition-colors duration-300",
                                asset.flash === 'green' && "text-green-500",
                                asset.flash === 'red' && "text-red-500"
                            )}>
                                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className={cn(
                                "text-xs flex items-center mt-1",
                                asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                            )}>
                                {asset.change24h >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {Math.abs(asset.change24h)}%
                                <span className="text-muted-foreground ml-1">24h</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area - Chart & Details */}
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Market Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full mt-4 pr-4">
                            {assets.length > 0 && <PriceChart data={assets[0].history} />}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>AI Predictions</CardTitle>
                        <p className="text-sm text-muted-foreground">Forecasts based on LSTM model</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {assets.slice(0, 3).map((asset) => (
                                <div key={asset.id} className="flex items-center">
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none">{asset.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Signal: <span className={asset.prediction.direction === 'up' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                {asset.prediction.label}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "font-medium text-sm",
                                        asset.prediction.direction === 'up' ? "text-green-500" : "text-red-500"
                                    )}>
                                        {asset.prediction.confidence}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
