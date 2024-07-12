import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Draggable from 'react-draggable';
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface PieChartContainerProps {
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

const PieChartContainer: React.FC<PieChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete
}) => {
  const [data, setData] = useState<ChartDataPoint[]>(initialData);
  const [displayData, setDisplayData] = useState<ChartDataPoint[]>(initialData);
  const [dataPoints, setDataPoints] = useState<number>(10);
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(400);

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
            onDataTypeChange={onDataTypeChange}
            availableDataTypes={availableDataTypes}
            dataPoints={dataPoints}
            onDataPointsChange={setDataPoints}
          />
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={displayData}
                dataKey="y"
                nameKey="x"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
            Delete
          </button>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default PieChartContainer;
