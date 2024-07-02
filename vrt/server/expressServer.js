const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
const { getBinaryTelemetryData } = require('./redisClient');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3001;

let telemetryDataMap = {};
let clients = [];

// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Health check endpoint to verify the server is running.
 */
app.get('/health', (req, res) => {
  res.status(200).send('Express server is running');
});

/**
 * Endpoint to retrieve telemetry data.
 * Responds with the telemetry data stored in Redis.
 */
app.get('/telemetry', async (req, res) => {
  try {
    console.log("Attempting to retrieve telemetry data from Redis");
    const data = await getBinaryTelemetryData();
    
    // Decode and parse the binary data, accumulating in a map
    data.forEach(item => {
      const binaryData = Buffer.from(item.data, 'base64'); // Convert the stored data back to Buffer
      const decodedData = binaryData.toString('utf-8'); // Decode the binary data to a UTF-8 string
      const jsonData = JSON.parse(decodedData); // Parse the string as JSON
      
      // Accumulate data into the telemetryDataMap
      for (const key in jsonData) {
        if (!telemetryDataMap[key]) {
          telemetryDataMap[key] = [];
        }
        telemetryDataMap[key].push({ timestamp: item.timestamp, value: jsonData[key] });
      }
    });

    console.log("Data retrieved and mapped from Redis:", Object.keys(telemetryDataMap).length, "categories found");
    res.json(telemetryDataMap);
  } catch (error) {
    console.error("Error retrieving telemetry data:", error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Endpoint to establish SSE connection.
 * Sends telemetry updates to connected clients.
 */
app.get('/events', cors(), (req, res) => { // Ensure CORS is applied here as well
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add this client to the list of clients
  clients.push(res);

  // Remove client when they disconnect
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

/**
 * Function to send updates to all connected clients.
 */
const sendUpdates = (data) => {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

/**
 * Starts the Express server and logs the running port.
 */
const server = app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

/**
 * Function to send updates to all connected clients.
 */
const sendUpdatesWS = (data) => {
  clients.forEach(client => {
    client.send(JSON.stringify(data));
  });
};

module.exports = { sendUpdates, sendUpdatesWS }; // Export sendUpdates for use in udpServer.js
