const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const router = express.Router();

require("dotenv").config(); // Sets up dotenv as soon as our application starts
const environment = process.env.NODE_ENV; // development
const stage = require("./config")[environment];
const routes = require("./routes/index.js");

// ---- mongoose connection ----
const connUri = process.env.MONGO_LOCAL_CONN_URL;
mongoose.connect(
  connUri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  function (err, db) {
    if (err) {
      console.error(err);
    }
  }
);

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
