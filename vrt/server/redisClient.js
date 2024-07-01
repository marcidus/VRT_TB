const Redis = require('ioredis');
const client = new Redis({
  host: '127.0.0.1',
  port: 6379
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

const addTelemetryData = async (data) => {
  try {
    console.log('Attempting to add data to Redis:', data);
    await client.lpush('telemetry_data', JSON.stringify(data));
    console.log('Successfully added data to Redis:', data);
  } catch (error) {
    console.error('Error adding data to Redis:', error);
  }
};

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
