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
 * Adds binary telemetry data to the Redis list.
 *
 * @param {Object} data - The telemetry data to add.
 */
const addBinaryTelemetryData = async (data) => {
  try {
    console.log('Attempting to add binary data to Redis');
    await client.lpush('binary_telemetry_data', JSON.stringify(data));
    console.log('Successfully added binary data to Redis');
  } catch (error) {
    console.error('Error adding binary data to Redis:', error);
  }
};

/**
 * Retrieves all binary telemetry data from the Redis list.
 *
 * @returns {Array<Object>} - An array of binary telemetry data objects.
 */
const getBinaryTelemetryData = async () => {
  try {
    console.log('Attempting to retrieve binary data from Redis');
    const data = await client.lrange('binary_telemetry_data', 0, -1);
    console.log('Binary data retrieved from Redis');
    return data.map(item => JSON.parse(item));
  } catch (error) {
    console.error('Error retrieving binary data from Redis:', error);
    return [];
  }
};

module.exports = {
  addBinaryTelemetryData,
  getBinaryTelemetryData
};
