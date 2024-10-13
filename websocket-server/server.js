//This is the WebSocket server written in Node.js
const WebSocket = require('ws');
const db = require('./databases/db');
const db_auth = require('./databases/db_auth');
const jwt = require('jsonwebtoken');


const server = new WebSocket.Server({ port: 8080 });

const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 5000;

function verifyToken(token){
  try{
    const decoded = jwt.verify(token, db_auth.JWT_SECRET);
    return decoded;
  }
  catch(err){
    console.log('Token verification failed', err);
    return null;
  }
}


//Connecting to WS, and iterating through the messages
server.on('connection', (ws, req) => {

  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');

  if (!token) {
    ws.close(4001, 'No token provided');
    return;
  }
  
  const user = verifyToken(token); 

  if (!user) {
    ws.close(4002, 'Invalid token');
    return;
  }

  console.log(`${user.name} connected`);

  db.getMessages((err, messages) => {
    if(err){
      console.log('Error fetching messages:', err)
    }
    else{
      messages.forEach((message) => {
        ws.send(message.content)
      });
    }
  })
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

      db.addMessage(message);

      
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
  });

  
  ws.send('You have connected to the server');

//Disconnect message from WS
  ws.on('close', () => {
      console.log(`${user.name} disconnected from the server`);
      clearInterval(interval);
  });
});


console.log('Websocket server runs on port 8080');
