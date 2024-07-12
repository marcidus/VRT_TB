import React, { useState, useEffect } from 'react';

interface AddChartFormProps {
  availableDataTypes: string[];
  onAddChart: (title: string, dataType: string) => void;
}

const AddChartForm: React.FC<AddChartFormProps> = ({ availableDataTypes, onAddChart }) => {
  const [title, setTitle] = useState('');
  const [dataType, setDataType] = useState(availableDataTypes[0] || '');

  useEffect(() => {
    if (availableDataTypes.length > 0 && !dataType) {
      setDataType(availableDataTypes[0]);
    }
  }, [availableDataTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChart(title, dataType);
    setTitle('');
    setDataType(availableDataTypes[0] || ''); // Reset data type to the first available option
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
        />
      </div>
      <div className="mb-2">
        <label className="mr-2">Data Type:</label>
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border rounded p-1"
          required
        >
          {availableDataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Add Chart
      </button>
    </form>
  );
};

export default AddChartForm;
