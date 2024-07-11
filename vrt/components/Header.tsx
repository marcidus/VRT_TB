import React from 'react';

interface HeaderProps {
  title: string;
  dataType: string;
  onDataTypeChange: (newDataType: string) => void;
  availableDataTypes: string[];
  dataPoints: number;
  onDataPointsChange: (newPoints: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  dataType,
  onDataTypeChange,
  availableDataTypes,
  dataPoints,
  onDataPointsChange,
}) => {
  console.log('Rendering Header with title:', title);
  return (
    <div className="header-container border-b border-gray-400">
      <div className="header bg-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white handle-bar cursor-move">{title}</h2>
        <div className="flex items-center">
          <select
            className="ml-2 bg-white border border-gray-300 rounded"
            value={dataType}
            onChange={(e) => onDataTypeChange(e.target.value)}
          >
            {availableDataTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="ml-4 text-white">Points:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={dataPoints}
            onChange={(e) => onDataPointsChange(parseInt(e.target.value))}
            className="ml-2"
          />
          <span className="ml-2 text-white">{dataPoints}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
