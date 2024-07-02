import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import ChartComponent from './ChartComponent';

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

  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={100} width={1200}>
      {layout.map(item => (
        <div key={item.i} className="border rounded shadow p-2" style={{ height: '100%' }}>
          <div className="text-center font-bold">{item.title}</div>
          <div style={{ height: 'calc(100% - 2rem)' }}>
            <ChartComponent dataType={item.dataType} />
          </div>
        </div>
      ))}
    </GridLayout>
  );
};

export default GridLayoutComponent;
