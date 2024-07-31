import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ChartComponentProps {
  displayData: ChartDataPoint[];
  yAxisRange: { min: number, max: number };
  onDrag: (direction: 'left' | 'right') => void; // Prop for handling drag
}

const ChartComponent: React.FC<ChartComponentProps> = ({ displayData, yAxisRange, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    document.body.style.userSelect = 'none'; // Prevent text selection
    document.body.style.cursor = 'grabbing'; // Change cursor to grabbing
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && startX !== null) {
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left';
        onDrag(direction);
        setStartX(event.clientX); // Reset startX to the current position
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartX(null);
    document.body.style.userSelect = ''; // Re-enable text selection
    document.body.style.cursor = ''; // Revert cursor to default
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis
            domain={[yAxisRange.min, yAxisRange.max]}
            tickFormatter={(value) => Math.round(value).toString()} // Format Y-axis ticks to integer strings
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
