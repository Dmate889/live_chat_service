// server.js
const WebSocket = require('ws');


const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('New client has connected to the server');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  const interval = setInterval(() => {
    server.clients.forEach((ws) => {
        if(!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
  }, 30000);
  
  ws.on('message', (message) => {
    console.log(`New message received: ${message}`);

    
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  
  ws.send('You have connected to the server');
  
  ws.on('close', () => {
      console.log('Client has disconnected from the server')
      clearInterval(interval);
  });
});


console.log('Websocket server runs on port 8080');
