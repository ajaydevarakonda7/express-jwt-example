const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const app = express();
const router = express.Router();

require("dotenv").config(); // Sets up dotenv as soon as our application starts
const environment = process.env.NODE_ENV; // development
const stage = require("./config")[environment];
const routes = require("./routes/index.js");

// ---- mysql connection ----
const connection = mysql.createConnection('mysql://root:test@localhost/test');

connection.connect();

app.locals.dbClient = connection;

// ---- middleware ----
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (environment !== "production") {
  app.use(logger("dev"));
}

app.use("/api/v1", routes(router));

// ---- routes setup ----
app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
