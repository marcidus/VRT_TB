import React from 'react';
import GridLayoutComponent from './GridLayoutComponent';
import DashboardList from './DashboardList';
import { useDashboardManager } from './useDashboardManager';

interface DashboardManagerProps {
  onTitleChange: (title: string) => void;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({ onTitleChange }) => {
  const {
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
  } = useDashboardManager(onTitleChange);

  return (
    <div>
      <DashboardList
        dashboardGroups={dashboardGroups}
        selectedDashboard={selectedDashboard}
        onSelectDashboard={selectDashboard}
        onRenameDashboard={renameDashboard}
        onDeleteDashboard={deleteDashboard}
        onAddDashboard={addDashboard}
        onCreateGroup={onCreateGroup}
        onRenameGroup={onRenameGroup}
        onDeleteGroup={onDeleteGroup}
      />
      {dashboardGroups.map(group =>
        group.dashboards.map(dashboard =>
          dashboard.id === selectedDashboard && dashboardStates[dashboard.id] ? (
            <GridLayoutComponent
              key={dashboard.id}
              charts={dashboardStates[dashboard.id].charts}
              selectedDataTypes={dashboardStates[dashboard.id].selectedDataTypes}
              onUpdateCharts={(charts) => updateCharts(dashboard.id, charts)}
              onUpdateSelectedDataTypes={(selectedDataTypes) => updateSelectedDataTypes(dashboard.id, selectedDataTypes)}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default DashboardManager;
