const express = require("express");
const route = require("./src/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/hoa_don")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("can't connect");
  });

route(app);

app.listen(4000, () => console.log("listening on port " + 4000));
