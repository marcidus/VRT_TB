import React, { useState, useEffect } from 'react';
import ChartContainer from './ChartContainer';
import BarChartContainer from './Charts/BarChartContainer';
import PieChartContainer from './Charts/PieChartContainer';
import AddChartForm from './AddChartForm';
import CarDataDisplay from './Charts/CarDataDisplay';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import HeaderToggleButton from './HeaderToggleButton'; // Ensure to import HeaderToggleButton
import 'react-resizable/css/styles.css';

interface ChartItem {
  id: string;
  title: string;
  dataType: string;
  chartType: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CarDataItem {
  id: string;
  type: 'car';
  x: number;
  y: number;
  width: number;
  height: number;
}

type DashboardItem = ChartItem | CarDataItem;

const GridLayoutComponent: React.FC = () => {
  const [charts, setCharts] = useState<DashboardItem[]>([
    { id: '1', title: 'Left Engine Temp', dataType: 'Left_Engine_Temp', chartType: 'line', x: 0, y: 0, width: 300, height: 200 },
    { id: '2', title: 'Right Engine Temp', dataType: 'Right_Engine_Temp', chartType: 'line', x: 200, y: 0, width: 300, height: 200 },
    { id: '3', title: 'Inverter Temp', dataType: 'Left_Inverter_Temperature', chartType: 'line', x: 400, y: 0, width: 300, height: 200 },
  ]);
  const [availableDataTypes, setAvailableDataTypes] = useState<string[]>([]);
  const [carData, setCarData] = useState<{ [key: string]: number }>({
    Left_Front_Wheel: 0,
    Right_Front_Wheel: 0,
    Left_Back_Wheel: 0,
    Right_Back_Wheel: 0,
    Battery: 0,
  });

  const [selectedDataTypes, setSelectedDataTypes] = useState<{ [key: string]: string }>({
    Left_Front_Wheel: availableDataTypes[0] || '',
    Right_Front_Wheel: availableDataTypes[0] || '',
    Left_Back_Wheel: availableDataTypes[0] || '',
    Right_Back_Wheel: availableDataTypes[0] || '',
    Battery: availableDataTypes[0] || '',
  });

  const [headersUpdated, setHeadersUpdated] = useState(false);

  // Function to fetch headers
  const fetchHeaders = async () => {
    try {
      const response = await fetch('http://localhost:3001/data-types');
      const data = await response.json();
      setAvailableDataTypes(data);
      setSelectedDataTypes((prev) => ({
        Left_Front_Wheel: data[0],
        Right_Front_Wheel: data[0],
        Left_Back_Wheel: data[0],
        Right_Back_Wheel: data[0],
        Battery: data[0],
        ...prev,
      }));
    } catch (error) {
      console.error('Error fetching data types:', error);
    }
  };

  useEffect(() => {
    if (headersUpdated) {
      fetchHeaders(); // Initial fetch
      const interval = setInterval(fetchHeaders, 5000); // Fetch headers every 5 seconds
      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [headersUpdated]);

  const toggleHeadersUpdated = (newState) => {
    setHeadersUpdated(newState);
  };

  const handleDataTypeChange = (index: number, newDataType: string) => {
    const newCharts = [...charts];
    const chart = newCharts[index] as ChartItem;
    newCharts[index] = {
      ...chart,
      dataType: newDataType,
      title: newDataType.replace(/_/g, ' '),
    };
    setCharts(newCharts);
  };

  const handleAddChart = (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => {
    if (chartType === 'car') {
      const newItem: CarDataItem = {
        id: (charts.length + 1).toString(),
        type: 'car',
        x: 0,
        y: 0,
        width: 400,
        height: 600,
      };
      setCharts([...charts, newItem]);
    } else {
      const newItem: ChartItem = {
        id: (charts.length + 1).toString(),
        title,
        dataType,
        chartType,
        x: 0,
        y: 0,
        width: 300,
        height: 200,
      };
      setCharts([...charts, newItem]);
    }
  };

  const handleDeleteChart = (index: number) => {
    const newCharts = charts.filter((_, i) => i !== index);
    setCharts(newCharts);
  };

  const handleDragStop = (e: any, data: any, index: number) => {
    const newCharts = [...charts];
    newCharts[index].x = data.x;
    newCharts[index].y = data.y;
    setCharts(newCharts);
  };

  const handleResizeStop = (e: any, data: any, index: number) => {
    const newCharts = [...charts];
    newCharts[index].width = data.size.width;
    newCharts[index].height = data.size.height;
    setCharts(newCharts);
  };

  const handleCarDataTypeChange = (position: string, newDataType: string) => {
    setSelectedDataTypes((prev) => ({
      ...prev,
      [position]: newDataType,
    }));
  };

  return (
    <div className="layout" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <HeaderToggleButton headersUpdated={headersUpdated} toggleHeadersUpdated={toggleHeadersUpdated} /> {/* Ensure the toggle button is added */}
      <AddChartForm availableDataTypes={availableDataTypes} onAddChart={handleAddChart} />
      {charts.map((item, index) => (
        <Draggable
          key={item.id}
          handle=".handle-bar"
          defaultPosition={{ x: item.x, y: item.y }}
          onStop={(e, data) => handleDragStop(e, data, index)}
        >
          <ResizableBox
            width={item.width}
            height={item.height}
            minConstraints={[100, 100]}
            maxConstraints={[1000, 1000]}
            onResizeStop={(e, data) => handleResizeStop(e, data, index)}
          >
            <div className="border rounded shadow p-2" style={{ width: '100%', height: '100%' }}>
              {'chartType' in item && item.chartType === 'line' && (
                <ChartContainer
                  dataType={item.dataType}
                  title={item.title}
                  onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
                  availableDataTypes={availableDataTypes}
                  onDelete={() => handleDeleteChart(index)}
                />
              )}
              {'chartType' in item && item.chartType === 'bar' && (
                <BarChartContainer
                  dataType={item.dataType}
                  title={item.title}
                  onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
                  availableDataTypes={availableDataTypes}
                  onDelete={() => handleDeleteChart(index)}
                />
              )}
              {'chartType' in item && item.chartType === 'pie' && (
                <PieChartContainer
                  dataType={item.dataType}
                  title={item.title}
                  onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
                  availableDataTypes={availableDataTypes}
                  onDelete={() => handleDeleteChart(index)}
                />
              )}
              {'type' in item && item.type === 'car' && (
                <CarDataDisplay
                  data={carData}
                  onDelete={() => handleDeleteChart(index)}
                  availableDataTypes={availableDataTypes}
                  onDataTypeChange={handleCarDataTypeChange}
                  selectedDataTypes={selectedDataTypes}
                  onPositionChange={(x, y) => {
                    const newCharts = [...charts];
                    newCharts[index].x = x;
                    newCharts[index].y = y;
                    setCharts(newCharts);
                  }}
                />
              )}
            </div>
          </ResizableBox>
        </Draggable>
      ))}
    </div>
  );
};

export default GridLayoutComponent;
