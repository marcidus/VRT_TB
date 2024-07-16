import React, { useEffect, useState } from 'react';
import { DataService } from './DataService';

interface LatestLiveDataComponentProps {
  dataType: string;
  children: (latestData: { timestamp: string; value: number } | null) => React.ReactNode;
}

const LatestLiveDataComponent: React.FC<LatestLiveDataComponentProps> = ({ dataType, children }) => {
  const [latestData, setLatestData] = useState<{ timestamp: string; value: number } | null>(null);

  useEffect(() => {
    const dataService = DataService.getInstance();

    const updateData = (data: { timestamp: string; value: number }) => {
      setLatestData(data);
    };

    dataService.subscribe(dataType, updateData);

    return () => {
      dataService.unsubscribe(dataType, updateData);
    };
  }, [dataType]);

  return <>{children(latestData)}</>;
};

export default LatestLiveDataComponent;
