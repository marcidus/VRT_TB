/**
 * Author: Alexandre Martroye de Joly
 * Description: This component provides a header for chart containers, allowing users to select data types and adjust
 *              the number of data points to display. It includes a title, a data type dropdown, and a data points slider.
 */

import React, { useEffect } from 'react';

// Props for the Header component
interface HeaderProps {
  title: string; // The title of the chart
  dataType: string; // The currently selected data type
  onDataTypeChange: (newDataType: string) => void; // Function to handle changes in data type
  availableDataTypes: string[]; // List of available data types to select from
  dataPoints: number; // The number of data points to display
  onDataPointsChange: (newPoints: number) => void; // Function to handle changes in data points
}

const Header: React.FC<HeaderProps> = ({
  title,
  dataType,
  onDataTypeChange,
  availableDataTypes,
  dataPoints,
  onDataPointsChange,
}) => {
  useEffect(() => {
    // Ensure the dropdown menu updates whenever availableDataTypes change
    console.log('Available data types updated:', availableDataTypes);
  }, [availableDataTypes]);

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
