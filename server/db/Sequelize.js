const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  operatorsAliases: false,
  logging: false,
});

const initDB = function () {
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

module.exports = { sequelize, initDB };
