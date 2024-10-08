import React, { useState, useEffect } from 'react';
import Popup from '../../Shared/Popup';

interface YAxisRangeComponentProps {
    data: { x: string, y: number }[];
    displayDataPoints: number;
    onRangeChange: (filteredData: { x: string, y: number }[], min: number, max: number) => void;
    onSpikeDetected: (spike: { x: string, y: number }) => void;
}

const calculateMedian = (values: number[]): number => {
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
        return (values[middle - 1] + values[middle]) / 2;
    } else {
        return values[middle];
    }
};

const YAxisRangeComponent: React.FC<YAxisRangeComponentProps> = ({
    data,
    displayDataPoints,
    onRangeChange,
    onSpikeDetected
}) => {
    const [percentage, setPercentage] = useState<number>(10);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [yAxisRange, setYAxisRange] = useState<{ min: number, max: number } | null>(null);

    useEffect(() => {
        if (data.length === 0) return;

        // Get the last `displayDataPoints` points from the current data
        const relevantData = data.slice(-displayDataPoints);
        const yValues = relevantData.map((d: { y: number }) => d.y);
        if (yValues.length === 0) return;

        const median = calculateMedian(yValues);
        const range = (median * percentage) / 100;

        let min = Math.floor((median - range) / 10) * 10;
        let max = Math.ceil((median + range) / 10) * 10;

        if (min > max) {
            [min, max] = [max, min];
        }

        const filteredData = relevantData.filter((point: { x: string, y: number }) => {
            const isSpike = point.y < min || point.y > max;
            if (isSpike) {
                setPopupMessage(`Spike detected at ${point.x} with value ${point.y}`);
                onSpikeDetected(point);
            }
            return !isSpike;
        });

        setYAxisRange({ min, max });
        onRangeChange(filteredData, min, max);
    }, [data, displayDataPoints, percentage, onRangeChange, onSpikeDetected, yAxisRange]);

    useEffect(() => {
        if (popupMessage) {
            const timer = setTimeout(() => {
                setPopupMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popupMessage]);

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = parseInt(e.target.value);
        setPercentage(newPercentage);
    };

    return (
        <div>
            <label>Percentage Range: {percentage}%</label>
            <input
                type="range"
                min="1"
                max="100"
                value={percentage}
                onChange={handlePercentageChange}
            />
            {popupMessage && <Popup message={popupMessage} />}
        </div>
    );
};

export default YAxisRangeComponent;
