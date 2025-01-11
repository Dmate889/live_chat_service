//This is the WebSocket server written in Node.js
const app = require("./app_config");
const WebSocket = require("ws");
const db = require("./databases/db");
const jwt = require("jsonwebtoken");
const {
  fetchUsers,
  fetchMessages,
  insertMessages,
  verifyToken,
} = require("./server_logic");

const server = new WebSocket.Server({ port: 8080 });

//Connecting to WS, and iterating through the messages
server.on("connection", async (ws, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get(
    "token"
  );

  const user = verifyToken(token, jwt);

  if (!token) {
    ws.close(4001, "No token provided");
    return;
  }

  if (!user) {
    ws.close(4002, "Invalid JWT token");
    return;
  }

  //Set users' state online and
  await db.setStateUsersOnline(user.name);
  fetchUsers(server);

  //Making the messages visible from the DB on the UI
  fetchMessages(ws);

  ws.messageCount = 0;
  ws.startTime = Date.now();

  ws.on("message", (message) => {
    //Inserting the message into the DB, and sending it out to all the clients
    insertMessages(ws, server, message, user);
  });

  //Disconnect client from WS and run new query of online users to send it to FE
  ws.on("close", () => {
    db.setStateUsersOffline(user.name);
    fetchUsers(server);
  });
});

console.log("Websocket server is running on port 8080");
