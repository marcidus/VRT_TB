// components/AddChartForm.tsx
import React, { useState, useEffect } from 'react';

interface AddChartFormProps {
  availableDataTypes: string[];
  onAddChart: (title: string, dataType: string, chartType: 'line' | 'bar' | 'car') => void;
}

const AddChartForm: React.FC<AddChartFormProps> = ({ availableDataTypes, onAddChart }) => {
  const [title, setTitle] = useState(''); 
  const [dataType, setDataType] = useState(availableDataTypes[0] || ''); 
  const [chartType, setChartType] = useState<'line' | 'bar' | 'car'>('line'); 

  useEffect(() => {
    if (availableDataTypes.length > 0 && !dataType) {
      setDataType(availableDataTypes[0]);
    }
  }, [availableDataTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding chart:", { title, dataType, chartType }); // Debug log
    onAddChart(title, dataType, chartType);
    setTitle('');
    setDataType(availableDataTypes[0] || '');
    setChartType('line');
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
          disabled={chartType === 'car'}
        />
      </div>
      <div className="mb-2">
        <label className="mr-2">Data Type:</label>
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border rounded p-1"
          required
          disabled={chartType === 'car'}
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
