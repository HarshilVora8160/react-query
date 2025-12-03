const express = require("express");
const DbConnect = require("./db/index");
const router = require("./routes/userRoutes");
require("dotenv").config({ path: "" });
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const startServer = async () => {
  await DbConnect();
  app.get("/", (req, res, next) => {
    res.send("hello world");
  });

  app.use("/api/v1", router);
};

module.exports = { app, startServer };
