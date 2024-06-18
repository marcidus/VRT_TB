import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import ChartComponent from "./ChartComponent";

interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  dataType: string;
  chartType: string;
}

const GridLayoutComponent: React.FC = () => {
  const [layout, setLayout] = useState<GridItem[]>([
    { i: '1', x: 0, y: 0, w: 3, h: 2, title: 'MyTitle', dataType: 'data1', chartType: 'LineChart' },
    { i: '2', x: 3, y: 0, w: 3, h: 2, title: 'Inverter', dataType: 'data2', chartType: 'BarChart' },
    { i: '3', x: 6, y: 0, w: 3, h: 2, title: 'Race', dataType: 'data3', chartType: 'Map' },
  ]);

  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
      {layout.map(item => (
        <div key={item.i} className="border rounded shadow p-2">
          <div className="text-center font-bold">{item.title}</div>
          <ChartComponent dataType={item.dataType} chartType={item.chartType} />
        </div>
      ))}
    </GridLayout>
  );
};

export default GridLayoutComponent;
