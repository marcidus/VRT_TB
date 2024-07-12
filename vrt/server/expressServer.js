/**
 * Express Server for Telemetry Data
 * Date: 2024-07-12
 * 
 * Description:
 * This module sets up an Express server to handle telemetry data. 
 * It provides endpoints for health checks, retrieving telemetry data,
 * and establishing Server-Sent Events (SSE) and WebSocket connections.
 * 
 * 0x41 0x6c 0x65 0x78 0x61 0x6e 0x64 0x72 0x65 0x20 0x4d 0x61 0x72 0x74 0x72 0x6f 0x79 0x65 0x20 0x64 0x65 0x20 0x4a 0x6f 0x6c 0x79
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const { getBinaryTelemetryData } = require('./redisClient');
const { addHeader, removeHeader, loadHeaders } = require('./headerManager');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3001;

let telemetryDataMap = {};
let sseClients = [];
let wsClients = [];
let headersUpdated = false;

// Use CORS middleware to enable cross-origin requests
app.use(cors({
  origin: 'http://localhost:3000' // Update this to match your frontend URL
}));

app.use(express.json());

app.get('/headers-updated', (req, res) => {
  res.json({ headersUpdated });
});

app.post('/toggle-headers-updated', (req, res) => {
  headersUpdated = !headersUpdated;
  res.json({ headersUpdated });
});

app.get('/data-types', (req, res) => {
  try {
    const headers = loadHeaders();
    res.json(headers);
  } catch (error) {
    console.error("Error fetching data types:", error);
    res.status(500).send("Internal Server Error");
  }
});

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

    data.forEach(item => {
      const binaryData = Buffer.from(item.data, 'base64');
      const decodedData = binaryData.toString('utf-8');
      const jsonData = JSON.parse(decodedData);

      const existingHeaders = loadHeaders();
      const newHeaders = Object.keys(jsonData).filter(header => !existingHeaders.includes(header));
      const removedHeaders = existingHeaders.filter(header => !Object.keys(jsonData).includes(header));

      newHeaders.forEach(addHeader);
      removedHeaders.forEach(removeHeader);

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
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

/**
 * Function to send updates to all connected SSE clients.
 * @param {Object} data - The data to send to clients.
 */
const sendUpdatesSSE = (data) => {
  sseClients.forEach(client => {
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

/**
 * WebSocket connection handler.
 * Adds new WebSocket connections alexto the clients list and handles disconnections.
 */
wss.on('connection', (ws) => {
  wsClients.push(ws);

  ws.on('close', () => {
    wsClients = wsClients.filter(client => client !== ws);
  });
});

/**
 * Function to send updates to all connected WebSocket clients.
 * @param {Object} data - The data to send to clients.
 */
const sendUpdatesWS = (data) => {
  wsClients.forEach(client => {
    client.send(JSON.stringify(data));
  });
};

const sendUpdates = (data) => {
  sendUpdatesSSE(data);
  sendUpdatesWS(data);
};

const getHeadersUpdated = () => headersUpdated;

module.exports = { sendUpdates, getHeadersUpdated };
