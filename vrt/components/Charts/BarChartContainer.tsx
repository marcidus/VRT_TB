import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import LatestDataComponent from '../Data/LatestDataComponent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import { BarChartContainerProps, BarChartDataPoint } from './types/chartComponentTypes';
import "./BarChartContainer.css";

const BarChartContainer: React.FC<BarChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [displayData, setDisplayData] = useState<BarChartDataPoint[]>([]);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [offset, setOffset] = useState<number>(0);
  const [currentDataType, setCurrentDataType] = useState<string>(dataType);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (currentDataType !== dataType) {
      setDisplayData([]);
      setCurrentDataType(dataType);
    }
  }, [dataType, currentDataType]);

  const handleRangeChange = (filteredData: { x: string; y: number }[], min: number, max: number) => {
    const orderedMin = Math.min(min, max);
    const orderedMax = Math.max(min, max);
    setYAxisRange({ min: orderedMin, max: orderedMax });
    setDisplayData(filteredData.map(d => ({ ...d, source: 'filtered' })));
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

  const handleChartMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    document.body.classList.add('no-select'); // Add the no-select class
    document.body.style.cursor = 'grabbing';
  };

  const handleChartMouseMove = (event: React.MouseEvent) => {
    if (isDragging && startX !== null) {
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left';
        handleDrag(direction);
        setStartX(event.clientX);
      }
    }
  };

  const handleChartMouseUp = () => {
    setIsDragging(false);
    setStartX(null);
    document.body.classList.remove('no-select'); // Remove the no-select class
    document.body.style.cursor = '';
  };

  return (
    <Draggable handle=".header-container">
      <div className="bar-chart-container">
        <LatestDataComponent dataType={dataType}>
          {(historicalData, liveData) => {
            const combinedData: BarChartDataPoint[] = [
              ...historicalData.map(d => ({ x: d.timestamp, y: d.value, source: 'historical' })),
              ...liveData.map(d => ({ x: d.timestamp, y: d.value, source: 'live' })),
            ];

            const start = Math.max(0, combinedData.length - dataPoints - offset);
            const end = Math.max(0, combinedData.length - offset);
            const visibleData = combinedData.slice(start, end);
            const currentValue = visibleData.length ? visibleData[visibleData.length - 1].y : 0;

            return (
              <div>
                <div className="header-container">
                  <Header
                    title={title}
                    dataType={dataType}
                    onDataTypeChange={(newDataType) => {
                      setDisplayData([]);
                      onDataTypeChange(newDataType);
                    }}
                    availableDataTypes={availableDataTypes}
                    dataPoints={dataPoints}
                    onDataPointsChange={handleDataPointsChange}
                    currentValue={currentValue}
                  />
                </div>
                <YAxisRangeComponent
                  data={visibleData}
                  displayDataPoints={dataPoints}
                  onRangeChange={handleRangeChange}
                  onSpikeDetected={handleSpikeDetected}
                />
                <div
                  onMouseDown={handleChartMouseDown}
                  onMouseMove={handleChartMouseMove}
                  onMouseUp={handleChartMouseUp}
                  onMouseLeave={handleChartMouseUp}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
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
                </div>
                <button onClick={onDelete} className="delete-button">
                  Delete
                </button>
              </div>
            );
          }}
        </LatestDataComponent>
      </div>
    </Draggable>
  );
};

export default BarChartContainer;
