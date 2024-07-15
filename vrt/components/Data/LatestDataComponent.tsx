import React, { useEffect, useState } from 'react';
import { DataService } from './DataService';

interface LatestDataComponentProps {
  dataType: string;
  children: (data: any) => React.ReactNode;
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType, children }) => {
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    const dataService = DataService.getInstance();
    const updateData = (data: any) => {
      console.log('Latest data received for', dataType, ':', data);  // Log latest data for debugging
      setLatestData(data);
    };

    dataService.subscribe(dataType, updateData);

    return () => {
      dataService.unsubscribe(dataType, updateData);
    };
  }, [dataType]);

  return <>{children(latestData)}</>;
};

export default LatestDataComponent;
