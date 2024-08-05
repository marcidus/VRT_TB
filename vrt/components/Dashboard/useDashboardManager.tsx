import { useState } from 'react';
import { DashboardItem } from './DashboardItemTypes';

interface Dashboard {
  id: string;
  name: string;
}

interface DashboardGroup {
  id: string;
  name: string;
  dashboards: Dashboard[];
}

export interface DashboardState {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
}

export const useDashboardManager = (onTitleChange: (title: string) => void) => {
  const [dashboardGroups, setDashboardGroups] = useState<DashboardGroup[]>([
    { id: '1', name: 'Default Group', dashboards: [{ id: '1', name: 'Dashboard 1' }] }
  ]);
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

  const addDashboard = (groupId: string) => {
    setDashboardGroups(prevGroups => {
      const updatedGroups = prevGroups.map(group => {
        if (group.id === groupId) {
          const newId = `${Date.now()}`; // Use unique timestamp as ID
          const newDashboard = { id: newId, name: `New Dashboard ${newId}` };
          group.dashboards.push(newDashboard);
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
        }
        return group;
      });
      return [...updatedGroups];
    });
  };

  const deleteDashboard = (groupId: string, dashboardId: string) => {
    if (dashboardId === '1') return;
    setDashboardGroups(prevGroups => {
      const updatedGroups = prevGroups.map(group => {
        if (group.id === groupId) {
          group.dashboards = group.dashboards.filter(dashboard => dashboard.id !== dashboardId);
        }
        return group;
      });
      const selectedDashboardExists = updatedGroups.some(group =>
        group.dashboards.some(dashboard => dashboard.id === selectedDashboard)
      );
      if (!selectedDashboardExists && updatedGroups.length > 0) {
        const newSelected = updatedGroups[0].dashboards[0]?.id || '';
        setSelectedDashboard(newSelected);
        onTitleChange(updatedGroups[0].dashboards[0]?.name || '');
      }
      return [...updatedGroups];
    });
    setDashboardStates(prev => {
      const { [dashboardId]: _, ...rest } = prev;
      return rest;
    });
  };

  const renameDashboard = (groupId: string, dashboardId: string, newDashboardName: string) => {
    setDashboardGroups(prevGroups => {
      const updatedGroups = prevGroups.map(group => {
        if (group.id === groupId) {
          group.dashboards = group.dashboards.map(dashboard =>
            dashboard.id === dashboardId ? { ...dashboard, name: newDashboardName } : dashboard
          );
        }
        return group;
      });
      if (selectedDashboard === dashboardId) {
        onTitleChange(newDashboardName);
      }
      return [...updatedGroups];
    });
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

  const onCreateGroup = (groupName: string) => {
    const newGroupId = `${Date.now()}`; // Use unique timestamp as ID
    setDashboardGroups(prevGroups => [
      ...prevGroups,
      { id: newGroupId, name: groupName, dashboards: [] }
    ]);
  };

  const onRenameGroup = (groupId: string, newName: string) => {
    setDashboardGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
  };

  const onDeleteGroup = (groupId: string) => {
    setDashboardGroups(prevGroups => {
      const updatedGroups = prevGroups.filter(group => group.id !== groupId);
      if (selectedDashboard && !updatedGroups.some(group => group.dashboards.some(d => d.id === selectedDashboard))) {
        const newSelected = updatedGroups[0]?.dashboards[0]?.id || '';
        setSelectedDashboard(newSelected);
        onTitleChange(updatedGroups[0]?.dashboards[0]?.name || '');
      }
      // Delete associated dashboard states
      setDashboardStates(prev => {
        const newState = { ...prev };
        prevGroups.find(group => group.id === groupId)?.dashboards.forEach(dashboard => {
          delete newState[dashboard.id];
        });
        return newState;
      });
      return updatedGroups;
    });
  };

  return {
    dashboardGroups,
    selectedDashboard,
    dashboardStates,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    selectDashboard,
    updateCharts,
    updateSelectedDataTypes,
    onCreateGroup,
    onRenameGroup,
    onDeleteGroup,
  };
};
