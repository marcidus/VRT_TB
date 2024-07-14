/**
 * Author: Alexandre Martroye de Joly
 * Description: Type definitions for chart data points and structured chart data used in various chart components.
 */

// Interface to represent a single data point in the chart
export interface ChartDataPoint {
  timestamp: string; // The timestamp of the data point
  value: number; // The value of the data point
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
