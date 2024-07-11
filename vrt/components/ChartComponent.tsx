import React from 'react';
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
}

const ChartComponent: React.FC<ChartComponentProps> = ({ displayData, yAxisRange }) => {
  console.log('Rendering Chart with data:', displayData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis domain={[yAxisRange.min, yAxisRange.max]} tickFormatter={(value) => Math.round(value)} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
