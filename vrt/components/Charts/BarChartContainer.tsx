import React, { useState, useEffect } from 'react';
import LatestDataComponent from '../Data/LatestDataComponent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './common/Header';
import YAxisRangeComponent from './common/YAxisRangeComponent';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { BarChartContainerProps, BarChartDataPoint } from './types/chartComponentTypes';
import { DataService } from '../Data/DataService';

const BarChartContainer: React.FC<BarChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [data, setData] = useState<BarChartDataPoint[]>([]);
  const [displayData, setDisplayData] = useState<BarChartDataPoint[]>([]);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(400);
  const [yAxisRange, setYAxisRange] = useState<{ min: number, max: number }>({ min: 0, max: 100 });
  const [currentDataType, setCurrentDataType] = useState<string>(dataType);

  // Fetch historical data when the data type changes
  useEffect(() => {
    const fetchHistoricalData = async () => {
      const dataService = DataService.getInstance();
      const historicalData = await dataService.fetchHistoricalData(dataType);
      const mappedData = historicalData.map(d => ({ x: d.timestamp, y: d.value }));
      setData(mappedData);
      setDisplayData(mappedData.slice(-dataPoints));
    };

    // Clear existing data when the data type changes
    if (currentDataType !== dataType) {
      setData([]);
      setDisplayData([]);
      setCurrentDataType(dataType);
      fetchHistoricalData();
    }
  }, [dataType, dataPoints, currentDataType]);

  // Update displayed data when data or display parameters change
  useEffect(() => {
    const start = Math.max(0, data.length - dataPoints);
    const end = data.length;
    setDisplayData(data.slice(start, end));
  }, [data, dataPoints]);

  const handleRangeChange = (filteredData: { x: string, y: number }[], min: number, max: number) => {
    setYAxisRange({ min, max });
    setDisplayData(filteredData);
  };

  const handleSpikeDetected = (spike: { x: string, y: number }) => {
    console.log('Spike detected:', spike);
  };

  const handleDataPointsChange = (newDataPoints: number) => {
    setDataPoints(newDataPoints);
  };

  return (
    <LatestDataComponent dataType={dataType}>
      {(combinedData) => {
        // Map combinedData to the appropriate format for the chart
        const mappedData = combinedData.map(d => ({ x: d.timestamp, y: d.value }));

        // Update data state with combined historical and live data
        if (JSON.stringify(data) !== JSON.stringify(mappedData)) {
          setData(mappedData);
        }

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
              <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width, height }}>
                <Header
                  title={title}
                  dataType={dataType}
                  onDataTypeChange={(newDataType) => {
                    // Clear existing data when the data type changes
                    setData([]);
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
