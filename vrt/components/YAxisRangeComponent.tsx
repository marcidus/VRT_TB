/**
 * Author: Alexandre Martroye de Joly
 * Description: This component calculates and sets the Y-axis range for a chart based on the median of the data.
 *              It includes a slider to adjust the percentage range around the median and displays a popup message
 *              if a data spike is detected outside the calculated range.
 */

import React, { useState, useEffect } from 'react';
import Popup from './Popup';

// Props for the YAxisRangeComponent
interface YAxisRangeComponentProps {
  data: { x: string, y: number }[]; // The data points to be displayed on the chart
  displayDataPoints: number; // The number of data points to be displayed on the chart
  onRangeChange: (filteredData: { x: string, y: number }[], min: number, max: number) => void; // Callback to handle range changes
  onSpikeDetected: (spike: { x: string, y: number }) => void; // Callback to handle detected spikes
}

// Utility function to calculate the median of an array of numbers
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

    const relevantData = data.slice(-displayDataPoints);
    const yValues = relevantData.map(d => d.y);
    const median = calculateMedian(yValues);
    const range = (median * percentage) / 100;

    const min = Math.floor((median - range) / 10) * 10;
    const max = Math.ceil((median + range) / 10) * 10;

    if (yAxisRange === null || yAxisRange.min !== min || yAxisRange.max !== max) {
      const filteredData = relevantData.filter(point => {
        const isSpike = point.y < min || point.y > max;
        if (isSpike) {
          setPopupMessage(`Spike detected at ${point.x} with value ${point.y}`);
          onSpikeDetected(point);
        }
        return !isSpike;
      });

      setYAxisRange({ min, max });
      onRangeChange(filteredData, min, max);
    }
  }, [data, displayDataPoints, percentage, onRangeChange, onSpikeDetected, yAxisRange]);

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div>
      <label>Percentage Range: {percentage}%</label>
      <input
        type="range"
        min="1"
        max="100"
        value={percentage}
        onChange={(e) => setPercentage(parseInt(e.target.value))}
      />
      {popupMessage && <Popup message={popupMessage} />}
    </div>
  );
};

export default YAxisRangeComponent;
