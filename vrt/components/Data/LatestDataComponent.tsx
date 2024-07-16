import React, { useEffect, useState } from 'react';
import { DataService } from './DataService';

interface LatestDataComponentProps {
  dataType: string;
  children: (data: any) => React.ReactNode;
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType, children }) => {
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; value: number }[]>([]);
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    const dataService = DataService.getInstance();

    const fetchHistoricalData = async () => {
      const data = await dataService.fetchHistoricalData(dataType);
      setHistoricalData(data);
    };

    const updateData = (data: any) => {
      console.log('Latest data received for', dataType, ':', data);  // Log latest data for debugging
      setLatestData(data);
    };

    fetchHistoricalData();
    dataService.subscribe(dataType, updateData);

    return () => {
      dataService.unsubscribe(dataType, updateData);
    };
  }, [dataType]);

  const combinedData = historicalData.concat(latestData ? [latestData] : []);

  return <>{children(combinedData)}</>;
};

export default LatestDataComponent;
