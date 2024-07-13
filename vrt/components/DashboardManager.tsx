/**
 * Author: Alexandre Martroye de Joly
 * Description: This component manages multiple dashboards, allowing users to add, delete, rename, and select dashboards.
 *              It also manages the state of each dashboard, including its charts and selected data types.
 */

import React, { useState } from 'react';
import GridLayoutComponent from './GridLayoutComponent';
import { DashboardItem } from './DashboardItemTypes';

// Interface to represent a dashboard
interface Dashboard {
  id: string;
  name: string;
}

// Props for the DashboardManager component
interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
}

// State for each dashboard
export interface DashboardState {
  charts: DashboardItem[];
  selectedDataTypes: { [key: string]: string };
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ onTitleChange }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { id: '1', name: 'Dashboard 1' }
  ]); // State to manage the list of dashboards
  const [selectedDashboard, setSelectedDashboard] = useState<string>('1'); // State to manage the currently selected dashboard
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

  /**
   * Adds a new dashboard.
   */
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

  /**
   * Deletes a dashboard by its ID.
   * @param id - The ID of the dashboard to delete.
   */
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

  /**
   * Renames a dashboard by its ID.
   * @param oldDashboardId - The old ID of the dashboard to rename.
   * @param newDashboardName - The new name of the dashboard.
   */
  const renameDashboard = (oldDashboardId: string, newDashboardName: string) => {
    const newDashboards = dashboards.map(dashboard =>
      dashboard.id === oldDashboardId ? { ...dashboard, name: newDashboardName } : dashboard
    );
    setDashboards(newDashboards);
    if (selectedDashboard === oldDashboardId) {
      onTitleChange(newDashboardName);
    }
  };

  /**
   * Handles the selection of a dashboard.
   * @param id - The ID of the selected dashboard.
   * @param name - The name of the selected dashboard.
   */
  const handleSelectDashboard = (id: string, name: string) => {
    setSelectedDashboard(id);
    onTitleChange(name);
  };

  /**
   * Updates the charts for a given dashboard.
   * @param dashboardId - The ID of the dashboard to update.
   * @param charts - The updated list of charts.
   */
  const handleUpdateCharts = (dashboardId: string, charts: DashboardItem[]) => {
    setDashboardStates((prev) => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        charts
      }
    }));
  };

  /**
   * Updates the selected data types for a given dashboard.
   * @param dashboardId - The ID of the dashboard to update.
   * @param selectedDataTypes - The updated selected data types.
   */
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
                disabled={dashboard.id === '1'} // Ensure the delete button is disabled for the first dashboard
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
