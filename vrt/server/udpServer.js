const dgram = require('dgram'); // Import the 'dgram' module to create UDP sockets
const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module for handling file paths
const msgpack = require('@msgpack/msgpack'); // Import the MessagePack library

// Create a UDP server
const server = dgram.createSocket('udp4'); // Create a UDP socket using IPv4

const UDP_IP = '0.0.0.0'; // IP address to bind the server to. '0.0.0.0' means it will listen on all available network interfaces
const UDP_PORT = 7070; // Port number to listen on

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
 * Event handler for incoming messages.
 * This function processes and logs incoming messages.
 * @param {Buffer} msg - The message received.
 * @param {Object} rinfo - Remote address information.
 */
server.on('message', (msg, rinfo) => {
  try {
    const timestamp = getHighPrecisionTimestamp(); // Get a high-precision timestamp for when the message was received

    const messageObj = msgpack.decode(msg); // Decode the MessagePack buffer

    messageObj.timestamp = timestamp; // Add the high-precision timestamp to the message object

    // Log a brief confirmation message
    console.log(`Received message from ${rinfo.address}:${rinfo.port}`);

  } catch (error) {
    logError(rinfo, error.message, msg.toString()); // Log any errors that occur during message processing
  }
});

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

// Bind the server to the specified IP address and port
server.bind(UDP_PORT, UDP_IP, () => {
  console.log(`UDP server listening on ${UDP_IP}:${UDP_PORT}`);
});
