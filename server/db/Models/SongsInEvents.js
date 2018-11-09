const Sequelize     = require('sequelize');
let { sequelize }   = require('../Sequelize');
const { LikesToSongs }     = require('./LikesToSongs'); 

const SongsInEvents = sequelize.define('songs_events', {
    eventId: Sequelize.BIGINT(10),
    songId: Sequelize.STRING,
    likesCounter: Sequelize.SMALLINT
});

SongsInEvents.hasMany(LikesToSongs,{as: 'likes', foreignKey: 'songInEventId', onDelete: 'cascade'})

module.exports = { SongsInEvents };