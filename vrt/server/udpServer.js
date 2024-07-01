const dgram = require('dgram');
const { addTelemetryData } = require('./redisClient');

// IP address and port to bind the UDP server
const UDP_IP = '0.0.0.0';
const UDP_PORT = 7070;

// Create a UDP server using IPv4
const server = dgram.createSocket('udp4');

/**
 * Event handler for incoming messages.
 * Processes the message, adds telemetry data to Redis, and logs the details.
 *
 * @param {Buffer} msg - The received message.
 * @param {Object} rinfo - Remote address information of the sender.
 */
server.on('message', async (msg, rinfo) => {
  try {
    // Get the current timestamp in ISO format
    const timestamp = new Date().toISOString();

    // Convert the received message buffer to a string
    const messageStr = msg.toString();

    // Create an object containing the raw message data and the timestamp
    const messageObj = { rawData: messageStr, timestamp };

    // Log the received message
    console.log(`Received message: ${messageStr}`);

    // Add the telemetry data to Redis
    await addTelemetryData(messageObj);

    // Log the data added to Redis
    console.log(`Data added to Redis: ${JSON.stringify(messageObj)}`);

    // Log the sender's address and port along with the message object
    console.log(`Received message from ${rinfo.address}:${rinfo.port} - ${JSON.stringify(messageObj)}`);
  } catch (error) {
    // Log any errors that occur during message processing
    console.error('Error processing message:', error);
  }
});

/**
 * Binds the UDP server to the specified IP address and port.
 * Logs a message when the server starts listening.
 */
server.bind(UDP_PORT, UDP_IP, () => {
  console.log(`UDP server listening on ${UDP_IP}:${UDP_PORT}`);
});
