import React, { useState } from 'react';
import GridLayoutComponent from './GridLayoutComponent';
import { DashboardItem } from './DashboardItemTypes';

interface Dashboard {
  id: string;
  name: string;
}

interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
}

export interface DashboardState {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ onTitleChange }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { id: '1', name: 'Dashboard 1' }
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

  const addDashboard = () => {
    const newId = (dashboards.length + 1).toString();
    const newDashboard = { id: newId, name: `New Dashboard ${newId}` };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newId);
    onTitleChange(newDashboard.name);
    setDashboardStates((prev) => ({
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
    if (id === '1') return; // Prevent deletion of the first dashboard
    const newDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(newDashboards);
    if (selectedDashboard === id && newDashboards.length > 0) {
      setSelectedDashboard(newDashboards[0].id);
      onTitleChange(newDashboards[0].name);
    } else if (newDashboards.length === 0) {
      addDashboard(); // Ensure there's always at least one dashboard
    }
    setDashboardStates((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renameDashboard = (oldDashboardId: string, newDashboardId: string) => {
    const dashboardState = dashboardStates[oldDashboardId];
    if (dashboardState) {
      setDashboardStates((prev) => {
        const { [oldDashboardId]: _, ...rest } = prev;
        return {
          ...rest,
          [newDashboardId]: dashboardState
        };
      });
      setDashboards((prev) => {
        return prev.map(dashboard => dashboard.id === oldDashboardId ? { ...dashboard, id: newDashboardId, name: newDashboardId } : dashboard);
      });
    }
  };

  const handleSelectDashboard = (id: string, name: string) => {
    setSelectedDashboard(id);
    onTitleChange(name);
  };

  const handleUpdateCharts = (dashboardId: string, charts: DashboardItem[]) => {
    setDashboardStates((prev) => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        charts
      }
    }));
  };

  const handleUpdateSelectedDataTypes = (dashboardId: string, selectedDataTypes: { [key: string]: string }) => {
    setDashboardStates((prev) => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        selectedDataTypes
      }
    }));
  };

  return (
    <div>
      <div className="flex items-center mb-4 space-x-2">
        {dashboards.map(dashboard => (
          <div
            key={dashboard.id}
            className={`flex items-center px-4 py-2 rounded-lg ${selectedDashboard === dashboard.id ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'} cursor-pointer`}
            onClick={() => handleSelectDashboard(dashboard.id, dashboard.name)}
          >
            <input
              type="text"
              value={dashboard.name}
              onChange={e => renameDashboard(dashboard.id, e.target.value)}
              className={`bg-transparent border-none ${selectedDashboard === dashboard.id ? 'text-white' : 'text-gray-200'} outline-none`}
            />
            {dashboard.id !== '1' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDashboard(dashboard.id);
                }}
                className="ml-2 bg-red-500 text-white rounded px-2 hover:bg-red-700 transition-colors"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDashboard}
          className="ml-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
      {dashboards.map(dashboard => (
        dashboard.id === selectedDashboard && dashboardStates[dashboard.id] && (
          <GridLayoutComponent
            key={dashboard.id}
            charts={dashboardStates[dashboard.id].charts}
            selectedDataTypes={dashboardStates[dashboard.id].selectedDataTypes}
            onUpdateCharts={(charts) => handleUpdateCharts(dashboard.id, charts)}
            onUpdateSelectedDataTypes={(selectedDataTypes) => handleUpdateSelectedDataTypes(dashboard.id, selectedDataTypes)}
          />
        )
      ))}
    </div>
  );
};

export default DashboardManager;
