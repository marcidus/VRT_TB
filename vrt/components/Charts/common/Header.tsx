import React, { useEffect } from 'react';

// Props for the Header component
interface HeaderProps {
  title: string; // The title of the chart
  sensors: string[]; // List of sensors
  onSensorChange: (index: number, newDataType: string) => void; // Function to handle changes in sensors
  availableDataTypes: string[]; // List of available data types to select from
  dataPoints: number; // The number of data points to display
  onDataPointsChange: (newPoints: number) => void; // Function to handle changes in data points
  currentValue: number; // The current value being displayed
  onAddSensor: () => void; // Function to add a new sensor
  onRemoveSensor: (index: number) => void; // Function to remove a sensor
}

const Header: React.FC<HeaderProps> = ({
  title,
  sensors,
  onSensorChange,
  availableDataTypes,
  dataPoints,
  onDataPointsChange,
  currentValue,
  onAddSensor,
  onRemoveSensor,
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
          {sensors.map((sensor, index) => (
            <div key={index} className="flex items-center mr-2">
              <select
                className="bg-white border border-gray-300 rounded mr-2"
                value={sensor}
                onChange={(e) => onSensorChange(index, e.target.value)}
              >
                {availableDataTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {index > 0 && (
                <button onClick={() => onRemoveSensor(index)} className="bg-red-500 text-white rounded px-2 py-1">
                  Remove
                </button>
              )}
              <span className="ml-2 text-white">{currentValue}</span>
            </div>
          ))}
          <button onClick={onAddSensor} className="bg-blue-500 text-white rounded px-2 py-1 mr-2">
            Add Sensor
          </button>
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
          <span className="ml-4 text-white">Current: {currentValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
