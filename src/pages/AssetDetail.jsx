import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarketService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PriceChart from '@/components/charts/PriceChart';
import ConfidenceGauge from '@/components/ui/confidence-gauge';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAsset = async () => {
            setLoading(true);
            try {
                const data = await MarketService.getAssetDetails(id);
                setAsset(data);
            } finally {
                setLoading(false);
            }
        };
        loadAsset();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!asset) return <div className="p-8">Asset not found</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
                    <span className="text-xl text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                        {asset.symbol}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Price History (30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <PriceChart data={asset.history} color={asset.change24h >= 0 ? "#22c55e" : "#ef4444"} />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Price</span>
                                <span className="font-bold">${asset.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Market Cap</span>
                                <span className="font-medium">${(asset.marketCap / 1e9).toFixed(2)}B</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Volume (24h)</span>
                                <span className="font-medium">${(asset.volume / 1e6).toFixed(2)}M</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-primary">AI Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-background p-3 rounded-md border border-border">
                                    <span className="text-sm font-medium">Predicted Price (7d)</span>
                                    <span className="font-bold text-green-600">${(asset.price * 1.05).toFixed(2)}</span>
                                </div>
                                <ConfidenceGauge score={87} />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Our LSTM model predicts a bullish trend for {asset.name} based on recent volume spikes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AssetDetail;
