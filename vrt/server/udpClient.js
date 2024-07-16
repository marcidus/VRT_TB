/**
 * UDP Client for Telemetry Data Simulation
 * Date: 2024-07-12
 * 
 * Description:
 * This client simulates the generation of random telemetry data and sends it
 * as UDP packets to a specified server IP address and port. The data is sent
 * every second, and the client closes after a specified period (e.g., 30 seconds).
 * 
 * 0x41 0x6c 0x65 0x78 0x61 0x6e 0x64 0x72 0x65 0x20 0x4d 0x61 0x72 0x74 0x72 0x6f 0x79 0x65 0x20 0x64 0x65 0x20 0x4a 0x6f 0x6c 0x79
 */

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// IP address and port to send the UDP packets
const UDP_IP = '127.0.0.1'; // Replace with the actual server IP if needed
const UDP_PORT = 7070;

/**
 * Generate random telemetry data.
 * @returns {Object} - Randomly generated telemetry data.
 */
const generateTelemetryData = () => {
  return {
    Left_Engine_Temp: (Math.random() * 100).toFixed(2),
    Right_Engine_Temp: (Math.random() * 100).toFixed(2),
    Left_Inverter_Temperature: (Math.random() * 100).toFixed(2),
    Right_Inverter_Temperature: (Math.random() * 100).toFixed(2),
    Right_Gearbox_Temp: (Math.random() * 100).toFixed(2),
    Right_Radiator_Temp: (Math.random() * 100).toFixed(2),
    Left_Gearbox_Temp: (Math.random() * 100).toFixed(2),
    Left_Radiator_Temp: (Math.random() * 100).toFixed(2),
    Car_Speed: (Math.random() * 200).toFixed(2),
    GSPSpeed: (Math.random() * 200).toFixed(2),
    Suspension_Back_Left: (Math.random() * 5000).toFixed(2),
    Suspension_Back_Right: (Math.random() * 5000).toFixed(2),
    Suspension_Front_Left: (Math.random() * 5000).toFixed(2),
    Suspension_Front_Right: (Math.random() * 5000).toFixed(2),
    Brake_Pedal: (Math.random() * 100).toFixed(2),
    Accelerator_Pedal: (Math.random() * 100).toFixed(2),
    Raw_Direction: (Math.random() * 3000).toFixed(2),
    lat: (Math.random() * 180 - 90).toFixed(6),  // Latitude between -90 and 90
    lon: (Math.random() * 360 - 180).toFixed(6), // Longitude between -180 and 180
    Flag: Math.round(Math.random()) // Random flag (0 or 1)
  };
};

/**
 * Send telemetry data as a UDP message.
 */
const sendTelemetryData = () => {
  const telemetryData = generateTelemetryData();
  const message = Buffer.from(JSON.stringify(telemetryData));

  client.send(message, UDP_PORT, UDP_IP, (err) => {
    if (err) {
      console.error('Error sending message:', err);
    } else {
      console.log('Message sent:', message.toString());
    }
  });
};

// Send telemetry data every second
setInterval(sendTelemetryData, 100);

// Close the client after a certain period (e.g., 30 seconds)
setTimeout(() => {
  client.close();
  console.log('Client closed');
}, 30000);
