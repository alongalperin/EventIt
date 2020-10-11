// run config file that sets env variables
require("./config/config");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

let { sequelize } = require("./db/Sequelize");
const routes = require('./routes');

const port = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// initialize db. run only when  initDB() run bellow. usually the invoke line will be in comment
let initDB = function () {
  sequelize
    .query("SET FOREIGN_KEY_CHECKS = 0")
    .then(function () {
      return sequelize.sync({
        force: true,
      });
    })
    .then(function () {
      return sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    })
    .then(
      function () {
        console.log("Database synchronised.");
      },
      function (err) {
        console.log(err);
      }
    );
};
// RESET THE DB
// initDB();

app.use(routes);

app.listen(port, () => {
  console.log(`Started up at ${port}`);
});
