const Sequelize = require("sequelize");
let { sequelize } = require("../Sequelize");

const LikesToSongs = sequelize.define("likes_songs", {
  guestId: Sequelize.STRING,
  eventId: Sequelize.BIGINT(10),
  songInEventId: Sequelize.INTEGER,
});

module.exports = { LikesToSongs };
