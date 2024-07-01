const express = require('express');
const { getTelemetryData } = require('./redisClient');

const app = express();
const port = 3000;

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
    const data = await getTelemetryData();
    console.log("Data retrieved from Redis:", data.length, "records found");
    res.json(data);
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
