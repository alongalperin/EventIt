const Sequelize      = require('sequelize');
let { sequelize }    = require('../Sequelize');

// definition of Guest table
const Guest = sequelize.define('Guest', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = { Guest };