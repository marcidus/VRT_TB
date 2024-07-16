import React, { useState } from 'react';
import DashboardManager from '../components/Dashboard/DashboardManager';
import { Dashboard as DashboardType } from "../components/Dashboard/DashboardItemTypes"
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { DashboardItem } from '../components/Dashboard/DashboardItemTypes';


const Dashboard: React.FC = () => {
  const [title, setTitle] = useState<string>('Dashboard');
  const [headersUpdated, setHeadersUpdated] = useState(false);
  const [charts, setCharts] = useState<DashboardItem[]>([]);
  const [templates, setTemplates] = useState<{ [key: string]: DashboardItem[] }>({});
  const [dashboards, setDashboards] = useState<DashboardType[]>([{ id: '1', name: 'Dashboard 1' }]);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('1');

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const toggleHeadersUpdated = (newState: boolean) => {
    setHeadersUpdated(newState);
  };

  const handleAddChart = (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => {
    const newChart: DashboardItem = {
      id: (charts.length + 1).toString(),
      title,
      dataType,
      chartType,
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    };
    setCharts([...charts, newChart]);
  };

  const handleSaveAsTemplate = (templateName: string) => {
    setTemplates((prev) => ({
      ...prev,
      [templateName]: charts
    }));
  };

  const addDashboard = () => {
    const newId = (dashboards.length + 1).toString();
    const newDashboard = { id: newId, name: `New Dashboard ${newId}` };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newId);
    handleTitleChange(newDashboard.name);
  };

  const deleteDashboard = (id: string) => {
    if (id === '1') return;
    const newDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(newDashboards);
    if (selectedDashboard === id && newDashboards.length > 0) {
      setSelectedDashboard(newDashboards[0].id);
      handleTitleChange(newDashboards[0].name);
    } else if (newDashboards.length === 0) {
      addDashboard();
    }
  };

  const renameDashboard = (id: string, newName: string) => {
    const newDashboards = dashboards.map(dashboard =>
      dashboard.id === id ? { ...dashboard, name: newName } : dashboard
    );
    setDashboards(newDashboards);
    if (selectedDashboard === id) {
      handleTitleChange(newName);
    }
  };

  const handleDashboardChange = (dashboards: DashboardType[], selectedDashboard: string) => {
    setDashboards(dashboards);
    setSelectedDashboard(selectedDashboard);
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        title={title} 
        onTitleChange={handleTitleChange} 
        headersUpdated={headersUpdated}
        toggleHeadersUpdated={toggleHeadersUpdated}
        dashboards={dashboards}
        selectedDashboard={selectedDashboard}
        onDashboardChange={handleDashboardChange}
        addDashboard={addDashboard}
        deleteDashboard={deleteDashboard}
        renameDashboard={renameDashboard}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          onAddChart={handleAddChart}
          onSaveAsTemplate={handleSaveAsTemplate}
        />
        <div className="p-4 flex-1">
          <DashboardManager 
            onTitleChange={handleTitleChange} 
            headersUpdated={headersUpdated} 
            toggleHeadersUpdated={toggleHeadersUpdated}
            dashboards={dashboards}
            selectedDashboard={selectedDashboard}
            charts={charts}
            onUpdateCharts={setCharts}
            templates={templates}
            onLoadTemplate={(templateName) => {
              const templateCharts = templates[templateName];
              if (templateCharts) {
                setCharts(templateCharts);
              }
            }}
            onImportTemplate={(templateName, importedCharts) => {
              setTemplates((prev) => ({
                ...prev,
                [templateName]: importedCharts
              }));
            }}
            onDeleteTemplate={(templateName) => {
              setTemplates((prev) => {
                const { [templateName]: _, ...rest } = prev;
                return rest;
              });
            }}
            onRenameTemplate={(oldTemplateName, newTemplateName) => {
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
            }}
            onSaveTemplate={handleSaveAsTemplate} // Pass the prop here
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
