import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import LatestDataComponent from './LatestDataComponent';

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
    { i: '1', x: 0, y: 0, w: 3, h: 2, title: 'Left Engine Temp', dataType: 'Left_Engine_Temp' },
    { i: '2', x: 3, y: 0, w: 3, h: 2, title: 'Right Engine Temp', dataType: 'Right_Engine_Temp' },
    { i: '3', x: 6, y: 0, w: 3, h: 2, title: 'Inverter', dataType: 'Left_Inverter_Temperature' },
  ]);

  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
      {layout.map(item => (
        <div key={item.i} className="border rounded shadow p-2">
          <div className="text-center font-bold">{item.title}</div>
          <LatestDataComponent dataType={item.dataType} />
        </div>
      ))}
    </GridLayout>
  );
};

export default GridLayoutComponent;
