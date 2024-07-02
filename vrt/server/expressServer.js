const express = require('express');
const { getBinaryTelemetryData } = require('./redisClient');

const app = express();
const port = 3000;

let telemetryDataMap = {};

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
 * Starts the Express server and logs the running port.
 */
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
