import React, { useState } from 'react';
import DashboardManager from '../components/Dashboard/DashboardManager';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState<string>('Dashboard');

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="dashboard-container">
      <h1>{title}</h1>
      <DashboardManager onTitleChange={handleTitleChange} />
    </div>
  );
};

export default Dashboard;
