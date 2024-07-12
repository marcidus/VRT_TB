import React from 'react';
import GridLayoutComponent from '../components/GridLayoutComponent';
import HeaderToggleButton from '../components/HeaderToggleButton';


const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <HeaderToggleButton />
      <GridLayoutComponent />

    </div>
  );
};

export default Dashboard;
