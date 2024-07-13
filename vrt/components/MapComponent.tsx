import React, { useState, useEffect, useRef, use } from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet.offline"
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import "../styles/map.css"
import L from 'leaflet'
import 'leaflet.offline';
import { tileLayerOffline, ControlSaveTiles, TileLayerOffline, savetiles } from 'leaflet.offline';
import html2canvas from 'html2canvas';
import Popup from 'reactjs-popup';
import { BiSolidFileImport, BiSolidFileImage, BiSolidFileJson, BiSolidSave, BiSolidDirectionLeft } from "react-icons/bi";


export default function MapComponent(props: any) {
  const [polylinePoints, setPolylinePoints] = useState<L.LatLng[]>([]);
  const [center, setCenter] = useState<L.LatLng>(L.latLng(46.174764452886265, 7.223735237766073));
  const [boolTile, setBoolTile] = useState<boolean>(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds>();
  const [boolBounds, setBoolBounds] = useState<boolean>(false);
  const [mapImage, setMapImage] = useState<HTMLImageElement>();
  const [jsonBounds, setJsonBounds] = useState<L.LatLngBounds>();
  const [startFileName, setStartFileName] = useState<String>("default");
  const [imageUrl, setImageUrl] = useState(null);

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

  //Function to get computer current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  useEffect(() => {
    console.log('Getting current location...');
    var position = getCurrentLocation().then((pos) => {
      console.log('Current location:', L.latLng(pos.latitude, pos.longitude));
      setCenter(L.latLng(pos.latitude, pos.longitude));
    }, (error) => {
      console.error(error);
    });
  }, []);


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


      setPolylinePoints(points);
    };
    reader.readAsText(file);
  };

  // Websocket connection to update the marker position
  const [markerPosition, setMarkerPosition] = useState<L.LatLng>(L.latLng(0, 0));

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
            setPolylinePoints(prevPoints => {
              if (prevPoints.length === 0) {
                return [L.latLng(lat, lon)];
              }
              return [...prevPoints, L.latLng(lat, lon)];
            });
            setMarkerPosition(L.latLng(lat, lon));
            console.log(`Latitude: ${lat}, Longitude: ${lon}, pushed`);
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

  //Popup for save files to add to files (errors from editor are normal => typscript error)
  const SavePopup = () => {
    let name;
    return <Popup trigger={<button className='map-btn'>{<BiSolidSave className='map-btn-icon' />} Save Tiles </button>} modal>
      {close => (
        <span>
          <button className="close" onClick={() => {
            close();
          }}>
            &times;
          </button>
          <h2>Save Tiles</h2>
          <p>Name for the map image and json file :</p>
          <input type="text" placeholder="File Name" onChange={(e) => name = e.target.value} />
          <button onClick={() => handleSaveTiles(name)}>Save</button>
        </span>
      )}
    </Popup>
  }
  const handleSaveTiles = (name: String) => {
    setStartFileName(name);
    let mapContainer = document.getElementById('map');
    html2canvas(mapContainer, {
      useCORS: true,
      width: mapContainer.offsetWidth,
      height: mapContainer.offsetHeight,
    }).then(function (canvas) {
      var link = document.createElement('a');
      link.download = name + '.png';
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).then(() => {
      setBoolBounds(true);
    });
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming setImageUrl is the function to update state
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //set json bounds in SetJsonBounds
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const jsonContent = JSON.parse(event.target.result);
      const southWest = L.latLng(jsonContent._southWest.lat, jsonContent._southWest.lng);
      const northEast = L.latLng(jsonContent._northEast.lat, jsonContent._northEast.lng);
      const bounds = L.latLngBounds(southWest, northEast);
      // Assuming 'map' is your map instance
      setMapBounds(bounds);
    };

    reader.readAsText(file);
  }

  const GetBounds = (bool: boolean) => {
    const map = useMap();
    const bounds = map.getBounds();
    if (boolBounds == true) {
      var json = JSON.stringify(bounds);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.download = startFileName + '.json';
      link.href = url;
      link.click();
    }
    setBoolBounds(false);
    return null;
  }
  const SetBounds = ({ bounds }: { bounds: L.LatLngBounds }) => {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds);
      }
    }, [bounds, map]);
    return null;
  }

  //function to reset the map
  const resetMap = () => {
    setPolylinePoints([]);
    setImageUrl(null)
    setMarkerPosition(L.latLng(0, 0))
    setCenter(center)
  }

  return (<div>
    <div className='mapDiv' style={{
      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
      backgroundSize: 'cover', // Ensure the image covers the div
      backgroundPosition: 'center' // Center the background image
    }}>
      <MapContainer id='map' center={center} zoom={10} scrollWheelZoom={false} className='map' zoomDelta={0.25} zoomSnap={0}>
        {imageUrl == null && (
          <TileLayer url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' />
        )}
        <Polyline positions={polylinePoints} />
        <Marker position={markerPosition} />
        <GetBounds bool={boolBounds} />
        <SetBounds bounds={mapBounds} />
      </MapContainer>
      <table>
        <tr>
          <td>
            <label className='map-btn'>
              <input type="file" onChange={handleFileUpload} accept=".csv" />
              {<BiSolidFileImport className='map-btn-icon' />} Upload CSV
            </label>
          </td>
          <td>
            <label className='map-btn'>
              <input type="file" onChange={handleImageUpload} accept=".png" />
              {<BiSolidFileImage className='map-btn-icon' />} Upload Map Image
            </label>
          </td>
          <td>
            <label className='map-btn'>
              <input className='btn' type="file" onChange={handleJsonUpload} accept=".json" />
              {<BiSolidFileJson className='map-btn-icon' />} Upload JSON
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <SavePopup />
          </td>
          <td>
            <button className='map-btn' onClick={resetMap}>{<BiSolidDirectionLeft className='map-btn-icon' />}Reset Map Tile</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  );

}