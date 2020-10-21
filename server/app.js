// run config file that sets env variables
require("./config/config");

const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const history = require("connect-history-api-fallback");

let { initDB } = require("./db/Sequelize");
const routes = require("./routes");

let app = express();
app.use(cors());
app.use(history());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("tiny"));

// RESET THE DB
// initDB();

app.use(routes);

app.get("/test", (req, res) => {
  res.send("from test");
});

module.exports = { app };
