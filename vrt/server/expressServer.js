const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
const { getBinaryTelemetryData } = require('./redisClient');
const { addHeader, removeHeader, loadHeaders } = require('./headerManager'); // Ensure this import is correct
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3001;

let telemetryDataMap = {};
let clients = [];

// Use CORS middleware to enable cross-origin requests
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).send('Express server is running');
});

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

app.get('/events', cors(), (req, res) => { // Ensure CORS is applied here as well
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

const sendUpdates = (data) => {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

const server = app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

const sendUpdatesWS = (data) => {
  clients.forEach(client => {
    client.send(JSON.stringify(data));
  });
};

module.exports = { sendUpdates, sendUpdatesWS };
