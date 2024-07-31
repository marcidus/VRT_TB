import React, { useState, useEffect } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import ChartComponent from './common/ChartComponent';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import { ChartContainerProps } from './types/chartComponentTypes';
import { useDrag } from '../Charts/common/DragContext';

const ChartContainer: React.FC<ChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const { globalOffset, handleDrag, toggleSync, lastSyncedOffset } = useDrag();
  const [displayData, setDisplayData] = useState<{ x: string, y: number, type: string }[]>([]);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [localOffset, setLocalOffset] = useState<number>(0);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [currentDataType, setCurrentDataType] = useState<string>(dataType);

  useEffect(() => {
    if (currentDataType !== dataType) {
      setDisplayData([]);
      setCurrentDataType(dataType);
    }
  }, [dataType, currentDataType]);

  const handleRangeChange = (filteredData: { x: string, y: number }[], min: number, max: number) => {
    setDisplayData(filteredData.map(d => ({ ...d, type: 'historical' })));
    setYAxisRange({ min, max });
  };

  const handleSpikeDetected = (spike: { x: string, y: number }) => {
    console.log('Spike detected:', spike);
  };

  const handleLocalDrag = (direction: 'left' | 'right') => {
    if (isSynced) {
      handleDrag(direction);
    } else {
      setLocalOffset((prevOffset) => {
        const newOffset = direction === 'right' ? prevOffset + 10 : prevOffset - 10;
        return Math.max(0, newOffset);
      });
    }
  };

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints);
  };

  const handleSyncToggle = () => {
    if (!isSynced) {
      setLocalOffset(lastSyncedOffset); // Set local offset to the last synced position
    }
    setIsSynced(!isSynced);
    toggleSync();
  };

  const offset = isSynced ? globalOffset : localOffset;

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
        const currentValue = displayData.length ? displayData[displayData.length - 1].y : 0;

        return (
          <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
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
            <YAxisRangeComponent
              data={displayData}
              displayDataPoints={dataPoints}
              onRangeChange={handleRangeChange}
              onSpikeDetected={handleSpikeDetected}
            />
            <ChartComponent displayData={displayData} yAxisRange={yAxisRange} onDrag={handleLocalDrag} />
            <div>
              <label>
                <input type="checkbox" checked={isSynced} onChange={handleSyncToggle} />
                Sync Drag
              </label>
            </div>
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
