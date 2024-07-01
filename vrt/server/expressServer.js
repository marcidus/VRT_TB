const express = require('express');
const { getTelemetryData } = require('./redisClient');

const app = express();
const port = 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Express server is running');
});

// Telemetry endpoint
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

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
