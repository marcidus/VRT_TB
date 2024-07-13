/**
 * Author: Alexandre Martroye de Joly
 * Description: This component renders a line chart using the Recharts library. It displays the given data points
 *              and supports custom Y-axis range.
 */

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

// Define the structure of a data point for the chart
interface ChartDataPoint {
  x: string;
  y: number;
}

// Define the props for the ChartComponent
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
        <YAxis 
          domain={[yAxisRange.min, yAxisRange.max]} 
          tickFormatter={(value) => Math.round(value).toString()} // Format Y-axis ticks to integer strings
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
