import React, { useState } from 'react';
import GridLayoutComponent from './GridLayoutComponent';
import { DashboardItem } from './DashboardItemTypes';
import { Dashboard as DashboardType } from './DashboardItemTypes';

// Props for the DashboardManager component
interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
  headersUpdated: boolean;
  toggleHeadersUpdated: (newState: boolean) => void;
  dashboards: DashboardType[];
  selectedDashboard: string;
  charts: DashboardItem[];
  onUpdateCharts: (charts: DashboardItem[]) => void;
  templates: { [key: string]: DashboardItem[] };
  onLoadTemplate: (templateName: string) => void;
  onImportTemplate: (templateName: string, importedCharts: DashboardItem[]) => void;
  onDeleteTemplate: (templateName: string) => void;
  onRenameTemplate: (oldTemplateName: string, newTemplateName: string) => void;
  onSaveTemplate: (templateName: string) => void; // Add this prop
}

// State for each dashboard
export interface DashboardState {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
}

const DashboardManager: React.FC<DashboardManagerProps> = ({
  onTitleChange,
  headersUpdated,
  toggleHeadersUpdated,
  dashboards,
  selectedDashboard,
  charts,
  onUpdateCharts,
  templates,
  onLoadTemplate,
  onImportTemplate,
  onDeleteTemplate,
  onRenameTemplate,
  onSaveTemplate // Add this prop
}) => {
  const [dashboardStates, setDashboardStates] = useState<{ [key: string]: DashboardState }>({
    '1': {
      charts: [],
      selectedDataTypes: {
        Left_Front_Wheel: '',
        Right_Front_Wheel: '',
        Left_Back_Wheel: '',
        Right_Back_Wheel: '',
        Battery: ''
      }
    }
  }); // State to manage the state of each dashboard

  const handleUpdateCharts = (dashboardId: string, charts: DashboardItem[]) => {
    setDashboardStates((prev: { [key: string]: DashboardState }) => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        charts
      }
    }));
  };

  const handleUpdateSelectedDataTypes = (dashboardId: string, selectedDataTypes: { [key: string]: string }) => {
    setDashboardStates((prev: { [key: string]: DashboardState }) => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        selectedDataTypes
      }
    }));
  };

  return (
    <div className="flex-1">
      {dashboards.map(dashboard => (
        dashboard.id === selectedDashboard && dashboardStates[dashboard.id] && (
          <GridLayoutComponent
            key={dashboard.id}
            charts={charts}
            selectedDataTypes={dashboardStates[dashboard.id].selectedDataTypes}
            onUpdateCharts={onUpdateCharts}
            onUpdateSelectedDataTypes={(selectedDataTypes) => handleUpdateSelectedDataTypes(dashboard.id, selectedDataTypes)}
            headersUpdated={headersUpdated}
            toggleHeadersUpdated={toggleHeadersUpdated}
            templates={templates}
            onLoadTemplate={onLoadTemplate}
            onImportTemplate={onImportTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onRenameTemplate={onRenameTemplate}
            onSaveTemplate={onSaveTemplate} // Pass the prop here
          />
        )
      ))}
    </div>
  );
};

export default DashboardManager;
