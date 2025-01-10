//Contains the configuration of express, and CORS header
const authRoutes = require("./authRoutes");
const express = require("express");
const cors = require("cors");
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