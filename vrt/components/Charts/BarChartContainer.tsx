import React, { useState, useEffect, useCallback } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import { BarChartContainerProps, BarChartDataPoint } from './types/chartComponentTypes';

const BarChartContainer: React.FC<BarChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [sensors, setSensors] = useState<string[]>([dataType]);
  const [displayData, setDisplayData] = useState<{ [key: string]: BarChartDataPoint[] }>({});
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);

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

  const handleChartMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    document.body.style.userSelect = 'none'; // Prevent text selection
    document.body.style.cursor = 'grabbing'; // Change cursor to grabbing
  };

  const handleChartMouseMove = (event: React.MouseEvent) => {
    if (isDragging && startX !== null) {
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? 'right' : 'left';
        handleDrag(direction);
        setStartX(event.clientX); // Reset startX to the current position
      }
    }
  };

  const handleChartMouseUp = () => {
    setIsDragging(false);
    setStartX(null);
    document.body.style.userSelect = ''; // Re-enable text selection
    document.body.style.cursor = ''; // Revert cursor to default
  };

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
      <div
        onMouseDown={handleChartMouseDown}
        onMouseMove={handleChartMouseMove}
        onMouseUp={handleChartMouseUp}
        onMouseLeave={handleChartMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis
              domain={[yAxisRange.min, yAxisRange.max]}
              tickFormatter={(value) => Math.round(value).toString()} // Format Y-axis ticks to integer strings
            />
            <Tooltip />
            <Legend />
            {sensors.map((sensor, index) => (
              <Bar
                key={sensor}
                dataKey="y"
                data={displayData[sensor]}
                name={sensor.replace('_', ' ')} // Use sensor name for legend and format it
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each sensor
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
        Delete
      </button>
    </div>
  );
};

export default BarChartContainer;
