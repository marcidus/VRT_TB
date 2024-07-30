import React, { useEffect, useState } from 'react';
import { DataService } from './DataService';

interface LatestDataComponentProps {
  dataType: string;
  children: (historicalData: { timestamp: string; value: number }[], liveData: { timestamp: string; value: number }[]) => React.ReactNode;
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType, children }) => {
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; value: number }[]>([]);
  const [liveData, setLiveData] = useState<{ timestamp: string; value: number }[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const dataService = DataService.getInstance();

    const fetchHistoricalData = async () => {
      setIsFetching(true);
      const data = await dataService.fetchHistoricalData(dataType);
      setHistoricalData(data.reverse()); // Reverse to have the most recent data last
      setIsFetching(false);
    };

    const updateData = (data: { timestamp: string; value: number }) => {
      setLiveData((prevLiveData) => {
        const newLiveData = [...prevLiveData, data];
        return newLiveData.slice(-100); // Keep only the last 100 data points
      });
    };

    fetchHistoricalData();
    dataService.subscribe(dataType, updateData);

    return () => {
      dataService.unsubscribe(dataType, updateData);
      setLiveData([]); // Clear live data when unsubscribing
    };
  }, [dataType]);

  if (isFetching) {
    return <div>Loading...</div>; // Show loading state while fetching historical data
  }

  return <>{children(historicalData, liveData)}</>;
};

export default LatestDataComponent;
