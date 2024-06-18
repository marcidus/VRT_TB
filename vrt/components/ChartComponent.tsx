import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

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

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

interface ChartComponentProps {
  dataType: string;
  chartType: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ dataType, chartType }) => {
  // Use dataType as needed in your chart configuration
  console.log("DataType: ", dataType); // Example usage

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
