import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const PriceChart = ({ data, color = "#2563eb" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No data available
            </div>
        );
    }

    // Format date for tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                    <p className="text-[0.70rem] uppercase text-muted-foreground">
                        {label}
                    </p>
                    <span className="font-bold text-muted-foreground">
                        {payload[0].value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    hide
                />
                <YAxis
                    hide
                    domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default PriceChart;
