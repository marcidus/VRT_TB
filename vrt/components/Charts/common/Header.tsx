import React, { useEffect } from 'react';

// Props for the Header component
interface HeaderProps {
  title: string; // The title of the chart
  dataType: string; // The currently selected data type
  onDataTypeChange: (newDataType: string) => void; // Function to handle changes in data type
  availableDataTypes: string[]; // List of available data types to select from
  dataPoints: number; // The number of data points to display
  onDataPointsChange: (newPoints: number) => void; // Function to handle changes in data points
  currentValue: number; // The current value being displayed
}

const Header: React.FC<HeaderProps> = ({
  title,
  dataType,
  onDataTypeChange,
  availableDataTypes,
  dataPoints,
  onDataPointsChange,
  currentValue,
}) => {
  useEffect(() => {
    // Ensure the dropdown menu updates whenever availableDataTypes change
    console.log('Available data types updated:', availableDataTypes);
  }, [availableDataTypes]);

  return (
    <div>
      <div>
        <h2>{title}</h2>
        <div>
          <select
            value={dataType}
            onChange={(e) => onDataTypeChange(e.target.value)}
          >
            {availableDataTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label>Points:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={dataPoints}
            onChange={(e) => onDataPointsChange(parseInt(e.target.value))}
            className="ml-2"
          />
          <span>{dataPoints}</span>
          <span >Current: {currentValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
