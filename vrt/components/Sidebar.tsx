import React from 'react';
import HeaderToggleButton from './Dashboard/HeaderToggleButton';
import { Dashboard } from './Dashboard/DashboardItemTypes';

interface SidebarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  headersUpdated: boolean;
  toggleHeadersUpdated: (newState: boolean) => void;
  dashboards: Dashboard[];
  selectedDashboard: string;
  onDashboardChange: (dashboards: Dashboard[], selectedDashboard: string) => void;
  addDashboard: () => void;
  deleteDashboard: (id: string) => void;
  renameDashboard: (id: string, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  title,
  onTitleChange,
  headersUpdated,
  toggleHeadersUpdated,
  dashboards,
  selectedDashboard,
  onDashboardChange,
  addDashboard,
  deleteDashboard,
  renameDashboard
}) => {
  return (
    <div className="bg-gray-700 text-white w-64 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <HeaderToggleButton headersUpdated={headersUpdated} toggleHeadersUpdated={toggleHeadersUpdated} />
      <div className="mt-4">
        {dashboards.map(dashboard => (
          <div key={dashboard.id} className="mb-2">
            <input
              type="text"
              value={dashboard.name}
              onChange={(e) => renameDashboard(dashboard.id, e.target.value)}
              className={`w-full p-1 ${selectedDashboard === dashboard.id ? 'bg-blue-500' : 'bg-gray-800'} text-white`}
            />
            <button onClick={() => onDashboardChange(dashboards, dashboard.id)} className="w-full bg-green-500 text-white mt-1">Select</button>
            {dashboard.id !== '1' && (
              <button onClick={() => deleteDashboard(dashboard.id)} className="w-full bg-red-500 text-white mt-1">Delete</button>
            )}
          </div>
        ))}
        <button onClick={addDashboard} className="bg-blue-500 text-white p-2 mt-4">Add Dashboard</button>
      </div>
    </div>
  );
};

export default Sidebar;
