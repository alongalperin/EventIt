// run config file that sets env variables
require("./config/config");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

let { initDB } = require("./db/Sequelize");
const routes = require('./routes');

const port = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// RESET THE DB
// initDB();

app.use(routes);

app.listen(port, () => {
  console.log(`Started up at ${port}`);
});
