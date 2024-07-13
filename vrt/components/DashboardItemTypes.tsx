export interface ChartItem {
    id: string;
    title: string;
    dataType: string;
    chartType: 'line' | 'bar' | 'pie';
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface CarDataItem {
    id: string;
    type: 'car';
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export type DashboardItem = ChartItem | CarDataItem;
  