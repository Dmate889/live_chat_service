//Helper file for server logic
const db = require("./databases/db");
const WebSocket = require("ws");


async function fetchUsers(server){
    try{
      const onlineUsers = await db.getUsersRecord('online');
  
      const userList =  onlineUsers.map((user) => ({
        name: user.name,
        createdAt: user.createdAt
      }));
     
      server.clients.forEach(client => {
        if(client.readyState  === WebSocket.OPEN){
          client.send(
            JSON.stringify({
              type: 'userList',
              users: userList
            })
          )
        }
      });

      const allUsers = await db.getUserRecordsAll();

      const userListAll = allUsers.map((user) => ({
        name: user.name,
        createdAt: user.createdAt,
        state: user.state
      }));

      server.clients.forEach(client => {
        if(client.readyState  === WebSocket.OPEN){
          client.send(
            JSON.stringify({
              type: 'userListAll',
              users: userListAll
            })
          )
        }
      });
    }

    catch(error){
      console.error('Error fetching users on the server side', error);
    }
  }


  function fetchMessages(ws){
    db.getMessages((err, messages) => {
      if (err) {
        console.log("Error fetching messages:", err);
      } else {
        messages.forEach((message) => {
          ws.send(
            JSON.stringify({
              content: Buffer.isBuffer(message.content)
                ? message.content.toString()
                : message.content,
              sender: message.name,
              timestamp: message.timestamp,
            })
          );
        });
      }
    });
  }

  function insertMessages(ws, server, message, user){
    let parsedMessage = JSON.parse(message);
    messageContent =
      typeof parsedMessage === "string"
        ? JSON.parse(parsedMessage)
        : parsedMessage;

    const currentTime = Date.now();
    if (currentTime - ws.startTime < 5000) ws.messageCount++;
    else {
      ws.messageCount = 1;
      ws.startTime = currentTime;
    }

    if (ws.messageCount > 5) {
      console.log("Client disconnected due to spamming");
      ws.close();
      return;
    }

    console.log(
      `New message received: ${messageContent.content} from Id: ${user.id}`
    );

    db.addMessage(messageContent.content, user.id);

    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            content: Buffer.isBuffer(messageContent.content)
              ? messageContent.content.toString()
              : messageContent.content,
            sender: user.name,
            timestamp: messageContent.timestamp,
          })
        );
      }
    });
  }

  function verifyToken(token,jwt) {
    try {
      const decoded = jwt.verify(token, db.JWT_SECRET);
      return decoded;
    } catch (err) {
      console.log("Token verification failed", err);
      return null;
    }
  }

  module.exports = {
    fetchUsers,
    fetchMessages,
    verifyToken,
    insertMessages,
  };