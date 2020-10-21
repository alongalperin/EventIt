const Sequelize = require("sequelize");
let { sequelize } = require("../Sequelize");

// definition of Event table
const Event = sequelize.define("Event", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    autoIncrement: false,
  },
  manageId: Sequelize.BIGINT(12),
  eventId: Sequelize.BIGINT(10),
  ownerEmail: Sequelize.STRING,
  name: Sequelize.STRING,
  date: Sequelize.DATE,
  addressName: Sequelize.STRING,
  address: Sequelize.STRING,
  lat: Sequelize.DOUBLE,
  lng: Sequelize.DOUBLE,
});

module.exports = { Event };
