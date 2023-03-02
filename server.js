const express = require("express");
const app = express();
const router = require("./router/router");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(
  cors({
    origin: ["http://3.35.187.33:3001", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "build")));

app.use(router);
app.listen(3001);
