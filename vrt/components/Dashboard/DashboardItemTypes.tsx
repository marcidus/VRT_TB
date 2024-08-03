/**
 * Author: Alexandre Martroye de Joly
 * Description: Type definitions for different items that can be included in a dashboard. These include chart items
 *              (line, bar, or pie charts) and car data items.
 */

// Interface to represent a chart item in the dashboard
export interface ChartItem {
  id: string; // Unique identifier for the chart item
  title: string; // Title of the chart
  dataType: string; // Data type that the chart represents
  chartType: 'line' | 'bar'; // Type of the chart
  x: number; // X-coordinate of the chart's position
  y: number; // Y-coordinate of the chart's position
  width: number; // Width of the chart
  height: number; // Height of the chart
}

// Interface to represent a car data item in the dashboard
export interface CarDataItem {
  id: string; // Unique identifier for the car data item
  type: 'car'; // Type of the item, fixed as 'car'
  x: number; // X-coordinate of the item's position
  y: number; // Y-coordinate of the item's position
  width: number; // Width of the item
  height: number; // Height of the item
}

// Union type to represent any item that can be included in the dashboard
export type DashboardItem = ChartItem | CarDataItem;
