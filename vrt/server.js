const dgram = require('dgram');
const WebSocket = require('ws');

const udpServer = dgram.createSocket('udp4');
const wss = new WebSocket.Server({ port: 8080 });

udpServer.on('message', (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  // Broadcast to all connected WebSocket clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg.toString());
    }
  });
});

udpServer.bind(7070);

console.log('UDP Server listening on port 7070');
console.log('WebSocket Server running on port 8080');