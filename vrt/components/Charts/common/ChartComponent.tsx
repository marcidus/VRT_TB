import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ChartComponentProps {
  displayData: ChartDataPoint[];
  yAxisRange: { min: number, max: number };
  onDrag: (direction: 'left' | 'right') => void;
  type?: 'line' | 'bar';  // Allows for both Line and Bar charts
}

const ChartComponent: React.FC<ChartComponentProps> = ({ displayData, yAxisRange, onDrag, type = 'line' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && startX !== null) {
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left';
        onDrag(direction);
        setStartX(event.clientX);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartX(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  const renderChart = () => {
    const orderedYAxisRange = {
      min: Math.min(yAxisRange.min, yAxisRange.max),
      max: Math.max(yAxisRange.min, yAxisRange.max),
    };

    return type === 'line' ? (
      <LineChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis domain={[orderedYAxisRange.min, orderedYAxisRange.max]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    ) : (
      <BarChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis domain={[orderedYAxisRange.min, orderedYAxisRange.max]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
    );
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
