const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Validator = require("validatorjs");
const config = require("./config");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  });
