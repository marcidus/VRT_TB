import React, { useState, useEffect } from 'react';
import ChartContainer from './ChartContainer';
import BarChartContainer from './Charts/BarChartContainer'; // Importez les nouveaux types de graphiques
import PieChartContainer from './Charts/PieChartContainer'; // Importez les nouveaux types de graphiques
import AddChartForm from './AddChartForm';

interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  dataType: string;
  chartType: string; // Ajoutez chartType ici
}

const GridLayoutComponent: React.FC = () => {
  const [layout, setLayout] = useState<GridItem[]>([
    { i: '1', x: 0, y: 0, w: 4, h: 3, title: 'Left Engine Temp', dataType: 'Left_Engine_Temp', chartType: 'line' },
    { i: '2', x: 4, y: 0, w: 4, h: 3, title: 'Right Engine Temp', dataType: 'Right_Engine_Temp', chartType: 'line' },
    { i: '3', x: 8, y: 0, w: 4, h: 3, title: 'Inverter Temp', dataType: 'Left_Inverter_Temperature', chartType: 'line' },
  ]);

  const [availableDataTypes, setAvailableDataTypes] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    fetch('http://localhost:3001/data-types')
      .then((response) => response.json())
      .then((data) => setAvailableDataTypes(data))
      .catch((error) => console.error('Error fetching data types:', error));
  }, []);

  const handleDataTypeChange = (index: number, newDataType: string) => {
    const newLayout = [...layout];
    newLayout[index] = {
      ...newLayout[index],
      dataType: newDataType,
      title: newDataType.replace(/_/g, ' '),
    };
    setLayout(newLayout);
  };

  const handleAddChart = (title: string, dataType: string, chartType: string) => {
    const newItem: GridItem = {
      i: (layout.length + 1).toString(),
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      title,
      dataType,
      chartType, // Ajoutez chartType ici
    };
    setLayout([...layout, newItem]);
    setRefreshKey((prevKey) => prevKey + 1); // Force re-render
  };

  const handleDeleteChart = (index: number) => {
    const newLayout = layout.filter((item, i) => i !== index);
    setLayout(newLayout);
    setRefreshKey((prevKey) => prevKey + 1); // Force re-render
  };

  return (
    <div className="layout" key={refreshKey}>
      <AddChartForm availableDataTypes={availableDataTypes} onAddChart={handleAddChart} />
      {layout.map((item, index) => (
        <div key={item.i} className="border rounded shadow p-2">
          {item.chartType === 'line' && (
            <ChartContainer
              dataType={item.dataType}
              title={item.title}
              onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
              availableDataTypes={availableDataTypes}
              onDelete={() => handleDeleteChart(index)}
            />
          )}
          {item.chartType === 'bar' && (
            <BarChartContainer
              dataType={item.dataType}
              title={item.title}
              onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
              availableDataTypes={availableDataTypes}
              onDelete={() => handleDeleteChart(index)}
            />
          )}
          {item.chartType === 'pie' && (
            <PieChartContainer
              dataType={item.dataType}
              title={item.title}
              onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
              availableDataTypes={availableDataTypes}
              onDelete={() => handleDeleteChart(index)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GridLayoutComponent;
