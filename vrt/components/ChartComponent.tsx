import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: { x: string, y: number }[];
  }[];
}

interface ChartComponentProps {
  dataType: string;
}

const initialData: ChartData = {
  labels: [],
  datasets: [
    {
      label: 'Telemetry Data',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: [],
    },
  ],
};

const truncateTimestamp = (timestamp: string): string => {
  try {
    // Split the timestamp into date part and fractional seconds part
    const [datePart, fractionalPart] = timestamp.split('.');
    if (fractionalPart) {
      // Truncate the fractional part to three decimal places
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
  const [data, setData] = useState<ChartData>(initialData);

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
            const updatedData = { ...prevData };
            updatedData.labels = [...prevData.labels, truncatedTimestamp];
            updatedData.datasets[0].data = [
              ...prevData.datasets[0].data,
              { x: truncatedTimestamp, y: newValue }
            ];

            if (updatedData.labels.length > 10) {
              updatedData.labels.shift();
              updatedData.datasets[0].data.shift();
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

  const options: any = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
          displayFormats: {
            second: 'HH:mm:ss',
          },
          title: {
            display: true,
            text: 'Timestamp',
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // Set the y-axis maximum value to 100
        title: {
          display: true,
          text: dataType.replace(/_/g, ' '),
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
