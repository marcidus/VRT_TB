import React, {useState, useEffect} from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import "../styles/map.css"
import L from 'leaflet'




export default function MapComponent(props: any) {
    const [polylinePoints, setPolylinePoints] = useState<L.LatLng[]>([]);

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
        if (!isNaN(lat) && !isNaN(lon)) {
          // Update the marker position with valid lat and lon
          setMarkerPosition({ lat, lon }); // Adjust this to your actual method for updating the marker
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
        <MapContainer center={L.latLng(46.174764452886265, 7.223735237766073)} zoom={19} scrollWheelZoom={false} className='map' >
          <TileLayer
            attribution=''
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {polylinePoints.length > 0 && <Polyline positions={polylinePoints}  />}
            {polylinePoints.length > 0 && <RecenterMap points={polylinePoints} />}
            <Marker position={markerPosition}  />
        </MapContainer>
        <input type="file" onChange={handleFileUpload} accept=".csv" />
      </div>    );

  }