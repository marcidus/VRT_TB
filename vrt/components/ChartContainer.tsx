/**
 * Author: Alexandre Martroye de Joly
 * Description: This component acts as a container for a chart. It handles fetching and processing real-time data,
 *              updating the chart display, and providing controls for adjusting the Y-axis range.
 */

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ChartComponent from './ChartComponent';
import YAxisRangeComponent from './YAxisRangeComponent';

// Define the structure of a data point for the chart
interface ChartDataPoint {
  x: string;
  y: number;
}

// Define the props for the ChartContainer component
interface ChartContainerProps {
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

const ChartContainer: React.FC<ChartContainerProps> = ({
  dataType,
  title,
  onDataTypeChange,
  availableDataTypes,
  onDelete,
}) => {
  const [data, setData] = useState<ChartDataPoint[]>(initialData); // State to hold all the chart data points
  const [displayData, setDisplayData] = useState<ChartDataPoint[]>(initialData); // State to hold the displayed chart data points
  const [dataPoints, setDataPoints] = useState<number>(10); // State to manage the number of displayed data points
  const [yAxisRange, setYAxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 }); // State to manage the Y-axis range
  const [offset, setOffset] = useState<number>(0); // State to manage the offset for dragging

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

  // Effect to update the displayed data when data, dataPoints, or offset change
  useEffect(() => {
    const start = Math.max(0, data.length - dataPoints - offset);
    const end = Math.max(0, data.length - offset);
    setDisplayData(data.slice(start, end));
  }, [data, dataPoints, offset]);

  /**
   * Handler for changing the Y-axis range.
   * @param filteredData - The filtered data points within the new range.
   * @param min - The new minimum value of the Y-axis range.
   * @param max - The new maximum value of the Y-axis range.
   */
  const handleRangeChange = (filteredData: { x: string; y: number }[], min: number, max: number) => {
    setDisplayData(filteredData);
    setYAxisRange({ min, max });
  };

  /**
   * Handler for detecting spikes in the data.
   * @param spike - The data point where a spike is detected.
   */
  const handleSpikeDetected = (spike: { x: string; y: number }) => {
    console.log('Spike detected:', spike);
  };

  /**
   * Handler for dragging the chart.
   * @param direction - The direction of the drag ('left' or 'right').
   */
  const handleDrag = (direction: 'left' | 'right') => {
    setOffset((prevOffset) => {
      const newOffset = direction === 'left' ? prevOffset + 10 : prevOffset - 10;
      return Math.max(0, newOffset);
    });
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
      <ChartComponent displayData={displayData} yAxisRange={yAxisRange} onDrag={handleDrag} />
      <button onClick={onDelete} className="bg-red-500 text-white rounded px-4 py-2 mt-2">
        Delete
      </button>
    </div>
  );
};

export default ChartContainer;
