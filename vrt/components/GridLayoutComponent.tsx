import React, { useState, useEffect } from 'react';
import ChartContainer from './ChartContainer';

interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  dataType: string;
}

const GridLayoutComponent: React.FC = () => {
  const [layout, setLayout] = useState<GridItem[]>([
    { i: '1', x: 0, y: 0, w: 4, h: 3, title: 'Left Engine Temp', dataType: 'Left_Engine_Temp' },
    { i: '2', x: 4, y: 0, w: 4, h: 3, title: 'Right Engine Temp', dataType: 'Right_Engine_Temp' },
    { i: '3', x: 8, y: 0, w: 4, h: 3, title: 'Inverter Temp', dataType: 'Left_Inverter_Temperature' },
  ]);

  const [availableDataTypes, setAvailableDataTypes] = useState<string[]>([]);

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

  return (
    <div className="layout">
      {layout.map((item, index) => (
        <div key={item.i} className="border rounded shadow p-2">
          <ChartContainer
            dataType={item.dataType}
            title={item.title}
            onDataTypeChange={(newDataType) => handleDataTypeChange(index, newDataType)}
            availableDataTypes={availableDataTypes}
          />
        </div>
      ))}
    </div>
  );
};

export default GridLayoutComponent;
