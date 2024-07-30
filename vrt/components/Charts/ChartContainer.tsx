import React, { useState, useEffect, useCallback } from 'react';
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
  const [sensors, setSensors] = useState<string[]>([dataType]);
  const [displayData, setDisplayData] = useState<{ [key: string]: { x: string, y: number }[] }>({});
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [offset, setOffset] = useState<number>(0);

  const handleRangeChange = (sensor: string, filteredData: { x: string, y: number }[], min: number, max: number) => {
    setDisplayData(prev => ({ ...prev, [sensor]: filteredData }));
    setYAxisRange({ min, max });
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

  const addSensor = useCallback(() => {
    setSensors([...sensors, availableDataTypes[0]]);
  }, [sensors, availableDataTypes]);

  const removeSensor = useCallback((index: number) => {
    setSensors(sensors.filter((_, i) => i !== index));
  }, [sensors]);

  const handleSensorChange = useCallback((index: number, newDataType: string) => {
    const newSensors = [...sensors];
    newSensors[index] = newDataType;
    setSensors(newSensors);
  }, [sensors]);

  return (
    <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
      <Header
        title={title}
        sensors={sensors}
        onSensorChange={handleSensorChange}
        availableDataTypes={availableDataTypes}
        dataPoints={dataPoints}
        onDataPointsChange={handleDataPointsChange}
        currentValue={0} // Update this to reflect the current value as needed
        onAddSensor={addSensor}
        onRemoveSensor={removeSensor}
      />
      {sensors.map((sensor) => (
        <LatestDataComponent key={sensor} dataType={sensor}>
          {(historicalData, liveData) => {
            const combinedData = [
              ...historicalData.map(d => ({ x: d.timestamp, y: d.value })),
              ...liveData.map(d => ({ x: d.timestamp, y: d.value })),
            ];

            const start = Math.max(0, combinedData.length - dataPoints - offset);
            const end = Math.max(0, combinedData.length - offset);
            const sensorDisplayData = combinedData.slice(start, end);

            return (
              <YAxisRangeComponent
                data={sensorDisplayData}
                displayDataPoints={dataPoints}
                onRangeChange={(filteredData, min, max) => handleRangeChange(sensor, filteredData, min, max)}
                onSpikeDetected={() => {}}
              />
            );
          }}
        </LatestDataComponent>
      ))}
      <ChartComponent displayData={displayData} yAxisRange={yAxisRange} onDrag={handleDrag} sensors={sensors} />
      <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
        Delete
      </button>
    </div>
  );
};

export default ChartContainer;
