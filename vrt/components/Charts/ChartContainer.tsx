import React, { useState, useEffect } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import ChartComponent from './common/ChartComponent';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import { ChartContainerProps } from './types/chartComponentTypes';

const ChartContainer: React.FC<ChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [data, setData] = useState<{ x: string, y: number }[]>([]);
  const [displayData, setDisplayData] = useState<{ x: string, y: number }[]>([]);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [offset, setOffset] = useState<number>(0);

  // Effect to update the displayed data when data, dataPoints, or offset change
  useEffect(() => {
    const start = Math.max(0, data.length - dataPoints - offset);
    const end = Math.max(0, data.length - offset);
    setDisplayData(data.slice(start, end));
  }, [data, dataPoints, offset]);

  const handleRangeChange = (filteredData: { x: string, y: number }[], min: number, max: number) => {
    setDisplayData(filteredData);
    setYAxisRange({ min, max });
  };

  const handleSpikeDetected = (spike: { x: string, y: number }) => {
    console.log('Spike detected:', spike);
  };

  const handleDrag = (direction: 'left' | 'right') => {
    setOffset((prevOffset) => {
      const newOffset = direction === 'left' ? prevOffset + 10 : prevOffset - 10;
      return Math.max(0, newOffset);
    });
  };

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints);
  };

  return (
    <LatestDataComponent dataType={dataType}>
      {(latestData) => {
        if (latestData) {
          // Ensure we don't re-render the component unnecessarily
          if (!data.some(d => d.x === latestData.timestamp)) {
            setData((prevData) => {
              const updatedData = [...prevData, { x: latestData.timestamp, y: latestData.value }];
              if (updatedData.length > 100) {
                updatedData.shift();
              }
              return updatedData;
            });
          }
        }

        return (
          <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
            <Header
              title={title}
              dataType={dataType}
              onDataTypeChange={onDataTypeChange}
              availableDataTypes={availableDataTypes}
              dataPoints={dataPoints}
              onDataPointsChange={handleDataPointsChange}
            />
            <YAxisRangeComponent
              data={data}
              displayDataPoints={dataPoints}
              onRangeChange={handleRangeChange}
              onSpikeDetected={handleSpikeDetected}
            />
            <ChartComponent displayData={displayData} yAxisRange={yAxisRange} onDrag={handleDrag} />
            <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
              Delete
            </button>
          </div>
        );
      }}
    </LatestDataComponent>
  );
};

export default ChartContainer;
