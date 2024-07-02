const dgram = require('dgram');
const fs = require('fs');
const path = require('path');
const { addBinaryTelemetryData } = require('./redisClient');

// IP address and port to bind the UDP server
const UDP_IP = '0.0.0.0';
const UDP_PORT = 7070;

// In-memory error log buffer
let errorLogBuffer = [];
const ERROR_LOG_FILE = path.join(__dirname, 'udpServerErrors.log');

/**
 * Get high-precision current timestamp.
 * @returns {string} - High-precision timestamp in ISO format with nanoseconds.
 */
const getHighPrecisionTimestamp = () => {
  const now = new Date();
  const [seconds, nanoseconds] = process.hrtime();
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  const nanos = nanoseconds.toString().padStart(9, '0');
  return `${now.toISOString().slice(0, -1)}.${milliseconds}${nanos}Z`;
};

/**
 * Logs an error message to the buffer.
 * @param {Object} rinfo - Remote address information.
 * @param {string} errorMessage - The error message to log.
 * @param {string} rawMessage - The raw message received.
 */
const logError = (rinfo, errorMessage, rawMessage) => {
  const logLine = `${getHighPrecisionTimestamp()} - Error processing message from ${rinfo.address}:${rinfo.port} - ${errorMessage} - Raw message: ${rawMessage}\n`;
  errorLogBuffer.push(logLine);
  // Flush the buffer if it reaches a certain size
  if (errorLogBuffer.length >= 10) {
    flushErrorLogBuffer();
  }
};

/**
 * Flushes the error log buffer to the file.
 */
const flushErrorLogBuffer = () => {
  if (errorLogBuffer.length > 0) {
    const logLines = errorLogBuffer.join('');
    errorLogBuffer = [];
    fs.appendFile(ERROR_LOG_FILE, logLines, (err) => {
      if (err) {
        console.error('Error logging messages:', err);
      }
    });
  }
};

// Periodically flush the error log buffer
setInterval(flushErrorLogBuffer, 5000);

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
    const timestamp = getHighPrecisionTimestamp();

    // Create an object containing the binary data and the timestamp
    const messageObj = { data: msg, timestamp };

    // Log the received message
    console.log(`Received message from ${rinfo.address}:${rinfo.port}`);

    // Add the telemetry data to Redis
    await addBinaryTelemetryData(messageObj);

    // Log the data added to Redis
    console.log(`Data added to Redis with timestamp: ${timestamp}`);
  } catch (error) {
    // Log any errors that occur during message processing
    logError(rinfo, error.message, msg.toString('utf-8'));
  }
});

/**
 * Binds the UDP server to the specified IP address and port.
 * Logs a message when the server starts listening.
 */
server.bind(UDP_PORT, UDP_IP, () => {
  console.log(`UDP server listening on ${UDP_IP}:${UDP_PORT}`);
});
