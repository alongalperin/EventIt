const Sequelize = require("sequelize");
let { sequelize } = require("../Sequelize");
const { Event } = require("./Event");
const { Guest } = require("./Guest");

const GuestEvents = sequelize.define("guest_events", {
  status: Sequelize.STRING,
  manageId: Sequelize.BIGINT(12),
});
// set 2 forgien keys in GuestEvents table
GuestEvents.belongsTo(Event);
GuestEvents.belongsTo(Guest);

module.exports = { GuestEvents };
