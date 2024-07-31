// useDashboardManager.ts
import { useState } from 'react';
import { DashboardItem } from './DashboardItemTypes';

interface Dashboard {
  id: string;
  name: string;
}

export interface DashboardState {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
}

export const useDashboardManager = (onTitleChange: (title: string) => void) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([{ id: '1', name: 'Dashboard 1' }]);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('1');
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
  });

  const addDashboard = () => {
    const newId = (dashboards.length + 1).toString();
    const newDashboard = { id: newId, name: `New Dashboard ${newId}` };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newId);
    onTitleChange(newDashboard.name);
    setDashboardStates(prev => ({
      ...prev,
      [newId]: {
        charts: [],
        selectedDataTypes: {
          Left_Front_Wheel: '',
          Right_Front_Wheel: '',
          Left_Back_Wheel: '',
          Right_Back_Wheel: '',
          Battery: ''
        }
      }
    }));
  };

  const deleteDashboard = (id: string) => {
    if (id === '1') return;
    const newDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(newDashboards);
    if (selectedDashboard === id && newDashboards.length > 0) {
      setSelectedDashboard(newDashboards[0].id);
      onTitleChange(newDashboards[0].name);
    } else if (newDashboards.length === 0) {
      addDashboard();
    }
    setDashboardStates(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renameDashboard = (oldDashboardId: string, newDashboardName: string) => {
    const newDashboards = dashboards.map(dashboard =>
      dashboard.id === oldDashboardId ? { ...dashboard, name: newDashboardName } : dashboard
    );
    setDashboards(newDashboards);
    if (selectedDashboard === oldDashboardId) {
      onTitleChange(newDashboardName);
    }
  };

  const selectDashboard = (id: string, name: string) => {
    setSelectedDashboard(id);
    onTitleChange(name);
  };

  const updateCharts = (dashboardId: string, charts: DashboardItem[]) => {
    setDashboardStates(prev => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        charts
      }
    }));
  };

  const updateSelectedDataTypes = (dashboardId: string, selectedDataTypes: { [key: string]: string }) => {
    setDashboardStates(prev => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        selectedDataTypes
      }
    }));
  };

  return {
    dashboards,
    selectedDashboard,
    dashboardStates,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    selectDashboard,
    updateCharts,
    updateSelectedDataTypes,
  };
};
