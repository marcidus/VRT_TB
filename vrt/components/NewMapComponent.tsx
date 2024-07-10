import React, { useState, useEffect, useRef, use, } from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet.offline"
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import "../styles/map.css"
import L from 'leaflet'
import 'leaflet.offline';
import { tileLayerOffline, ControlSaveTiles, TileLayerOffline, savetiles } from 'leaflet.offline';

interface Props {
    // Define the props for your component here
}

const NewMapComponent: React.FC<Props> = (props) => {
    
    const [polylinePoints, setPolylinePoints] = useState<L.LatLng[]>([]);
    const [layer, setLayer] = useState<TileLayerOffline>();
    const [center, setCenter] = useState<L.LatLng>(L.latLng(46.174764452886265, 7.223735237766073));
    const [boolTile, setBoolTile] = useState<boolean>(false);
  
    const RecenterMap = ({ points }: { points: L.LatLng[] }) => {
      const map = useMap();
      useEffect(() => {
        if (points.length > 0) {
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds);
        }
      }, [points, map]);
      return null;
    };
  
    const SetLayerOffline = ({ }: {}) => {
      const map = useMap();
      if (!boolTile) {
        useEffect(() => {
  
          setLayer(tileLayerOffline('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {}));
          map.addLayer(tileLayerOffline('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {}));
          setBoolTile(true);
        }, [boolTile]);
      }
      return null;
    }
    
    
  
    //Temporary function to handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        const rows = text?.toString().split('\n') || [];
        const header = rows[0].split(',');
        const gpsIndex = header.findIndex((col) => col.includes('GPS'));
        if (gpsIndex === -1) return;
  
        const points = rows.slice(1).map(row => {
          const columns = row.split(',');
          // Check if the GPS data exists and is not empty before splitting
          if (columns[gpsIndex] && columns[gpsIndex].trim()) {
            const [lat, lng] = columns[gpsIndex].split(' ');
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            return L.latLng(parseFloat(lat), parseFloat(lng));
          }
          return null; // Return null or a default value if GPS data is missing or malformed
        }).filter(point => point !== null); // Filter out any null values resulting from missing/malformed GPS data
  
  
        setPolylinePoints(points! as L.LatLng[]);
      };
      reader.readAsText(file);
    };
  
    // Websocket connection to update the marker position
    const [markerPosition, setMarkerPosition] = useState<L.LatLng>(L.latLng(46.174764452886265, 7.223735237766073));
  
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:8080');
  
      ws.onmessage = (event) => {
        try {
          // Parse the JSON message
          const data = JSON.parse(event.data);
  
          // Find a property name containing "GPS"
          const gpsKey = Object.keys(data).find(key => key.includes("GPS"));
  
          if (gpsKey) {
            // Extract latitude and longitude from the found GPS property
            const [latStr, lonStr] = data[gpsKey].split(' ');
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);
  
            // Validate the extracted latitude and longitude
            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
              // Update the marker position with valid lat and lon
              setMarkerPosition(L.latLng(lat, lon)); // Adjust this to your actual method for updating the marker
              //add to polylinepoints list
              if (polylinePoints.length == 0) {
                //setPolylinePoints([L.latLng(lat, lon)]);
                polylinePoints.push(L.latLng(lat, lon));
              }
              else {
                //setPolylinePoints([...polylinePoints, L.latLng(lat, lon)]);
                polylinePoints.push(L.latLng(lat, lon));
                console.log("add point to position ",lat,lon)
              }
            } else {
              console.error('Invalid latitude or longitude values:', latStr, lonStr);
            }
          } else {
            console.error('No property containing "GPS" found in the message:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
  
      return () => {
        ws.close();
      };
    }, []);
  
  
  
    return (
      <div>
        <MapContainer id='map' center={center} zoom={19} scrollWheelZoom={false} className='map' >
          {<SetLayerOffline />}
          {polylinePoints.length > 0 && <Polyline positions={polylinePoints} />}
          {polylinePoints.length > 0 && <RecenterMap points={polylinePoints} />}
          <Marker position={markerPosition} />
        </MapContainer>
        <input type="file" onChange={handleFileUpload} accept=".csv" />
      </div>);
};

export default NewMapComponent;