import React, { useState, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet.offline"
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import "../styles/map.css"
import L from 'leaflet'
import 'leaflet.offline';
import html2canvas from 'html2canvas';
import Popup from 'reactjs-popup';
import { BiSolidFileImport, BiSolidFileImage, BiSolidFileJson, BiSolidSave, BiSolidDirectionLeft } from "react-icons/bi";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet-notifications/js/leaflet-notifications.js";
import "leaflet-notifications/css/leaflet-notifications.css";
import { AppBar, Box, Button, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, FormControlLabel, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Stack, Switch, TextField, ThemeProvider, Toolbar, Tooltip, Typography } from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import SensorsIcon from '@mui/icons-material/Sensors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
// @ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


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
  const [imageFileName, setImageFileName] = useState<String>("");
  const [jsonFileName, setJsonFileName] = useState<String>("");
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


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
    getCurrentLocation().then((pos:any) => {
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

  //Popup for save files to add to files
  const SavePopup = () => {
    // @ts-ignore */
    let name;
    return <Popup trigger={<button className='map-btn'>{<BiSolidSave className='map-btn-icon' />} Save Tiles </button>} modal>
      {// @ts-ignore */
        close => (
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
      NotificationManager.success('Map image saved successfully');
    });
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      setStartFileName(file.name.split('.')[0]);
      console.log(file.name.split('.')[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming setImageUrl is the function to update state
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      NotificationManager.success('Map image uploaded successfully');
      if (jsonFileName == "") {
        NotificationManager.warning('Do not forget to upload the JSON file');
        console.log(jsonFileName);
      } else if (file.name.split('.')[0] !== jsonFileName) {
        NotificationManager.error('Map image and JSON file names do not match');
      }
    }
  }

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //set json bounds in SetJsonBounds
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setJsonFileName(file.name.split('.')[0]);
      const jsonContent = JSON.parse(event.target.result);
      const southWest = L.latLng(jsonContent._southWest.lat, jsonContent._southWest.lng);
      const northEast = L.latLng(jsonContent._northEast.lat, jsonContent._northEast.lng);
      const bounds = L.latLngBounds(southWest, northEast);
      // Assuming 'map' is your map instance
      setMapBounds(bounds);
    };
    reader.readAsText(file);
    NotificationManager.success('JSON file uploaded successfully');
    if (imageFileName == "") {
      NotificationManager.warning('Do not forget to upload the image file');
    } else if (file.name.split('.')[0] !== imageFileName) {
      NotificationManager.error('Map image and JSON file names do not match');
    }
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
      NotificationManager.success('Map JSON saved successfully');
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
    setJsonFileName("");
    setImageFileName("");
    NotificationManager.info('Map reset successfully');
  }

  //Function to add search bar to the map
  const GeoControlSearchBar = () => {
    const map = useMap();
    const geocoderControlAdded = useRef(false);

    useEffect(() => {
      // Step 2: Singleton pattern check
      if (!geocoderControlAdded.current) {
        // Step 3: Explicit removal before addition
        const existingControl = map._controlCorners.topright.querySelector('.leaflet-control-geocoder');
        if (existingControl) {
          existingControl.remove(); // Remove existing control if found
        }

        // Custom Nominatim Geocoder to search globally
        var customNominatimGeocoder = new L.Control.Geocoder.Nominatim();
        var originalGeocodeMethod = customNominatimGeocoder.geocode.bind(customNominatimGeocoder);
        customNominatimGeocoder.geocode = function (query, cb, context) {
          // Modify query here if needed before passing it to the original geocode method
          return originalGeocodeMethod(query, cb, context);
        };

        // Add the geocoder control
        L.Control.geocoder({
          query: "",
          placeholder: "Search here...",
          defaultMarkGeocode: false,
          geocoder: customNominatimGeocoder,
          showUniqueResult: false,
        }).on('markgeocode', function (e) {
          const center = e.geocode.center;
          const zoomLevel = 15;
          map.setView(center, zoomLevel);
        }).addTo(map);
        geocoderControlAdded.current = true; // Mark as added

      }
    }, [map]); // Dependency array ensures this runs only when `map` is initialized or changed
    return null; // This component does not render anything itself
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const [checkedLiveMode, setCheckedLiveMode] = React.useState(false);
  const wsRef = useRef<WebSocket | null>(null); // Use useRef to hold the WebSocket instance
  const handleChangeLiveMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedLiveMode(event.target.checked);
    NotificationManager.info('Live mode is ' + (event.target.checked ? 'enabled' : 'disabled'));

    if (event.target.checked) {
      // Open a websocket connection
      if (!wsRef.current) {
        wsRef.current = new WebSocket('ws://localhost:8080');
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const gpsKey = Object.keys(data).find(key => key.includes("GPS"));
            if (gpsKey) {
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
      }
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  };

  const [saveOpen, setSaveOpen] = React.useState(false);
  const handleSaveOpen = () => setSaveOpen(true);
  const handleSaveClose = () => setSaveOpen(false);



  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='map-container'>
        <NotificationContainer />
        <AppBar position="static" >
          <Toolbar variant="dense">
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu-button"
                  aria-controls='menu-appbar'
                  onClick={handleOpenMenu}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{ minWidth: 250, maxWidth: 360 }}
              >
                <List
                  dense
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  subheader={<ListSubheader>Map Settings</ListSubheader>}
                >
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SensorsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Live mode" />
                    <Switch
                      checked={checkedLiveMode}
                      onChange={handleChangeLiveMode}
                      edge="end"
                      inputProps={{
                        'aria-label': 'switch-live-mode',
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Upload Map Image " />
                    <Tooltip title="Upload image of the map for when there is no connection">
                      <Button variant="contained" component="label" sx={{ ml: 5 }}>
                        <UploadFileIcon />
                        <input type="file" hidden accept='.png' onChange={handleImageUpload} />
                      </Button>
                    </Tooltip>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Upload Map JSON " />
                    <Tooltip title="Upload image of JSON with bounds of the map for when there is no connection">
                      <Button variant="contained" component="label" sx={{ ml: 5 }}>
                        <UploadFileIcon />
                        <input type="file" hidden accept='.json' onChange={handleJsonUpload} />
                      </Button>
                    </Tooltip>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Save Map" />
                    <Tooltip title="Save the current map display as an image and JSON file">
                      <Button variant="contained" onClick={handleSaveOpen} sx={{ ml: 5 }}>
                        <DownloadIcon />
                      </Button>
                    </Tooltip>
                    <Dialog
                      open={saveOpen}
                      onClose={handleSaveClose}
                      PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries((formData as any).entries());
                          const filename = formJson.filename;
                          handleSaveTiles(filename);
                          handleSaveClose();
                        },
                      }}>
                      <DialogTitle>Save Map</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          To save the current map display as an image and JSON file, please enter a file name:
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="name"
                          name="filename"
                          label="File Name"
                          type="text"
                          fullWidth
                          variant="standard"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleSaveClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                      </DialogActions>
                    </Dialog>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Upload CSV "/>
                    <Tooltip title="Upload CSV to display the car path of a past session">
                      <Button variant="contained" component="label" sx={{ ml: 5 }}>
                        <UploadFileIcon />
                        <input type="file" hidden accept='.png' onChange={handleFileUpload} />
                      </Button>
                    </Tooltip>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Reset Map" />
                    <Tooltip title="Reset the map to the initial state">
                      <Button variant="contained" onClick={resetMap} sx={{ ml: 5 }}>
                        <RestartAltIcon />
                      </Button>
                    </Tooltip>
                  </ListItem>
                </List>
              </Menu>
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Map
            </Typography>
          </Toolbar>
        </AppBar>
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
            <GeoControlSearchBar />
          </MapContainer>
        </div>
      </div>
    </ThemeProvider>
  );
}