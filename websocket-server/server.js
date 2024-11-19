//This is the WebSocket server written in Node.js
const WebSocket = require('ws');
const db = require('./databases/db');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes');

const app = express();

//Middlewares & routes
app.use(express.json()); 
// app.use(cors({
//   origin: 'https://www.l1node4fun.xyz', 
//   methods: ['GET', 'POST', 'OPTIONS'],
//   credentials: true
// })); 
app.use(cors());
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Express server is running on port 3000');
});

const server = new WebSocket.Server({ port: 8080 });

function verifyToken(token){
  try{
    const decoded = jwt.verify(token, db.JWT_SECRET);
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

  //Making the messages visible from the DB on the UI
  db.getMessages((err, messages) => {

    if(err){
      console.log('Error fetching messages:', err)
    }
    else{
     messages.forEach((message) => {
      ws.send(JSON.stringify({
        content: Buffer.isBuffer(message.content) ? message.content.toString(): message.content,
        sender: message.name,
        timestamp: message.timestamp
      }));
     }) 
    }
  })

    ws.messageCount = 0;
    ws.startTime = Date.now();
    
  //Sending the message to all clients + spam protection. If the message limit(5) has been exceeded, the client will be disconnected
    ws.on('message', (message) => {

      let parsedMessage = JSON.parse(message);
      messageContent = typeof parsedMessage === 'string' ? JSON.parse(parsedMessage): parsedMessage;

      const currentTime = Date.now();
      if(currentTime - ws.startTime < 5000) ws.messageCount++
      else
      {
        ws.messageCount = 1;
        ws.startTime = currentTime;
      }

      if(ws.messageCount > 5)
      {
        console.log('Client disconnected due to spamming');
        ws.close();
        return;
      }

      console.log(`New message received: ${messageContent.content} from Id: ${user.id}`);

      //Inserting the message into the DB, and sending it out to all the clients
      db.addMessage(messageContent.content,user.id);

      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            content: Buffer.isBuffer(messageContent.content) ? messageContent.content.toString(): messageContent.content,
            sender: user.name,
            timestamp: messageContent.timestamp
          }))     
    }});
  });


//Disconnect message from WS
  ws.on('close', () => {
      console.log(`${user.name} disconnected from the server`);
  });
});


console.log('Websocket server is running on port 8080');


