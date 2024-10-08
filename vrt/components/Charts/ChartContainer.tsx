import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import LatestDataComponent from '../Data/LatestDataComponent';
import ChartComponent from './common/ChartComponent';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import { ChartContainerProps } from './types/chartComponentTypes';
import './ChartContainer.css';

const ChartContainer: React.FC<ChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [displayData, setDisplayData] = useState<{ x: string, y: number, type: string }[]>([]);
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

  const handleRangeChange = (filteredData: { x: string, y: number }[], min: number, max: number) => {
    const orderedMin = Math.min(min, max);
    const orderedMax = Math.max(min, max);
    setYAxisRange({ min: orderedMin, max: orderedMax });
    setDisplayData(filteredData.map(d => ({ ...d, type: 'historical' })));
  };

  const handleSpikeDetected = (spike: { x: string, y: number }) => {
    console.log('Spike detected:', spike);
  };

  const handleDrag = (direction: 'left' | 'right') => {
    setOffset((prevOffset) => {
      const newOffset = direction === 'right' ? prevOffset + 10 : prevOffset - 10;
      return Math.max(0, newOffset);
    });
  };

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints);
  };

  const handleChartMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    document.body.classList.add('no-select'); // Add the no-select class
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
  };

  return (
    <Draggable handle=".header-container">
      <div className="chart-container">
        <LatestDataComponent dataType={dataType}>
          {(historicalData, liveData) => {
            const combinedData = [
              ...historicalData.map(d => ({ x: d.timestamp, y: d.value, type: 'historical' })),
              ...liveData.map(d => ({ x: d.timestamp, y: d.value, type: 'live' })),
            ];

            const start = Math.max(0, combinedData.length - dataPoints - offset);
            const end = Math.max(0, combinedData.length - offset);
            const visibleData = combinedData.slice(start, end);

            return (
              <>
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
                    onDataPointsChange={handleDataPointsChange} // Use the defined function here
                    currentValue={visibleData.length ? visibleData[visibleData.length - 1].y : 0}
                  />
                </div>
                <YAxisRangeComponent
                  data={visibleData}
                  displayDataPoints={dataPoints}
                  onRangeChange={handleRangeChange}
                  onSpikeDetected={handleSpikeDetected}
                />
                <ChartComponent displayData={displayData} yAxisRange={yAxisRange} onDrag={handleDrag} />
                <button onClick={onDelete} className="delete-button">
                  Delete
                </button>
              </>
            );
          }}
        </LatestDataComponent>
      </div>
    </Draggable>
  );
};

export default ChartContainer;
