// types/chartComponentTypes.ts

/**
 * Author: Alexandre Martroye de Joly
 * Description: Type definitions for chart data points and structured chart data used in various chart components.
 */

// Interface to represent a single data point in the chart
export interface ChartDataPoint {
  timestamp: string; // The timestamp of the data point
  value: number; // The value of the data point
}

// Interface to represent a single data point in the bar chart
export interface BarChartDataPoint {
  x: string; // The x-axis value (timestamp)
  y: number; // The y-axis value
}

// Interface to represent the structured data used in the chart components
export interface ChartData {
  labels: string[]; // Array of labels for the X-axis
  datasets: {
    label: string; // The label for the dataset
    backgroundColor: string; // The background color for the dataset in the chart
    borderColor: string; // The border color for the dataset in the chart
    data: number[]; // Array of data values corresponding to the labels
  }[];
}

// Props for CarDataDisplay component
export interface CarDataDisplayProps {
  onDelete: () => void;
  availableDataTypes: string[];
  onDataTypeChange: (key: string, newDataType: string) => void;
  selectedDataTypes: { [key: string]: string };
  onPositionChange: (x: number, y: number) => void;
  data: { [key: string]: number };
}

// Props for ChartContainer component
export interface ChartContainerProps {
  dataType: string;
  title: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  onDelete: () => void;
  globalOffset: number; // Add this line
  setGlobalOffset: React.Dispatch<React.SetStateAction<number>>; // Add this line
  
}

// Props for PieChartContainer component
export interface PieChartContainerProps {
  dataType: string;
  title: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  onDelete: () => void;
}

// Props for BarChartContainer component
export interface BarChartContainerProps {
  dataType: string;
  title: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  onDelete: () => void;
  globalOffset: number; // Add this line
  setGlobalOffset: React.Dispatch<React.SetStateAction<number>>; // Add this line
}
