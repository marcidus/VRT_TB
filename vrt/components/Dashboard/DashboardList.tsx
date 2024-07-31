// DashboardList.tsx
import React from 'react';

interface DashboardListProps {
  dashboards: { id: string; name: string }[];
  selectedDashboard: string;
  onSelectDashboard: (id: string, name: string) => void;
  onRenameDashboard: (id: string, newName: string) => void;
  onDeleteDashboard: (id: string) => void;
  onAddDashboard: () => void;
}

const DashboardList: React.FC<DashboardListProps> = ({
  dashboards,
  selectedDashboard,
  onSelectDashboard,
  onRenameDashboard,
  onDeleteDashboard,
  onAddDashboard,
}) => {
  return (
    <div className="flex items-center mb-4 space-x-2">
      {dashboards.map(dashboard => (
        <div
          key={dashboard.id}
          className={`flex items-center px-4 py-2 rounded-lg ${selectedDashboard === dashboard.id ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'} cursor-pointer`}
          onClick={() => onSelectDashboard(dashboard.id, dashboard.name)}
        >
          <input
            type="text"
            value={dashboard.name}
            onChange={e => onRenameDashboard(dashboard.id, e.target.value)}
            className={`bg-transparent border-none ${selectedDashboard === dashboard.id ? 'text-white' : 'text-gray-200'} outline-none`}
          />
          {dashboard.id !== '1' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteDashboard(dashboard.id);
              }}
              className="ml-2 bg-red-500 text-white rounded px-2 hover:bg-red-700 transition-colors"
            >
              X
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAddDashboard}
        className="ml-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default DashboardList;
