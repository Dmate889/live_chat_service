//This is the WebSocket server written in Node.js
const WebSocket = require("ws");
const db = require("./databases/db");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const {
  fetchUsers,
  fetchMessages,
  insertMessages,
  verifyToken,
} = require("./server_logic");

const app = express();

//Middlewares & routes
app.use(express.json());

const allowedOrigins = "http://localhost:4200";
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Express server is running on port 3000");
});

const server = new WebSocket.Server({ port: 8080 });

//Connecting to WS, and iterating through the messages
server.on("connection", async (ws, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get(
    "token"
  );

  if (!token) {
    ws.close(4001, "No token provided");
    return;
  }

  const user = verifyToken(token, jwt);

  if (!user) {
    ws.close(4002, "Invalid token");
    return;
  }

  //Set users' state online and
  await db.setStateUsersOnline(user.name);
  fetchUsers(server, ws);

  //Making the messages visible from the DB on the UI
  fetchMessages(ws);

  ws.messageCount = 0;
  ws.startTime = Date.now();

  //Sending the message to all clients + spam protection. If the message limit(5) has been exceeded, the client will be disconnected
  ws.on("message", (message) => {
    //Inserting the message into the DB, and sending it out to all the clients
    insertMessages(ws, server, message, user);
  });

  //Disconnect client from WS and run new query of online users to send it to FE
  ws.on("close", () => {
    db.setStateUsersOffline(user.name);
    fetchUsers(server, ws);
  });
});

console.log("Websocket server is running on port 8080");
