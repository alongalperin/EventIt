const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  operatorsAliases: false,
  logging: false,
});

module.exports = { sequelize };
