import React, { useState } from 'react';
import DashboardManager from '../components/Dashboard/DashboardManager';

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState<string>('Dashboard');

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <DashboardManager onTitleChange={handleTitleChange} />
    </div>
  );
};

export default Dashboard;
