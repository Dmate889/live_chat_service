//This is the WebSocket server written in Node.js
const WebSocket = require('ws');
const db = require('./databases/db');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');

const app = express();
const server = new WebSocket.Server({ port: 8080 });

const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 5000;

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

  db.getMessages((err, messages) => {
    if(err){
      console.log('Error fetching messages:', err)
    }
    else{
     messages.forEach((message) => {
      ws.send(JSON.stringify({

        content: Buffer.isBuffer(message.content) ? message.content.toString(): message.content,
        sender: message.name

      }));
     }) 
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

      let parsedMessage = JSON.parse(message);
      messageContent = typeof parsedMessage === 'string' ? JSON.parse(parsedMessage): parsedMessage;

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

      console.log(`New message received: ${messageContent.content} from Id: ${user.id}`);

      const messageObject = {
        content: messageContent.content,      
        sender: user.name          
    };

      db.addMessage(messageObject.content,user.id);

      
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            content: Buffer.isBuffer(messageObject.content) ? messageObject.content.toString(): messageObject.content,
            sender: messageObject.sender
          }))     
    }});
  });

  
  //ws.send('You have connected to the server');

//Disconnect message from WS
  ws.on('close', () => {
      console.log(`${user.name} disconnected from the server`);
      clearInterval(interval);
  });
});


console.log('Websocket server runs on port 8080');


//Registering users

app.use(express.json()); 
app.use(cors()); 

//API endpoint for the register service and the front-end
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  try {
    db.authUsers(username, password, (err) => {
        if (err) {
            console.log('Error during registration:', err);
            return res.status(500).json({ message: 'Registration error: User already exist or DB issue.' });
        }
        res.status(200).json({ message: 'User registered successfully' });
    });
  }
  catch{
    res.status(500).send({message: 'Internal server error'});
  }
});

//Logging in users
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      db.getUsers(username, password, (err, result) => {
          if (err) {
              console.error('Error during user authentication:', err); 
              res.status(500).send({ message: 'Unsuccessful login attempt' });
          } else if (result.success) {
              res.status(200).json({ message: 'Login successful', token: result.token });
          } else {
              res.status(401).json({ message: result.message });
          }
      });
  } catch (err) {
      res.status(500).send({ message: 'Internal server error' });
  }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});