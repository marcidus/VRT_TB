import React from 'react';
import GridLayoutComponent from './GridLayoutComponent';
import { DashboardItem } from './DashboardItemTypes';
import DashboardList from './DashboardList';
import { useDashboardManager } from './useDashboardManager';

interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ onTitleChange }) => {
  const {
    dashboards,
    selectedDashboard,
    dashboardStates,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    selectDashboard,
    updateCharts,
    updateSelectedDataTypes,
  } = useDashboardManager(onTitleChange);

  return (
    <div>
      <DashboardList
        dashboards={dashboards}
        selectedDashboard={selectedDashboard}
        onSelectDashboard={selectDashboard}
        onRenameDashboard={renameDashboard}
        onDeleteDashboard={deleteDashboard}
        onAddDashboard={addDashboard}
      />
      {dashboards.map(dashboard =>
        dashboard.id === selectedDashboard && dashboardStates[dashboard.id] ? (
          <GridLayoutComponent
            key={dashboard.id}
            charts={dashboardStates[dashboard.id].charts}
            selectedDataTypes={dashboardStates[dashboard.id].selectedDataTypes}
            onUpdateCharts={(charts) => updateCharts(dashboard.id, charts)}
            onUpdateSelectedDataTypes={(selectedDataTypes) => updateSelectedDataTypes(dashboard.id, selectedDataTypes)}
          />
        ) : null
      )}
    </div>
  );
};

export default DashboardManager;
