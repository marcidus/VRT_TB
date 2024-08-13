import React, { useState, useEffect } from 'react';
import './AddChartForm.css'; // Import the CSS file

interface AddChartFormProps {
  availableDataTypes: string[];
  onAddChart: (title: string, dataType: string, chartType: 'line' | 'bar' | 'car' | 'map') => void;
}

const AddChartForm: React.FC<AddChartFormProps> = ({ availableDataTypes, onAddChart }) => {
  const [title, setTitle] = useState(''); 
  const [dataType, setDataType] = useState(availableDataTypes[0] || ''); 
  const [chartType, setChartType] = useState<'line' | 'bar' | 'car' | 'map'>('line'); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (availableDataTypes.length > 0 && !dataType) {
      setDataType(availableDataTypes[0]);
    }
  }, [availableDataTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChart(title, dataType, chartType);
    setTitle('');
    setDataType(availableDataTypes[0] || '');
    setChartType('line');
    setSidebarOpen(false); // Close the sidebar after adding the chart
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className="hamburger-button" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit} className="add-chart-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={chartType === 'car' || chartType === 'map'}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dataType">Data Type:</label>
            <select
              id="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              required
              disabled={chartType === 'car' || chartType === 'map'}
              className="form-control"
            >
              {availableDataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="chartType">Chart Type:</label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'car' | 'map')}
              required
              className="form-control"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="car">Car Data Display</option>
              <option value="map">Map</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Add Chart
          </button>
        </form>
      </div>
    </>
  );
};

export default AddChartForm;
