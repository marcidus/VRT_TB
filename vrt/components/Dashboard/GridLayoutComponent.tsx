/**
 * Author: Alexandre Martroye de Joly
 * Description: This component manages the layout of the dashboard, including adding, deleting, resizing, and dragging
 *              charts. It also handles saving, loading, importing, and exporting dashboard templates.
 */

import React, { useState, useEffect } from 'react';
import ChartContainer from '../Charts/ChartContainer';
import BarChartContainer from '../Charts/BarChartContainer';
import PieChartContainer from '../Charts/PieChartContainer';
import AddChartForm from './AddChartForm';
import CarDataDisplay from '../Charts/CarDataDisplay';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import HeaderToggleButton from './HeaderToggleButton';
import 'react-resizable/css/styles.css';
import { CarDataItem, ChartItem, DashboardItem } from './DashboardItemTypes';
import DashboardTemplates from './DashboardTemplates';

// Props for the GridLayoutComponent
interface GridLayoutComponentProps {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
  onUpdateCharts: (charts: DashboardItem[]) => void;
  onUpdateSelectedDataTypes: (selectedDataTypes: { [key: string]: string }) => void;
}

const GridLayoutComponent: React.FC<GridLayoutComponentProps> = ({ charts: initialCharts, selectedDataTypes: initialSelectedDataTypes, onUpdateCharts, onUpdateSelectedDataTypes }) => {
  const [charts, setCharts] = useState<DashboardItem[]>(initialCharts);
  const [availableDataTypes, setAvailableDataTypes] = useState<string[]>([]);
  const [carData, setCarData] = useState<{ [key: string]: number }>({
    Left_Front_Wheel: 0,
    Right_Front_Wheel: 0,
    Left_Back_Wheel: 0,
    Right_Back_Wheel: 0,
    Battery: 0,
  });

  const [selectedDataTypes, setSelectedDataTypes] = useState<{ [key: string]: string }>(initialSelectedDataTypes);
  const [templates, setTemplates] = useState<{ [key: string]: DashboardItem[] }>({});

  const [headersUpdated, setHeadersUpdated] = useState(false);

  // Fetch available data types from the server
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
      fetchHeaders();
      const interval = setInterval(fetchHeaders, 5000);
      return () => clearInterval(interval);
    }
  }, [headersUpdated]);

  // Load templates from local storage when the component mounts
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('dashboardTemplates') || '{}');
    setTemplates(savedTemplates);
  }, []);

  // Save templates to local storage when they change
  useEffect(() => {
    localStorage.setItem('dashboardTemplates', JSON.stringify(templates));
  }, [templates]);

  // Toggle the state of headersUpdated
  const toggleHeadersUpdated = (newState: boolean) => {
    setHeadersUpdated(newState);
  };

  // Handle changing the data type of a chart
  const handleDataTypeChange = (index: number, newDataType: string) => {
    const newCharts = [...charts];
    const chart = newCharts[index] as ChartItem;
    newCharts[index] = {
      ...chart,
      dataType: newDataType,
      title: newDataType.replace(/_/g, ' '),
    };
    setCharts(newCharts);
    onUpdateCharts(newCharts);
  };

  // Handle adding a new chart
  const handleAddChart = (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => {
    let newItem: DashboardItem;
    if (chartType === 'car') {
      newItem = {
        id: (charts.length + 1).toString(),
        type: 'car',
        x: 0,
        y: 0,
        width: 400,
        height: 600,
      } as CarDataItem;
    } else {
      newItem = {
        id: (charts.length + 1).toString(),
        title,
        dataType,
        chartType,
        x: 0,
        y: 0,
        width: 300,
        height: 200,
      } as ChartItem;
    }
    const newCharts = [...charts, newItem];
    setCharts(newCharts);
    onUpdateCharts(newCharts);
  };

  // Handle deleting a chart
  const handleDeleteChart = (index: number) => {
    const newCharts = charts.filter((_, i) => i !== index);
    setCharts(newCharts);
    onUpdateCharts(newCharts);
  };

  // Handle dragging a chart
  const handleDragStop = (e: DraggableEvent, data: DraggableData, index: number) => {
    const newCharts = [...charts];
    newCharts[index].x = data.x;
    newCharts[index].y = data.y;
    setCharts(newCharts);
    onUpdateCharts(newCharts);
  };

  // Handle resizing a chart
  const handleResizeStop = (e: React.SyntheticEvent<Element>, data: ResizeCallbackData, index: number) => {
    const { size } = data;
    const newCharts = [...charts];
    newCharts[index].width = size.width;
    newCharts[index].height = size.height;
    setCharts(newCharts);
    onUpdateCharts(newCharts);
  };

  // Handle changing the data type of a car data display
  const handleCarDataTypeChange = (position: string, newDataType: string) => {
    const newSelectedDataTypes = {
      ...selectedDataTypes,
      [position]: newDataType,
    };
    setSelectedDataTypes(newSelectedDataTypes);
    onUpdateSelectedDataTypes(newSelectedDataTypes);
  };

  // Handle saving the current charts as a template
  const handleSaveAsTemplate = (templateName: string) => {
    setTemplates((prev) => ({
      ...prev,
      [templateName]: charts
    }));
  };

  // Handle loading a template
  const handleLoadTemplate = (templateName: string) => {
    const templateCharts = templates[templateName];
    if (templateCharts) {
      setCharts(templateCharts);
      onUpdateCharts(templateCharts);
    }
  };

  // Handle importing a template
  const handleImportTemplate = (templateName: string, importedCharts: DashboardItem[]) => {
    setTemplates((prev) => ({
      ...prev,
      [templateName]: importedCharts
    }));
  };

  // Handle deleting a template
  const handleDeleteTemplate = (templateName: string) => {
    setTemplates((prev) => {
      const { [templateName]: _, ...rest } = prev;
      return rest;
    });
  };

  // Handle renaming a template
  const handleRenameTemplate = (oldTemplateName: string, newTemplateName: string) => {
    const templateCharts = templates[oldTemplateName];
    if (templateCharts) {
      setTemplates((prev) => {
        const { [oldTemplateName]: _, ...rest } = prev;
        return {
          ...rest,
          [newTemplateName]: templateCharts
        };
      });
    }
  };

  // Set initial charts when the component mounts or when initialCharts prop changes
  useEffect(() => {
    setCharts(initialCharts);
  }, [initialCharts]);

  // Set initial selected data types when the component mounts or when initialSelectedDataTypes prop changes
  useEffect(() => {
    setSelectedDataTypes(initialSelectedDataTypes);
  }, [initialSelectedDataTypes]);

  return (
    <div className="layout" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <HeaderToggleButton headersUpdated={headersUpdated} toggleHeadersUpdated={toggleHeadersUpdated} />
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
                    onUpdateCharts(newCharts);
                  }}
                />
              )}
            </div>
          </ResizableBox>
        </Draggable>
      ))}
      <DashboardTemplates
        templates={templates}
        onLoadTemplate={handleLoadTemplate}
        onImportTemplate={handleImportTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onRenameTemplate={handleRenameTemplate}
        onSaveTemplate={handleSaveAsTemplate}
      />
    </div>
  );
};

export default GridLayoutComponent;
