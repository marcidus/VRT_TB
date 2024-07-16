import React, { useEffect, useState } from 'react';
import { DataService } from './DataService';

interface LatestDataComponentProps {
  dataType: string;
  children: (data: { timestamp: string; value: number }[]) => React.ReactNode;
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType, children }) => {
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; value: number }[]>([]);
  const [liveData, setLiveData] = useState<{ timestamp: string; value: number }[]>([]);

  useEffect(() => {
    const dataService = DataService.getInstance();

    const fetchHistoricalData = async () => {
      const data = await dataService.fetchHistoricalData(dataType);
      setHistoricalData(data);
    };

    const updateData = (data: { timestamp: string; value: number }) => {
      setLiveData((prevLiveData) => [...prevLiveData, data]);
    };

    fetchHistoricalData();
    dataService.subscribe(dataType, updateData);

    return () => {
      dataService.unsubscribe(dataType, updateData);
      setLiveData([]); // Clear live data when unsubscribing
    };
  }, [dataType]);

  const combinedData = [...historicalData, ...liveData];

  return <>{children(combinedData)}</>;
};

export default LatestDataComponent;
