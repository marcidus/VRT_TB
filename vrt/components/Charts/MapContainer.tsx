import { FaTrash } from "react-icons/fa";
import { MapContainerProps } from "./types/chartComponentTypes";
import Draggable from 'react-draggable';
import MapComponent from "./common/MapComponent";
import './MapContainer.css';
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import MapDisplay from "../../pages/mapDisplay";


const MapContainer: React.FC<MapContainerProps> = ({
    title,
    onDelete,
    onPositionChange,
}) => {
    return (
        <Draggable
            handle=".handle-bar"
            onStop={(e, data) => {
                onPositionChange(data.x, data.y);
            }}
        >
            <div className="map-container">
                <div className="handle-bar">
                    <span></span>
                    <button onClick={onDelete} className="delete-button">
                        <FaTrash />
                    </button>
                </div>
                <MapDisplay/>
            </div>
        </Draggable>
    );
}
export default MapContainer;