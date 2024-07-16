import React, { useState, useEffect } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { BarChartContainerProps, BarChartDataPoint } from './types/chartComponentTypes';

const BarChartContainer: React.FC<BarChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [displayData, setDisplayData] = useState<BarChartDataPoint[]>([]);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(400);
  const [yAxisRange, setYAxisRange] = useState<{ min: number, max: number }>({ min: 0, max: 100 });
  const [offset, setOffset] = useState<number>(0);
  const [currentDataType, setCurrentDataType] = useState<string>(dataType);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    // Clear existing data when the data type changes
    if (currentDataType !== dataType) {
      setDisplayData([]);
      setCurrentDataType(dataType);
    }
  }, [dataType, currentDataType]);

  const handleRangeChange = (filteredData: { x: string, y: number }[], min: number, max: number) => {
    setYAxisRange({ min, max });
    setDisplayData(filteredData.map(d => ({ ...d, type: 'historical' })));
  };

  const handleSpikeDetected = (spike: { x: string, y: number }) => {
    console.log('Spike detected:', spike);
  };

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints);
  };

  const handleDrag = (direction: 'left' | 'right') => {
    setOffset((prevOffset) => {
      const newOffset = direction === 'left' ? prevOffset - 10 : prevOffset + 10;
      return Math.max(0, newOffset);
    });
  };

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
        const direction = deltaX > 0 ? 'left' : 'right';
        handleDrag(direction);
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
    <LatestDataComponent dataType={dataType}>
      {(historicalData, liveData) => {
        const combinedData = [
          ...historicalData.map(d => ({ x: d.timestamp, y: d.value, type: 'historical' })),
          ...liveData.map(d => ({ x: d.timestamp, y: d.value, type: 'live' })),
        ];

        const start = Math.max(0, combinedData.length - dataPoints - offset);
        const end = Math.max(0, combinedData.length - offset);
        const displayData = combinedData.slice(start, end);

        return (
          <Draggable handle=".handle-bar">
            <Resizable
              width={width}
              height={height}
              onResize={(e, { size }) => {
                setWidth(size.width);
                setHeight(size.height);
              }}
            >
              <div
                className="border-2 border-gray-400 rounded shadow p-2"
                style={{ width, height }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <Header
                  title={title}
                  dataType={dataType}
                  onDataTypeChange={(newDataType) => {
                    // Clear existing data when the data type changes
                    setDisplayData([]);
                    onDataTypeChange(newDataType);
                  }}
                  availableDataTypes={availableDataTypes}
                  dataPoints={dataPoints}
                  onDataPointsChange={handleDataPointsChange}
                />
                <YAxisRangeComponent
                  data={displayData}
                  displayDataPoints={dataPoints}
                  onRangeChange={handleRangeChange}
                  onSpikeDetected={handleSpikeDetected}
                />
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis domain={[yAxisRange.min, yAxisRange.max]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="y" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
                  Delete
                </button>
              </div>
            </Resizable>
          </Draggable>
        );
      }}
    </LatestDataComponent>
  );
};

export default BarChartContainer;
