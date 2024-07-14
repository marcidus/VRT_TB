/**
 * Author: Alexandre Martroye de Joly
 * Description: This function fetches data for a specific sensor from the API and transforms the data
 *              into the ChartDataPoint format.
 */

import { ChartDataPoint } from '../Charts/types/chartComponentTypes';

/**
 * Fetches data for a specific sensor from the API.
 * @param sensorId - The ID of the sensor to fetch data for.
 * @returns A promise that resolves to an array of ChartDataPoint objects.
 * @throws Will throw an error if the fetch operation fails.
 */
export const fetchDataForSensor = async (sensorId: string): Promise<ChartDataPoint[]> => {
  const response = await fetch(`/api/sensors/${sensorId}/data`);
  
  // Check if the response is not OK (status not in the range 200-299)
  if (!response.ok) {
    throw new Error('Failed to fetch data for sensor');
  }
  
  const data = await response.json();
  
  // Transform the data into ChartDataPoint format
  return data.map((entry: any) => ({
    x: entry.timestamp, // Assign the timestamp to the x property
    y: entry.value,     // Assign the value to the y property
  }));
};
