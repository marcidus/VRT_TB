import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface CarDataDisplayProps {
  onDelete: () => void;
  availableDataTypes: string[];
  onDataTypeChange: (key: string, newDataType: string) => void;
  selectedDataTypes: { [key: string]: string };
  onPositionChange: (x: number, y: number) => void;
  data: { [key: string]: number };
}

const CarDataDisplay: React.FC<CarDataDisplayProps> = ({
  onDelete,
  availableDataTypes,
  onDataTypeChange,
  selectedDataTypes,
  onPositionChange,
  data
}) => {
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(600);
  const [labels, setLabels] = useState<{ [key: string]: string }>({
    Left_Front_Wheel: 'Left Front Wheel',
    Right_Front_Wheel: 'Right Front Wheel',
    Left_Back_Wheel: 'Left Back Wheel',
    Right_Back_Wheel: 'Right Back Wheel',
    Battery: 'Battery',
  });

  const [positions, setPositions] = useState<{ [key: string]: { x: number, y: number } }>({
    Left_Front_Wheel: { x: 50, y: 50 },
    Right_Front_Wheel: { x: 250, y: 50 },
    Left_Back_Wheel: { x: 50, y: 500 },
    Right_Back_Wheel: { x: 250, y: 500 },
    Battery: { x: 175, y: 275 },
  });

  const [latestData, setLatestData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');
    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      const newData = JSON.parse(event.data);

      // Parse the received data
      const parsedData = JSON.parse(Buffer.from(newData.data, 'base64').toString('utf-8'));
      console.log('Parsed data:', parsedData); // Debugging log

      const updatedData = { ...latestData };
      Object.keys(selectedDataTypes).forEach((key) => {
        if (parsedData[selectedDataTypes[key]] !== undefined) {
          console.log(`Updating data for ${key}:`, parsedData[selectedDataTypes[key]]); // Debugging log
          updatedData[key] = parsedData[selectedDataTypes[key]];
        }
      });

      setLatestData(updatedData);
    };
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    return () => eventSource.close();
  }, [selectedDataTypes]);

  useEffect(() => {
    if (availableDataTypes.length > 0) {
      const initialSelectedDataTypes = { ...selectedDataTypes };
      Object.keys(labels).forEach((key) => {
        if (!initialSelectedDataTypes[key]) {
          initialSelectedDataTypes[key] = availableDataTypes[0];
        }
      });
      console.log('Initializing selected data types:', initialSelectedDataTypes); // Debugging log
      Object.keys(initialSelectedDataTypes).forEach((key) => {
        onDataTypeChange(key, initialSelectedDataTypes[key]);
      });
    }
  }, [availableDataTypes]);

  const handleLabelChange = (key: string, newLabel: string) => {
    setLabels({ ...labels, [key]: newLabel });
  };

  const handleAddLabel = () => {
    const newKey = `Label_${Object.keys(labels).length + 1}`;
    setLabels({ ...labels, [newKey]: 'New Label' });
    setPositions({ ...positions, [newKey]: { x: 200, y: 300 } });
    onDataTypeChange(newKey, availableDataTypes[0]); // Ensure new labels have a default data type
  };

  return (
    <Draggable
      handle=".handle-bar"
      onStop={(e, data) => {
        onPositionChange(data.x, data.y);
      }}
    >
      <Resizable
        width={width}
        height={height}
        onResize={(e, { size }) => {
          setWidth(size.width);
          setHeight(size.height);
        }}
      >
        <div className="border-2 border-gray-400 rounded shadow p-2" style={{ width, height, position: 'relative' }}>
          <div className="handle-bar h-4 bg-gray-600 rounded-t cursor-move flex justify-between items-center">
            <span>Car Data Display</span>
            <button onClick={onDelete} className="bg-red-500 text-white rounded px-2 py-1">
              Delete
            </button>
          </div>
          <button onClick={handleAddLabel} className="bg-blue-500 text-white rounded px-2 py-1 mt-2 mb-2">
            Add Label
          </button>
          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 40px)' }}>
            <img src="/car.jpg" alt="Car" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
            {Object.keys(labels).map((key) => (
              <Draggable
                key={key}
                defaultPosition={{ x: positions[key].x, y: positions[key].y }}
                onStop={(e, data) => {
                  setPositions({ ...positions, [key]: { x: data.x, y: data.y } });
                }}
              >
                <div style={{ position: 'absolute', color: 'red', backgroundColor: 'white', padding: '2px', borderRadius: '4px', zIndex: 2 }}>
                  <input
                    type="text"
                    value={labels[key]}
                    onChange={(e) => handleLabelChange(key, e.target.value)}
                    style={{ backgroundColor: 'white', border: '1px solid gray', borderRadius: '4px', width: '100px', marginBottom: '2px' }}
                  />
                  <select
                    value={selectedDataTypes[key]}
                    onChange={(e) => onDataTypeChange(key, e.target.value)}
                    className="ml-2 bg-white border border-gray-300 rounded"
                    style={{ width: '100px', marginBottom: '2px' }}
                  >
                    {availableDataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span>{latestData[key] !== undefined ? latestData[key] : 'No Data'}</span>
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default CarDataDisplay;
