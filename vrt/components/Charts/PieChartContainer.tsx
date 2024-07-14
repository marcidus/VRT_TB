/**
 * Author: Alexandre Martroye de Joly
 * Description: This component renders a draggable and resizable pie chart that receives real-time data updates
 *              from a server. It also includes a header for settings.
 */

import React, { useEffect, useState } from 'react';
import Header from './common/Header';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Draggable from 'react-draggable';
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';

// Define the structure of a data point for the chart
interface ChartDataPoint {
  x: string;
  y: number;
}

// Define the props for the PieChartContainer component
interface PieChartContainerProps {
  dataType: string;
  title: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  onDelete: () => void;
}

// Initialize an empty array for the initial data
const initialData: ChartDataPoint[] = [];

/**
 * Helper function to truncate the timestamp to a more manageable format.
 * @param timestamp - The original timestamp string.
 * @returns A truncated timestamp string.
 */
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
  const [data, setData] = useState<ChartDataPoint[]>(initialData); // State to hold all the chart data points
  const [displayData, setDisplayData] = useState<ChartDataPoint[]>(initialData); // State to hold the displayed chart data points
  const [dataPoints, setDataPoints] = useState<number>(10); // State to manage the number of displayed data points
  const [width, setWidth] = useState<number>(400); // State to manage the width of the chart container
  const [height, setHeight] = useState<number>(400); // State to manage the height of the chart container

  // Effect to handle incoming data from the server
  useEffect(() => {
    setData(initialData);

    // Initialize the EventSource to receive real-time data
    const eventSource = new EventSource('http://localhost:3001/events');

    // Event listener for incoming messages
    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        const decodedData = atob(newData.data);
        const parsedData = JSON.parse(decodedData);

        // Check if the received data contains the specified dataType
        if (parsedData[dataType] !== undefined) {
          const truncatedTimestamp = truncateTimestamp(newData.timestamp);
          if (isNaN(Date.parse(truncatedTimestamp))) {
            return;
          }

          const newValue = parseFloat(parsedData[dataType]);

          setData((prevData) => {
            const updatedData = [...prevData, { x: truncatedTimestamp, y: newValue }];

            // Limit the number of data points to 100
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

    // Error event listener
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    // Cleanup the EventSource on component unmount
    return () => eventSource.close();
  }, [dataType]);

  // Effect to update the displayed data when data or dataPoints change
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
