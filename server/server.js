// run config file that sets env variables
require("./config/config");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

let { sequelize } = require("./db/Sequelize");

const { createEvent } = require("./routes/events/createEvent");
const { getEvent } = require("./routes/events/getEvent");
const { addGuest } = require("./routes/events/addGuest");
const { addSong } = require("./routes/events/addSong");
const { getSongsOfEvent } = require("./routes/events/getSongsOfEvent");
const { addLikeToSong } = require("./routes/events/addLikeToSong");
const { removeLikeFromSong } = require("./routes/events/removeLikeFromSong");
const { removeSongFromEvent } = require("./routes/events/removeSongFromEvent");
const { songsLikedByUser } = require("./routes/events/songsLikedByUser");
const { getGuests } = require("./routes/events/getGuests");
const { updateGuestStatus } = require("./routes/guests/updateGuestStatus");
const { getGuestData } = require("./routes/guests/getGuestData");

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

app.use(getEvent);
app.use(createEvent);
app.use(addGuest);
app.use(addSong);
app.use(getSongsOfEvent);
app.use(addLikeToSong);
app.use(removeLikeFromSong);
app.use(removeSongFromEvent);
app.use(songsLikedByUser);
app.use(getGuests);

app.use(updateGuestStatus);
app.use(getGuestData);

app.listen(port, () => {
  console.log(`Started up at ${port}`);
});
