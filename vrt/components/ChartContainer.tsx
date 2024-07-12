import React, { useState, useEffect } from 'react';
import Header from './Header';
import ChartComponent from './ChartComponent';
import YAxisRangeComponent from './YAxisRangeComponent';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ChartContainerProps {
  dataType: string;
  title: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  onDelete: () => void;
}

const initialData: ChartDataPoint[] = [];

const truncateTimestamp = (timestamp: string): string => {
  try {
    const [datePart, fractionalPart] = timestamp.split('.');
    if (fractionalPart) {
      const truncatedFractionalPart = fractionalPart.slice(0, 3);
      return `${datePart}.${truncatedFractionalPart}Z`;
    }
    return timestamp;
  } catch (error) {
    console.error('Error truncating timestamp:', error);
    return timestamp;
  }
};

const ChartContainer: React.FC<ChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [data, setData] = useState<ChartDataPoint[]>(initialData);
  const [displayData, setDisplayData] = useState<ChartDataPoint[]>(initialData);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });

  useEffect(() => {
    setData(initialData);

    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        const decodedData = atob(newData.data);
        const parsedData = JSON.parse(decodedData);

        if (parsedData[dataType] !== undefined) {
          const truncatedTimestamp = truncateTimestamp(newData.timestamp);
          if (isNaN(Date.parse(truncatedTimestamp))) {
            return;
          }

          const newValue = parseFloat(parsedData[dataType]);

          setData((prevData) => {
            const updatedData = [...prevData, { x: truncatedTimestamp, y: newValue }];

            if (updatedData.length > 100) {
              updatedData.shift();
            }

            return updatedData;
          });
        }
      } catch (error) {
        console.error('Error processing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => eventSource.close();
  }, [dataType]);

  useEffect(() => {
    setDisplayData(data.slice(-dataPoints));
  }, [data, dataPoints]);

  const handleRangeChange = (filteredData: { x: string; y: number }[], min: number, max: number) => {
    setDisplayData(filteredData);
    setYAxisRange({ min, max });
  };

  const handleSpikeDetected = (spike: { x: string; y: number }) => {
    console.log('Spike detected:', spike);
  };

  return (
    <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
      <Header
        title={title}
        dataType={dataType}
        onDataTypeChange={onDataTypeChange}
        availableDataTypes={availableDataTypes}
        dataPoints={dataPoints}
        onDataPointsChange={setDataPoints}
      />
      <YAxisRangeComponent
        data={data}
        displayDataPoints={dataPoints}
        onRangeChange={handleRangeChange}
        onSpikeDetected={handleSpikeDetected}
      />
      <ChartComponent displayData={displayData} yAxisRange={yAxisRange} />
      <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
        Delete
      </button>
    </div>
  );
};

export default ChartContainer;
