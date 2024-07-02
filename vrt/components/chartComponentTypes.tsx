export interface ChartDataPoint {
    timestamp: string;
    value: number;
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      backgroundColor: string;
      borderColor: string;
      data: number[];
    }[];
  }
  