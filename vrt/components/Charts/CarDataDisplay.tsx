import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import { FaCar, FaTrash } from 'react-icons/fa';
import LatestLiveDataComponent from '../Data/LatestLiveDataComponent';
import { CarDataDisplayProps } from './types/chartComponentTypes';
import { DataService } from '../Data/DataService';
import './CarDataDisplay.css'; // Import the CSS file

const CarDataDisplay: React.FC<CarDataDisplayProps> = ({
  onDelete,
  availableDataTypes,
  onDataTypeChange,
  selectedDataTypes,
  onPositionChange,
}) => {
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
    const dataService = DataService.getInstance();
    Object.keys(selectedDataTypes).forEach((key) => {
      dataService.subscribe(selectedDataTypes[key], () => {});
    });

    return () => {
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
      <div className="car-data-display-container">
        <div className="handle-bar">
          <span>Car Data Display</span>
          <button onClick={onDelete} className="delete-button">
            <FaTrash />
          </button>
        </div>
        <button onClick={handleAddLabel} className="add-label-button">
          Add Label
        </button>
        <div className="car-image-container">
          <img
            src="/car.jpg"
            alt="Car"
            className="car-image"
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
                  <div className="data-label">
                    <div className="label-header">
                      <FaCar />
                      <input
                        type="text"
                        value={labels[key]}
                        onChange={(e) => handleLabelChange(key, e.target.value)}
                        className="label-input"
                      />
                      <button
                        onClick={() => handleDeleteLabel(key)}
                        className="delete-label-button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <select
                      value={selectedDataTypes[key]}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newDataType = e.target.value;
                        onDataTypeChange(key, newDataType);
                        const oldDataType = selectedDataTypes[key];
                        if (oldDataType) {
                          DataService.getInstance().unsubscribe(oldDataType, () => {});
                        }
                        const dataService = DataService.getInstance();
                        dataService.subscribe(newDataType, () => {});
                      }}
                      className="data-select"
                    >
                      {availableDataTypes.map((type: string) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <span className="data-value">{latestData ? latestData.value : 'No Data'}</span>
                  </div>
                </Draggable>
              )}
            </LatestLiveDataComponent>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default CarDataDisplay;
