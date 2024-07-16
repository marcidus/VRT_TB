import React from 'react';

interface HeaderProps {
  onAddChart: (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => void;
  onSaveAsTemplate: (templateName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddChart, onSaveAsTemplate }) => {
  const handleAddChart = () => {
    const title = prompt('Enter chart title:');
    const dataType = prompt('Enter data type:');
    const chartType = prompt('Enter chart type (line, bar, car):') as 'line' | 'bar' | 'car';
    if (title && dataType && chartType) {
      onAddChart(title, dataType, chartType);
    }
  };

  const handleSaveTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      onSaveAsTemplate(templateName);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex-1 flex justify-center">
        <button onClick={handleAddChart} className="bg-blue-500 text-white rounded px-4 py-2">
          Add Chart
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        <button onClick={handleSaveTemplate} className="bg-green-500 text-white rounded px-4 py-2">
          Saved Template
        </button>
      </div>
    </div>
  );
};

export default Header;
