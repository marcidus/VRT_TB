import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { FaCar, FaTrash } from 'react-icons/fa';
import LatestLiveDataComponent from '../Data/LatestLiveDataComponent';
import { CarDataDisplayProps } from './types/chartComponentTypes';
import { DataService } from '../Data/DataService';

const CarDataDisplay: React.FC<CarDataDisplayProps> = ({
  onDelete,
  availableDataTypes,
  onDataTypeChange,
  selectedDataTypes,
  onPositionChange,
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

  useEffect(() => {
    // Subscribe to the initial data types
    const dataService = DataService.getInstance();
    Object.keys(selectedDataTypes).forEach((key) => {
      dataService.subscribe(selectedDataTypes[key], () => {});
    });

    return () => {
      // Unsubscribe from all data types on unmount
      Object.keys(selectedDataTypes).forEach((key) => {
        dataService.unsubscribe(selectedDataTypes[key], () => {});
      });
    };
  }, [selectedDataTypes]);

  const handleLabelChange = (key: string, newLabel: string) => {
    setLabels({ ...labels, [key]: newLabel });
  };

  const handleAddLabel = () => {
    const newKey = `Label_${Object.keys(labels).length + 1}`;
    setLabels({ ...labels, [newKey]: 'New Label' });
    setPositions({ ...positions, [newKey]: { x: 200, y: 300 } });
    const initialDataType = availableDataTypes[0];
    onDataTypeChange(newKey, initialDataType);
    DataService.getInstance().subscribe(initialDataType, () => {});
  };

  const handleDeleteLabel = (key: string) => {
    const newLabels = { ...labels };
    const newSelectedDataTypes = { ...selectedDataTypes };
    const newPositions = { ...positions };

    const dataType = selectedDataTypes[key];

    delete newLabels[key];
    delete newSelectedDataTypes[key];
    delete newPositions[key];

    setLabels(newLabels);
    setPositions(newPositions);

    onDataTypeChange(key, '');

    // Unsubscribe from the data type
    const dataService = DataService.getInstance();
    dataService.unsubscribe(dataType, () => {});
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
            <img
              src="/car.jpg"
              alt="Car"
              style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
            {Object.keys(labels).map((key) => (
              <LatestLiveDataComponent key={`${key}-${selectedDataTypes[key]}`} dataType={selectedDataTypes[key]}>
                {(latestData) => (
                  <Draggable
                    key={key}
                    defaultPosition={{ x: positions[key].x, y: positions[key].y }}
                    onStop={(e, data) => {
                      setPositions({ ...positions, [key]: { x: data.x, y: data.y } });
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        color: 'red',
                        backgroundColor: 'white',
                        padding: '2px',
                        borderRadius: '4px',
                        zIndex: 2,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                        <FaCar />
                        <input
                          type="text"
                          value={labels[key]}
                          onChange={(e) => handleLabelChange(key, e.target.value)}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid gray',
                            borderRadius: '4px',
                            width: '100px',
                            marginLeft: '2px',
                          }}
                        />
                        <button
                          onClick={() => handleDeleteLabel(key)}
                          className="ml-2 text-red-500"
                          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <select
                        value={selectedDataTypes[key]}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const newDataType = e.target.value;
                          onDataTypeChange(key, newDataType);

                          // Unsubscribe from the old data type
                          const oldDataType = selectedDataTypes[key];
                          if (oldDataType) {
                            DataService.getInstance().unsubscribe(oldDataType, () => {});
                          }

                          // Subscribe to the new data type
                          const dataService = DataService.getInstance();
                          dataService.subscribe(newDataType, () => {});
                        }}
                        className="ml-2 bg-white border border-gray-300 rounded"
                        style={{ width: '100px', marginBottom: '2px' }}
                      >
                        {availableDataTypes.map((type: string) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <span>{latestData ? latestData.value : 'No Data'}</span>
                    </div>
                  </Draggable>
                )}
              </LatestLiveDataComponent>
            ))}
          </div>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default CarDataDisplay;
