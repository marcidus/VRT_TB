const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');
const csv = require('csv-parser');

const UDP_IP = '0.0.0.0';
const UDP_PORT = 7070;

// Function to send a message to the UDP server
const sendMessage = (message) => {
  client.send(message, UDP_PORT, UDP_IP, (err) => {
    if (err) {
      console.error('Error sending message:', err);
    } else {
      console.log('Message sent:', message);
    }
  });
};

// Read the CSV file and send each row as a UDP message
fs.createReadStream('telemetry_data_20240609_163554.csv')
  .pipe(csv())
  .on('data', (row) => {
    const message = JSON.stringify(row);
    sendMessage(Buffer.from(message));
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    client.close();
  });
