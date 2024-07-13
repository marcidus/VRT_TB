/**
 * Author: Alexandre Martroye de Joly
 * Description: This component provides a form for adding new charts to a dashboard. Users can select the chart title,
 *              data type, and chart type (line, bar, or car). The form updates dynamically based on available data types
 *              and resets after submission.
 */

import React, { useState, useEffect } from 'react';

// Define the props for the AddChartForm component
interface AddChartFormProps {
  availableDataTypes: string[];
  onAddChart: (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => void;
}

const AddChartForm: React.FC<AddChartFormProps> = ({ availableDataTypes, onAddChart }) => {
  const [title, setTitle] = useState(''); // State to manage the title of the chart
  const [dataType, setDataType] = useState(availableDataTypes[0] || ''); // State to manage the selected data type
  const [chartType, setChartType] = useState<'line' | 'bar' | 'car'>('line'); // State to manage the selected chart type

  // Effect to update the selected data type when available data types change
  useEffect(() => {
    if (availableDataTypes.length > 0 && !dataType) {
      setDataType(availableDataTypes[0]);
    }
  }, [availableDataTypes]);

  /**
   * Handler for form submission.
   * @param e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChart(title, dataType, chartType);
    setTitle(''); // Reset title input
    setDataType(availableDataTypes[0] || ''); // Reset data type to the first available option
    setChartType('line'); // Reset chart type to default
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="mr-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-1"
          required
          disabled={chartType === 'car'} // Disable title input for car data display
        />
      </div>
      <div className="mb-2">
        <label className="mr-2">Data Type:</label>
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border rounded p-1"
          required
          disabled={chartType === 'car'} // Disable data type input for car data display
        >
          {availableDataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="mr-2">Chart Type:</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'car')}
          className="border rounded p-1"
          required
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="car">Car Data Display</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Add Chart
      </button>
    </form>
  );
};

export default AddChartForm;
