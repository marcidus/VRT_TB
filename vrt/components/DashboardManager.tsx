import React, { useState } from 'react';
import GridLayoutComponent from './GridLayoutComponent';

interface Dashboard {
  id: string;
  name: string;
}

interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ onTitleChange }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { id: '1', name: 'Dashboard' }
  ]);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('1');

  const addDashboard = () => {
    const newId = (dashboards.length + 1).toString();
    const newDashboard = { id: newId, name: `New Dashboard ${newId}` };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newId);
    onTitleChange(newDashboard.name);
  };

  const deleteDashboard = (id: string) => {
    const newDashboards = dashboards.filter(dashboard => dashboard.id !== id);
    setDashboards(newDashboards);
    if (selectedDashboard === id && newDashboards.length > 0) {
      setSelectedDashboard(newDashboards[0].id);
      onTitleChange(newDashboards[0].name);
    } else if (newDashboards.length === 0) {
      addDashboard(); // Ensure there's always at least one dashboard
    }
  };

  const renameDashboard = (id: string, newName: string) => {
    const newDashboards = dashboards.map(dashboard =>
      dashboard.id === id ? { ...dashboard, name: newName } : dashboard
    );
    setDashboards(newDashboards);
    if (selectedDashboard === id) {
      onTitleChange(newName);
    }
  };

  const handleSelectDashboard = (id: string, name: string) => {
    setSelectedDashboard(id);
    onTitleChange(name);
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDashboard(dashboard.id);
              }}
              className="ml-2 bg-red-500 text-white rounded px-2 hover:bg-red-700 transition-colors"
            >
              X
            </button>
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
        dashboard.id === selectedDashboard && (
          <GridLayoutComponent key={dashboard.id} />
        )
      ))}
    </div>
  );
};

export default DashboardManager;
