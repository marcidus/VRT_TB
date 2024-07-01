const Redis = require('ioredis');

// Create a new Redis client instance
const client = new Redis({
  host: '127.0.0.1',
  port: 6379
});

// Handle Redis client errors
client.on('error', (err) => {
  console.error('Redis client error:', err);
});

/**
 * Adds telemetry data to the Redis list.
 *
 * @param {Object} data - The telemetry data to add.
 */
const addTelemetryData = async (data) => {
  try {
    console.log('Attempting to add data to Redis:', data);
    await client.lpush('telemetry_data', JSON.stringify(data));
    console.log('Successfully added data to Redis:', data);
  } catch (error) {
    console.error('Error adding data to Redis:', error);
  }
};

/**
 * Retrieves all telemetry data from the Redis list.
 *
 * @returns {Array<Object>} - An array of telemetry data objects.
 */
const getTelemetryData = async () => {
  try {
    console.log('Attempting to retrieve data from Redis');
    const data = await client.lrange('telemetry_data', 0, -1);
    console.log('Data retrieved from Redis:', data);
    return data.map(item => JSON.parse(item));
  } catch (error) {
    console.error('Error retrieving data from Redis:', error);
    return [];
  }
};

module.exports = {
  addTelemetryData,
  getTelemetryData
};
