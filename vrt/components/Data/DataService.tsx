export class DataService {
  private static instance: DataService;
  private eventSource: EventSource | null;
  private dataCallbacks: Map<string, ((data: any) => void)[]>;
  private headersUpdatedCallbacks: ((headersUpdated: boolean) => void)[];

  private constructor() {
    this.eventSource = null;
    this.dataCallbacks = new Map();
    this.headersUpdatedCallbacks = [];

    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      this.eventSource = new EventSource('http://localhost:3001/events');

      this.eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        const decodedData = atob(newData.data);
        const parsedData = JSON.parse(decodedData);

        console.log('Received data:', parsedData);

        this.dataCallbacks.forEach((callbacks, dataType) => {
          if (parsedData[dataType] !== undefined) {
            callbacks.forEach(callback => callback({ timestamp: newData.timestamp, value: parsedData[dataType] }));
          }
        });
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
      };
    }
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public subscribe(dataType: string, callback: (data: any) => void): void {
    if (!this.dataCallbacks.has(dataType)) {
      this.dataCallbacks.set(dataType, []);
    }
    this.dataCallbacks.get(dataType)?.push(callback);
  }

  public unsubscribe(dataType: string, callback: (data: any) => void): void {
    const callbacks = this.dataCallbacks.get(dataType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.dataCallbacks.delete(dataType);
      }
    }
  }

  public async fetchHeadersUpdated(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/headers-updated');
      const data = await response.json();
      return data.headersUpdated;
    } catch (error) {
      console.error('Error fetching headersUpdated state:', error);
      return false;
    }
  }

  public async toggleHeadersUpdated(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/toggle-headers-updated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      this.headersUpdatedCallbacks.forEach(callback => callback(data.headersUpdated));
      return data.headersUpdated;
    } catch (error) {
      console.error('Error toggling headersUpdated state:', error);
      return false;
    }
  }

  public async fetchHistoricalData(sensorType: string): Promise<{ timestamp: string; value: number }[]> {
    try {
      const response = await fetch(`http://localhost:3001/telemetry/${sensorType}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching historical data for sensor ${sensorType}:`, error);
      return [];
    }
  }
  

  public subscribeToHeadersUpdated(callback: (headersUpdated: boolean) => void): void {
    this.headersUpdatedCallbacks.push(callback);
  }

  public unsubscribeFromHeadersUpdated(callback: (headersUpdated: boolean) => void): void {
    const index = this.headersUpdatedCallbacks.indexOf(callback);
    if (index !== -1) {
      this.headersUpdatedCallbacks.splice(index, 1);
    }
  }

  public async fetchHeaders(): Promise<string[]> {
    const response = await fetch('http://localhost:3001/data-types');
    return await response.json();
  }
}
