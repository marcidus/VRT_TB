// components/PieChartContainer.tsx

import React, { useState } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Header from './common/Header';
import { PieChartContainerProps, ChartDataPoint } from './types/chartComponentTypes';

const PieChartContainer: React.FC<PieChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [dataPoints, setDataPoints] = useState<number>(10); // State to manage the number of displayed data points

  return (
    <LatestDataComponent dataType={dataType}>
      {(latestData) => (
        <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
          <Header
            title={title}
            dataType={dataType}
            onDataTypeChange={onDataTypeChange}
            availableDataTypes={availableDataTypes}
            dataPoints={dataPoints}
            onDataPointsChange={setDataPoints}
          />
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={latestData ? [latestData] : []} dataKey="value" nameKey="timestamp" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {(latestData ? [latestData] : []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#82ca9d" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
            Delete
          </button>
        </div>
      )}
    </LatestDataComponent>
  );
};

export default PieChartContainer;
