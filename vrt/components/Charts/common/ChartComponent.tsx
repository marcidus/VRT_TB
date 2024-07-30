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

// Define the structure of a data point for the chart
interface ChartDataPoint {
  x: string;
  y: number;
}

// Define the props for the ChartComponent
interface ChartComponentProps {
  displayData: { [key: string]: ChartDataPoint[] };
  yAxisRange: { min: number, max: number };
  onDrag: (direction: 'left' | 'right') => void; // Prop for handling drag
  sensors: string[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ displayData, yAxisRange, onDrag, sensors }) => {
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

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908'];

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
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis
            domain={[yAxisRange.min, yAxisRange.max]}
            tickFormatter={(value) => Math.round(value).toString()} // Format Y-axis ticks to integer strings
          />
          <Tooltip />
          <Legend />
          {sensors.map((sensor, index) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey="y"
              data={displayData[sensor]}
              name={sensor.replace('_', ' ')} // Use sensor name for legend and format it
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
