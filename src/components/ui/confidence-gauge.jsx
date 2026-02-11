import React from 'react';

const ConfidenceGauge = ({ score }) => {
    // Score is 0-100
    const getColor = (s) => {
        if (s >= 80) return 'bg-green-500';
        if (s >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model Confidence</span>
                <span className="font-bold">{score}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor(score)} transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
};

export default ConfidenceGauge;
