/**
 * Author: Alexandre Martroye de Joly
 * Description: This component listens for server-sent events (SSE) to display the latest data for a specified data type.
 *              It establishes an SSE connection to receive updates and updates the state when new data is received.
 */

import React, { useEffect, useState } from 'react';

// Props for the LatestDataComponent
interface LatestDataComponentProps {
  dataType: string; // The data type to listen for and display
}

const LatestDataComponent: React.FC<LatestDataComponentProps> = ({ dataType }) => {
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    // Establish an SSE connection to receive data updates
    const eventSource = new EventSource('http://localhost:3001/events');
    
    // Handle incoming messages from the SSE
    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      const newData = JSON.parse(event.data);

      // Parse the received data
      const parsedData = JSON.parse(Buffer.from(newData.data, 'base64').toString('utf-8'));

      // Update the state if the data type matches
      if (parsedData[dataType] !== undefined) {
        console.log('Updating data for:', dataType);
        setLatestData({ timestamp: newData.timestamp, value: parsedData[dataType] });
      }
    };

    // Handle SSE errors
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    // Cleanup the SSE connection on component unmount
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
