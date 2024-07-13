import { ChartDataPoint } from './chartComponentTypes';

export const fetchDataForSensor = async (sensorId: string): Promise<ChartDataPoint[]> => {
  const response = await fetch(`/api/sensors/${sensorId}/data`);
  if (!response.ok) {
    throw new Error('Failed to fetch data for sensor');
  }
  const data = await response.json();
  return data.map((entry: any) => ({
    x: entry.timestamp,
    y: entry.value,
  }));
};
