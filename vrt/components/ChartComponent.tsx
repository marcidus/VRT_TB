import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartData } from './chartComponentTypes';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface ChartComponentProps {
  dataType: string;
  chartType: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ dataType, chartType }) => {
  const [data, setData] = useState<ChartData>(initialData);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      if (newData.dataType === dataType) {
        setData((prevData) => {
          const updatedData = { ...prevData };
          updatedData.labels.push(newData.timestamp);
          updatedData.datasets[0].data.push(newData.value);

          if (updatedData.labels.length > 10) {
            updatedData.labels.shift();
            updatedData.datasets[0].data.shift();
          }

          return updatedData;
        });
      }
    };
    return () => ws.close();
  }, [dataType]);

  switch (chartType) {
    case 'LineChart':
      return <Line data={data} />;
    case 'BarChart':
      return <Bar data={data} />;
    case 'Map':
      return <div>Map Component Here</div>;
    default:
      return <div>Invalid chart type</div>; // Provide a default case that returns a valid JSX element
  }
};

export default ChartComponent;
