const express = require("express");
const { UserController } = require("./controllers/userController");
const { redisCacheMiddleware } = require("./middlewares/redis");
const { sessionMiddleware } = require("./middlewares/session");

const expressApp = express();
expressApp.use(express.json());
expressApp.use(sessionMiddleware);
require("dotenv").config();

expressApp.get("/api/v1/users", redisCacheMiddleware(), UserController.getAll);
expressApp.get("/profile", (req, res) => {
  if (req.session && req.session.userId) {
    const userId = req.session.userId;
    res.send("User is authenticated: ", userId);
  } else {
    res.status(403).json("User not authenticated");
  }
});

module.exports = expressApp;
