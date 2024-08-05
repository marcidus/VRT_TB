import React, { useState } from 'react';
import './DashboardList.css'; // Import the CSS file
import { IoMdAddCircle } from 'react-icons/io';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface Dashboard {
  id: string;
  name: string;
}

interface DashboardGroup {
  id: string;
  name: string;
  dashboards: Dashboard[];
}

interface DashboardListProps {
  dashboardGroups: DashboardGroup[];
  selectedDashboard: string;
  onSelectDashboard: (id: string, name: string) => void;
  onRenameDashboard: (groupId: string, dashboardId: string, newName: string) => void;
  onDeleteDashboard: (groupId: string, dashboardId: string) => void;
  onAddDashboard: (groupId: string) => void;
  onCreateGroup: (groupName: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

const DashboardList: React.FC<DashboardListProps> = ({
  dashboardGroups,
  selectedDashboard,
  onSelectDashboard,
  onRenameDashboard,
  onDeleteDashboard,
  onAddDashboard,
  onCreateGroup,
  onRenameGroup,
  onDeleteGroup,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState(dashboardGroups[0]?.id || '');

  const filteredGroups = dashboardGroups.map(group => ({
    ...group,
    dashboards: group.dashboards.filter(dashboard =>
      dashboard.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const currentGroup = filteredGroups.find(group => group.id === activeGroup);

  return (
    <div className={`dashboard-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="dashboard-list-header" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
      </div>
      {isExpanded && (
        <div className="dashboard-list-content">
          <input
            type="text"
            className="search-bar"
            placeholder="Search dashboards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="group-tabs">
            {filteredGroups.map(group => (
              <div
                key={group.id}
                className={`group-tab ${group.id === activeGroup ? 'active' : ''}`}
                onClick={() => setActiveGroup(group.id)}
              >
                <span>{group.name}</span>
                <FaEdit
                  className="edit-group-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt('Enter new group name:', group.name);
                    if (newName) onRenameGroup(group.id, newName);
                  }}
                />
                {group.id !== '1' && (
                  <FaTrashAlt
                    className="delete-group-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
                        onDeleteGroup(group.id);
                        if (activeGroup === group.id) {
                          setActiveGroup(filteredGroups[0]?.id || '');
                        }
                      }
                    }}
                  />
                )}
              </div>
            ))}
            <button
              className="add-group-button"
              onClick={() => {
                const groupName = prompt("Enter group name:");
                if (groupName) onCreateGroup(groupName);
              }}
            >
              + Add Group
            </button>
          </div>
          {currentGroup && (
            <div className="dashboard-group">
              <div className="dashboard-group-title">{currentGroup.name}</div>
              <div className="dashboard-items-container">
                {currentGroup.dashboards.map(dashboard => (
                  <div
                    key={dashboard.id}
                    className={`dashboard-item ${selectedDashboard === dashboard.id ? 'selected' : ''}`}
                    onClick={() => onSelectDashboard(dashboard.id, dashboard.name)}
                  >
                    <input
                      type="text"
                      value={dashboard.name}
                      className="dashboard-name"
                      onChange={e => onRenameDashboard(currentGroup.id, dashboard.id, e.target.value)}
                    />
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDashboard(currentGroup.id, dashboard.id);
                      }}
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-dashboard-button" onClick={() => onAddDashboard(currentGroup.id)}>
                <IoMdAddCircle size={24} /> Add Dashboard to {currentGroup.name}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardList;
