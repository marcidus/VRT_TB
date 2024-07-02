import React, { useEffect, useState } from 'react';

interface LatestDataComponentProps {
  dataType: string;
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType }) => {
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');
    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      const newData = JSON.parse(event.data);

      // Parse the received data
      const parsedData = JSON.parse(Buffer.from(newData.data, 'base64').toString('utf-8'));

      if (parsedData[dataType] !== undefined) {
        console.log('Updating data for:', dataType);
        setLatestData({ timestamp: newData.timestamp, value: parsedData[dataType] });
      }
    };
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    return () => eventSource.close();
  }, [dataType]);

  return (
    <div>
      <h2>Latest Data for {dataType}</h2>
      {latestData ? (
        <pre>{JSON.stringify(latestData, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default LatestDataComponent;
