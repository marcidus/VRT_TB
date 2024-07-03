import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ChartComponentProps {
  dataType: string;
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

const ChartComponent: React.FC<ChartComponentProps> = ({ dataType }) => {
  const [data, setData] = useState<ChartDataPoint[]>(initialData);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');
    eventSource.onmessage = (event) => {
      try {
        console.log('SSE message received:', event.data);
        const newData = JSON.parse(event.data);
        const decodedData = atob(newData.data);
        const parsedData = JSON.parse(decodedData);

        console.log('Parsed data:', parsedData);

        if (parsedData[dataType] !== undefined) {
          const truncatedTimestamp = truncateTimestamp(newData.timestamp);
          if (isNaN(Date.parse(truncatedTimestamp))) {
            console.error('Invalid truncated timestamp:', truncatedTimestamp);
            return; // Exit early if the truncated timestamp is invalid
          }

          const newValue = parseFloat(parsedData[dataType]);
          console.log(`newValue for ${dataType}:`, newValue);

          setData((prevData) => {
            const updatedData = [...prevData, { x: truncatedTimestamp, y: newValue }];

            if (updatedData.length > 10) {
              updatedData.shift();
            }

            console.log('Updated data:', updatedData);

            return updatedData;
          });
        } else {
          console.error(`Data type ${dataType} not found in parsed data`);
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
    console.log('Current data for chart:', JSON.stringify(data, null, 2));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
