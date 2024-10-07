// server.js
const WebSocket = require('ws');


const server = new WebSocket.Server({ port: 8080 });

const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 5000;

//Connecting to WS
server.on('connection', (ws) => {
  console.log('New client has connected to the server');
  ws.isAlive = true;

//WS healthcheck
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.messageCount = 0;
  ws.startTime = Date.now();


  const interval = setInterval(() => {
    server.clients.forEach((ws) => {
        if(!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
  }, 30000);
  
  //Sending the message to all clients + spam protection. If the message limit(5) has been exceeded, the client will be disconnected
  ws.on('message', (message) => {

    const currentTime = Date.now();
    if(currentTime - ws.startTime < TIME_WINDOW){
      ws.messageCount++;
    } 
    else
    {
      ws.messageCount = 1;
      ws.startTime = currentTime;
    }

    if(ws.messageCount > MESSAGE_LIMIT)
    {
      console.log('Client disconnected due to spamming');
      ws.close();
      return;
    }

    console.log(`New message received: ${message}`);

    
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  
  ws.send('You have connected to the server');

//Disconnect message from WS
  ws.on('close', () => {
      console.log('Client has disconnected from the server')
      clearInterval(interval);
  });
});


console.log('Websocket server runs on port 8080');
