const dgram = require('dgram');
const { addTelemetryData } = require('./redisClient');

const UDP_IP = '0.0.0.0';
const UDP_PORT = 7070;

const server = dgram.createSocket('udp4');

server.on('message', async (msg, rinfo) => {
  try {
    const timestamp = new Date().toISOString();
    const messageStr = msg.toString();
    const messageObj = { rawData: messageStr, timestamp };

    console.log(`Received message: ${messageStr}`);
    await addTelemetryData(messageObj);
    console.log(`Data added to Redis: ${JSON.stringify(messageObj)}`);

    console.log(`Received message from ${rinfo.address}:${rinfo.port} - ${JSON.stringify(messageObj)}`);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

server.bind(UDP_PORT, UDP_IP, () => {
  console.log(`UDP server listening on ${UDP_IP}:${UDP_PORT}`);
});
